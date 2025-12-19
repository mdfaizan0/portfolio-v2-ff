import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notify } from "@/lib/toast/notify";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { publicClient } from '@/lib/api/publicClient';
import PageTransition from "@/components/shared/PageTransition";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/cms/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      notify("Please fill in all fields", "warning");
      return;
    }

    setLoading(true);

    try {
      const response = await publicClient.post('/auth/login', {
        username,
        password
      });

      // Assuming API returns { message: "...", token: "..." }
      if (response && response.token) {
        login(response.token);
        notify("Login successful", "success");
        navigate('/cms/dashboard');
      } else {
        notify("Invalid response from server", "error");
      }

    } catch (error) {
      // adminClient interceptor handles generic errors, but we can double check specific cases here
      if (error.response?.status === 401) {
        notify("Invalid credentials", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the CMS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline underline-offset-4">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}

export default Login;
