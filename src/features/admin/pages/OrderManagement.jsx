import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAdminOrders, useUpdateAdminOrder } from '@/features/admin/api/useAdmin';
import { ORDER_STATUS_LABELS } from '@/features/courses/constants/courseStatus';

export default function OrderManagement() {
  const { isAdmin } = useAuth();
  const { data: orders, isPending } = useAdminOrders({ enabled: isAdmin });
  const updateOrder = useUpdateAdminOrder();

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrder.mutateAsync({ id, status });
    } catch (err) {
      alert(err.message);
    }
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
        <h1 className="page-title">訂單管理</h1>
        <Link to="/admin" className="back-link">← 返回管理後台</Link>

        {isPending && <p>載入中...</p>}

        <div className="admin-order-list">
          {orders?.map((order) => (
            <div key={order.id} className="admin-order-card admin-order-card--full">
              <div>
                <p className="admin-order-card__id">{order.id}</p>
                <p className="admin-order-card__title">{order.title}</p>
                <p className="admin-order-card__user">用戶 ID：{order.userId}</p>
              </div>
              <div className="admin-order-card__meta">
                <strong>${order.price.toLocaleString()}</strong>
                <span>{order.date}</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={updateOrder.isPending}
                >
                  {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
