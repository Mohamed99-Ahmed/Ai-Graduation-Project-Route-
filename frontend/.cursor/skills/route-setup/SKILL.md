---
name: route-setup
description: Set up routes using react-router-dom v7 with layouts, protected routes, and error boundaries. Use when creating routes, navigation, or when user mentions routing, pages, or react-router.
---

# Route Setup

Configure routes using react-router-dom v7 with proper layouts, authentication guards, and error handling.

## When to Use

- Creating new routes/pages
- Setting up protected routes (auth required)
- Adding nested routes with layouts
- Implementing route-based code splitting
- Creating error boundaries for routes

## File Structure

```
src/
├── routes/
│   ├── index.tsx           # Root router configuration
│   ├── ProtectedRoute.tsx  # Auth guard component
│   ├── ErrorBoundary.tsx   # Error boundary for routes
│   └── paths.ts            # Route path constants
├── pages/
│   ├── Dashboard/
│   │   └── Dashboard.tsx
│   ├── Users/
│   │   ├── UserList.tsx
│   │   ├── UserDetail.tsx
│   │   └── UserCreate.tsx
│   └── Auth/
│       ├── Login.tsx
│       └── Register.tsx
└── layouts/
    ├── MainLayout.tsx      # Authenticated layout
    ├── AuthLayout.tsx      # Auth pages layout
    └── PublicLayout.tsx    # Public pages layout
```

## Route Path Constants

```typescript
// routes/paths.ts
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Users
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
  USER_CREATE: '/users/create',
  USER_EDIT: (id: string) => `/users/${id}/edit`,
  
  // Settings
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_SECURITY: '/settings/security',
  
  // Errors
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
} as const;
```

## Basic Router Configuration (React Router v7)

```typescript
// routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ErrorBoundary } from './ErrorBoundary';
import { ROUTES } from './paths';

// Lazy load pages
import { lazy } from 'react';
const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'));
const UserList = lazy(() => import('@/pages/Users/UserList'));
const UserDetail = lazy(() => import('@/pages/Users/UserDetail'));
const Login = lazy(() => import('@/pages/Auth/Login'));
const Register = lazy(() => import('@/pages/Auth/Register'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: ROUTES.DASHBOARD,
            element: <Dashboard />,
          },
          {
            path: ROUTES.USERS,
            children: [
              {
                index: true,
                element: <UserList />,
              },
              {
                path: ':id',
                element: <UserDetail />,
              },
              {
                path: 'create',
                element: <UserCreate />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTES.REGISTER,
        element: <Register />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

// App component
export const App = () => {
  return <RouterProvider router={router} />;
};
```

## Protected Route Component

```typescript
// routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Spinner } from '@/components/ui';
import { ROUTES } from './paths';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Render child routes
  return <Outlet />;
};
```

## Role-Based Protected Route

```typescript
// routes/RoleProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from './paths';

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  allowedRoles 
}) => {
  const { user, hasRole } = useAuth();

  // Check if user has required role
  const hasAccess = allowedRoles.some((role) => hasRole(role));

  if (!hasAccess) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};

// Usage
{
  path: '/admin',
  element: <RoleProtectedRoute allowedRoles={['admin']} />,
  children: [
    { path: 'users', element: <AdminUsers /> },
  ],
}
```

## Main Layout with Navigation

```typescript
// layouts/MainLayout.tsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/routes/paths';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <nav className="flex flex-col gap-2 p-4">
          <Link
            to={ROUTES.DASHBOARD}
            className="rounded-md px-3 py-2 hover:bg-accent"
          >
            Dashboard
          </Link>
          <Link
            to={ROUTES.USERS}
            className="rounded-md px-3 py-2 hover:bg-accent"
          >
            Users
          </Link>
          <Link
            to={ROUTES.SETTINGS}
            className="rounded-md px-3 py-2 hover:bg-accent"
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="border-b p-4">
          <div className="flex items-center justify-between">
            <h1>Social Management</h1>
            <div className="flex items-center gap-4">
              <span>{user?.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </header>
        
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
```

## Error Boundary

```typescript
// routes/ErrorBoundary.tsx
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { ROUTES } from './paths';

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="mt-2 text-muted-foreground">Page not found</p>
          <Link to={ROUTES.DASHBOARD} className="mt-4 btn-primary">
            Go to Dashboard
          </Link>
        </div>
      );
    }

    if (error.status === 401) {
      return (
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">401</h1>
          <p className="mt-2 text-muted-foreground">Unauthorized</p>
          <Link to={ROUTES.LOGIN} className="mt-4 btn-primary">
            Go to Login
          </Link>
        </div>
      );
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p className="mt-2 text-muted-foreground">Something went wrong</p>
      <Link to={ROUTES.DASHBOARD} className="mt-4 btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
};
```

## Navigation Hooks Usage

```typescript
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';

export const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Navigate programmatically
  const goToEdit = () => {
    navigate(ROUTES.USER_EDIT(id!));
  };

  // Go back
  const goBack = () => {
    navigate(-1);
  };

  // Update search params
  const updateFilters = () => {
    setSearchParams({ status: 'active', page: '1' });
  };

  // Read search params
  const status = searchParams.get('status');
  const page = searchParams.get('page');

  // Current location
  console.log(location.pathname); // /users/123
  console.log(location.search); // ?status=active&page=1

  return <div>User {id}</div>;
};
```

## Active Link Styling

```typescript
import { NavLink } from 'react-router-dom';

export const Navigation = () => {
  return (
    <nav>
      <NavLink
        to={ROUTES.DASHBOARD}
        className={({ isActive }) =>
          isActive
            ? 'bg-primary text-primary-foreground px-3 py-2 rounded-md'
            : 'hover:bg-accent px-3 py-2 rounded-md'
        }
      >
        Dashboard
      </NavLink>
      
      <NavLink
        to={ROUTES.USERS}
        className={({ isActive }) =>
          isActive
            ? 'bg-primary text-primary-foreground px-3 py-2 rounded-md'
            : 'hover:bg-accent px-3 py-2 rounded-md'
        }
      >
        Users
      </NavLink>
    </nav>
  );
};
```

## Lazy Loading with Suspense

```typescript
import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui';

const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'));

export const router = createBrowserRouter([
  {
    path: ROUTES.DASHBOARD,
    element: (
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    ),
  },
]);
```

## Breadcrumbs

```typescript
// components/Breadcrumbs.tsx
import { Link, useMatches } from 'react-router-dom';

export const Breadcrumbs = () => {
  const matches = useMatches();

  const breadcrumbs = matches
    .filter((match) => match.handle?.crumb)
    .map((match) => ({
      label: match.handle.crumb,
      path: match.pathname,
    }));

  return (
    <nav className="flex items-center gap-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-2">
          {index > 0 && <span>/</span>}
          <Link to={crumb.path} className="hover:underline">
            {crumb.label}
          </Link>
        </div>
      ))}
    </nav>
  );
};

// Add handle to routes
{
  path: ROUTES.USERS,
  element: <UserList />,
  handle: { crumb: 'Users' },
}
```

## URL Query State with nuqs

```typescript
// Using nuqs for URL query state
import { useQueryState } from 'nuqs';

export const UserList = () => {
  const [search, setSearch] = useQueryState('search');
  const [page, setPage] = useQueryState('page', { defaultValue: '1' });
  const [status, setStatus] = useQueryState('status');

  // URL: /users?search=john&page=2&status=active

  return (
    <div>
      <input
        value={search || ''}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
      />
      
      <select value={status || ''} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      
      {/* User list filtered by search, page, status */}
    </div>
  );
};
```

## Checklist

When setting up routes, ensure:

- [ ] Route paths defined in `paths.ts` constants
- [ ] Protected routes use `ProtectedRoute` component
- [ ] Error boundary implemented
- [ ] Layouts created (MainLayout, AuthLayout)
- [ ] Lazy loading used for code splitting
- [ ] Suspense fallback provided for lazy routes
- [ ] 404 and error pages created
- [ ] Navigation uses `Link` or `NavLink` components
- [ ] Active link styling implemented
- [ ] Role-based access control (if needed)
- [ ] Breadcrumbs added for better UX
- [ ] URL query state managed with nuqs
- [ ] Redirect to login preserves intended destination
- [ ] All routes properly nested under layouts
