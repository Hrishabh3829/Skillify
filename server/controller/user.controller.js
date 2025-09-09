import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import crypto from "crypto";
// Using global fetch (Node 18+). Removed dependency on 'node-fetch' for deployment compatibility.

const SIGNING_SECRET = process.env.SECRET_KEY;
const isProd = process.env.NODE_ENV === 'production';
const baseCookieOptions = {
  httpOnly: true,
  secure: isProd, // required for SameSite=None
  sameSite: isProd ? 'none' : 'lax',
};
if (!SIGNING_SECRET) {
  console.warn("[WARN] SECRET_KEY not set. JWT signing will fail.");
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If existing user was created via Google OAuth (no password stored)
      if (!existingUser.password) {
        return res.status(409).json({
          success: false,
          message: "This email is registered with Google. Use 'Sign in with Google'.",
          oauthOnly: true,
        });
      }
      return res.status(409).json({
        success: false,
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //Immediately log the user in by generating a token.
  const token = jwt.sign({ userId: newUser._id }, SIGNING_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(201)
      .cookie("token", token, { ...baseCookieOptions, maxAge: 24 * 60 * 60 * 1000 })
      .json({
        success: true,
        message: `Hello ${name}, your registration was successful!`,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          photoUrl: newUser.photoUrl || "",
        },
      });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register user due to a server error.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    // User exists but is an OAuth (Google) account with no local password set
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Sign-In. Please continue with Google.",
        oauthOnly: true,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    // Generate token and log the user in
  const token = jwt.sign({ userId: user._id }, SIGNING_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, { ...baseCookieOptions, maxAge: 24 * 60 * 60 * 1000 })
      .json({
        success: true,
        message: `Welcome back, ${user.name} 👋`,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photoUrl: user.photoUrl || "",
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login due to a server error.",
    });
  }
};

export const logout = (_, res) => {
  try {
  res.cookie("token", "", { ...baseCookieOptions, expires: new Date(0) });

    res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "enrolledCourses",
        populate: { path: "creator", select: "name photoUrl" },
      });
      
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("getUserProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;
    const user = await User.findById(userId);

    if (!name || !profilePhoto) {
      return res.status(400).json({
        success: false,
        message: "Name and photo required",
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    //extract the public id of the old image from the url is it exists
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0]; //extract public id
      deleteMediaFromCloudinary(publicId);
    }

    //upload new photo
    const cloudResponse = await uploadMedia(profilePhoto.path);
    const photoUrl = cloudResponse.secure_url;

    const updatedData = { name, photoUrl };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");
    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.log("updateProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update Profile",
    });
  }
};

// ---------- GOOGLE OAUTH ----------
// 1) Frontend calls /api/v1/user/google/auth-url to obtain consent screen URL
// 2) User consents at Google and Google redirects to GOOGLE_REDIRECT_URI with a code
// 3) Backend exchanges code for tokens, fetches profile, creates or finds user, sets cookie, redirects to CLIENT_REDIRECT_SUCCESS

export const getGoogleAuthUrl = async (req, res) => {
  try {
    // If already logged in, avoid redundant consent
    try {
      const existingToken = req.cookies?.token;
      if (existingToken && SIGNING_SECRET) {
        const decoded = jwt.verify(existingToken, SIGNING_SECRET);
        if (decoded?.userId) {
          const existingUser = await User.findById(decoded.userId).select("name email role photoUrl");
          if (existingUser) {
            return res.status(200).json({
              success: true,
              alreadyLoggedIn: true,
              message: "User already logged in",
              user: existingUser,
            });
          }
        }
      }
    } catch (_) {}

    const state = crypto.randomBytes(16).toString("hex");
    // Set state cookie as cross-site compatible so it persists in modern browsers
    res.cookie("g_state", state, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      path: "/",
      maxAge: 5 * 60 * 1000,
    });
    const root = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
      state,
    });
    return res.status(200).json({ success: true, url: `${root}?${params.toString()}` });
  } catch (e) {
    console.error("getGoogleAuthUrl error", e);
    return res.status(500).json({ success: false, message: "Failed to build Google URL" });
  }
};

export const googleOAuthCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).json({ success: false, message: "Missing code" });
    const storedState = req.cookies?.g_state;
    if (!state || !storedState || state !== storedState) {
      return res.status(400).json({ success: false, message: "Invalid state" });
    }
    // clear state cookie (use same attributes so browsers overwrite correctly)
    res.cookie("g_state", "", {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      path: "/",
      expires: new Date(0),
    });

    // Exchange code for tokens
    const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }).toString(),
    });
    const tokenJson = await tokenResp.json();
    if (!tokenResp.ok) {
      console.error("Google token exchange failed", tokenJson);
      return res.status(400).json({ success: false, message: tokenJson.error_description || "Token exchange failed" });
    }

    const { access_token } = tokenJson;
    const profileResp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const profile = await profileResp.json();
    if (!profile?.email) {
      console.error("Google profile fetch failed", profile);
      return res.status(400).json({ success: false, message: "Failed to fetch Google profile" });
    }

    const { email, name, picture } = profile;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: name || email.split("@")[0], email, photoUrl: picture || "" });
    }

    const token = jwt.sign({ userId: user._id }, SIGNING_SECRET, { expiresIn: "1d" });
  res.cookie("token", token, { ...baseCookieOptions, maxAge: 24 * 60 * 60 * 1000 });

    const redirectBase = process.env.CLIENT_REDIRECT_SUCCESS || process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${redirectBase}/oauth-success?success=true`);
  } catch (e) {
    console.error("googleOAuthCallback error", e);
    return res.status(500).json({ success: false, message: "Google OAuth failed" });
  }
};
