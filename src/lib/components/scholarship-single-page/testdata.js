export const scholarship = {
    id: 1,
    title: 'Fulbright Student Program',
    provider: 'U.S. Department of State',
    amount: '$25,000 - $50,000',
    deadline: '2024-03-15',
    category: 'cultural',
    country: 'italy',
    level: 'graduate',
    field: 'any',
    location: 'Italy',
    description: 'The Fulbright Student Program provides funding for one academic year of study or research in Italy. This prestigious program aims to increase mutual understanding between the people of the United States and other countries through educational and cultural exchange.',
    fullDescription: `The Fulbright Student Program is the flagship international educational exchange program sponsored by the U.S. government. It is designed to increase mutual understanding between the people of the United States and other countries through educational and cultural exchange.

    The program provides funding for one academic year of study or research in Italy, covering tuition, living expenses, travel costs, and health insurance. Recipients become part of a global network of Fulbright alumni who have gone on to become leaders in their fields.

    This program is particularly valuable for students interested in conducting research, pursuing graduate studies, or engaging in cultural exchange activities that will enhance their academic and professional development while contributing to mutual understanding between nations.`,
    eligibility: [
      'U.S. citizenship required',
      'Bachelor\'s degree by application deadline',
      'Language proficiency in Italian (intermediate level)',
      'Research proposal or study plan',
      'Strong academic record (minimum 3.5 GPA)',
      'Demonstrated leadership potential',
      'Clear career goals and objectives'
    ],
    requirements: [
      {id: 1, req: 'Completed online application'},
      {id: 2, req: 'Personal statement (2-3 pages)'},
      {id: 3, req: 'Research proposal or study plan (5-10 pages)'},
      {id: 4, req: 'Three letters of recommendation'},
      {id: 5, req: 'Official transcripts from all universities attended'},
      {id: 6, req: 'Language proficiency documentation'},
      {id: 7, req: 'CV/Resume'},
      {id: 8, req: 'Interview (if selected as finalist)'},
    ],
    benefits: [
      'Full tuition coverage',
      'Monthly living stipend',
      'Round-trip travel to Italy',
      'Health insurance coverage',
      'Pre-departure orientation',
      'In-country support and networking',
      'Access to Fulbright alumni network',
      'Professional development opportunities'
    ],
    timeline: [
      { date: '2024-03-15', event: 'Application Deadline', status: 'upcoming' },
      { date: '2024-04-30', event: 'Initial Review Complete', status: 'future' },
      { date: '2024-06-15', event: 'Finalist Interviews', status: 'future' },
      { date: '2024-08-01', event: 'Final Selections Announced', status: 'future' },
      { date: '2024-09-01', event: 'Program Begins', status: 'future' }
    ],
    applicationProcess: [
      {
        step: 1,
        title: 'Prepare Application Materials',
        description: 'Gather all required documents including transcripts, recommendations, and personal statement.',
        timeframe: '2-3 months before deadline'
      },
      {
        step: 2,
        title: 'Submit Online Application',
        description: 'Complete the online application form and upload all required documents.',
        timeframe: 'By March 15, 2024'
      },
      {
        step: 3,
        title: 'Initial Review',
        description: 'Applications are reviewed by the selection committee.',
        timeframe: 'April 2024'
      },
      {
        step: 4,
        title: 'Finalist Selection',
        description: 'Selected candidates are invited for interviews.',
        timeframe: 'May-June 2024'
      },
      {
        step: 5,
        title: 'Final Decision',
        description: 'Final selections are made and candidates are notified.',
        timeframe: 'August 2024'
      }
    ],
    contact: {
      email: 'fulbright@state.gov',
      phone: '+1 (202) 453-8000',
      website: 'https://us.fulbrightonline.org',
      address: 'Institute of International Education, 1400 K Street NW, Washington, DC 20005'
    },
    status: 'open',
    featured: true,
    rating: 4.8,
    applicants: 1250,
    awarded: 45,
    successRate: '3.6%'
  };

export const similarScholarships = [
    {
      id: 2,
      title: 'Erasmus+ Scholarship',
      provider: 'European Commission',
      amount: '€300 - €600/month',
      deadline: '2024-04-01',
      rating: 4.6
    },
    {
      id: 3,
      title: 'Benjamin A. Gilman Scholarship',
      provider: 'U.S. Department of State',
      amount: 'Up to $5,000',
      deadline: '2024-03-01',
      rating: 4.7
    },
    {
      id: 4,
      title: 'DAAD Study Scholarship',
      provider: 'German Academic Exchange Service',
      amount: '€850/month',
      deadline: '2024-05-15',
      rating: 4.9
    }
];