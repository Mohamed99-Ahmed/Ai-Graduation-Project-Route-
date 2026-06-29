---
name: component-generator
description: Generate React components following shadcn/ui patterns with Radix UI, Tailwind CSS, and TypeScript. Use when creating UI components, shared components, or when user mentions components, Radix, shadcn, or Tailwind.
---

# Component Generator

Generate clean, reusable React components following project standards with shadcn/ui patterns, Radix UI primitives, and Tailwind CSS.

## When to Use

- Creating new UI components
- Building shared/reusable components
- Implementing Radix UI primitives
- Creating compound components
- Setting up feature components

## File Structure

```
components/
├── ui/                    # shadcn/ui components
│   ├── button.tsx
│   ├── dialog.tsx
│   └── index.ts
└── shared/                # Shared components (3+ uses)
    ├── DataTable/
    │   ├── DataTable.tsx
    │   ├── DataTable.types.ts
    │   └── index.ts

screens/
└── Auth/
    └── components/        # Screen-specific components
        └── ConnectAccountDialog.tsx
```

## Basic Component Pattern

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        
        // Variant styles
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
        },
        
        // Size styles
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
```

## Compound Component Pattern (Composition)

```typescript
import { cn } from '@/lib/utils';

// Card Container
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
    {children}
  </div>
);

// Card Header
export const CardHeader: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
    {children}
  </div>
);

// Card Title
export const CardTitle: React.FC<CardProps> = ({ children, className }) => (
  <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
    {children}
  </h3>
);

// Card Description
export const CardDescription: React.FC<CardProps> = ({ children, className }) => (
  <p className={cn('text-sm text-muted-foreground', className)}>
    {children}
  </p>
);

// Card Content
export const CardContent: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn('p-6 pt-0', className)}>{children}</div>
);

// Card Footer
export const CardFooter: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn('flex items-center p-6 pt-0', className)}>{children}</div>
);

// Usage
<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
    <CardDescription>View and edit user information</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>
```

## Radix UI Integration Pattern

```typescript
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 animate-in fade-in" />
      <Dialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-full max-w-lg rounded-lg bg-background p-6 shadow-lg',
          'animate-in fade-in zoom-in-95',
          className
        )}
      >
        <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
        {description && (
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">
            {description}
          </Dialog.Description>
        )}
        
        <div className="mt-4">{children}</div>
        
        <Dialog.Close asChild>
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
```

## Generic/Reusable Component Pattern

```typescript
// Generic DataTable component
import { useTable, Column } from '@tanstack/react-table';

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const DataTable = <T extends { id: string }>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<T>) => {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={cn('rounded-md border', className)}>
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i} className="px-4 py-3 text-left text-sm font-medium">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className="cursor-pointer hover:bg-muted/50"
            >
              {columns.map((column, i) => (
                <td key={i} className="px-4 py-3">
                  {column.cell({ row })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Usage with typed data
interface User {
  id: string;
  name: string;
  email: string;
}

const columns: Column<User>[] = [
  { header: 'Name', cell: ({ row }) => row.name },
  { header: 'Email', cell: ({ row }) => row.email },
];

<DataTable<User>
  data={users}
  columns={columns}
  onRowClick={handleUserClick}
/>
```

## Custom Hook for Logic Extraction

```typescript
// hooks/use-user-data.ts
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

export const useUserData = (userId: string) => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId },
    skip: !userId,
  });

  const formattedUser = useMemo(() => {
    if (!data?.user) return null;
    return {
      ...data.user,
      fullName: `${data.user.firstName} ${data.user.lastName}`,
      initials: `${data.user.firstName[0]}${data.user.lastName[0]}`,
    };
  }, [data]);

  return { user: formattedUser, loading, error };
};

// Component stays clean
export const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const { user, loading, error } = useUserData(userId);

  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;

  return <UserCard user={user} />;
};
```

## Component with forwardRef

```typescript
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium" htmlFor={props.id}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2',
          'text-sm ring-offset-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';
```

## Barrel Export Pattern

```typescript
// components/ui/index.ts
export { Button } from './button';
export { Card, CardHeader, CardTitle, CardContent } from './card';
export { Dialog } from './dialog';
export { Input } from './input';

// Clean imports
import { Button, Card, Input } from '@/components/ui';
```

## Component Documentation

```typescript
/**
 * Avatar component displays user profile image with fallback.
 * 
 * @example
 * <Avatar src={user.avatar} alt={user.name} fallback={user.initials} />
 */
interface AvatarProps {
  src?: string;        // Image URL
  alt: string;         // Alt text for accessibility
  fallback?: string;   // Fallback text when no image
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  className,
}) => {
  // Implementation
};
```

## Early Returns Pattern

```typescript
export const UserList: React.FC<{ users: User[] }> = ({ users }) => {
  // Early returns for different states
  if (users.length === 0) {
    return <EmptyState message="No users found" />;
  }

  if (users.length > 100) {
    return <VirtualizedList items={users} />;
  }

  // Main render
  return (
    <ul className="space-y-2">
      {users.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  );
};
```

## Constants (No Magic Values)

```typescript
// At top of file or in constants file
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const FileUpload: React.FC = () => {
  const handleFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large');
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Invalid file type');
      return;
    }

    // Process file
  };

  return <input type="file" onChange={(e) => handleFile(e.target.files?.[0])} />;
};
```

## Checklist

When creating components, ensure:

- [ ] Single responsibility (one purpose)
- [ ] TypeScript interfaces defined
- [ ] Props extend native HTML when appropriate
- [ ] `className` prop supported for customization
- [ ] Uses `cn()` utility for class merging
- [ ] Early returns for loading/error/empty states
- [ ] No magic numbers or strings
- [ ] Accessible (proper ARIA, keyboard support)
- [ ] Uses Tailwind CSS for styling
- [ ] Follows composition over props drilling
- [ ] Custom hooks extract complex logic
- [ ] Shared components in `components/shared/`
- [ ] Screen-specific components in `screens/{screen}/components/`
- [ ] Barrel exports in `index.ts`
- [ ] Uses `React.FC` or explicit return types
