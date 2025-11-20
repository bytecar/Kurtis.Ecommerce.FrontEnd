import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
<<<<<<< HEAD
import { insertLoginSchema, insertUserSchema } from "@/shared/schema";
=======
import { insertLoginSchema, insertUserSchema } from "@shared/schema";
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Registration schema - extending the insertUserSchema
const registerSchema = insertUserSchema.extend({
  username: z.string().min(1, "Username is required"),
<<<<<<< HEAD
  password: z.string().min(6, "Password must be at least 6 characters"),  
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  role: z.string().optional(), // Only allow 'user' role for registration
  status: z.string().optional(), // Default status to 'active'
}).refine(data => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],   
=======
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  role: z.literal("customer"), // Only allow 'user' role for registration
}).refine(data => {
   data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
   }
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
});

type LoginFormValues = z.infer<typeof insertLoginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
<<<<<<< HEAD
  const { user, login, register } = useAuth();
=======
  const { user, loginMutation, registerMutation } = useAuth();
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
  const [location, navigate] = useLocation();

  // Parse tab from URL
  useEffect(() => {
    const query = location.split("?")[1] ?? "";
    const params = new URLSearchParams(query);
    if (params.get("tab") === "register") {
      setActiveTab("register");
    }
  }, [location]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Login form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(insertLoginSchema),
<<<<<<< HEAD
      defaultValues: {
          email: "",
          password: "",
          clientId: "client-app-one"
=======
    defaultValues: {
      username: "",
      password: "",
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
    },
  });

  // Register form setup
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
<<<<<<< HEAD
      password: "",      
      email: "",
      fullName: "",
      role: "customer",
      status: "active", 
=======
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
      role: "customer",
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
    },
  });

  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
<<<<<<< HEAD
    login.mutate(data);
=======
    loginMutation.mutate(data);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
  };

  // Handle registration submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Strip confirmPassword before sending to API
    const { confirmPassword, ...registerData } = data;
<<<<<<< HEAD
    register.mutate(registerData);
=======
    registerMutation.mutate(registerData);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-serif">Welcome to Kurtis & More</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your account or create a new one</p>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
<<<<<<< HEAD
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
=======
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} />
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
<<<<<<< HEAD
                      disabled={login.isPending}
                    >
                      {login.isPending ? (
=======
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => setActiveTab("register")}
                  >
                    Register
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Register Form */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Sign up to get access to all features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Choose a password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm your password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
<<<<<<< HEAD
                      disabled={register.isPending}
                    >
                      {register.isPending ? (
=======
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => setActiveTab("login")}
                  >
                    Login
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
