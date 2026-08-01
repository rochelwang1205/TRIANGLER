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
};
