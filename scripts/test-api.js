const BASE = process.env.API_BASE || 'http://localhost:3001/api';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function run() {
  const results = [];
  let token = null;

  const step = async (name, fn) => {
    try {
      await fn();
      results.push({ name, pass: true });
      console.log(`✓ ${name}`);
    } catch (err) {
      results.push({ name, pass: false, error: err.message });
      console.error(`✗ ${name}: ${err.message}`);
    }
  };

  await step('GET /courses returns list', async () => {
    const { ok, data } = await request('/courses');
    assert(ok && Array.isArray(data) && data.length > 0, 'courses empty');
  });

  await step('GET /courses/1 includes detail fields', async () => {
    const { ok, data } = await request('/courses/1');
    assert(ok && data.description && data.units && data.reviews, 'missing detail fields');
  });

  await step('POST /auth/login', async () => {
    const { ok, data } = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ account: 'demo_user', password: 'TriangleDemo2026' }),
    });
    assert(ok && data.token, 'login failed');
    token = data.token;
  });

  const auth = { Authorization: `Bearer ${token}` };

  await step('GET /profile for demo user', async () => {
    const { ok, data } = await request('/profile', { headers: auth });
    assert(ok && data.user && Array.isArray(data.orders), 'profile invalid');
  });

  await step('POST /likeGoods add favorite', async () => {
    const { ok, data } = await request('/likeGoods', {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({ courseId: 3 }),
    });
    assert(ok && data.savedCourses.some((item) => item.courseId === 3), 'favorite not added');
  });

  await step('DELETE /likeGoods remove favorite', async () => {
    const { ok, data } = await request('/likeGoods/3', { method: 'DELETE', headers: auth });
    assert(ok && !data.savedCourses.some((item) => item.courseId === 3), 'favorite not removed');
  });

  await step('Cart add and purchase flow', async () => {
    await request('/cart', { method: 'DELETE', headers: auth });
    const add = await request('/cart', {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({ courseId: 12 }),
    });
    assert(add.ok, 'add to cart failed');

    const purchase = await request('/purchase', { method: 'POST', headers: auth, body: '{}' });
    assert(purchase.ok && purchase.data.orders.length === 1, 'purchase failed');

    const history = await request('/purchaseHistory', { headers: auth });
    assert(history.ok && history.data.some((order) => order.courseId === 12), 'order not in history');

    const orderId = purchase.data.orders[0].id;
    const one = await request(`/purchaseHistory/${orderId}`, { headers: auth });
    assert(one.ok && one.data.id === orderId, 'get one order failed');

    const updated = await request(`/purchaseHistory/${orderId}`, {
      method: 'PATCH',
      headers: auth,
      body: JSON.stringify({ status: 'refunded' }),
    });
    assert(updated.ok && updated.data.status === 'refunded', 'update status failed');
  });

  await step('POST /auth/register creates profile', async () => {
    const account = `test_${Date.now()}`;
    const reg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        account,
        password: 'TriangleDemo2026',
        confirmPassword: 'TriangleDemo2026',
      }),
    });
    assert(reg.ok && reg.data.token, 'register failed');

    const profile = await request('/profile', {
      headers: { Authorization: `Bearer ${reg.data.token}` },
    });
    assert(profile.ok && profile.data.user.account === account, 'new user profile missing');
  });

  const failed = results.filter((item) => !item.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
