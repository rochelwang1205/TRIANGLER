import { Link } from 'react-router-dom';
import { MdCampaign, MdFactCheck, MdPeople, MdPayment } from 'react-icons/md';

const TILES = [
  { to: '/admin/ads', icon: MdCampaign, label: '廣告管理' },
  { to: '/admin/courses', icon: MdFactCheck, label: '課程審核' },
  { to: '/admin/users', icon: MdPeople, label: '用戶管理' },
  { to: '/admin/orders', icon: MdPayment, label: '訂單管理' },
];

export default function ManagementTiles() {
  return (
    <div className="management-tiles">
      {TILES.map(({ to, icon: Icon, label }) => (
        <Link key={to} to={to} className="management-tile">
          <Icon size={32} />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
}
