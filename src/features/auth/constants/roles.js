export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  student: '學生',
  teacher: '老師',
  admin: '管理員',
};

export function getDashboardPath(role) {
  switch (role) {
    case ROLES.TEACHER:
      return '/teacher';
    case ROLES.ADMIN:
      return '/admin';
    default:
      return '/profile';
  }
}
