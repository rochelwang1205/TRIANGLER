const BASE_URL = '/api';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = localStorage.getItem('token');
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || '請求失敗');
  }

  return data;
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export const serverApi = {
  getCourses(params) {
    return request(`/courses${buildQuery(params)}`);
  },

  getCourse(id) {
    return request(`/courses/${id}`);
  },

  getFaqCategories() {
    return request('/faqCategories');
  },

  getQuizQuestions() {
    return request('/quizQuestions');
  },

  getTestimonials() {
    return request('/testimonials');
  },

  getThemes() {
    return request('/themes');
  },

  submitRecommend(answers) {
    return request('/recommend', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  login(account, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ account, password }),
    });
  },

  register(account, password, confirmPassword) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ account, password, confirmPassword }),
    });
  },

  resetPassword(account, password, confirmPassword) {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ account, password, confirmPassword }),
    });
  },

  getPopularSearches() {
    return request('/popularSearches');
  },

  getCart() {
    return request('/cart');
  },

  addToCart(courseId) {
    return request('/cart', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  },

  removeFromCart(courseId) {
    return request(`/cart/${courseId}`, { method: 'DELETE' });
  },

  clearCart() {
    return request('/cart', { method: 'DELETE' });
  },

  getProfile() {
    return request('/profile');
  },

  addLikeGoods(courseId) {
    return request('/likeGoods', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  },

  removeLikeGoods(courseId) {
    return request(`/likeGoods/${courseId}`, { method: 'DELETE' });
  },

  purchase() {
    return request('/purchase', { method: 'POST', body: JSON.stringify({}) });
  },

  getPurchaseHistory() {
    return request('/purchaseHistory');
  },

  getPurchaseOne(id) {
    return request(`/purchaseHistory/${id}`);
  },

  updatePurchaseStatus(id, status) {
    return request(`/purchaseHistory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
