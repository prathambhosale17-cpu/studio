'use client';

import { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { SCHEMES, DISTRICTS } from '@/lib/yojana-mitra-data';
import './styles.css';
import { supportedLanguages } from '@/context/language-context';

type Scheme = typeof SCHEMES[0];
type Lang = typeof supportedLanguages[number]['code'];

const i18nMap = {
    en: {
        siteTitle: 'Yojana Mitra • Maharashtra',
        siteTag: 'Schemes & Community Help',
        heroTitle: 'Find the right scheme in minutes',
        heroSub: 'Answer a few questions to see schemes you can apply for.',
        heroNote: 'No login needed. Anonymous posting allowed.',
        finderTitle: 'Smart Scheme Finder',
        labelDistrict: 'District',
        labelCrop: 'Crop',
        labelLand: 'Land Size',
        labelIrr: 'Irrigation',
        labelAge: 'Age',
        labelKyc: 'KYC & Bank Link',
        btnShowEligible: 'Show Eligible Schemes',
        btnClear: 'Clear',
        btnFindSchemes: 'Find Schemes',
        btnAsk: 'Ask a Doubt',
        qaTitle: "Farmers’ Q&A",
        labelQDistrict: 'District',
        labelQCat: 'Category',
        labelQTitle: 'Title',
        labelQBody: 'Describe your problem',
        lblUnanswered: 'Unanswered',
        print: 'Print',
        apply: 'Apply Online',
        footerTxt: 'Best-effort information. Verify with official sources.',
        details: 'Details',
        noSchemes: 'No matching schemes found. Try changing filters.',
        noPosts: 'No posts yet.',
        captcha: 'Captcha:',
        copy: 'Copy',
        copied: 'Copied!',
        downloadPdf: 'Download PDF',
        close: 'Close',
        whatYouGet: 'What you get',
        eligibility: 'Eligibility',
        howToApply: 'How to apply',
        docsYouNeed: 'Documents you need',
        postDoubt: 'Post Doubt',
        wrongCaptcha: 'Wrong captcha',
        postReported: 'Reported. Post hidden.',
        markSolved: 'Mark Solved',
        report: 'Report',
    },
    mr: {
        siteTitle: 'योजना मित्र • महाराष्ट्र',
        siteTag: 'योजना व समुदाय मदत',
        heroTitle: 'योग्य योजना काही मिनिटांत शोधा',
        heroSub: 'थोडे प्रश्न उत्तर द्या आणि आपल्या पात्र योजना पहा.',
        heroNote: 'लॉगिनची गरज नाही. गुप्तपणे प्रश्न विचारू शकता.',
        finderTitle: 'स्मार्ट योजना शोधक',
        labelDistrict: 'जिल्हा',
        labelCrop: 'पीक',
        labelLand: 'शेती क्षेत्र',
        labelIrr: 'सिंचन',
        labelAge: 'वय',
        labelKyc: 'केवायसी व बँक लिंक',
        btnShowEligible: 'पात्र योजना दाखवा',
        btnClear: 'रीसेट',
        btnFindSchemes: 'योजना शोधा',
        btnAsk: 'शंका विचारा',
        qaTitle: 'शेतकरी प्रश्नोत्तर',
        labelQDistrict: 'जिल्हा',
        labelQCat: 'विभाग',
        labelQTitle: 'शीर्षक',
        labelQBody: 'समस्या लिहा',
        lblUnanswered: 'उत्तर नसलेले',
        print: 'प्रिंट',
        apply: 'ऑनलाइन अर्ज',
        footerTxt: 'माहिती सर्वोत्तम प्रयत्नांवर आधारित. कृपया अधिकृत स्रोत तपासा.',
        details: 'तपशील',
        noSchemes: 'जुळणाऱ्या योजना आढळल्या नाहीत. फिल्टर बदलून प्रयत्न करा.',
        noPosts: 'अद्याप पोस्ट नाहीत.',
        captcha: 'कॅप्चा:',
        copy: 'कॉपी',
        copied: 'कागदपत्रांची यादी कॉपी केली',
        downloadPdf: 'PDF डाउनलोड करा',
        close: 'बंद करा',
        whatYouGet: 'तुम्हाला काय मिळेल',
        eligibility: 'पात्रता',
        howToApply: 'अर्ज कसा करावा',
        docsYouNeed: 'आवश्यक कागदपत्रे',
        postDoubt: 'शंका पोस्ट करा',
        wrongCaptcha: 'चुकीचा कॅप्चा',
        postReported: 'रिपोर्ट केले. पोस्ट लपवली आहे.',
        markSolved: 'सोडवले म्हणून चिन्हांकित करा',
        report: 'रिपोर्ट करा',
    }
};

export default function YojanaMitraPage() {
    const [lang, setLang] = useState<Lang>('en');
    const [finderData, setFinderData] = useState({ district: '', crop: '', land: '', irrig: '', age: '', kyc: '' });
    const [results, setResults] = useState<Scheme[]>(SCHEMES);
    const [qaPosts, setQaPosts] = useState<any[]>([]);
    const [qaFilters, setQaFilters] = useState({ district: '', category: '', unanswered: false });
    const [qaFormData, setQaFormData] = useState({ district: '', category: 'Pests/Diseases', title: '', body: '' });
    const [captcha, setCaptcha] = useState({ a: 0, b: 0, answer: 0 });
    const [captchaInput, setCaptchaInput] = useState('');
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const t = (key: keyof typeof i18nMap['en']) => (i18nMap as any)[lang]?.[key] || i18nMap['en'][key];

    useEffect(() => {
        const savedLang = localStorage.getItem('lang');
        if (savedLang && supportedLanguages.some(l => l.code === savedLang)) {
            setLang(savedLang as Lang);
        }
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
    
    const handleLangChange = (newLang: Lang) => {
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    };

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
        const schemeTitle = (scheme.title as any)[lang] || scheme.title.en;
        doc.text(`${t('siteTag')}: ${schemeTitle}`, margin, y); y += 20;

        const docs = (scheme.docs as any)?.[lang] || scheme.docs?.en || [];
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
                             <button key={l.code} className={`btn btn-ghost text-xs p-2 ${lang === l.code ? 'font-bold text-primary bg-primary/10' : ''}`} onClick={() => handleLangChange(l.code as Lang)}>{l.name}</button>
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
                            <label className="font-semibold text-slate-700">{t('labelDistrict')}</label>
                            <select value={finderData.district} onChange={e => handleFinderChange('district', e.target.value)} className="input" required>
                                <option value="">Select</option>
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold text-slate-700">{t('labelCrop')}</label>
                            <select value={finderData.crop} onChange={e => handleFinderChange('crop', e.target.value)} className="input">
                                <option value="">Select</option>
                                {allCrops.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold text-slate-700">{t('labelLand')}</label>
                            <select value={finderData.land} onChange={e => handleFinderChange('land', e.target.value)} className="input">
                                <option value="">Select</option>
                                <option value="<2">Below 2 ha</option>
                                <option value="2-5">2–5 ha</option>
                                <option value=">5">Above 5 ha</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold text-slate-700">{t('labelIrr')}</label>
                            <select value={finderData.irrig} onChange={e => handleFinderChange('irrig', e.target.value)} className="input">
                                <option value="">Select</option>
                                <option>Rainfed</option><option>Well/Bore</option><option>Canal</option><option>Drip/Sprinkler</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold text-slate-700">{t('labelAge')}</label>
                            <select value={finderData.age} onChange={e => handleFinderChange('age', e.target.value)} className="input">
                                <option value="">Select</option>
                                <option value="<35">18–35</option><option value="35-60">35–60</option><option value=">60">60+</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold text-slate-700">{t('labelKyc')}</label>
                            <select value={finderData.kyc} onChange={e => handleFinderChange('kyc', e.target.value)} className="input">
                                <option value="">Select</option><option>Yes</option><option>No</option>
                            </select>
                        </div>
                        <div className="md:col-span-3 flex gap-3 pt-2">
                            <button type="submit" className="btn btn-primary">{t('btnShowEligible')}</button>
                            <button type="button" onClick={clearFinder} className="btn btn-ghost">{t('btnClear')}</button>
                        </div>
                    </form>
                    <div id="results" className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map(s => {
                            const title = (s.title as any)[lang] || s.title.en;
                            const what = (s.what as any)[lang] || s.what.en;
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
                            <h4 className="text-lg font-bold">{(selectedScheme.title as any)[lang] || selectedScheme.title.en}</h4>
                            <button className="btn btn-ghost" aria-label="Close" onClick={() => setSelectedScheme(null)}>✕</button>
                        </div>
                        <div className="p-5 grid gap-5 md:grid-cols-3">
                            <div className="md:col-span-2 space-y-4">
                                <div className="text-sm text-slate-600">{selectedScheme.dept} • {selectedScheme.level.toUpperCase()}</div>
                                <div>
                                    <h5 className="font-semibold">{t('whatYouGet')}</h5>
                                    <p>{(selectedScheme.what as any)[lang] || selectedScheme.what.en}</p>
                                </div>
                                <div>
                                    <h5 className="font-semibold">{t('eligibility')}</h5>
                                    <ul className="list-disc pl-6 space-y-1">
                                        {(((selectedScheme.eligibility as any)[lang] || selectedScheme.eligibility.en) || []).map((e:string,i:number) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-semibold">{t('howToApply')}</h5>
                                    <ol className="list-decimal pl-6 space-y-1">
                                        {(((selectedScheme.steps as any)[lang] || selectedScheme.steps.en) || []).map((s:string,i:number) => <li key={i}>{s}</li>)}
                                    </ol>
                                </div>
                            </div>
                            <aside className="md:sticky md:top-4 h-max">
                                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                                    <h5 className="font-semibold text-primary">{t('docsYouNeed')}</h5>
                                    <ul className="mt-2 list-disc pl-6 space-y-1 text-primary/90">
                                        {(((selectedScheme.docs as any)[lang] || selectedScheme.docs.en) || []).map((d:string,i:number) => <li key={i}>{d}</li>)}
                                    </ul>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <button type="button" className="btn btn-muted" onClick={() => {
                                            const docsText = ((selectedScheme.docs as any)[lang] || selectedScheme.docs.en).join('\n');
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
