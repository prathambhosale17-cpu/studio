'use client';

import { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { SCHEMES, DISTRICTS, INDIAN_STATES } from '@/lib/yojana-mitra-data';
import './styles.css';
import { useLanguage, supportedLanguages } from '@/context/language-context';

type Scheme = typeof SCHEMES[0];

export default function YojanaMitraPage() {
    const { language, setLanguage, t } = useLanguage();
    const [finderData, setFinderData] = useState({ state: '', level: 'all' });
    const [results, setResults] = useState<Scheme[]>(SCHEMES);
    const [qaPosts, setQaPosts] = useState<any[]>([]);
    const [qaFilters, setQaFilters] = useState({ district: '', category: '', unanswered: false });
    const [qaFormData, setQaFormData] = useState({ district: '', category: 'Pests/Diseases', title: '', body: '' });
    const [captcha, setCaptcha] = useState({ a: 0, b: 0, answer: 0 });
    const [captchaInput, setCaptchaInput] = useState('');
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
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

    useEffect(() => {
        if (selectedScheme) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [selectedScheme]);
    

    const handleFinderChange = (field: string, value: string) => {
        setFinderData(prev => ({ ...prev, [field]: value }));
    };

    const handleFinderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredSchemes = SCHEMES.filter(scheme => {
            const stateMatch = !finderData.state || scheme.state === finderData.state;
            const levelMatch = finderData.level === 'all' || scheme.level === finderData.level;
            return stateMatch && levelMatch;
        });
        setResults(filteredSchemes);
    };

    const clearFinder = () => {
        setFinderData({ state: '', level: 'all' });
        setResults(SCHEMES);
    };

    const downloadDocsPDF = (scheme: Scheme) => {
        const { jsPDF } = window as any;
        if (!jsPDF) { alert('PDF library failed to load'); return; }
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
            alert(t('wrongCaptcha'));
            return;
        }
        if (!qaFormData.title || !qaFormData.body || !qaFormData.district) {
            alert('Please fill all fields for the question.');
            return;
        }
        const maskPII = (text: string) => text.replace(/\b\d{10}\b/g, '[phone hidden]').replace(/\b\d{12}\b/g, '[aadhaar hidden]');
        const newPost = {
            id: 'p_' + Date.now(),
            ...qaFormData,
            title: maskPII(qaFormData.title),
            body: maskPII(qaFormData.body),
            up: 0, solved: false, hidden: false, ts: Date.now()
        };
        const updatedPosts = [newPost, ...qaPosts];
        savePosts(updatedPosts);
        setQaFormData({ district: '', category: 'Pests/Diseases', title: '', body: '' });
        setCaptchaInput('');
        generateCaptcha();
    };

    const vote = (id: string, d: number) => {
        const updated = qaPosts.map(p => p.id === id ? { ...p, up: Math.max(0, (p.up || 0) + d) } : p);
        savePosts(updated);
    };

    const markSolved = (id: string) => {
        const updated = qaPosts.map(p => p.id === id ? { ...p, solved: !p.solved } : p);
        savePosts(updated);
    };

    const reportPost = (id: string) => {
        const updated = qaPosts.map(p => p.id === id ? { ...p, hidden: true } : p);
        savePosts(updated);
        alert(t('postReported'));
    };

    const filteredQaPosts = qaPosts
        .filter(p => !p.hidden)
        .filter(p => !qaFilters.district || p.district === qaFilters.district)
        .filter(p => !qaFilters.category || p.category === qaFilters.category)
        .filter(p => !qaFilters.unanswered || !p.solved)
        .sort((a, b) => b.ts - a.ts);

    const allCrops = Array.from(new Set(SCHEMES.flatMap(s => s.crops || [])));
    const qaCategories = ["Pests/Diseases", "Irrigation/Water", "Loans/KCC", "Insurance/PMFBY", "Machinery/Repairs", "Organic/Inputs", "Market/Prices", "Govt Processes/Docs"];

    return (
        <div id="yojana-mitra-page">
             <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b border-border">
                <div className="mx-auto container-narrow px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 grid place-items-center rounded-xl bg-primary/10 text-primary font-bold">🌾</div>
                        <div>
                            <h1 className="text-lg font-bold text-foreground">{t('siteTitle')}</h1>
                            <p className="text-xs text-muted-foreground">{t('siteTag')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-slate-500">Language:</span>
                        {supportedLanguages.map(l => (
                             <button key={l.code} className={`btn btn-ghost text-xs p-2 ${language === l.code ? 'font-bold text-primary bg-primary/10' : ''}`} onClick={() => setLanguage(l.code as any)}>{l.name}</button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="mx-auto container-narrow px-4 py-6 space-y-8">
                <section id="actions" className="grid md:grid-cols-3 gap-4">
                    <div className="card p-5 md:col-span-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{t('heroTitle')}</h2>
                                <p className="text-slate-600">{t('heroSub')}</p>
                            </div>
                            <div className="flex gap-3">
                                <a href="#finder" className="btn btn-primary">{t('btnFindSchemes')}</a>
                                <a href="#qa" className="btn btn-muted">{t('btnAsk')}</a>
                            </div>
                        </div>
                    </div>
                    <div className="card p-5">
                        <div className="flex items-center gap-3">
                            <span className="chip">PWA-ready</span>
                            <span className="chip">Bilingual</span>
                            <span className="chip">Print-friendly</span>
                        </div>
                        <p className="mt-3 text-slate-600">{t('heroNote')}</p>
                    </div>
                </section>

                <section id="finder" className="card p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">{t('finderTitle')}</h3>
                    <form onSubmit={handleFinderSubmit} className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="font-semibold text-slate-700">{t('labelState')}</label>
                            <select value={finderData.state} onChange={e => handleFinderChange('state', e.target.value)} className="input">
                                <option value="">{t('lblAllStates')}</option>
                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="font-semibold text-slate-700">{t('labelLevel')}</label>
                            <div className="flex items-center gap-4 pt-2">
                                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                                    <input type="radio" name="level" value="all" checked={finderData.level === 'all'} onChange={e => handleFinderChange('level', e.target.value)} />
                                    <span>{t('lblAll')}</span>
                                </label>
                                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                                    <input type="radio" name="level" value="central" checked={finderData.level === 'central'} onChange={e => handleFinderChange('level', e.target.value)} />
                                    <span>{t('lblCentral')}</span>
                                </label>
                                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                                    <input type="radio" name="level" value="state" checked={finderData.level === 'state'} onChange={e => handleFinderChange('level', e.target.value)} />
                                    <span>{t('lblState')}</span>
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-3 flex gap-3 pt-2">
                            <button type="submit" className="btn btn-primary">{t('btnShowEligible')}</button>
                            <button type="button" onClick={clearFinder} className="btn btn-ghost">{t('btnClear')}</button>
                        </div>
                    </form>
                    <div id="results" className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map(s => {
                            const title = (s.title as any)[language] || s.title.en;
                            const what = (s.what as any)[language] || s.what.en;
                            return (
                            <article key={s.id} className="p-4 card flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="font-semibold text-foreground">{title}</h4>
                                        <span className="badge">{s.level}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-2">{what}</p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button className="btn btn-muted" onClick={() => setSelectedScheme(s)}>{t('details')}</button>
                                    <a className="btn btn-primary" href={s.apply} target="_blank" rel="noopener noreferrer">{t('apply')}</a>
                                </div>
                            </article>
                        )})}
                        {results.length === 0 && <div className="text-slate-600">{t('noSchemes')}</div>}
                    </div>
                </section>

                <section id="qa" className="card p-6">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-bold text-foreground">{t('qaTitle')}</h3>
                        <div className="flex gap-2">
                            <select value={qaFilters.district} onChange={e => setQaFilters(f => ({...f, district: e.target.value}))} className="input">
                                 <option value="">All Districts</option>
                                 {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                            </select>
                            <select value={qaFilters.category} onChange={e => setQaFilters(f => ({...f, category: e.target.value}))} className="input">
                                <option value="">All Categories</option>
                                {qaCategories.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                                <input type="checkbox" checked={qaFilters.unanswered} onChange={e => setQaFilters(f => ({...f, unanswered: e.target.checked}))} />
                                <span>{t('lblUnanswered')}</span>
                            </label>
                        </div>
                    </div>

                    <form onSubmit={handlePostSubmit} className="grid md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <label className="font-semibold text-slate-700">{t('labelQDistrict')}</label>
                            <select value={qaFormData.district} onChange={e => setQaFormData(f => ({ ...f, district: e.target.value }))} className="input" required>
                                <option value="">--</option>
                                {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold text-slate-700">{t('labelQCat')}</label>
                            <select value={qaFormData.category} onChange={e => setQaFormData(f => ({...f, category: e.target.value}))} className="input" required>
                                {qaCategories.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <label className="font-semibold text-slate-700">{t('labelQTitle')}</label>
                            <input value={qaFormData.title} onChange={e => setQaFormData(f => ({ ...f, title: e.target.value }))} className="input" placeholder="Short problem title" required />
                        </div>
                        <div className="md:col-span-3">
                            <label className="font-semibold text-slate-700">{t('labelQBody')}</label>
                            <textarea value={qaFormData.body} onChange={e => setQaFormData(f => ({...f, body: e.target.value}))} rows={4} className="input" placeholder="Explain briefly. Avoid phone/Aadhaar numbers." required></textarea>
                        </div>
                        <div className="flex items-center gap-3 md:col-span-3">
                            <span className="text-sm text-slate-600">{t('captcha')} {captcha.a} + {captcha.b} = ?</span>
                            <input value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} className="input w-28" placeholder="?" required />
                            <button type="submit" className="btn btn-primary">{t('postDoubt')}</button>
                        </div>
                    </form>

                    <div id="qaList" className="mt-6 divide-y">
                        {filteredQaPosts.length > 0 ? filteredQaPosts.map(p => (
                             <article key={p.id} className="py-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-foreground">{p.title}</h4>
                                    <div className="flex items-center gap-2 text-sm">
                                    <span className="badge">{p.district}</span><span className="badge">{p.category}</span>{p.solved ? <span className="chip">Solved</span> : ''}
                                    </div>
                                </div>
                                <p className="text-slate-700">{p.body}</p>
                                <div className="flex gap-2">
                                    <button className="btn btn-muted" onClick={() => vote(p.id,1)}>▲ {p.up || 0}</button>
                                    <button className="btn btn-ghost" onClick={() => markSolved(p.id)}>{t('markSolved')}</button>
                                    <button className="btn btn-ghost" onClick={() => reportPost(p.id)}>{t('report')}</button>
                                </div>
                            </article>
                        )) : <div className="text-slate-600">{t('noPosts')}</div>}
                    </div>
                </section>
            </main>

            <dialog ref={dialogRef} id="schemeModal" className="w-full max-w-4xl rounded-2xl p-0" onClose={() => setSelectedScheme(null)}>
                {selectedScheme && (
                    <div className="p-0 m-0">
                        <div className="p-5 border-b flex items-center justify-between">
                            <h4 className="text-lg font-bold">{(selectedScheme.title as any)[language] || selectedScheme.title.en}</h4>
                            <button className="btn btn-ghost" aria-label="Close" onClick={() => setSelectedScheme(null)}>✕</button>
                        </div>
                        <div className="p-5 grid gap-5 md:grid-cols-3">
                            <div className="md:col-span-2 space-y-4">
                                <div className="text-sm text-slate-600">{selectedScheme.dept} • {selectedScheme.level.toUpperCase()}</div>
                                <div>
                                    <h5 className="font-semibold">{t('whatYouGet')}</h5>
                                    <p>{(selectedScheme.what as any)[language] || selectedScheme.what.en}</p>
                                </div>
                                <div>
                                    <h5 className="font-semibold">{t('eligibility')}</h5>
                                    <ul className="list-disc pl-6 space-y-1">
                                        {(((selectedScheme.eligibility as any)[language] || selectedScheme.eligibility.en) || []).map((e:string,i:number) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-semibold">{t('howToApply')}</h5>
                                    <ol className="list-decimal pl-6 space-y-1">
                                        {(((selectedScheme.steps as any)[language] || selectedScheme.steps.en) || []).map((s:string,i:number) => <li key={i}>{s}</li>)}
                                    </ol>
                                </div>
                            </div>
                            <aside className="md:sticky md:top-4 h-max">
                                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                                    <h5 className="font-semibold text-primary">{t('docsYouNeed')}</h5>
                                    <ul className="mt-2 list-disc pl-6 space-y-1 text-primary/90">
                                        {(((selectedScheme.docs as any)[language] || selectedScheme.docs.en) || []).map((d:string,i:number) => <li key={i}>{d}</li>)}
                                    </ul>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <button type="button" className="btn btn-muted" onClick={() => {
                                            const docsText = ((selectedScheme.docs as any)[language] || selectedScheme.docs.en).join('\n');
                                            navigator.clipboard.writeText(docsText).then(() => alert(t('copied')));
                                        }}>{t('copy')}</button>
                                        <button type="button" className="btn btn-muted" onClick={() => downloadDocsPDF(selectedScheme)}>{t('downloadPdf')}</button>
                                        <a href={selectedScheme.apply} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t('apply')}</a>
                                    </div>
                                </div>
                            </aside>
                        </div>
                        <div className="p-5 border-t flex flex-wrap gap-2">
                           <button type="button" onClick={() => window.print()} className="btn btn-muted">{t('print')}</button>
                        </div>
                    </div>
                )}
            </dialog>

            <footer className="mx-auto container-narrow px-4 py-10 text-center text-sm text-slate-500">
                <p>{t('footerTxt')} © <span>{new Date().getFullYear()}</span></p>
            </footer>
        </div>
    );
}
