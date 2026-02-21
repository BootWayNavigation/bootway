'use client';

import Link from 'next/link';
import { User, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-8" aria-label="BootWay Home">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/images/logo/logo-b-re.png" alt="BootWay" className="h-10 w-auto mx-auto" />
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Please select your login type to continue</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Candidate Login */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50 group h-full">
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Candidate</CardTitle>
                            <CardDescription>
                                For job seekers applying for positions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center pt-4">
                            <p className="text-sm text-muted-foreground mb-6">
                                Apply for jobs, track your applications.
                            </p>
                            <Button asChild className="w-full" size="lg">
                                <Link href="/candidate/login">
                                    Login as Candidate
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <div className="mt-4 text-sm text-muted-foreground">
                                Don&apos;t have an account?{' '}
                                <Link href="/candidate/signup" className="text-primary hover:underline font-medium">
                                    Sign up
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* HR/Admin Login */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50 group h-full">
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                                <Briefcase className="w-8 h-8 text-accent" />
                            </div>
                            <CardTitle className="text-2xl">Admin / HR</CardTitle>
                            <CardDescription>
                                For administrators and hiring managers
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center pt-4">
                            <p className="text-sm text-muted-foreground mb-6">
                                Post jobs, manage applications, and schedule interviews.
                            </p>
                            <Button asChild className="w-full" size="lg">
                                <Link href="/admin/login">
                                    Login
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <div className="mt-4 text-sm text-muted-foreground">
                                Admin access only
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center mt-8">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
