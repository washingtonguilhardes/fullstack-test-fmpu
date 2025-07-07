# Route Protection Implementation

This document explains how route protection is implemented in the Next.js 15 admin panel.

## Overview

The route protection system uses a multi-layered approach:

1. **Middleware Protection** - Server-side route protection using Next.js middleware
2. **Client-side Protection** - Additional protection using React components and hooks
3. **API Route Protection** - Backend validation of authentication tokens

## Components

### 1. Middleware (`src/middleware.ts`)

The middleware runs on every request and:
- Checks for authentication cookies (`accessToken`, `access_token`, `DriveappSessionId`)
- Redirects unauthenticated users to `/login` with a redirect parameter
- Redirects authenticated users away from login/register pages
- Protects routes defined in `protectedRoutes` array

**Protected Routes:**
- `/files` - File management
- `/profile` - User profile

**Public Routes:**
- `/login` - Login page
- `/register` - Registration page
- `/` - Home page (redirects to login or files)

### 2. useAuth Hook (`src/hooks/use-auth.hook.ts`)

A custom React hook that:
- Manages authentication state on the client side
- Provides user information
- Handles logout functionality
- Automatically redirects on authentication failure

**Usage:**
```tsx
const { user, loading, isAuthenticated, logout } = useAuth();
```

### 3. ProtectedRoute Component (`src/components/auth/protected-route.component.tsx`)

A higher-order component that:
- Wraps protected pages
- Shows loading state while checking authentication
- Handles authentication failures
- Works with the middleware for seamless protection

**Usage:**
```tsx
import { ProtectedRoute } from '@/components/auth/protected-route.component';

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

### 4. Logout API Route (`src/app/api/logout/route.ts`)

Handles logout requests by:
- Clearing all authentication cookies
- Providing a clean logout experience

## How to Add Route Protection

### For New Pages

1. **Server-side protection** (automatic):
   - Add your route to the `protectedRoutes` array in `middleware.ts`
   - The middleware will automatically protect it

2. **Client-side protection** (recommended):
   - Wrap your page component with `<ProtectedRoute>`
   - Use the `useAuth` hook to access user data

```tsx
import { ProtectedRoute } from '@/components/auth/protected-route.component';
import { useAuth } from '@/hooks/use-auth.hook';

export default function NewProtectedPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Welcome, {user?.firstName}!</h1>
        {/* Your protected content */}
      </div>
    </ProtectedRoute>
  );
}
```

### For API Routes

API routes should validate the authentication token:

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Your protected API logic here
  return NextResponse.json({ data: 'Protected data' });
}
```

## Authentication Flow

1. **Login**: User logs in → cookies are set → redirect to requested page or `/files`
2. **Protected Route Access**: Middleware checks cookies → allows/denies access
3. **Client-side Check**: `useAuth` hook validates token → updates UI accordingly
4. **Logout**: Cookies are cleared → redirect to login

## Cookie Management

The system handles multiple cookie names for compatibility:
- `accessToken`
- `access_token`
- `DriveappSessionId`

All cookies are cleared on logout and authentication failure.

## Error Handling

- **Authentication failures** are handled gracefully with redirects
- **Invalid tokens** are cleared automatically
- **Network errors** show appropriate error messages
- **Loading states** are displayed during authentication checks

## Security Considerations

- Cookies are HTTP-only and secure in production
- Tokens are validated on both client and server
- Automatic cleanup of invalid tokens
- Redirect parameters are URL-encoded for security
- No sensitive data is stored in localStorage

## Testing

To test the protection:

1. **Without authentication**: Try accessing `/files` → should redirect to `/login`
2. **With authentication**: Login → should access protected routes normally
3. **Logout**: Click logout → should clear cookies and redirect to login
4. **Invalid tokens**: Clear cookies manually → should redirect to login
