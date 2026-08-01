import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAdminUsers, useUpdateAdminUser } from '@/features/admin/api/useAdmin';
import { ROLE_LABELS } from '@/features/auth/constants/roles';

const ROLES = ['student', 'teacher', 'admin'];

export default function UserManagement() {
  const { isAdmin } = useAuth();
  const { data: users, isPending } = useAdminUsers({ enabled: isAdmin });
  const updateUser = useUpdateAdminUser();

  const handleRoleChange = async (id, role) => {
    try {
      await updateUser.mutateAsync({ id, data: { role } });
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
        <h1 className="page-title">用戶管理</h1>
        <Link to="/admin" className="back-link">← 返回管理後台</Link>

        {isPending && <p>載入中...</p>}

        <div className="user-list">
          {users?.map((user) => (
            <div key={user.id} className="user-item">
              <div>
                <strong>{user.name}</strong>
                <p>{user.account}</p>
              </div>
              <select
                value={user.role ?? 'student'}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                disabled={updateUser.isPending}
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
