
'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DISTRICTS, SCHEMES } from '@/lib/yojana-mitra-data';
import { jsPDF } from 'jspdf';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';


type Scheme = typeof SCHEMES[0];

export default function YojanaMitraPage() {
  // State for the finder form
  const [finderData, setFinderData] = useState({
    district: '',
    crop: '',
    land: '',
    irrig: '',
    age: '',
    kyc: '',
  });
  const [results, setResults] = useState<Scheme[]>(SCHEMES);

  // State for the Q&A section
  const [qaPosts, setQaPosts] = useState<any[]>([]);
  const [qaFilters, setQaFilters] = useState({ district: '', category: '', unanswered: false });
  const [qaFormData, setQaFormData] = useState({ district: '', category: 'Pests/Diseases', title: '', body: '' });
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');

  // State for the modal
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // Load initial data and set up
  useEffect(() => {
    // Initialize Q&A posts from localStorage or with base data
    const savedPosts = localStorage.getItem('qa_posts_v1');
    if (savedPosts) {
      setQaPosts(JSON.parse(savedPosts));
    } else {
      const baseQA = [
        { id: 'p1', district: 'Pune', category: 'Pests/Diseases', title: 'Leaf curling in cotton', body: 'What to spray?', up: 11, solved: false, hidden: false, ts: Date.now() - 86400000 },
        { id: 'p2', district: 'Buldhana', category: 'Insurance/PMFBY', title: 'Claim delay', body: 'Whom to contact?', up: 6, solved: false, hidden: false, ts: Date.now() - 3600000 }
      ];
      localStorage.setItem('qa_posts_v1', JSON.stringify(baseQA));
      setQaPosts(baseQA);
    }
    generateCaptcha();
  }, []);

  const handleFinderChange = (field: string, value: string) => {
    setFinderData(prev => ({ ...prev, [field]: value }));
  };

  const handleFinderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredSchemes = SCHEMES.filter(s => {
      if (finderData.crop && s.crops && s.crops.length && !s.crops.includes(finderData.crop)) return false;
      const tags = s.tags || {};
      if (tags.land && finderData.land && !tags.land.includes(finderData.land)) return false;
      if (tags.irrig && finderData.irrig && !tags.irrig.includes(finderData.irrig)) return false;
      if (tags.age && finderData.age && !tags.age.includes(finderData.age)) return false;
      if (tags.kyc && finderData.kyc && !tags.kyc.includes(finderData.kyc)) return false;
      return true;
    });
    setResults(filteredSchemes);
  };
  
  const clearFinder = () => {
    setFinderData({ district: '', crop: '', land: '', irrig: '', age: '', kyc: '' });
    setResults(SCHEMES);
  }

  const handleDownloadPdf = (scheme: Scheme) => {
      const { jsPDF } = window as any;
      if (!jsPDF) { alert('PDF library failed to load'); return; }
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const margin = 40;
      let y = margin;

      doc.setFont('helvetica', 'bold'); doc.setFontSize(16);
      doc.text('Required Documents', margin, y); y += 26;
      
      doc.setFont('helvetica', 'normal'); doc.setFontSize(12);
      doc.text(`Scheme: ${scheme.title['en']}`, margin, y); y += 20;

      const docs = scheme.docs?.['en'] || [];
      (docs.length ? docs : ['—']).forEach(item => {
          doc.text(`• ${item}`, margin, y);
          y+= 18
      });

      y = doc.internal.pageSize.getHeight() - margin;
      doc.setFontSize(9); doc.setTextColor(120);
      doc.text('Note: This list is indicative. Please verify with official sources.', margin, y);
      doc.save(`${scheme.id}-documents.pdf`);
  };

  // Q&A Logic
  const generateCaptcha = () => {
    const a = 1 + Math.floor(Math.random() * 9);
    const b = 1 + Math.floor(Math.random() * 9);
    setCaptcha({ a, b, answer: a + b });
  };

  const savePosts = (posts: any[]) => {
    localStorage.setItem('qa_posts_v1', JSON.stringify(posts));
    setQaPosts(posts);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaInput) !== captcha.answer) {
      alert('Wrong captcha answer!');
      return;
    }
    if(!qaFormData.title || !qaFormData.body || !qaFormData.district) {
        alert('Please fill all fields for the question.');
        return;
    }

    const newPost = {
      id: 'p_' + Date.now(),
      ...qaFormData,
      up: 0,
      solved: false,
      hidden: false,
      ts: Date.now()
    };
    const updatedPosts = [newPost, ...qaPosts];
    savePosts(updatedPosts);
    setQaFormData({ district: '', category: 'Pests/Diseases', title: '', body: '' });
    setCaptchaInput('');
    generateCaptcha();
  };

  const filteredQaPosts = qaPosts
    .filter(p => !p.hidden)
    .filter(p => !qaFilters.district || p.district === qaFilters.district)
    .filter(p => !qaFilters.category || p.category === qaFilters.category)
    .filter(p => !qaFilters.unanswered || !p.solved)
    .sort((a, b) => b.ts - a.ts);


  const allCrops = Array.from(new Set(SCHEMES.flatMap(s => s.crops || [])));
  const qaCategories = [
    "Pests/Diseases", "Irrigation/Water", "Loans/KCC", "Insurance/PMFBY", 
    "Machinery/Repairs", "Organic/Inputs", "Market/Prices", "Govt Processes/Docs"
  ];
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-emerald-50/60 to-white">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-6 space-y-8">
        {/* Hero */}
        <section className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-emerald-900">Find the right scheme in minutes</h2>
                        <p className="text-muted-foreground">Answer a few questions to see schemes you can apply for.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild><a href="#finder">Find Schemes</a></Button>
                        <Button variant="secondary" asChild><a href="#qa">Ask a Doubt</a></Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">PWA-ready</Badge>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Bilingual</Badge>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Print-friendly</Badge>
                    </div>
                    <p className="mt-3 text-muted-foreground text-sm">No login needed. Anonymous posting allowed.</p>
                </CardContent>
            </Card>
        </section>

        {/* Finder */}
        <section id="finder">
            <Card>
                <CardHeader>
                    <CardTitle className="text-emerald-900">Smart Scheme Finder</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFinderSubmit} className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="district">District</Label>
                             <Select name="district" value={finderData.district} onValueChange={v => handleFinderChange('district', v)}>
                                <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                                <SelectContent>
                                    {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="crop">Crop</Label>
                            <Select name="crop" value={finderData.crop} onValueChange={v => handleFinderChange('crop', v)}>
                                <SelectTrigger><SelectValue placeholder="Select Crop" /></SelectTrigger>
                                <SelectContent>
                                    {allCrops.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="land">Land Size</Label>
                            <Select name="land" value={finderData.land} onValueChange={v => handleFinderChange('land', v)}>
                                <SelectTrigger><SelectValue placeholder="Select Land Size" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="<2">Below 2 ha</SelectItem>
                                    <SelectItem value="2-5">2–5 ha</SelectItem>
                                    <SelectItem value=">5">Above 5 ha</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label>Irrigation</Label>
                           <Select value={finderData.irrig} onValueChange={v => handleFinderChange('irrig', v)}>
                                <SelectTrigger><SelectValue placeholder="Select Irrigation" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Rainfed">Rainfed</SelectItem>
                                    <SelectItem value="Well/Bore">Well/Bore</SelectItem>
                                    <SelectItem value="Canal">Canal</SelectItem>
                                    <SelectItem value="Drip/Sprinkler">Drip/Sprinkler</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-1.5">
                          <Label>Age</Label>
                          <Select value={finderData.age} onValueChange={v => handleFinderChange('age', v)}>
                                <SelectTrigger><SelectValue placeholder="Select Age" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="<35">18–35</SelectItem>
                                    <SelectItem value="35-60">35–60</SelectItem>
                                    <SelectItem value=">60">60+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label>KYC & Bank Link</Label>
                           <Select value={finderData.kyc} onValueChange={v => handleFinderChange('kyc', v)}>
                                <SelectTrigger><SelectValue placeholder="Select KYC status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-3 flex gap-3 pt-2">
                           <Button type="submit">Show Eligible Schemes</Button>
                           <Button type="button" variant="ghost" onClick={clearFinder}>Clear</Button>
                        </div>
                    </form>

                     <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.length > 0 ? results.map(s => (
                             <Dialog key={s.id} onOpenChange={(open) => !open && setSelectedScheme(null)}>
                                <DialogTrigger asChild>
                                    <button type="button" onClick={() => setSelectedScheme(s)} className="text-left">
                                        <Card className="flex flex-col justify-between h-full hover:border-primary">
                                            <CardContent className="p-4 space-y-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-semibold text-primary">{s.title['en']}</h4>
                                                    <Badge variant="outline" className="capitalize">{s.level}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{s.what['en']}</p>
                                            </CardContent>
                                        </Card>
                                    </button>
                                </DialogTrigger>
                             </Dialog>
                        )) : (
                            <p className="text-muted-foreground md:col-span-3">No matching schemes found. Try changing filters.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </section>

        {/* Q&A */}
        <section id="qa">
            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <CardTitle className="text-emerald-900">Farmers’ Q&A</CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Filter Controls */}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePostSubmit} className="grid md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                        <div className="space-y-1.5">
                            <Label>District</Label>
                            <Select required value={qaFormData.district} onValueChange={v => setQaFormData(p => ({...p, district: v}))}>
                                <SelectTrigger><SelectValue placeholder="Select District"/></SelectTrigger>
                                <SelectContent>
                                    {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-1.5">
                            <Label>Category</Label>
                             <Select required value={qaFormData.category} onValueChange={v => setQaFormData(p => ({...p, category: v}))}>
                                <SelectTrigger><SelectValue placeholder="Select Category"/></SelectTrigger>
                                <SelectContent>
                                    {qaCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-3 space-y-1.5">
                            <Label>Title</Label>
                            <Input required value={qaFormData.title} onChange={e => setQaFormData(p => ({...p, title: e.target.value}))} placeholder="Short problem title" />
                        </div>
                        <div className="md:col-span-3 space-y-1.5">
                            <Label>Describe your problem</Label>
                            <Textarea required value={qaFormData.body} onChange={e => setQaFormData(p => ({...p, body: e.target.value}))} placeholder="Explain briefly. Avoid phone/Aadhaar numbers." />
                        </div>
                        <div className="flex items-center gap-3 md:col-span-3">
                            <Label className="text-sm text-muted-foreground">{`Captcha: ${captcha.a} + ${captcha.b} = ?`}</Label>
                            <Input required className="w-28" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} placeholder="?" />
                            <Button type="submit">Post Doubt</Button>
                        </div>
                    </form>
                    
                    <div className="divide-y">
                        {filteredQaPosts.map(p => (
                            <article key={p.id} className="py-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-primary">{p.title}</h4>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Badge variant="secondary">{p.district}</Badge>
                                        <Badge variant="secondary">{p.category}</Badge>
                                        {p.solved && <Badge className="bg-green-100 text-green-800">Solved</Badge>}
                                    </div>
                                </div>
                                <p className="text-muted-foreground">{p.body}</p>
                            </article>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>

        {/* Modal */}
        {selectedScheme && (
             <Dialog open={!!selectedScheme} onOpenChange={(open) => !open && setSelectedScheme(null)}>
                <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{selectedScheme.title['en']}</DialogTitle>
                     <DialogClose />
                </DialogHeader>
                 <ScrollArea className="max-h-[70vh]">
                <div className="p-6 grid gap-5 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-4">
                         <div>
                            <h5 className="font-semibold">What you get</h5>
                            <p className="text-muted-foreground">{selectedScheme.what['en']}</p>
                          </div>

                          <div>
                            <h5 className="font-semibold">Eligibility</h5>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                {(selectedScheme.eligibility['en'] || []).map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-semibold">How to apply</h5>
                             <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                                {(selectedScheme.steps['en'] || []).map((s, i) => <li key={i}>{s}</li>)}
                            </ol>
                          </div>
                    </div>
                    <aside className="md:sticky md:top-4 h-max">
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                            <h5 className="font-semibold text-primary">Documents you need</h5>
                             <ul className="mt-2 list-disc pl-5 space-y-1 text-muted-foreground">
                                {(selectedScheme.docs['en'] || []).map((d, i) => <li key={i}>{d}</li>)}
                            </ul>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Button variant="secondary" size="sm" onClick={() => handleDownloadPdf(selectedScheme)}>Download PDF</Button>
                                <Button asChild size="sm"><a href={selectedScheme.apply} target="_blank" rel="noopener noreferrer">Apply Online</a></Button>
                            </div>
                        </div>
                    </aside>
                </div>
                </ScrollArea>
                </DialogContent>
             </Dialog>
        )}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        <p>Best-effort information. Verify with official sources. © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
