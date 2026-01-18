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
];
