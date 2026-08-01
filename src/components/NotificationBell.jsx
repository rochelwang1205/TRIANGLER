import { Link } from 'react-router-dom';
import { MdNotificationsNone } from 'react-icons/md';
import { useNotifications } from '@/features/notifications/api/useNotifications';

export default function NotificationBell() {
  const { data } = useNotifications();
  const unreadCount = data?.filter((n) => !n.read).length ?? 0;

  return (
    <Link to="/notifications" className="notification-bell" aria-label="通知">
      <MdNotificationsNone size={22} />
      {unreadCount > 0 && (
        <span className="notification-bell__badge">{unreadCount}</span>
      )}
    </Link>
  );
}
