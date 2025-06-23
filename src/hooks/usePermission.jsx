import { useSelector } from 'react-redux';

/**
 * Hook để kiểm tra permission và tự động re-render khi store thay đổi
 * @param {string} permission
 * @returns {boolean}
 */
export function usePermission(permission) {
  const perms = useSelector(state => state.user.permissions || []);
  return perms.includes(permission);
}
