'use client';
import { Header } from '@/components/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScanFace, Library, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      title: 'Verify Identity',
      description: 'Use AI to perform face matching and forgery detection on identity documents.',
      href: '/verify',
      icon: ScanFace,
    },
    {
      title: 'Yojana Mitra',
      description: 'Discover and learn about central and state government schemes across India.',
      href: '/yojana-mitra',
      icon: Library,
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 animate-fade-in-up">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  AI-Based Identity Verification
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  & Smart Government Scheme Platform
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full pb-12 md:pb-24 lg:pb-32">
          <div className="container grid items-start justify-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href} className="group">
                <Card className="h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="flex-row items-center gap-4 pb-2">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{feature.description}</CardDescription>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Get Started <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
