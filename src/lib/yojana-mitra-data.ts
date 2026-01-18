
export const DISTRICTS = ["Ahmednagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Chatrapati Sambhajinagar", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad (Dharashiv)", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"];

const BASE_SCHEMES = [
      {
        id: 'pmkisan',
        title: { 
          en: 'PM-KISAN Income Support', 
          mr: 'पीएम-किसान उत्पन्न सहाय्य' },
        dept: 'MoA&FW',
        level: 'central',
        districts: ['All'],
        categories: ['income-support'],
        crops: [],
        what: { 
          en: '₹6000 per year in 3 installments to eligible farmer families.', 
          mr: 'पात्र शेतकरी कुटुंबांना वर्षाकाठी ₹६००० तीन हप्त्यांत.' },
        eligibility: { 
          en: ['Farmer family as per norms', 'Land records in name', 'Not income-tax payer'], 
          mr: ['नियमांनुसार शेतकरी कुटुंब', 'जमिनीचा ७/१२ लाभार्थीच्या नावावर', 'इन्कम-टॅक्स भरत नसणे'] },
        docs: { 
          en: ['Aadhaar', 'Bank passbook', '7/12 extract'], 
          mr: ['आधार', 'बँक पासबुक', '७/१२ उतारा'] },
        steps: { 
          en: ['Check eligibility', 'Complete eKYC', 'Submit application'], 
          mr: ['पात्रता तपासा', 'eKYC पूर्ण करा', 'अर्ज सबमिट करा'] },
        apply: 'https://pmkisan.gov.in', tags: { kyc: ['Yes'] }
      },
      {
        id: 'pmfby',
        title: { en: 'PM Fasal Bima Yojana (PMFBY)',
        mr: 'पीएम फसल विमा योजना' },
        dept: 'MoA&FW',
        level: 'central',
        districts: ['All'],
        categories: ['insurance'],
        crops: ['Cotton', 'Soybean', 'Sugarcane', 'Wheat', 'Rice', 'Horticulture'],
        what: {
          en: 'Crop insurance for notified crops/seasons.',
          mr: 'सूचित पिके/हंगामासाठी पिक विमा.' },
        eligibility: { 
          en: ['Notified crop', 'Within season window', 'Loaned or non-loaned'], 
          mr: ['सूचित पीक', 'हंगामी कालावधीत अर्ज', 'कर्जदार/बिनकर्जदार'] },
        docs: { 
          en: ['Sowing certificate', 'Bank passbook', 'Aadhaar'], 
          mr: ['पेरणी प्रमाणपत्र', 'बँक पासबुक', 'आधार'] },
        steps: { 
          en: ['Visit CSC/bank or portal', 'Choose crop & season', 'Pay premium'], 
          mr: ['CSC/बँकेत जा किंवा पोर्टल', 'पीक व हंगाम निवडा', 'प्रिमियम भरा'] },
        apply: 'https://pmfby.gov.in'
      },
      {
        id: 'microirrigation',
        title: { 
          en: 'Micro-Irrigation Subsidy (Drip/Sprinkler)', 
          mr: 'सूक्ष्म सिंचन अनुदान (ड्रिप/स्प्रिंकलर)' },
        dept: 'PMKSY/State',
        level: 'state',
        districts: ['All'],
        categories: ['irrigation'],
        crops: ['Cotton', 'Horticulture'],
        what: { 
          en: 'Subsidy support for installing drip/sprinkler systems.', 
          mr: 'ड्रिप/स्प्रिंकलर बसवण्यासाठी अनुदान.' },
        eligibility: { 
          en: ['Farmer with cultivable land', 'As per district norms'], 
          mr: ['कृषी जमीन असलेला', 'जिल्हा निकषानुसार'] },
        docs: { 
          en: ['7/12 extract', 'Aadhaar', 'Vendor quotation'], 
          mr: ['७/१२ उतारा', 'आधार', 'विक्रेता कोटेशन'] },
        steps: { 
          en: ['Get vendor estimate', 'Apply via portal/office', 'Inspection & installation'], 
          mr: ['विक्रेत्याकडून अंदाजपत्र', 'पोर्टल/कार्यालयातून अर्ज', 'तपासणी व बसवणी'] },
        apply: '#'
      },
      {
        id: 'kcc',
        title: { 
          en: 'Kisan Credit Card (KCC)', 
          mr: 'किसान क्रेडिट कार्ड (KCC)' },
        dept: 'Banks/NABARD',
        level: 'central',
        districts: ['All'],
        categories: ['loan'],
        crops: [],
        what: { 
          en: 'Timely credit for crop needs at concessional interest.', 
          mr: 'पिकासाठी सवलतीच्या व्याजदराने कर्ज.' },
        eligibility: { 
          en: ['Cultivating farmer', 'KYC compliant'], 
          mr: ['पीक घेणारा शेतकरी', 'KYC पूर्ण असणे'] },
        docs: { 
          en: ['Aadhaar', 'Land records', 'Bank KYC'], 
          mr: ['आधार', 'जमीन नोंदी', 'बँक KYC'] },
        steps: { 
          en: ['Visit bank with documents', 'Fill KCC form', 'Get limit sanctioned'], 
          mr: ['बँकेत कागदपत्रांसह जा', 'KCC फॉर्म भरा', 'मर्यादा मंजूर करून घ्या'] },
        apply: '#'
      }
    ];

const MORE_SCHEMES = [
      {
        id: 'namo_shetkari_mhasamman',
        title: { en: 'Namo Shetkari Maha Samman Nidhi (State Top-Up)', mr: 'नमो शेतकरी महासम्मान निधी (राज्य टॉप-अप)' },
        dept: 'Dept. of Agriculture, Govt. of Maharashtra',
        level: 'state',
        districts: ['All'],
        categories: ['income-support'],
        crops: [],
        what: {
          en: 'State top-up assistance credited to PM-KISAN eligible beneficiaries (DBT to linked bank).',
          mr: 'पीएम-किसान पात्र लाभार्थ्यांना राज्याकडून अतिरिक्त अनुदान (DBT बँकेत).'
        },
        eligibility: {
          en: [
            'Must be an active PM-KISAN beneficiary',
            'eKYC completed; bank account Aadhaar-seeded',
            'Land records in beneficiary name as per state norms'
          ],
          mr: [
            'सक्रिय पीएम-किसान लाभार्थी असणे आवश्यक',
            'eKYC पूर्ण; आधार-सीडेड बँक खाते',
            'राज्य निकषानुसार जमिनीचा ७/१२ लाभार्थ्याच्या नावावर'
          ]
        },
        docs: {
          en: ['Aadhaar', 'Bank passbook', '7/12 extract', 'PM-KISAN status (optional print)'],
          mr: ['आधार', 'बँक पासबुक', '७/१२ उतारा', 'पीएम-किसान स्थिती (ऐच्छिक)']
        },
        steps: {
          en: [
            'Verify PM-KISAN status and complete eKYC if pending.',
            'Ensure bank account is Aadhaar-linked and active for DBT.',
            'No separate application usually required; monitor DBT credit on state portal/bank SMS.'
          ],
          mr: [
            'पीएम-किसान स्थिती तपासा व eKYC प्रलंबित असल्यास पूर्ण करा.',
            'बँक खाते आधार-लिंक व DBT साठी सक्रिय ठेवा.',
            'वेगळा अर्ज सामान्यतः आवश्यक नाही; राज्य पोर्टल/बँक SMS वर DBT क्रेडिट पाहा.'
          ]
        },
        apply: 'https://mahadbt.maharashtra.gov.in'
      },
      {
        id: 'pm_kisan_maandhan',
        title: { en: 'PM Kisan Maandhan (Pension Scheme)', mr: 'पीएम किसान मानधन (पेन्शन योजना)' },
        dept: 'MoA&FW (GoI) / LIC (Pension)',
        level: 'central',
        districts: ['All'],
        categories: ['income-support'],
        crops: [],
        what: {
          en: 'Voluntary pension for small/marginal farmers (₹3,000/month after 60) with small monthly contribution.',
          mr: 'लघु/सीमांत शेतकऱ्यांसाठी स्वैच्छिक पेन्शन (वय ६० नंतर ₹३,०००/महिना) छोटी मासिक भर.'
        },
        eligibility: {
          en: [
            'Age 18–40 at enrollment; small/marginal farmer category',
            'Not income-tax payer; not in NPS/EPFO/ESIC',
            'Savings bank account & Aadhaar'
          ],
          mr: [
            'नोंदणीवेळी वय १८–४०; लघु/सीमांत शेतकरी',
            'इन्कम-टॅक्स देणारा नसावा; NPS/EPFO/ESIC मध्ये नसावा',
            'बचत खाते व आधार'
          ]
        },
        docs: {
          en: ['Aadhaar', 'Bank passbook', 'Mobile number'],
          mr: ['आधार', 'बँक पासबुक', 'मोबाइल क्रमांक']
        },
        steps: {
          en: [
            'Register on maandhan portal or visit CSC.',
            'Choose auto-debit from bank; sign mandate.',
            'Keep receipt; track status via portal/CSC/LIC.'
          ],
          mr: [
            'maandhan पोर्टलवर नोंदणी करा किंवा CSC ला भेट द्या.',
            'बँकेतून ऑटो-डेबिट निवडा; मंडेट सही करा.',
            'पावती जतन करा; पोर्टल/CSC/LIC वर स्थिती पाहा.'
          ]
        },
        apply: 'https://maandhan.in/'
      },
      {
        id: 'wbcis',
        title: { en: 'Weather Based Crop Insurance Scheme (WBCIS)', mr: 'हवामानाधारित पिक विमा योजना (WBCIS)' },
        dept: 'MoA&FW (GoI) / State Agriculture',
        level: 'central',
        districts: ['All'],
        categories: ['insurance'],
        crops: ['Horticulture', 'Cotton', 'Soybean', 'Paddy', 'Wheat'],
        what: {
          en: 'Index-based insurance against adverse weather parameters for notified crops/seasons.',
          mr: 'सूचित पिके/हंगामांसाठी प्रतिकूल हवामान निर्देशांकाविरुद्ध विमा.'
        },
        eligibility: {
          en: [
            'Sowing of notified crop in notified blocks',
            'Enrollment within season cut-off',
            'Loanee or non-loanee farmers'
          ],
          mr: [
            'सूचित ब्लॉकमध्ये सूचित पिक पेरणी',
            'हंगामी अंतिम तारखेपूर्वी नोंदणी',
            'कर्जदार/बिनकर्जदार दोन्ही'
          ]
        },
        docs: {
          en: ['Aadhaar', 'Bank passbook', 'Sowing certificate / 7/12'],
          mr: ['आधार', 'बँक पासबुक', 'पेरणी प्रमाणपत्र / ७/१२']
        },
        steps: {
          en: [
            'Check notified crops/seasons on state portal/PMFBY portal.',
            'Enroll via bank/CSC/portal within the cut-off.',
            'Keep premium receipt & acknowledgement for claims.'
          ],
          mr: [
            'राज्य/PMFBY पोर्टलवर सूचीत पिके/हंगाम तपासा.',
            'बँक/CSC/पोर्टल वर अंतिम तारखेपूर्वी नोंदणी करा.',
            'प्रिमियम पावती व पावती क्रमांक जतन करा.'
          ]
        },
        apply: 'https://pmfby.gov.in'
      },
      {
        id: 'kcc_interest_subvention',
        title: { en: 'KCC Interest Subvention (Prompt Repayment Incentive)', mr: 'KCC व्याज अनुदान (वेळेत परतफेड सवलत)' },
        dept: 'MoF / NABARD / Banks',
        level: 'central',
        districts: ['All'],
        categories: ['loan'],
        crops: [],
        what: {
          en: 'Interest subvention and additional Prompt Repayment Incentive for KCC crop loans within limits.',
          mr: 'KCC पिक कर्जांवर व्याज अनुदान व वेळेत परतफेड सवलत (मर्यादेत).'
        },
        eligibility: {
          en: [
            'Valid KCC account for crop cultivation',
            'Repayment within stipulated period to avail PRI',
            'Bank’s KYC norms satisfied'
          ],
          mr: [
            'पीक उत्पादनासाठी वैध KCC खाते',
            'निर्धारित मुदतीत परतफेड केल्यास PRI लागू',
            'बँकेचे KYC निकष पूर्ण'
          ]
        },
        docs: {
          en: ['KCC form & sanction letter', 'Aadhaar', 'Land records (7/12)', 'Bank KYC'],
          mr: ['KCC फॉर्म व सॅंक्शन लेटर', 'आधार', 'जमीन नोंदी (७/१२)', 'बँक KYC']
        },
        steps: {
          en: [
            'Visit your KCC bank branch; confirm eligibility and limits.',
            'Ensure timely repayment to get the interest incentive.',
            'Keep statements/receipts for audit.'
          ],
          mr: [
            'आपल्या KCC बँक शाखेत जाऊन पात्रता व मर्यादा तपासा.',
            'वेळेत परतफेड करून व्याज सवलत मिळवा.',
            'हिशोब/पावत्या जतन करा.'
          ]
        },
        apply: '#'
      },
      {
        id: 'aif',
        title: { en: 'Agriculture Infrastructure Fund (AIF)', mr: 'कृषि पायाभूत सुविधा निधी (AIF)' },
        dept: 'MoA&FW (GoI)',
        level: 'central',
        districts: ['All'],
        categories: ['loan'],
        crops: [],
        what: {
          en: 'Medium/long-term finance with interest subvention & CGTMSE for warehouses, primary processing, supply chain.',
          mr: 'गोदाम, प्राथमिक प्रक्रिया, पुरवठा शृंखला यांसाठी व्याज सवलत व हमीसह मध्यम/दीर्घकालीन कर्ज.'
        },
        eligibility: {
          en: [
            'Eligible entities: Farmers, FPOs, SHGs, entrepreneurs, local bodies',
            'Viable project DPR & bankable proposal'
          ],
          mr: [
            'पात्र संस्था: शेतकरी, FPO, SHG, उद्योजक, स्थानिक संस्था',
            'व्यवहार्य DPR व बँक योग्य प्रस्ताव'
          ]
        },
        docs: {
          en: ['KYC set', 'Project DPR', 'Land/lease documents', 'Bank appraisal'],
          mr: ['KYC संच', 'प्रकल्प DPR', 'जमीन/लीज कागदपत्रे', 'बँक मूल्यांकन']
        },
        steps: {
          en: [
            'Prepare DPR and choose lending bank.',
            'Apply on AgriInfra portal; track sanction.',
            'Implement project; claim subvention as per norms.'
          ],
          mr: [
            'DPR तयार करा व कर्ज देणारी बँक निवडा.',
            'AgriInfra पोर्टलवर अर्ज करा; मंजुरी ट्रॅक करा.',
            'प्रकल्प राबवा; निकषांनुसार सवलत घ्या.'
          ]
        },
        apply: 'https://www.agriinfra.dac.gov.in/'
      },
      {
        id: 'pmfme',
        title: { en: 'PMFME (Micro Food Processing) – Credit Linked Subsidy', mr: 'PMFME (सूक्ष्म अन्न प्रक्रिया) – कर्जसह अनुदान' },
        dept: 'MoFPI (GoI)',
        level: 'central',
        districts: ['All'],
        categories: ['loan', 'women-shg'],
        crops: [],
        what: {
          en: '35% credit-linked subsidy (caps apply) for individuals, SHGs and FPOs in micro food processing.',
          mr: 'वैयक्तिक, SHG, FPO साठी सूक्ष्म अन्न प्रक्रियेत ३५% कर्जसह अनुदान (मर्यादा लागू).'
        },
        eligibility: {
          en: [
            'Existing/new micro food unit with Udyam registration',
            'Basic DPR/business plan and bank consent'
          ],
          mr: [
            'Udyam नोंदणी असलेली विद्यमान/नवीन सूक्ष्म युनिट',
            'मूलभूत DPR/व्यवसाय योजना व बँकेची संमती'
          ]
        },
        docs: {
          en: ['Aadhaar/PAN', 'Udyam certificate', 'Bank sanction', 'DPR', 'FSSAI (as applicable)'],
          mr: ['आधार/PAN', 'Udyam प्रमाणपत्र', 'बँक मंजुरी', 'DPR', 'FSSAI (लागू असल्यास)']
        },
        steps: {
          en: [
            'Prepare DPR; get Udyam & FSSAI (if needed).',
            'Apply on PMFME portal via State Nodal Agency.',
            'Obtain bank sanction; subsidy released post verification.'
          ],
          mr: [
            'DPR तयार करा; Udyam व FSSAI (लागू असल्यास) घ्या.',
            'राज्य नोडल एजन्सीद्वारे PMFME पोर्टलवर अर्ज करा.',
            'बँक मंजुरीनंतर पडताळणीनंतर अनुदान वितरित.'
          ]
        },
        apply: 'https://pmfme.mofpi.gov.in/'
      },
      {
        id: 'stand_up_india',
        title: { en: 'Stand-Up India (Women / SC / ST Entrepreneurs)', mr: 'स्टँड-अप इंडिया (महिला / SC / ST उद्योजक)' },
        dept: 'DFS (MoF) / Banks',
        level: 'central',
        districts: ['All'],
        categories: ['women-shg', 'loan'],
        crops: [],
        what: {
          en: 'Bank loans ₹10L–₹1Cr for greenfield enterprises; includes agri-allied & processing units.',
          mr: 'ग्रीनफिल्ड उद्योगांसाठी ₹१० लाख–₹१ कोटी बँक कर्ज; कृषि-अनुषंगिक/प्रोसेसिंग युनिट्स सामाविष्ट.'
        },
        eligibility: {
          en: [
            'Woman or SC/ST entrepreneur; age 18+',
            'Greenfield project; not defaulter',
            'Udyam registration preferable'
          ],
          mr: [
            'महिला किंवा SC/ST उद्योजक; वय १८+',
            'ग्रीनफिल्ड प्रकल्प; डिफॉल्टर नसावा',
            'Udyam नोंदणी प्राधान्य'
          ]
        },
        docs: {
          en: ['KYC', 'Project report', 'Quotation/invoices', 'Collateral/guarantee as per bank'],
          mr: ['KYC', 'प्रकल्प अहवाल', 'कोटेशन/चलने', 'बँकेनुसार तारण/हमी']
        },
        steps: {
          en: [
            'Prepare project profile & DPR.',
            'Apply via Stand-Up India portal or directly at bank.',
            'Complete appraisal, sanction & disbursement; start unit.'
          ],
          mr: [
            'प्रकल्प प्रोफाइल व DPR तयार करा.',
            'स्टँड-अप इंडिया पोर्टल/बँकेत थेट अर्ज करा.',
            'मूल्यांकन, मंजुरी व वितरण पूर्ण करून युनिट सुरू करा.'
          ]
        },
        apply: 'https://www.standupmitra.in/'
      },
      {
        id: 'pm_mudra',
        title: { en: 'PM MUDRA Yojana (Shishu/Kishore/Tarun)', mr: 'प्रधान मंत्री मुद्रा योजना (शिशु/किशोर/तरुण)' },
        dept: 'MoF / Banks',
        level: 'central',
        districts: ['All'],
        categories: ['loan', 'women-shg'],
        crops: [],
        what: {
          en: 'Loans for micro/small enterprises including agri-services, custom hiring, input shops.',
          mr: 'सूक्ष्म/लघु उद्योगांसाठी कर्ज – कृषि सेवा, कस्टम हायरिंग, इनपुट दुकाने इत्यादी.'
        },
        eligibility: {
          en: ['Non-farm income-generating activities', 'Clean CIBIL; KYC', 'Basic business plan'],
          mr: ['नॉन-फार्म उत्पन्न प्रकल्प', 'CIBIL ठीक; KYC', 'मूलभूत व्यवसाय योजना']
        },
        docs: {
          en: ['KYC', 'Udyam (if available)', 'Quotation/Invoices', 'Bank statements'],
          mr: ['KYC', 'Udyam (असल्यास)', 'कोटेशन/चलने', 'बँक स्टेटमेंट्स']
        },
        steps: {
          en: [
            'Prepare brief plan & quotations.',
            'Apply at bank (MUDRA) in suitable category.',
            'Complete appraisal, execute documents, draw loan.'
          ],
          mr: [
            'संक्षिप्त योजना व कोटेशन तयार करा.',
            'योग्य श्रेणीत बँकेत (MUDRA) अर्ज करा.',
            'मूल्यांकन, कागदपत्रे व कर्ज वितरण पूर्ण करा.'
          ]
        },
        apply: 'https://www.mudra.org.in/'
      },
      {
        id: 'smam_mechanization',
        title: { en: 'SMAM – Farm Mechanization Subsidy', mr: 'SMAM – शेती यांत्रिकीकरण अनुदान' },
        dept: 'DoAC&FW (GoI) / State Agriculture',
        level: 'central',
        districts: ['All'],
        categories: ['machinery'],
        crops: [],
        what: {
          en: 'DBT subsidy for tractors, power tillers, implements via agri-machinery portals/State DBT.',
          mr: 'ट्रॅक्टर, पॉवर टिलर, अवजारे यांसाठी DBT अनुदान (अ‍ॅग्री-मशीनरी पोर्टल/राज्य DBT).'
        },
        eligibility: {
          en: ['Registered farmer; as per category/landholding norms', 'Vendor empanelment & quotation'],
          mr: ['नोंदणीकृत शेतकरी; श्रेणी/होल्डिंग निकषानुसार', 'एम्पॅनेल्ड विक्रेत्याचे कोटेशन/प्रोफॉर्मा']
        },
        docs: {
          en: ['Aadhaar', '7/12 extract', 'Bank details', 'Vendor proforma invoice'],
          mr: ['आधार', '७/१२ उतारा', 'बँक तपशील', 'विक्रेता प्रोफॉर्मा इनव्हॉईस']
        },
        steps: {
          en: [
            'Choose equipment & empanelled vendor; get proforma.',
            'Apply on agri-machinery/State DBT portal.',
            'Verification → sanction → purchase → installation → bill upload for subsidy.'
          ],
          mr: [
            'उपकरण व एम्पॅनेल्ड विक्रेता निवडा; प्रोफॉर्मा घ्या.',
            'अ‍ॅग्री-मशीनरी/राज्य DBT पोर्टलवर अर्ज करा.',
            'तपासणी → मंजुरी → खरेदी → बसवणी → बिल अपलोड करून अनुदान घ्या.'
          ]
        },
        apply: 'https://agrimachinery.nic.in/'
      },
      {
        id: 'smam_drones',
        title: { en: 'Drone Assistance for Agriculture (SMAM/State)', mr: 'कृषि ड्रोन सहाय्य (SMAM/राज्य)' },
        dept: 'DoAC&FW / State Agriculture',
        level: 'central',
        districts: ['All'],
        categories: ['machinery'],
        crops: [],
        what: {
          en: 'Assistance for purchase/CHC-based use of agri drones for spraying & monitoring (as notified).',
          mr: 'फवारणी व मॉनिटरिंगसाठी कृषि ड्रोन खरेदी/CHC वापरावर सहाय्य (सूचनेनुसार).'
        },
        eligibility: {
          en: ['Farmer/CHC/FPO/Institution as per guidelines', 'Trained operator/agency'],
          mr: ['मार्गदर्शकानुसार शेतकरी/CHC/FPO/संस्था', 'प्रशिक्षित ऑपरेटर/एजन्सी']
        },
        docs: {
          en: ['KYC', 'Proposal/quotation', 'Bank details', 'Training certificate (if required)'],
          mr: ['KYC', 'प्रस्ताव/कोटेशन', 'बँक तपशील', 'प्रशिक्षण प्रमाणपत्र (लागू असल्यास)']
        },
        steps: {
          en: [
            'Identify drone model/vendor and get estimate.',
            'Apply on agrimachinery/State DBT portal with proposal.',
            'Post-sanction purchase and demonstration; claim assistance.'
          ],
          mr: [
            'ड्रोन मॉडेल/विक्रेता निश्चित करून अंदाज घ्या.',
            'प्रस्तावासह अ‍ॅग्रीमशीनरी/राज्य DBT वर अर्ज करा.',
            'मंजुरीनंतर खरेदी व डेमो; सहाय्य मागणी करा.'
          ]
        },
        apply: 'https://agrimachinery.nic.in/'
      },
      {
        id: 'custom_hiring_centre',
        title: { en: 'Custom Hiring Centre (CHC) Support', mr: 'कस्टम हायरिंग सेंटर (CHC) सहाय्य' },
        dept: 'State Agriculture / SMAM',
        level: 'state',
        districts: ['All'],
        categories: ['machinery', 'loan'],
        crops: [],
        what: {
          en: 'Support for setting up CHCs so farmers can rent machinery at affordable rates.',
          mr: 'शेतकऱ्यांना परवडणाऱ्या दरात अवजारे भाड्याने देण्यासाठी CHC स्थापनेवर सहाय्य.'
        },
        eligibility: {
          en: ['FPO/SHG/Entrepreneur/Co-op entities', 'Project proposal with equipment list & business plan'],
          mr: ['FPO/SHG/उद्योजक/संस्था', 'उपकरण यादी व व्यवसाय आराखड्यासह प्रस्ताव']
        },
        docs: {
          en: ['KYC', 'Project report', 'Quotation bundle', 'Bank consent/sanction'],
          mr: ['KYC', 'प्रकल्प अहवाल', 'कोटेशन संच', 'बँक संमती/मंजुरी']
        },
        steps: {
          en: [
            'Prepare project plan & CAPEX list.',
            'Apply via State DBT/department with quotations.',
            'Verification → sanction → procurement; start CHC operations.'
          ],
          mr: [
            'प्रकल्प योजना व CAPEX यादी तयार करा.',
            'कोटेशनसह राज्य DBT/विभागामार्फत अर्ज करा.',
            'तपासणी → मंजुरी → खरेदी; CHC सुरू करा.'
          ]
        },
        apply: 'https://mahadbt.maharashtra.gov.in/'
      },
      {
        id: 'nrlm_rf',
        title: { en: 'NRLM – Revolving Fund for SHGs', mr: 'NRLM – स्वयं सहायता गटांसाठी रिव्हॉल्व्हिंग फंड' },
        dept: 'MoRD / MSRLM (UMED)',
        level: 'central',
        districts: ['All'],
        categories: ['women-shg'],
        crops: [],
        what: {
          en: 'Revolving Fund to eligible SHGs to strengthen internal lending and micro-enterprise activities.',
          mr: 'पात्र SHG साठी अंतर्गत कर्ज व सूक्ष्म-उद्योजकता मजबूत करण्यासाठी रिव्हॉल्व्हिंग फंड.'
        },
        eligibility: {
          en: ['SHG graded as per NRLM norms', 'Active bank account & books of accounts'],
          mr: ['NRLM निकषानुसार ग्रेडेड SHG', 'बँक खाते व पुस्तके व्यवस्थित']
        },
        docs: {
          en: ['SHG resolution', 'Bank details', 'Member list & IDs'],
          mr: ['SHG ठराव', 'बँक तपशील', 'सदस्य यादी व ओळखपत्र']
        },
        steps: {
          en: [
            'Contact Cluster/Block Mission Unit (UMED).',
            'Submit SHG documents for grading/approval.',
            'Receive RF in SHG account and on-lend to members.'
          ],
          mr: [
            'क्लस्टर/ब्लॉक मिशन युनिट (UMED) शी संपर्क साधा.',
            'ग्रेडिंग/मंजुरीसाठी SHG कागदपत्रे सादर करा.',
            'RF रक्कम SHG खात्यात मिळून सदस्यांना अंतर्गत कर्ज द्या.'
          ]
        },
        apply: 'https://umed.in/'
      },
      {
        id: 'mksp',
        title: { en: 'MKSP – Mahila Kisan Sashaktikaran Pariyojana', mr: 'MKSP – महिला किसान सशक्तिकरण परियोजना' },
        dept: 'MoRD / MSRLM (UMED)',
        level: 'central',
        districts: ['All'],
        categories: ['women-shg'],
        crops: [],
        what: {
          en: 'Capacity building & livelihood support for women farmers in sustainable agriculture & allied activities.',
          mr: 'शाश्वत शेті व संलग्न व्यवसायांत महिला शेतकऱ्यांसाठी क्षमतावृद्धी व उपजीविका सहाय्य.'
        },
        eligibility: {
          en: ['Women farmers/SHG members in project blocks', 'Willingness to adopt practices'],
          mr: ['प्रकल्प ब्लॉकमधील महिला शेतकरी/SHG सदस्य', 'पद्धती स्वीकारण्याची तयारी']
        },
        docs: {
          en: ['ID (Aadhaar)', 'SHG membership record', 'Bank details'],
          mr: ['ओळख (आधार)', 'SHG सदस्य नोंद', 'बँक तपशील']
        },
        steps: {
          en: [
            'Enroll via UMED field staff/cluster.',
            'Participate in training & demo plots.',
            'Access inputs/market linkages and small grants as per norms.'
          ],
          mr: [
            'UMED फील्ड स्टाफ/क्लस्टर मार्फत नोंदणी करा.',
            'प्रशिक्षण व डेमो प्लॉटमध्ये सहभागी व्हा.',
            'निकषांनुसार इनपुट/बाजार जोडणी व लहान अनुदान मिळवा.'
          ]
        },
        apply: 'https://umed.in/'
      },
      {
        id: 'nrlm_cif',
        title: { en: 'NRLM – Community Investment Fund (CIF)', mr: 'NRLM – कम्युनिटी इन्व्हेस्टमेंट फंड (CIF)' },
        dept: 'MoRD / MSRLM (UMED)',
        level: 'central',
        districts: ['All'],
        categories: ['women-shg', 'loan'],
        crops: [],
        what: {
          en: 'CIF to SHG federations for livelihood enterprises, including agri-based micro-units.',
          mr: 'SHG महासंघांना उपजीविका उद्योगांसाठी CIF – कृषि आधारित सूक्ष्म युनिटसह.'
        },
        eligibility: {
          en: ['SHG federation with proper governance', 'Approved micro-plan'],
          mr: ['योग्य शासकीय व्यवस्था असलेला SHG महासंघ', 'मंजूर मायक्रो-प्लॅन']
        },
        docs: {
          en: ['Federation resolution', 'Micro-plan/DPR', 'Bank details'],
          mr: ['महासंघ ठराव', 'मायक्रो-प्लॅन/DPR', 'बँक तपशील']
        },
        steps: {
          en: [
            'Prepare micro-plans with federations.',
            'Submit to Block/District Mission for approval.',
            'CIF released to federation; on-lending to SHGs.'
          ],
          mr: [
            'महासंघांसह मायक्रो-प्लॅन तयार करा.',
            'ब्लॉक/जिल्हा मिशनकडे मंजुरीसाठी सादर करा.',
            'CIF महासंघाला वितरीत; SHG ला पुढील कर्ज.'
          ]
        },
        apply: 'https://umed.in/'
      },
      {
        id: 'state_tractor_subsidy',
        title: { en: 'State Subsidy – Tractor / Power Tiller (MahaDBT)', mr: 'राज्य अनुदान – ट्रॅक्टर / पॉवर टिलर (महाडिबीटी)' },
        dept: 'Dept. of Agriculture, Maharashtra',
        level: 'state',
        districts: ['All'],
        categories: ['machinery'],
        crops: [],
        what: {
          en: 'State assistance for tractor/power tiller purchase for eligible farmers (share/ceiling as notified).',
          mr: 'पात्र शेतकऱ्यांसाठी ट्रॅक्टर/पॉवर टिलर खरेदीवर राज्य सहाय्य (सूचनेनुसार हिस्सा/सीलिंग).'
        },
        eligibility: {
          en: ['Registered farmer in Maharashtra', 'As per landholding & category norms', 'Purchase from empanelled vendor'],
          mr: ['महाराष्ट्रातील नोंदणीकृत शेतकरी', 'जमीनधारणा/श्रेणी निकषानुसार', 'एम्पॅनेल्ड विक्रेत्याकडून खरेदी']
        },
        docs: {
          en: ['Aadhaar', '7/12 extract', 'Bank details', 'Quotation/Invoice from empanelled dealer'],
          mr: ['आधार', '७/१२ उतारा', 'बँक तपशील', 'एम्पॅनेल्ड डिलरचे कोटेशन/इनव्हॉईस']
        },
        steps: {
          en: [
            'Select tractor/tiller & get vendor quotation.',
            'Apply on MahaDBT with documents; await verification & sanction.',
            'Purchase & upload bills; receive subsidy as per rules.'
          ],
          mr: [
            'ट्रॅक्टर/टिलर निवडा व विक्रेत्याकडून कोटेशन घ्या.',
            'महाडिबीटीवर कागदपत्रांसह अर्ज करा; पडताळणी व मंजुरीची प्रतीक्षा.',
            'खरेदी करून बिले अपलोड करा; नियमांनुसार अनुदान मिळवा.'
          ]
        },
        apply: 'https://mahadbt.maharashtra.gov.in'
      },
      {
        id: 'new_local_scheme',
        title: { en: 'Local Irrigation Support', mr: 'स्थानिक सिंचन सहाय्य' },
        dept: 'State Agriculture',
        level: 'state',
        districts: ['Aurangabad (Chhatrapati Sambhajinagar)'],
        categories: ['irrigation'],
        crops: ['Cotton', 'Horticulture'],
        what: { en: 'Subsidy for small irrigation systems.', mr: 'लहान सिंचन प्रणालींसाठी अनुदान.' },
        eligibility: { en: ['Farmer with cultivable land'], mr: ['कृषी जमीन असणे आवश्यक'] },
        docs: { en: ['Aadhaar', '7/12', 'Bank passbook'], mr: ['आधार', '७/१२', 'बँक पासबुक'] },
        steps: { en: ['Get vendor estimate', 'Apply at block office'], mr: ['विक्रेत्याकडून अंदाज घ्या', 'ब्लॉक कार्यालयात अर्ज करा'] },
        apply: '#'
      }
    ];

const FINAL_SCHEMES = [...BASE_SCHEMES, ...MORE_SCHEMES, 
      // 1) Rotavator / Cultivator Subsidy
      {
        id: 'rotavator_cultivator_subsidy',
        title: { en: 'Rotavator / Cultivator Subsidy', mr: 'रोटावेटर / कल्टिव्हेटर अनूद