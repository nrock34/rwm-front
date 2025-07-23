export const userProfile = {
    id: userId,
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