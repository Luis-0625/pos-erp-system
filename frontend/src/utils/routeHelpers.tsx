import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import type { RouteConfig } from '../config/routes.config';

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      <p className="mt-2 text-sm text-gray-600">Cargando...</p>
    </div>
  </div>
);

/**
 * Render a single route with optional protection and lazy loading
 */
export const renderRoute = (route: RouteConfig, index: number) => {
  const Component = route.component;

  const element = (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );

  // If route requires authentication or has permissions/roles, wrap with ProtectedRoute
  const protectedElement =
    route.requiredRoles || route.requiredPermissions ? (
      <ProtectedRoute
        requiredRoles={route.requiredRoles}
        requiredPermissions={route.requiredPermissions}
      >
        {element}
      </ProtectedRoute>
    ) : (
      element
    );

  return (
    <Route
      key={`${route.path}-${index}`}
      path={route.path}
      element={protectedElement}
    >
      {/* Render children routes recursively */}
      {route.children?.map((child, childIndex) =>
        renderRoute(child, childIndex)
      )}
    </Route>
  );
};

/**
 * Render multiple routes from config
 */
export const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route, index) => renderRoute(route, index));
};

/**
 * Get page title from route config
 */
export const getRouteTitle = (
  routes: RouteConfig[],
  pathname: string
): string | undefined => {
  for (const route of routes) {
    // Exact match
    if (route.path === pathname) {
      return route.title;
    }

    // Check children
    if (route.children) {
      const childTitle = getRouteTitle(route.children, pathname);
      if (childTitle) return childTitle;
    }

    // Pattern match (simple check for dynamic segments)
    if (route.path.includes(':')) {
      const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(pathname)) {
        return route.title;
      }
    }
  }

  return undefined;
};

/**
 * Check if a route is active (current or parent of current)
 */
export const isRouteActive = (routePath: string, currentPath: string): boolean => {
  // Exact match
  if (routePath === currentPath) return true;

  // Parent match (e.g., /products is active when on /products/123)
  if (currentPath.startsWith(routePath + '/')) return true;

  return false;
};

/**
 * Build breadcrumb items from route config
 */
export interface BreadcrumbItem {
  title: string;
  path: string;
}

export const getBreadcrumbs = (
  routes: RouteConfig[],
  pathname: string
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [];
  const pathSegments = pathname.split('/').filter(Boolean);

  let currentPath = '';
  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    const title = getRouteTitle(routes, currentPath);
    if (title) {
      breadcrumbs.push({ title, path: currentPath });
    } else {
      // Use segment as fallback
      breadcrumbs.push({
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath,
      });
    }
  }

  return breadcrumbs;
};

/**
 * Filter navigation items based on user permissions/roles
 * This will be used when implementing the Sidebar navigation
 */
export const filterNavByPermissions = (
  navItems: any[],
  hasPermission: (permission: string) => boolean,
  hasRole: (role: string) => boolean
): any[] => {
  return navItems.filter((item) => {
    // Check permissions
    if (item.requiredPermissions) {
      const hasAllPermissions = item.requiredPermissions.every((p: string) =>
        hasPermission(p)
      );
      if (!hasAllPermissions) return false;
    }

    // Check roles
    if (item.requiredRoles) {
      const hasRequiredRole = item.requiredRoles.some((r: string) => hasRole(r));
      if (!hasRequiredRole) return false;
    }

    // Filter children recursively
    if (item.children) {
      item.children = filterNavByPermissions(
        item.children,
        hasPermission,
        hasRole
      );
    }

    return true;
  });
};
