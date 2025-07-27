// utils/resolvePermissions.ts
import { PERMISSIONS } from './permissions';
import { ROUTES } from './routes';

/**
 * Resolves permissions for nested routes based on the user's role.
 */
type Role = 'admin' | 'user';

type NavItem = {
  id: string;
  title: string;
  url?: string;
  roles?: Role[];
  items?: NavItem[];
  [key: string]: any;
};

export const resolvePermissions = (role: Role) => {
  const allowedRoutes = PERMISSIONS[role] || [];

  const isRouteAllowed = (routeId: string) => {
    // Check if the route or any of its parent routes are allowed
    const parts = routeId.split('.');
    for (let i = parts.length; i > 0; i--) {
      const parentRouteId = parts.slice(0, i).join('.');
      if (allowedRoutes.includes(parentRouteId)) {
        return true;
      }
    }
    return false;
  };

  // Filter top-level routes
  const filteredNavMain = Object.values(ROUTES)
    .filter((route: NavItem) => isRouteAllowed(route.id))
    .map((route: NavItem) => ({
      ...route,
      items: route.items?.filter((item: NavItem) => {
        // Check if the nested route has explicit roles
        if (item.roles) {
          return item.roles.includes(role);
        }
        // Otherwise, inherit permissions from the parent route
        return isRouteAllowed(item.id);
      }),
    }));

  return filteredNavMain;
};