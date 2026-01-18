'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/header';
import { DISTRICTS, SCHEMES } from '@/lib/yojana-mitra-data';
import { jsPDF } from 'jspdf';
import './styles.css';

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
  const dialogRef = useRef<HTMLDialogElement>(null);


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
    <div id="yojana-mitra-page">
      <Header />
      <main className="container-narrow">
        <section id="actions" className="grid md:grid-cols-3 gap-4">
            <div className="card md:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-emerald-900">Find the right scheme in minutes</h2>
                        <p>Answer a few questions to see schemes you can apply for.</p>
                    </div>
                    <div className="flex gap-3">
                        <a href="#finder" className="btn btn-primary">Find Schemes</a>
                        <a href="#qa" className="btn btn-muted">Ask a Doubt</a>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="chip">PWA-ready</span>
                    <span className="chip">Bilingual</span>
                    <span className="chip">Print-friendly</span>
                </div>
                <p className="mt-3 text-sm">No login needed. Anonymous posting allowed.</p>
            </div>
        </section>

        <section id="finder" className="card">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Smart Scheme Finder</h3>
            <form onSubmit={handleFinderSubmit} className="grid md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="district" className='font-semibold'>District</label>
                    <select name="district" value={finderData.district} onChange={e => handleFinderChange('district', e.target.value)}>
                        <option value="">Select District</option>
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="crop" className='font-semibold'>Crop</label>
                    <select name="crop" value={finderData.crop} onChange={e => handleFinderChange('crop', e.target.value)}>
                        <option value="">Select Crop</option>
                        {allCrops.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="land" className='font-semibold'>Land Size</label>
                    <select name="land" value={finderData.land} onChange={e => handleFinderChange('land', e.target.value)}>
                        <option value="">Select Land Size</option>
                        <option value="<2">Below 2 ha</option>
                        <option value="2-5">2–5 ha</option>
                        <option value=">5">Above 5 ha</option>
                    </select>
                </div>
                <div>
                  <label className='font-semibold'>Irrigation</label>
                   <select value={finderData.irrig} onChange={e => handleFinderChange('irrig', e.target.value)}>
                        <option value="">Select Irrigation</option>
                        <option value="Rainfed">Rainfed</option>
                        <option value="Well/Bore">Well/Bore</option>
                        <option value="Canal">Canal</option>
                        <option value="Drip/Sprinkler">Drip/Sprinkler</option>
                    </select>
                </div>
                 <div>
                  <label className='font-semibold'>Age</label>
                  <select value={finderData.age} onChange={e => handleFinderChange('age', e.target.value)}>
                        <option value="">Select Age</option>
                        <option value="<35">18–35</option>
                        <option value="35-60">35–60</option>
                        <option value=">60">60+</option>
                    </select>
                </div>
                <div>
                  <label className='font-semibold'>KYC & Bank Link</label>
                   <select value={finderData.kyc} onChange={e => handleFinderChange('kyc', e.target.value)}>
                        <option value="">Select KYC status</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div className="md:col-span-3 flex gap-3 pt-2">
                   <button type="submit" className="btn btn-primary">Show Eligible Schemes</button>
                   <button type="button" className="btn btn-ghost" onClick={clearFinder}>Clear</button>
                </div>
            </form>

            <div id="results" className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.length > 0 ? results.map(s => (
                    <article key={s.id} className="card flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-emerald-900">{s.title['en']}</h4>
                                <span className="badge capitalize">{s.level}</span>
                            </div>
                            <p className="text-sm mt-2">{s.what['en']}</p>
                        </div>
                        <div className='mt-4'>
                            <button type="button" onClick={() => setSelectedScheme(s)} className="btn btn-muted">Details</button>
                        </div>
                    </article>
                )) : (
                    <p className="md:col-span-3">No matching schemes found. Try changing filters.</p>
                )}
            </div>
        </section>

        <section id="qa" className="card">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-emerald-900">Farmers’ Q&A</h3>
                <div className="flex flex-wrap items-center gap-2">
                    {/* Filter Controls */}
                </div>
            </div>
            <form onSubmit={handlePostSubmit} className="grid md:grid-cols-3 gap-4 mb-6 border-b pb-6 mt-4">
                <div>
                    <label className='font-semibold'>District</label>
                    <select required value={qaFormData.district} onChange={e => setQaFormData(p => ({...p, district: e.target.value}))}>
                        <option value="">Select District</option>
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                 <div>
                    <label className='font-semibold'>Category</label>
                     <select required value={qaFormData.category} onChange={e => setQaFormData(p => ({...p, category: e.target.value}))}>
                        <option value="">Select Category</option>
                        {qaCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="md:col-span-3">
                    <label className='font-semibold'>Title</label>
                    <input required value={qaFormData.title} onChange={e => setQaFormData(p => ({...p, title: e.target.value}))} placeholder="Short problem title" />
                </div>
                <div className="md:col-span-3">
                    <label className='font-semibold'>Describe your problem</label>
                    <textarea required value={qaFormData.body} onChange={e => setQaFormData(p => ({...p, body: e.target.value}))} placeholder="Explain briefly. Avoid phone/Aadhaar numbers." />
                </div>
                <div className="flex items-center gap-3 md:col-span-3">
                    <label>{`Captcha: ${captcha.a} + ${captcha.b} = ?`}</label>
                    <input required className="w-28" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} placeholder="?" />
                    <button type="submit" className="btn btn-primary">Post Doubt</button>
                </div>
            </form>
            
            <div className="divide-y">
                {filteredQaPosts.map(p => (
                    <article key={p.id} className="py-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-emerald-900">{p.title}</h4>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="badge">{p.district}</span>
                                <span className="badge">{p.category}</span>
                                {p.solved && <span className="chip">Solved</span>}
                            </div>
                        </div>
                        <p>{p.body}</p>
                    </article>
                ))}
            </div>
        </section>

        <dialog ref={dialogRef} id="schemeModal" className="w-full max-w-4xl rounded-2xl p-0" onClose={() => setSelectedScheme(null)}>
            {selectedScheme && (
                <form method="dialog" className="p-0 m-0">
                  <div className="p-5 border-b flex items-center justify-between">
                    <h4 className="text-lg font-bold">{selectedScheme.title['en']}</h4>
                    <button className="btn btn-ghost" aria-label="Close" onClick={() => setSelectedScheme(null)}>✕</button>
                  </div>

                  <div className="p-5 grid gap-5 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h5 className="font-semibold">What you get</h5>
                        <p>{selectedScheme.what['en']}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold">Eligibility</h5>
                        <ul className="list-disc pl-6 space-y-1">
                            {(selectedScheme.eligibility['en'] || []).map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold">How to apply</h5>
                        <ol className="list-decimal pl-6 space-y-1">
                            {(selectedScheme.steps['en'] || []).map((s, i) => <li key={i}>{s}</li>)}
                        </ol>
                      </div>
                    </div>
                    
                    <aside className="md:sticky md:top-4 h-max">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <h5 className="font-semibold text-emerald-900">Documents you need</h5>
                        <ul className="mt-2 list-disc pl-6 space-y-1">
                            {(selectedScheme.docs['en'] || []).map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button type="button" className="btn btn-muted" onClick={() => handleDownloadPdf(selectedScheme)}>Download PDF</button>
                            <a href={selectedScheme.apply} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Apply Online</a>
                        </div>
                      </div>
                    </aside>
                  </div>
                </form>
            )}
        </dialog>
      </main>
      <footer className="text-center p-4 text-sm border-t">
        <p>Best-effort information. Verify with official sources. © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
