export type GovernmentScheme = {
  name: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  link: string;
  category: string;
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
  }
];
