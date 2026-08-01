export const queryKeys = {
  courses: {
    all: ['courses'],
    list: (params = {}) => ['courses', 'list', params],
    detail: (id) => ['courses', 'detail', id],
  },
  themes: ['themes'],
  popularSearches: ['popularSearches'],
  testimonials: ['testimonials'],
  faq: ['faq'],
  profile: ['profile'],
  quiz: ['quiz'],
  notifications: ['notifications'],
  teacher: {
    courses: (userId) => ['teacher', 'courses', userId ?? 'guest'],
    students: (id) => ['teacher', 'students', id],
  },
  admin: {
    stats: ['admin', 'stats'],
    courses: (params = {}) => ['admin', 'courses', params],
    orders: ['admin', 'orders'],
    users: ['admin', 'users'],
    ads: ['admin', 'ads'],
  },
};
