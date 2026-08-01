import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  useAdminAds,
  useCreateAdminAd,
  useUpdateAdminAd,
  useDeleteAdminAd,
} from '@/features/admin/api/useAdmin';

export default function AdManagement() {
  const { isAdmin } = useAuth();
  const { data: ads, isPending } = useAdminAds({ enabled: isAdmin });
  const createAd = useCreateAdminAd();
  const updateAd = useUpdateAdminAd();
  const deleteAd = useDeleteAdminAd();

  const [form, setForm] = useState({ title: '', link: '/', image: '/images/courses/hot-1.png' });
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAd.mutateAsync(form);
      setForm({ title: '', link: '/', image: '/images/courses/hot-1.png' });
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggle = async (ad) => {
    await updateAd.mutateAsync({ id: ad.id, data: { active: !ad.active } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定刪除此廣告？')) return;
    await deleteAd.mutateAsync(id);
  };

  if (!isAdmin) {
    return (
      <main className="profile-page">
        <div className="container"><p>此頁面僅限管理員存取。</p></div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="container">
        <h1 className="page-title">廣告管理</h1>
        <Link to="/admin" className="back-link">← 返回管理後台</Link>

        <button type="button" className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '新增廣告'}
        </button>

        {showForm && (
          <form className="ad-form" onSubmit={handleCreate}>
            <input
              placeholder="標題"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              placeholder="連結"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
            <button type="submit" className="btn-primary btn-primary--sm">建立</button>
          </form>
        )}

        {isPending && <p>載入中...</p>}

        <div className="ad-list">
          {ads?.map((ad) => (
            <div key={ad.id} className="ad-item">
              <div>
                <strong>{ad.title}</strong>
                <p>{ad.link}</p>
              </div>
              <div className="ad-item__actions">
                <span className={`status-tag ${ad.active ? 'status-tag--published' : 'status-tag--archived'}`}>
                  {ad.active ? '啟用' : '停用'}
                </span>
                <button type="button" className="btn-outline btn-outline--sm" onClick={() => handleToggle(ad)}>
                  切換
                </button>
                <button type="button" className="btn-outline btn-outline--sm" onClick={() => handleDelete(ad.id)}>
                  刪除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
