import { Link } from 'react-router-dom';
import { MdOutlineSettings, MdNotificationsNone } from 'react-icons/md';
import { ROLE_LABELS } from '@/features/auth/constants/roles';
import NotificationBell from '@/components/NotificationBell';

export default function AccountHeader({
  name,
  email,
  role,
  settingsPath = '/settings',
  onLogout,
}) {
  return (
    <section className="profile-header">
      <div className="profile-header__avatar">
        {name?.charAt(0).toUpperCase()}
      </div>
      <div className="profile-header__info">
        <h2>
          {name}
          {role && role !== 'student' && (
            <span className={`role-badge role-badge--${role}`}>
              {ROLE_LABELS[role]}
            </span>
          )}
        </h2>
        <p>{email}</p>
      </div>
      <div className="profile-header__actions">
        <Link to={settingsPath} aria-label="設定">
          <MdOutlineSettings size={22} />
        </Link>
        <NotificationBell />
        <button type="button" className="btn-outline btn-outline--sm" onClick={onLogout}>
          登出
        </button>
      </div>
    </section>
  );
}
