export  const programs = [
    {
      id: 1,
      title: 'Semester in Florence',
      provider: 'Florence University of the Arts',
      location: 'Florence, Italy',
      country: 'italy',
      duration: 'semester',
      cost: '$18,000',
      costRange: 'medium',
      field: 'art',
      language: 'english',
      rating: 4.8,
      participants: 45,
      description: 'Immerse yourself in Renaissance art and Italian culture in the heart of Tuscany.',
      highlights: ['Art History Focus', 'Italian Language', 'Cultural Immersion', 'Museum Access'],
      image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      featured: true,
      university: {
        name: 'Florence University of the Arts',
        ranking: 'Top 50 Art Schools',
        accreditation: 'NASAD Accredited'
      },
      requirements: {
        gpa: '3.0',
        language: 'English (Italian helpful)',
        prerequisites: 'Art History background preferred'
      }
    },
    {
      id: 2,
      title: 'Tokyo Business Program',
      provider: 'Waseda University',
      location: 'Tokyo, Japan',
      country: 'japan',
      duration: 'year',
      cost: '$22,000',
      costRange: 'high',
      field: 'business',
      language: 'english',
      rating: 4.9,
      participants: 32,
      description: 'Study international business and Japanese culture in one of the world\'s leading business hubs.',
      highlights: ['Business Focus', 'Japanese Language', 'Internship Opportunities', 'Tech Industry'],
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      featured: true,
      university: {
        name: 'Waseda University',
        ranking: 'Top 10 in Japan',
        accreditation: 'AACSB Accredited'
      },
      requirements: {
        gpa: '3.5',
        language: 'English (Japanese helpful)',
        prerequisites: 'Business or Economics background'
      }
    },
    {
      id: 3,
      title: 'Barcelona Architecture',
      provider: 'Universitat Politècnica de Catalunya',
      location: 'Barcelona, Spain',
      country: 'spain',
      duration: 'semester',
      cost: '$16,500',
      costRange: 'medium',
      field: 'architecture',
      language: 'spanish',
      rating: 4.7,
      participants: 28,
      description: 'Explore modernist architecture and urban planning in the vibrant city of Barcelona.',
      highlights: ['Architecture Focus', 'Urban Planning', 'Spanish Language', 'Design Studios'],
      image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      featured: false,
      university: {
        name: 'Universitat Politècnica de Catalunya',
        ranking: 'Top Architecture School in Spain',
        accreditation: 'NAAB Recognized'
      },
      requirements: {
        gpa: '3.2',
        language: 'Spanish (Intermediate)',
        prerequisites: 'Architecture or Design background'
      }
    },
    {
      id: 4,
      title: 'Oxford Summer Program',
      provider: 'University of Oxford',
      location: 'Oxford, United Kingdom',
      country: 'uk',
      duration: 'summer',
      cost: '$8,500',
      costRange: 'low',
      field: 'liberal-arts',
      language: 'english',
      rating: 4.9,
      participants: 60,
      description: 'Experience the prestigious Oxford tutorial system in an intensive summer program.',
      highlights: ['Tutorial System', 'Historic Campus', 'Academic Excellence', 'Networking'],
      image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      featured: true,
      university: {
        name: 'University of Oxford',
        ranking: '#1 in UK',
        accreditation: 'Russell Group'
      },
      requirements: {
        gpa: '3.7',
        language: 'English (Native/Fluent)',
        prerequisites: 'Strong academic record'
      }
    }
  ];