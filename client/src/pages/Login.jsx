import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const Login = () => {
  const [signUpInput, setSignUpInput] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loginInput, setLoginInput] = useState({
    email: '',
    password: ''
  });

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === 'signup') {
      setSignUpInput({ ...signUpInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = (type) => {
    const inputData = type === 'signup' ? signUpInput : loginInput;
    console.log(inputData);
  }



return (
  <div className="flex items-center w-full justify-center">
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="signup">
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
                  onChange={(e) => changeInputHandler(e, 'signup')}
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
                  onChange={(e) => changeInputHandler(e, 'signup')}
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
                  onChange={(e) => changeInputHandler(e, 'signup')}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleRegistration('signup')}>SignUp</Button>
            </CardFooter>
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
                  onChange={(e) => changeInputHandler(e, 'login')}
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
                  onChange={(e) => changeInputHandler(e, 'login')}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleRegistration('login')}>Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
)
}

export default Login;
