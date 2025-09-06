import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [signUpInput, setSignUpInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });
  const [googleLoading, setGoogleLoading] = useState(false);
  const toastShownRef = useRef(false);

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();

  const navigate = useNavigate();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignUpInput({ ...signUpInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };
  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signUpInput : loginInput;

    //Added email format validation
    const emailToCheck = inputData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToCheck)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (type === "signup" && inputData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (toastShownRef.current) return;
    if (registerIsSuccess && registerData) {
      toastShownRef.current = true;
      toast.success(registerData.message || "Signup success");
      navigate("/");
      return;
    }
    if (registerError) {
      toastShownRef.current = true;
      if (registerError?.data?.oauthOnly) {
        toast.error(registerError.data.message);
      } else {
        toast.error(registerError?.data?.message || "Signup Failed");
      }
      return;
    }
    if (loginIsSuccess && loginData) {
      toastShownRef.current = true;
      toast.success(loginData.message || "Login success");
      const role = loginData?.user?.role;
      navigate(role === "instructor" ? "/admin/dashboard" : "/");
      return;
    }
    if (loginError) {
      toastShownRef.current = true;
      if (loginError?.data?.oauthOnly) {
        toast.error(loginError.data.message);
      } else {
        toast.error(loginError?.data?.message || "Login Failed");
      }
    }
  }, [registerIsSuccess, registerData, registerError, loginIsSuccess, loginData, loginError, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const res = await fetch("http://localhost:5000/api/v1/user/google/auth-url", { credentials: "include" });
      const data = await res.json();
      if (data?.alreadyLoggedIn) {
        toast.info(data.message || "Already logged in");
        navigate("/");
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(data?.message || "Failed to start Google login");
      }
    } catch (e) {
      toast.error("Google auth error");
    } finally {
      setTimeout(() => setGoogleLoading(false), 600);
    }
  };

  

  return (
  <div className="flex items-center w-full justify-center mt-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="login">
          <TabsList>
            <TabsTrigger value="signup">Signup</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>SignUp</CardTitle>
                <CardDescription>Signup to create an account</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="signup-name">Username</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="Enter your username"
                    value={signUpInput.name}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpInput.email}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    value={signUpInput.password}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={registerIsLoading}
                  onClick={() => handleRegistration("signup")}
                >
                  {registerIsLoading ? (
                    <DotLottieReact
                      src="https://lottie.host/99307f19-5bee-48c9-90f1-11858c3a98d1/vtpTJ34roC.lottie"
                      loop
                      autoplay
                    />
                  ) : (
                    "Signup"
                  )}
                </Button>
              </CardFooter>
              <div className="px-6 pb-6 -mt-2">
                <Button variant="outline" className="w-full gap-2" type="button" disabled={googleLoading} onClick={handleGoogleSignIn}>
                  <FcGoogle className="text-xl" /> {googleLoading ? "Redirecting..." : "Sign up with Google"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Login to your account here. Click login when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginInput.email}
                    onChange={(e) => changeInputHandler(e, "login")}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    value={loginInput.password}
                    onChange={(e) => changeInputHandler(e, "login")}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={loginIsLoading}
                  onClick={() => handleRegistration("login")}
                >
                  {loginIsLoading ? (
                    <DotLottieReact
                      src="https://lottie.host/99307f19-5bee-48c9-90f1-11858c3a98d1/vtpTJ34roC.lottie"
                      loop
                      autoplay
                    />
                  ) : (
                    "Login"
                  )}
                </Button>
              </CardFooter>
              <div className="px-6 pb-6 -mt-2">
                <Button variant="outline" className="w-full gap-2" type="button" disabled={googleLoading} onClick={handleGoogleSignIn}>
                  <FcGoogle className="text-xl" /> {googleLoading ? "Redirecting..." : "Sign in with Google"}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
