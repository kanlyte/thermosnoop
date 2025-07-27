import { resolvePermissions } from './resolvePermissions';

type Role = 'admin' | 'user';

export const filterRoutes = (role: Role) => {
  const filteredNavMain = resolvePermissions(role);

  return {
    navMain: filteredNavMain,
  };
};