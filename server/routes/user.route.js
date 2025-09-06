import express from "express";
import { getUserProfile, login, logout, register, updateProfile, getGoogleAuthUrl, googleOAuthCallback } from "../controller/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated,getUserProfile);
router.route("/profile/update").put(isAuthenticated,upload.single("profilePhoto"),updateProfile);
// Google OAuth
router.route("/google/auth-url").get(getGoogleAuthUrl);
router.route("/google/callback").get(googleOAuthCallback);

export default router;
