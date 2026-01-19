'use client';
import { Header } from '@/components/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Camera, ShieldCheck } from 'lucide-react';

export default function VerifyHubPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in-up">
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">ID Verification Center</h1>
                <p className="text-muted-foreground mt-2">Choose a method to verify an identity document.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Link href="/verify/face-match" className="group">
                    <Card className="h-full hover:border-primary transition-all duration-200 transform hover:-translate-y-1">
                        <CardHeader className="flex-row items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <Camera className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Live Face Match</CardTitle>
                                <CardDescription>Verify an ID card by matching the photo with a live camera feed.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <Button className="w-full">
                                Start Face Verification
                           </Button>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/verify/aadhaar-check" className="group">
                    <Card className="h-full hover:border-primary transition-all duration-200 transform hover:-translate-y-1">
                        <CardHeader className="flex-row items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Aadhaar Forgery Check</CardTitle>
                                <CardDescription>Scan an Aadhaar card image to check for signs of digital forgery.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <Button className="w-full">
                                Start Image Analysis
                           </Button>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
      </main>
    </div>
  );
}
