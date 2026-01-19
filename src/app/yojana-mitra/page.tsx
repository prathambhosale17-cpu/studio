'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import { SCHEMES, INDIAN_STATES } from '@/lib/yojana-mitra-data';
import { useLanguage } from '@/context/language-context';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

type Scheme = typeof SCHEMES[0];

export default function YojanaMitraPage() {
    const { language, t } = useLanguage();
    const [filters, setFilters] = useState({
        search: '',
        state: '',
        category: '',
        level: 'all', // 'all', 'central', 'state'
        aadhaar: 'all', // 'all', 'yes', 'no'
    });
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const allCategories = useMemo(() => Array.from(new Set(SCHEMES.flatMap(s => s.categories))).sort(), []);

    const filteredSchemes = useMemo(() => {
        return SCHEMES.filter(scheme => {
            const title = (scheme.title as any)[language] || scheme.title.en || '';
            const searchMatch = !filters.search || title.toLowerCase().includes(filters.search.toLowerCase());
            const stateMatch = !filters.state || scheme.state === filters.state;
            const levelMatch = filters.level === 'all' || scheme.level === filters.level;
            const categoryMatch = !filters.category || scheme.categories.includes(filters.category);
            
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
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="mx-auto grid w-full max-w-screen-xl gap-6">
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
                                            <SelectItem value="">{t('lblAllStates')}</SelectItem>
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
                                            <SelectItem value="">{t('lblAllCats')}</SelectItem>
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

                    <section id="results" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
