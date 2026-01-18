
export type GovernmentScheme = {
  name: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  link: string;
  category: string;
  state?: string;
};

export const governmentSchemes: GovernmentScheme[] = [
  {
    name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    description: 'National Mission for Financial Inclusion to ensure access to financial services, namely, Banking/ Savings & Deposit Accounts, Remittance, Credit, Insurance, Pension in an affordable manner.',
    eligibility: [
      'Indian citizen',
      'Minimum age of 10 years',
      'No requirement for minimum balance',
    ],
    benefits: [
      'Accidental insurance cover of Rs. 1 lakh',
      'Life cover of Rs. 30,000',
      'Overdraft facility up to Rs. 10,000',
    ],
    link: 'https://pmjdy.gov.in/',
    category: 'Financial Inclusion',
    state: 'Central Government',
  },
  {
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    description: 'A central sector scheme with 100% funding from Government of India that provides income support to all landholding farmer families in the country.',
    eligibility: [
      'Farmer families who have cultivable landholding',
      'Both urban and rural farmers are eligible',
    ],
    benefits: [
      'Income support of Rs. 6,000 per year in three equal installments',
      'Direct benefit transfer to the bank accounts of beneficiaries',
    ],
    link: 'https://pmkisan.gov.in/',
    category: 'Agriculture',
    state: 'Central Government',
  },
  {
    name: 'Atal Pension Yojana (APY)',
    description: 'A government-backed pension scheme in India, primarily targeted at the unorganized sector.',
    eligibility: [
      'Indian citizen between 18 - 40 years of age',
      'Must have a savings bank account',
    ],
    benefits: [
      'Guaranteed minimum monthly pension of Rs. 1,000 to Rs. 5,000 after the age of 60',
      'The government co-contributes 50% of the total contribution or Rs. 1,000 per annum, whichever is lower.',
    ],
    link: 'https://www.npscra.nsdl.co.in/atal-pension-yojana.php',
    category: 'Social Security',
    state: 'Central Government',
  },
    {
    name: 'Mukhymantri Chiranjeevi Swasthya Bima Yojana',
    description: 'A universal health insurance scheme providing cashless medical insurance to every family in Rajasthan.',
    eligibility: ['All permanent resident families of Rajasthan.'],
    benefits: ['Cashless health insurance up to ₹25 lakhs.', 'Covers a wide range of diseases and treatments.'],
    link: 'https://chiranjeevi.rajasthan.gov.in/',
    category: 'Health & Sanitation',
    state: 'Rajasthan',
  },
  {
    name: 'Beti Bachao, Beti Padhao (BBBP)',
    description: 'A campaign of the Government of India that aims to generate awareness and improve the efficiency of welfare services intended for girls in India.',
    eligibility: [
      'Focuses on families with a girl child',
      'Applicable across all states and UTs in India',
    ],
    benefits: [
      'Addresses the declining Child Sex Ratio (CSR)',
      'Promotes girl child education and empowerment',
      'Sukanya Samriddhi Yojana (SSY) is a small deposit scheme for a girl child under BBBP.',
    ],
    link: 'https://wcd.nic.in/bbbp-schemes',
    category: 'Women & Child Development',
    state: 'Central Government',
  },
  {
    name: 'Swachh Bharat Mission (SBM)',
    description: 'A country-wide campaign initiated by the Government of India to eliminate open defecation and improve solid waste management.',
    eligibility: [
      'Applicable to all rural and urban areas of the country.'
    ],
    benefits: [
      'Increased sanitation coverage in rural India',
      'Aims to achieve a clean and open defecation free (ODF) India',
      'Promotes hygiene and better living conditions',
    ],
    link: 'https://swachhbharatmission.gov.in/sbmcms/index.htm',
    category: 'Health & Sanitation',
    state: 'Central Government',
  },
    {
    name: 'Rythu Bandhu Scheme',
    description: 'Telangana\'s Farmer\'s Investment Support Scheme provides financial assistance to farmers for the two major crop seasons.',
    eligibility: ['All farmers in Telangana owning patta land.', 'Excludes farmers cultivating forest land.'],
    benefits: ['Financial aid of ₹5,000 per acre per season.', 'Covers both Rabi and Kharif seasons.'],
    link: 'https://rythubandhu.telangana.gov.in/',
    category: 'Agriculture',
    state: 'Telangana',
  },
  {
    name: 'Laadli Laxmi Yojana',
    description: 'A scheme to improve the health and educational status of girls and change the negative mindset towards the girl child.',
    eligibility: ['Girls born after January 1, 2006, in non-income tax paying families.', 'Parents should be residents of Madhya Pradesh.'],
    benefits: ['Financial assistance at different stages of education.', 'A lump sum of ₹1 lakh on attaining the age of 21 years.'],
    link: 'https://ladlilaxmi.mp.gov.in/',
    category: 'Women & Child Development',
    state: 'Madhya Pradesh',
  },
    {
    name: 'KALIA Scheme',
    description: 'Krushak Assistance for Livelihood and Income Augmentation (KALIA) is a support package for farmers and landless agricultural households.',
    eligibility: ['Small and marginal farmers.', 'Landless agricultural households.', 'Vulnerable agricultural households.'],
    benefits: ['Financial support of ₹12,500 over three installments for cultivators.', 'Livelihood support of ₹12,500 for landless households.', 'Life insurance cover.'],
    link: 'https://kalia.odisha.gov.in/',
    category: 'Agriculture',
    state: 'Odisha',
  },
  {
    name: 'Kanyashree Prakalpa',
    description: 'A conditional cash transfer scheme aiming to improve the status and well-being of girls, specifically by incentivizing schooling of teenage girls and delaying their marriages until the age of 18.',
    eligibility: ['Unmarried girls aged 13-18 enrolled in educational institutions.', 'Family income must be less than or equal to ₹1,20,000 per annum.'],
    benefits: ['Annual scholarship of ₹1000 for girls aged 13-18.', 'One-time grant of ₹25,000 for girls who continue education and remain unmarried at 18.'],
    link: 'https://www.wbkanyashree.gov.in/',
    category: 'Women & Child Development',
    state: 'West Bengal',
  },
  {
    name: 'YSR Rythu Bharosa',
    description: 'A scheme to provide financial assistance to farmer families, including tenant farmers, across Andhra Pradesh.',
    eligibility: ['Landowner farmer families.', 'Tenant farmers belonging to SC, ST, BC, and Minority categories.'],
    benefits: ['Financial assistance of ₹13,500 per farmer family per year.', 'Includes ₹6,000 from PM-KISAN.', 'Interest-free crop loans.'],
    link: 'https://ysrrythubharosa.apcfss.in/',
    category: 'Agriculture',
    state: 'Andhra Pradesh',
  },
  {
    name: 'Amma Vodi',
    description: 'A scheme to provide financial assistance to mothers or recognized guardians for sending their children to private unaided schools, from Class 1 to 12.',
    eligibility: ['Mothers or guardians from below poverty line (BPL) families.', 'Children must be studying in private unaided schools.'],
    benefits: ['Financial assistance of ₹15,000 per year.', 'Credited directly to the beneficiary mother\'s bank account.'],
    link: 'https://jaganannaammavodi.ap.gov.in/',
    category: 'Women & Child Development',
    state: 'Andhra Pradesh',
  },
  {
    name: 'Mahatma Jyotiba Phule Jan Arogya Yojana (MJPJAY)',
    description: 'A flagship health insurance scheme providing cashless quality medical care to beneficiaries for catastrophic illnesses requiring hospitalization and surgery.',
    eligibility: ['Families belonging to distressed districts of Maharashtra.', 'Must hold a valid ration card (Yellow, Orange, or White).'],
    benefits: ['Cashless healthcare up to ₹1,50,000 per family per year.', 'Covers 971 specified therapies and surgeries.', 'Kidney transplants up to ₹2,50,000.'],
    link: 'https://www.jeevandayee.gov.in/',
    category: 'Health & Sanitation',
    state: 'Maharashtra',
  },
  {
    name: 'Arogya Karnataka',
    description: 'A universal health coverage scheme that converges all existing government health schemes to provide comprehensive healthcare to all residents of Karnataka.',
    eligibility: ['All residents of Karnataka state.'],
    benefits: ['Provides primary, secondary, and tertiary healthcare.', 'Cashless treatment for entitled patients at government and empanelled private hospitals.'],
    link: 'https://arogya.karnataka.gov.in/',
    category: 'Health & Sanitation',
    state: 'Karnataka',
  }
];
