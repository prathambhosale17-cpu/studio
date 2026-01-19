'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import { SCHEMES, INDIAN_STATES, DISTRICTS } from '@/lib/yojana-mitra-data';
import { useLanguage } from '@/context/language-context';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';


type Scheme = typeof SCHEMES[0];
type Post = {
  id: number;
  district: string;
  category: string;
  title: string;
  body: string;
  answer?: string;
};


export default function YojanaMitraPage() {
    const { language, t } = useLanguage();
    const { toast } = useToast();
    const [filters, setFilters] = useState({
        search: '',
        state: 'all',
        category: 'all',
        level: 'all', // 'all', 'central', 'state'
        aadhaar: 'all', // 'all', 'yes', 'no'
    });
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    // Q&A State
    const [posts, setPosts] = useState<Post[]>([
        {
          id: 1,
          district: 'Pune',
          category: 'Subsidy',
          title: 'When does the onion subsidy application start?',
          body: 'I heard there is a subsidy for onion storage (chawl). When is the application period opening on MahaDBT? What documents are needed?',
          answer: 'The onion chawl subsidy usually opens on MahaDBT around June-July. You will need your 7/12, Aadhaar card, bank passbook, and a cost estimate for the structure. Keep an eye on the portal.'
        }
    ]);
    const [doubtFields, setDoubtFields] = useState({ district: '', category: '', title: '', body: '', captcha: '' });
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);

    const allCategories = useMemo(() => Array.from(new Set(SCHEMES.flatMap(s => s.categories))).sort(), []);
    const qaCategories = useMemo(() => Array.from(new Set(SCHEMES.flatMap(s => s.categories).concat(['Subsidy', 'Loan', 'Other']))).sort(), [SCHEMES]);


    useEffect(() => {
        setNum1(Math.floor(Math.random() * 10) + 1);
        setNum2(Math.floor(Math.random() * 10) + 1);
    }, []);

    const handlePostDoubt = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(doubtFields.captcha, 10) !== num1 + num2) {
            toast({ variant: 'destructive', title: t('wrongCaptcha') });
            return;
        }
        const newPost: Post = {
            id: Date.now(),
            ...doubtFields,
        };
        setPosts(prev => [newPost, ...prev]);
        setDoubtFields({ district: '', category: '', title: '', body: '', captcha: '' });
        setNum1(Math.floor(Math.random() * 10) + 1);
        setNum2(Math.floor(Math.random() * 10) + 1);
        toast({ title: "Doubt posted successfully!" });
    };

    const filteredSchemes = useMemo(() => {
        return SCHEMES.filter(scheme => {
            const title = (scheme.title as any)[language] || scheme.title.en || '';
            const searchMatch = !filters.search || title.toLowerCase().includes(filters.search.toLowerCase());
            const stateMatch = filters.state === 'all' || scheme.state === filters.state;
            const levelMatch = filters.level === 'all' || scheme.level === filters.level;
            const categoryMatch = filters.category === 'all' || scheme.categories.includes(filters.category);
            
            const aadhaarDocs = ((scheme.docs as any).en || []).join(' ').toLowerCase();
            const isAadhaarRequired = aadhaarDocs.includes('aadhaar');
            const aadhaarMatch = filters.aadhaar === 'all' || (filters.aadhaar === 'yes' && isAadhaarRequired) || (filters.aadhaar === 'no' && !isAadhaarRequired);
            
            return searchMatch && stateMatch && levelMatch && categoryMatch && aadhaarMatch;
        });
    }, [filters, language]);

    const handleFilterChange = (field: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        if (selectedScheme) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [selectedScheme]);
    
    const downloadDocsPDF = (scheme: Scheme) => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 40, lineH = 18;
        let y = margin;
        
        doc.setFont('helvetica', 'bold'); doc.setFontSize(16);
        doc.text(t('docsYouNeed'), margin, y); y += 26;
        
        doc.setFont('helvetica', 'normal'); doc.setFontSize(12);
        const schemeTitle = (scheme.title as any)[language] || scheme.title.en;
        doc.text(`${t('siteTag')}: ${schemeTitle}`, margin, y); y += 20;

        const docs = (scheme.docs as any)?.[language] || scheme.docs?.en || [];
        (docs.length ? docs : ['—']).forEach((item:string) => {
            const wrapped = doc.splitTextToSize('• ' + item, doc.internal.pageSize.getWidth() - margin * 2);
            wrapped.forEach((ln: string) => {
                if (y > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); y = margin; }
                doc.text(ln, margin, y); y += lineH;
            });
        });

        y = doc.internal.pageSize.getHeight() - margin;
        doc.setFontSize(9); doc.setTextColor(120);
        doc.text(t('footerTxt'), margin, y);
        doc.save(`${scheme.id}-documents.pdf`);
    };
    
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in-up">
                <div className="mx-auto grid w-full max-w-screen-xl gap-12">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">🌾 Yojana Mitra • Maharashtra</h1>
                        <p className="text-lg text-muted-foreground">Schemes & Community Help</p>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('finderTitle')}</CardTitle>
                                <CardDescription>{t('heroSub')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search schemes by name..."
                                        value={filters.search}
                                        onChange={e => handleFilterChange('search', e.target.value)}
                                        className="pl-10 w-full"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label>State</Label>
                                        <Select value={filters.state} onValueChange={value => handleFilterChange('state', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('lblAllStates')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t('lblAllStates')}</SelectItem>
                                                {INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select value={filters.category} onValueChange={value => handleFilterChange('category', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('lblAllCats')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t('lblAllCats')}</SelectItem>
                                                {allCategories.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace(/-/g, ' ')}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Government Type</Label>
                                        <RadioGroup
                                            value={filters.level}
                                            onValueChange={value => handleFilterChange('level', value)}
                                            className="flex pt-2 gap-4"
                                        >
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="level-all" /><Label htmlFor="level-all">All</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="central" id="level-central" /><Label htmlFor="level-central">Central</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="state" id="level-state" /><Label htmlFor="level-state">State</Label></div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Aadhaar Linked</Label>
                                        <RadioGroup
                                            value={filters.aadhaar}
                                            onValueChange={value => handleFilterChange('aadhaar', value)}
                                            className="flex pt-2 gap-4"
                                        >
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="aadhaar-all" /><Label htmlFor="aadhaar-all">All</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="aadhaar-yes" /><Label htmlFor="aadhaar-yes">Yes</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="aadhaar-no" /><Label htmlFor="aadhaar-no">No</Label></div>
                                        </RadioGroup>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <section id="results" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {filteredSchemes.map(s => {
                                const title = (s.title as any)[language] || s.title.en;
                                const what = (s.what as any)[language] || s.what.en;
                                return (
                                    <Card key={s.id} className="flex flex-col">
                                        <CardHeader>
                                            <CardTitle>{title}</CardTitle>
                                            <div className="flex items-center gap-2 pt-1">
                                                <Badge variant="secondary">{s.state}</Badge>
                                                <Badge variant={s.level === 'central' ? 'default' : 'outline'} className="capitalize">{s.level}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-sm text-muted-foreground">{what}</p>
                                        </CardContent>
                                        <div className="p-6 pt-0 flex gap-2">
                                            <Button variant="outline" onClick={() => setSelectedScheme(s)}>{t('details')}</Button>
                                            <Button asChild><a href={s.apply} target="_blank" rel="noopener noreferrer">{t('apply')}</a></Button>
                                        </div>
                                    </Card>
                                )
                            })}
                            {filteredSchemes.length === 0 && <p className="text-muted-foreground md:col-span-3 text-center py-10">{t('noSchemes')}</p>}
                        </section>
                    </div>

                     <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">{t('qaTitle')}</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('btnAsk')}</CardTitle>
                                    </CardHeader>
                                    <form onSubmit={handlePostDoubt}>
                                    <CardContent className="space-y-4">
                                         <div className="space-y-2">
                                            <Label htmlFor="q-district">{t('labelQDistrict')}</Label>
                                            <Select name="district" value={doubtFields.district} onValueChange={v => setDoubtFields(p => ({...p, district: v}))} required>
                                                <SelectTrigger id="q-district"><SelectValue placeholder={t('selectState')} /></SelectTrigger>
                                                <SelectContent>
                                                    {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="q-category">{t('labelQCat')}</Label>
                                            <Select name="category" value={doubtFields.category} onValueChange={v => setDoubtFields(p => ({...p, category: v}))} required>
                                                <SelectTrigger id="q-category"><SelectValue placeholder={t('lblAllCats')} /></SelectTrigger>
                                                <SelectContent>
                                                    {qaCategories.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace(/-/g, ' ')}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="q-title">{t('labelQTitle')}</Label>
                                            <Input id="q-title" name="title" value={doubtFields.title} onChange={e => setDoubtFields(p => ({...p, title: e.target.value}))} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="q-body">{t('labelQBody')}</Label>
                                            <Textarea id="q-body" name="body" value={doubtFields.body} onChange={e => setDoubtFields(p => ({...p, body: e.target.value}))} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="q-captcha">{t('captcha')} {num1} + {num2} = ?</Label>
                                            <Input id="q-captcha" name="captcha" type="number" value={doubtFields.captcha} onChange={e => setDoubtFields(p => ({...p, captcha: e.target.value}))} required />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit">{t('postDoubt')}</Button>
                                    </CardFooter>
                                    </form>
                                </Card>
                            </div>
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Questions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {posts.length === 0 ? (
                                            <p className="text-muted-foreground text-center py-10">{t('noPosts')}</p>
                                        ) : (
                                            <Accordion type="single" collapsible className="w-full">
                                                {posts.map(post => (
                                                    <AccordionItem key={post.id} value={`item-${post.id}`}>
                                                        <AccordionTrigger>
                                                            <div className="flex flex-col items-start text-left">
                                                                <p className="font-semibold">{post.title}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Badge variant="secondary">{post.district}</Badge>
                                                                    <Badge variant="outline">{post.category}</Badge>
                                                                </div>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="space-y-4">
                                                            <p className="text-muted-foreground">{post.body}</p>
                                                            {post.answer ? (
                                                                <div className="p-4 bg-primary/10 rounded-md">
                                                                    <p className="font-semibold text-primary">Answer:</p>
                                                                    <p className="text-primary/90">{post.answer}</p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm font-semibold text-destructive">{t('lblUnanswered')}</p>
                                                            )}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <dialog ref={dialogRef} className="w-full max-w-4xl rounded-2xl p-0 backdrop:bg-black/50" onClose={() => setSelectedScheme(null)}>
                {selectedScheme && (
                     <Card className="m-0 border-0 shadow-none">
                        <CardHeader className="flex-row items-start justify-between">
                            <div className="space-y-1.5">
                                <CardTitle>{(selectedScheme.title as any)[language] || selectedScheme.title.en}</CardTitle>
                                <CardDescription>{selectedScheme.dept} • {selectedScheme.level.toUpperCase()}</CardDescription>
                            </div>
                             <Button variant="ghost" size="icon" aria-label="Close" onClick={() => setSelectedScheme(null)}>
                                <X className="h-4 w-4" />
                             </Button>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-3">
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <h5 className="font-semibold text-foreground">{t('whatYouGet')}</h5>
                                    <p className="text-muted-foreground">{(selectedScheme.what as any)[language] || selectedScheme.what.en}</p>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-foreground">{t('eligibility')}</h5>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        {(((selectedScheme.eligibility as any)[language] || selectedScheme.eligibility.en) || []).map((e:string,i:number) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-foreground">{t('howToApply')}</h5>
                                    <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                                        {(((selectedScheme.steps as any)[language] || selectedScheme.steps.en) || []).map((s:string,i:number) => <li key={i}>{s}</li>)}
                                    </ol>
                                </div>
                            </div>
                            <aside>
                                <div className="rounded-lg border bg-card p-4 space-y-3">
                                    <h5 className="font-semibold text-foreground">{t('docsYouNeed')}</h5>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        {(((selectedScheme.docs as any)[language] || selectedScheme.docs.en) || []).map((d:string,i:number) => <li key={i}>{d}</li>)}
                                    </ul>
                                    <div className="pt-2 flex flex-wrap gap-2">
                                        <Button variant="secondary" onClick={() => downloadDocsPDF(selectedScheme)}>{t('downloadPdf')}</Button>
                                        <Button asChild><a href={selectedScheme.apply} target="_blank" rel="noopener noreferrer">{t('apply')}</a></Button>
                                    </div>
                                </div>
                            </aside>
                        </CardContent>
                    </Card>
                )}
            </dialog>
        </div>
    );
}
