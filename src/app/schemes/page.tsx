'use client';
import { Header } from '@/components/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { governmentSchemes, GovernmentScheme } from '@/lib/schemes';
import { Landmark, Tractor, Shield, Baby, Sparkles, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const categoryIcons: { [key: string]: React.ReactNode } = {
  'Financial Inclusion': <Landmark className="h-6 w-6 text-primary" />,
  'Agriculture': <Tractor className="h-6 w-6 text-primary" />,
  'Social Security': <Shield className="h-6 w-6 text-primary" />,
  'Women & Child Development': <Baby className="h-6 w-6 text-primary" />,
  'Health & Sanitation': <Sparkles className="h-6 w-6 text-primary" />,
};

function SchemeCard({ scheme }: { scheme: GovernmentScheme }) {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl">{scheme.name}</CardTitle>
                        <CardDescription className="mt-1">{scheme.description}</CardDescription>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                        {categoryIcons[scheme.category] || <Landmark className="h-6 w-6 text-primary" />}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div>
                    <h4 className="font-semibold text-sm mb-2">Key Benefits</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {scheme.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-sm mb-2">Eligibility Criteria</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {scheme.eligibility.map((criterion, index) => (
                            <li key={index}>{criterion}</li>
                        ))}
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 border-t pt-6">
                 <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{scheme.category}</Badge>
                    {scheme.state && <Badge variant="outline">{scheme.state}</Badge>}
                </div>
                <Button asChild className="w-full">
                    <Link href={scheme.link} target="_blank">
                        Learn More
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function SchemesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Government Schemes</h1>
                <p className="text-muted-foreground mt-2">Explore various welfare schemes available for citizens across India.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {governmentSchemes.sort((a, b) => (a.state || '').localeCompare(b.state || '') || a.name.localeCompare(b.name)).map((scheme, index) => (
                    <SchemeCard key={index} scheme={scheme} />
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
