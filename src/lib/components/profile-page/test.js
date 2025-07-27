export const userProfile = {
    id: 1,
    name: 'Marco Benedetti',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    badge: 'Local Expert',
    location: 'Rome, Italy',
    university: 'Sapienza University of Rome',
    currentProgram: 'Sapienza University of Rome',
    major: 'International Relations',
    year: 'Alumni',
    wentAbroad: true,
    joinDate: '2023-09-15',
    bio: 'Rome native passionate about helping international students discover the beauty of my city. Love photography, history, and sharing hidden gems with fellow students.',
    isVerified: true,
    stats: {
      posts: 47,
      followers: 234,
      following: 89,
      likes: 1247,
      helpfulVotes: 156
    },
    badges: [
      { name: 'Local Expert', color: 'bg-blue-100 text-blue-700' },
      { name: 'Top Contributor', color: 'bg-purple-100 text-purple-700' },
      { name: 'Photography Pro', color: 'bg-green-100 text-green-700' }
    ],
    recentPosts: [
      {
        id: 1,
        content: 'Amazing sunset from the Spanish Steps tonight! Rome never fails to take my breath away 🌅',
        image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        timestamp: '4 hours ago',
        likes: 89,
        comments: 23,
        shares: 15
      },
      {
        id: 2,
        content: 'Pro tip for new students: The best gelato in Trastevere is at Fatamorgana. Trust me on this one! 🍦',
        image: null,
        timestamp: '2 days ago',
        likes: 67,
        comments: 18,
        shares: 8
      },
      {
        id: 3,
        content: 'Weekend trip to Florence was incredible! The Uffizi Gallery blew my mind. Already planning the next adventure.',
        image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        timestamp: '1 week ago',
        likes: 124,
        comments: 31,
        shares: 22
      }
    ],
    contributions: [
      {
        type: 'guide',
        title: 'Hidden Gems of Trastevere',
        description: 'A local\'s guide to the best spots in Rome\'s most charming neighborhood.',
        rating: 4.8,
        views: 1247
      },
      {
        type: 'tip',
        title: 'Best Photography Spots in Rome',
        description: 'Capture the eternal city like a pro with these insider locations.',
        rating: 4.9,
        views: 892
      },
      {
        type: 'review',
        title: 'Authentic Roman Restaurants',
        description: 'Where locals actually eat - no tourist traps here!',
        rating: 4.7,
        views: 634
      }
    ],
    reviews: [
      {
        id: 1,
        reviewer: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        rating: 5,
        text: 'Marco was incredibly helpful when I first arrived in Rome. His local knowledge is amazing!',
        date: '2024-01-15'
      },
      {
        id: 2,
        reviewer: 'David Kim',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        rating: 5,
        text: 'Thanks to Marco\'s recommendations, I discovered some incredible places I never would have found on my own.',
        date: '2024-01-10'
      }
    ]
  };


  export const profileData = { 
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'Rome, Italy',
      university: 'University of California, Berkeley',
      major: 'Art History',
      bio: 'Passionate about Renaissance art and Italian culture. Currently studying abroad in Rome and loving every moment of this incredible journey.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  }

  export const savedItems = [
    {
      id: 1,
      type: 'scholarship',
      title: 'Fulbright Student Program',
      provider: 'U.S. Department of State',
      amount: '$25,000 - $50,000',
      deadline: '2024-03-15',
      dateSaved: '2024-01-10'
    },
    {
      id: 2,
      type: 'program',
      title: 'Semester in Florence',
      provider: 'Florence University of the Arts',
      cost: '$18,000',
      duration: 'Semester',
      dateSaved: '2024-01-08'
    },
    {
      id: 3,
      type: 'resource',
      title: 'Complete Guide to Student Visa Application',
      author: 'RomeWithMe Team',
      downloads: 2847,
      dateSaved: '2024-01-05'
    }
  ];

  export const applications = [
    {
      id: 1,
      title: 'Fulbright Student Program',
      type: 'scholarship',
      status: 'submitted',
      deadline: '2024-03-15',
      submitted: '2024-01-20',
      progress: 75
    },
    {
      id: 2,
      title: 'DAAD Study Scholarship',
      type: 'scholarship',
      status: 'in-progress',
      deadline: '2024-05-15',
      submitted: null,
      progress: 40
    },
    {
      id: 3,
      title: 'Barcelona Architecture Program',
      type: 'program',
      status: 'accepted',
      deadline: '2024-02-01',
      submitted: '2024-01-15',
      progress: 100
    }
  ];

  export const recentActivity = [
    {
      id: 1,
      type: 'post',
      action: 'liked',
      target: 'Amazing sunset from the Spanish Steps tonight!',
      user: 'Marco Benedetti',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'comment',
      action: 'commented on',
      target: 'Professor Rossi\'s Art History course discussion',
      user: 'Emma Chen',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      type: 'save',
      action: 'saved',
      target: 'Rome Transportation Master Guide',
      user: null,
      timestamp: '1 day ago'
    },
    {
      id: 4,
      type: 'application',
      action: 'submitted application for',
      target: 'Fulbright Student Program',
      user: null,
      timestamp: '3 days ago'
    }
  ];