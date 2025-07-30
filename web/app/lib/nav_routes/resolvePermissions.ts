// utils/resolvePermissions.ts
import { PERMISSIONS } from './permissions';
import { ROUTES } from './routes';

/**
 * Resolves permissions for nested routes based on the user's role.
 */
type Role = 'admin' | 'user';

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
    .filter(route => isRouteAllowed(route.id))
    .map(route => ({
      ...route,
      items: route.items?.filter((item: { id: string; roles?: Role[] }) => {
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