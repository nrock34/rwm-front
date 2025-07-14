 export const posts = [
    {
      id: 1,
      type: 'discussion',
      category: 'academics',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        badge: 'Community Leader',
        verified: true,
        admin: true
      },
      timestamp: '2 hours ago',
      content: 'Has anyone taken Professor Rossi\'s Art History course? I\'m considering it for next semester and would love to hear your thoughts on the workload and teaching style. Also wondering about the field trips - are they worth it?',
      image: null,
      likes: 24,
      comments: 12,
      shares: 3,
      views: 156,
      tags: ['art-history', 'professors', 'course-advice'],
      engagement: 39
    },
    {
      id: 2,
      type: 'photo',
      category: 'social',
      author: {
        name: 'Marco Benedetti',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        badge: 'Local Expert',
        verified: false
      },
      timestamp: '4 hours ago',
      content: 'Amazing sunset from the Spanish Steps tonight! Rome never fails to take my breath away 🌅 Perfect end to a long day of classes. Who else loves these magical Roman evenings?',
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      likes: 89,
      comments: 23,
      shares: 15,
      views: 342,
      tags: ['photography', 'spanish-steps', 'sunset', 'rome'],
      engagement: 127
    },
    {
      id: 3,
      type: 'announcement',
      category: 'opportunities',
      author: {
        name: 'RomeWithMe Admin',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        badge: 'Official',
        verified: true
      },
      timestamp: '6 hours ago',
      content: '🎓 New scholarship opportunity! The Fulbright Commission is now accepting applications for the 2024-2025 academic year. Deadline: March 15th. This is a fantastic opportunity for graduate students. Full details in the scholarship section.',
      image: null,
      likes: 156,
      comments: 34,
      shares: 67,
      views: 892,
      tags: ['scholarship', 'fulbright', 'deadline', 'graduate'],
      pinned: true,
      engagement: 257
    },
    {
      id: 4,
      type: 'question',
      category: 'housing',
      author: {
        name: 'Emma Chen',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        badge: 'Study Buddy',
        verified: false
      },
      timestamp: '8 hours ago',
      content: 'Looking for housing recommendations in Trastevere area. Budget around €600/month. Any suggestions for good neighborhoods or specific buildings? Also, is it safe to walk home late at night?',
      image: null,
      likes: 31,
      comments: 18,
      shares: 5,
      views: 234,
      tags: ['housing', 'trastevere', 'budget', 'safety'],
      engagement: 54
    },
    {
      id: 5,
      type: 'photo',
      category: 'events',
      author: {
        name: 'David Kim',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        badge: 'Explorer',
        verified: false
      },
      timestamp: '1 day ago',
      content: 'Weekend trip to Florence was incredible! The Uffizi Gallery blew my mind. Already planning the next adventure. Who\'s in for a trip to Venice next month? Thinking of organizing a group trip!',
      image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      likes: 67,
      comments: 29,
      shares: 12,
      views: 445,
      tags: ['florence', 'uffizi', 'weekend-trip', 'venice', 'group-travel'],
      engagement: 108
    },
    {
      id: 6,
      type: 'discussion',
      category: 'opportunities',
      author: {
        name: 'Lisa Park',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        badge: 'Mentor',
        verified: true
      },
      timestamp: '1 day ago',
      content: 'Just got accepted for an internship at a local NGO! For anyone looking for internship opportunities, I highly recommend checking out the International Volunteer HQ. They have great programs here in Rome. Happy to share my experience!',
      image: null,
      likes: 94,
      comments: 41,
      shares: 28,
      views: 567,
      tags: ['internship', 'ngo', 'volunteer', 'career', 'experience'],
      engagement: 163
    }
  ];