import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notify } from "@/lib/toast/notify";
import { useNavigate, Link } from "react-router-dom";
import { publicClient } from '@/lib/api/publicClient';
import PageTransition from "@/components/shared/PageTransition";

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password, confirmPassword } = formData;

        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            notify("Please fill in all fields", "warning");
            return;
        }

        if (password !== confirmPassword) {
            notify("Passwords do not match", "error");
            return;
        }

        setLoading(true);

        try {
            const response = await publicClient.post('/auth/register', {
                username,
                email,
                password
            });

            if (response) {
                notify("Registration successful! Please login.", "success");
                navigate('/login');
            }
        } catch (error) {
            console.error("Registration error:", error);
            const message = error.response?.data?.message || "Registration failed";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition className="flex min-h-screen items-center justify-center bg-background px-4">
            <Card className="w-full max-w-sm border-border shadow-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">Create Admin Account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to register as an admin
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:underline underline-offset-4">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </PageTransition>
    );
}

export default Register;
