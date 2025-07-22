export const program = {
    id: 1,
    title: 'Semester in Florence',
    provider: 'Florence University of the Arts',
    location: 'Florence, Italy',
    country: 'italy',
    duration: 'semester',
    cost: '$18,000',
    rating: 4.8,
    participants: 45,
    description: 'Immerse yourself in Renaissance art and Italian culture in the heart of Tuscany.',
    fullDescription: `Experience the birthplace of the Renaissance while earning academic credit in this comprehensive semester program. Located in the historic center of Florence, students have unparalleled access to world-renowned museums, galleries, and cultural sites.

The program combines rigorous academic coursework with hands-on cultural experiences, including guided tours of the Uffizi Gallery, Palazzo Pitti, and other significant cultural landmarks. Students live in carefully selected accommodations within walking distance of the university and major attractions.

Our faculty includes both American professors and local Italian experts who bring unique perspectives to the curriculum. The program is designed to provide students with a deep understanding of Italian culture, history, and contemporary society while developing language skills and global competencies.`,
    highlights: ['Art History Focus', 'Italian Language', 'Cultural Immersion', 'Museum Access'],
    image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    gallery: [
      'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    featured: true,
    university: {
      name: 'Florence University of the Arts',
      ranking: 'Top 50 Art Schools',
      accreditation: 'NASAD Accredited',
      founded: 1973,
      students: 2500,
      description: 'A leading institution for art and design education in Italy, offering programs that combine traditional techniques with contemporary approaches.'
    },
    requirements: {
      gpa: '3.0 minimum',
      language: 'English (Italian helpful but not required)',
      prerequisites: 'Art History background preferred',
      credits: '15-18 credits per semester',
      level: 'Undergraduate and Graduate'
    },
    academics: {
      courses: [
        'Renaissance Art and Architecture',
        'Italian Language and Culture',
        'Contemporary Italian Society',
        'Art Conservation Techniques',
        'Photography in Florence',
        'Italian Cinema Studies'
      ],
      fieldTrips: [
        'Uffizi Gallery private tours',
        'Palazzo Pitti workshops',
        'Siena day trip',
        'Rome weekend excursion',
        'Venetian art tour'
      ],
      faculty: '12 professors (6 American, 6 Italian)',
      classSize: '15-20 students per class'
    },
    housing: {
      type: 'Shared apartments and homestays',
      location: 'Historic center of Florence',
      amenities: ['WiFi', 'Kitchen access', 'Laundry facilities', 'Study areas'],
      cost: 'Included in program fee',
      description: 'Students are housed in carefully selected accommodations within walking distance of the university and major cultural sites.'
    },
    costs: {
      tuition: '$12,000',
      housing: '$4,000',
      meals: '$1,500',
      activities: '$500',
      total: '$18,000',
      additional: 'Personal expenses, travel insurance, and flights not included'
    },
    applicationProcess: [
      {
        step: 1,
        title: 'Submit Application',
        description: 'Complete online application with personal statement and academic transcripts.',
        deadline: '2 months before program start'
      },
      {
        step: 2,
        title: 'Academic Review',
        description: 'Academic committee reviews application and supporting materials.',
        deadline: '6 weeks before program start'
      },
      {
        step: 3,
        title: 'Acceptance & Enrollment',
        description: 'Accepted students complete enrollment and housing forms.',
        deadline: '4 weeks before program start'
      },
      {
        step: 4,
        title: 'Pre-Departure',
        description: 'Attend orientation sessions and complete final preparations.',
        deadline: '1 week before departure'
      }
    ],
    testimonials: [
      {
        name: 'Sarah Mitchell',
        program: 'Fall 2023',
        rating: 5,
        text: 'This program completely transformed my understanding of art history. Having access to original Renaissance masterpieces while studying was incredible.',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      },
      {
        name: 'Marco Rodriguez',
        program: 'Spring 2023',
        rating: 5,
        text: 'The cultural immersion was amazing. I not only improved my Italian but gained a deep appreciation for Italian culture and history.',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      },
      {
        name: 'Emma Chen',
        program: 'Fall 2022',
        rating: 4,
        text: 'Excellent program with knowledgeable professors. The field trips and cultural activities were highlights of my semester.',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      }
    ],
    contact: {
      email: 'admissions@fua.it',
      phone: '+39 055 274 7600',
      website: 'https://fua.it',
      address: 'Via del Parione, 11, 50123 Firenze FI, Italy'
    }
  };


export const relatedPrograms = [
    {
      id: 2,
      title: 'Rome Architecture Program',
      provider: 'American University of Rome',
      location: 'Rome, Italy',
      duration: 'semester',
      cost: '$19,500',
      rating: 4.7
    },
    {
      id: 3,
      title: 'Venice Art Intensive',
      provider: 'Venice Institute of Art',
      location: 'Venice, Italy',
      duration: 'summer',
      cost: '$8,500',
      rating: 4.6
    },
    {
      id: 4,
      title: 'Milan Design Program',
      provider: 'Istituto Europeo di Design',
      location: 'Milan, Italy',
      duration: 'semester',
      cost: '$21,000',
      rating: 4.8
    }
  ];