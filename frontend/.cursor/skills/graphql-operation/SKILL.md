---
name: graphql-operation
description: Generate Apollo Client GraphQL queries, mutations, and subscriptions with proper TypeScript typing. Use when creating GraphQL operations, API calls, or when user mentions queries, mutations, subscriptions, Apollo, or GraphQL.
---

# GraphQL Operation Generator

Generate type-safe GraphQL operations following project standards with Apollo Client, proper error handling, and cache management.

## When to Use

- Creating new GraphQL queries, mutations, or subscriptions
- Adding Apollo Client hooks to components
- Setting up GraphQL fragments for reusability
- Implementing file uploads via apollo-upload-client
- Setting up WebSocket subscriptions with graphql-ws

## File Organization

```
graphql/
├── auth.ts              # Auth queries & mutations
├── social/
│   ├── content.ts       # Content queries
│   ├── connections.ts   # Connection mutations
│   ├── comments.ts      # Comment operations
│   └── insights.ts      # Analytics queries
└── fragments.ts         # Reusable fragments
```

## Query Pattern

```typescript
import { gql, useQuery } from '@apollo/client';

// Define query at top of file or in queries.ts
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      avatar
      createdAt
    }
  }
`;

// Usage in component with proper typing
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface GetUserData {
  user: User;
}

interface GetUserVars {
  id: string;
}

export const useUserData = (userId: string) => {
  const { data, loading, error, refetch } = useQuery<GetUserData, GetUserVars>(
    GET_USER,
    {
      variables: { id: userId },
      skip: !userId, // Don't run if no userId
      fetchPolicy: 'cache-first', // Use cache when available
    }
  );

  return {
    user: data?.user,
    loading,
    error,
    refetch,
  };
};
```

## Mutation Pattern

```typescript
import { gql, useMutation } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

interface CreateUserData {
  createUser: User;
}

interface CreateUserVars {
  input: CreateUserInput;
}

export const useCreateUser = () => {
  const [createUser, { loading, error }] = useMutation<
    CreateUserData,
    CreateUserVars
  >(CREATE_USER, {
    // Update cache after mutation
    update(cache, { data }) {
      if (data?.createUser) {
        cache.modify({
          fields: {
            users(existing = []) {
              const newUserRef = cache.writeFragment({
                data: data.createUser,
                fragment: gql`
                  fragment NewUser on User {
                    id
                    name
                    email
                  }
                `,
              });
              return [...existing, newUserRef];
            },
          },
        });
      }
    },
    // Refetch queries after mutation
    refetchQueries: ['GetUsers'],
    // Optimistic response for instant UI updates
    optimisticResponse: (vars) => ({
      createUser: {
        __typename: 'User',
        id: 'temp-id',
        name: vars.input.name,
        email: vars.input.email,
      },
    }),
    onCompleted: (data) => {
      console.log('User created:', data.createUser);
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    },
  });

  return { createUser, loading, error };
};
```

## Fragment Pattern (Reusability)

```typescript
// fragments.ts
import { gql } from '@apollo/client';

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    email
    avatar
  }
`;

export const USER_WITH_POSTS = gql`
  fragment UserWithPosts on User {
    ...UserFields
    posts {
      id
      title
      content
    }
  }
  ${USER_FIELDS}
`;

// queries.ts - Use fragments
export const GET_USERS = gql`
  query GetUsers {
    users {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;
```

## File Upload Pattern

```typescript
import { gql, useMutation } from '@apollo/client';

// apollo-upload-client handles File/Blob automatically
export const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
      filename
    }
  }
`;

export const useFileUpload = () => {
  const [uploadFile, { loading, error }] = useMutation(UPLOAD_FILE);

  const handleUpload = async (file: File) => {
    try {
      const { data } = await uploadFile({
        variables: { file },
      });
      return data?.uploadFile;
    } catch (err) {
      console.error('Upload failed:', err);
      throw err;
    }
  };

  return { handleUpload, loading, error };
};
```

## WebSocket Subscription Pattern

```typescript
import { gql, useSubscription } from '@apollo/client';

export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageReceived($chatId: ID!) {
    messageReceived(chatId: $chatId) {
      id
      content
      senderId
      createdAt
    }
  }
`;

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

interface MessageReceivedData {
  messageReceived: Message;
}

interface MessageReceivedVars {
  chatId: string;
}

export const useMessageSubscription = (chatId: string) => {
  const { data, loading, error } = useSubscription<
    MessageReceivedData,
    MessageReceivedVars
  >(MESSAGE_SUBSCRIPTION, {
    variables: { chatId },
    skip: !chatId,
    onData: ({ data }) => {
      console.log('New message:', data.data?.messageReceived);
    },
  });

  return {
    message: data?.messageReceived,
    loading,
    error,
  };
};
```

## Error Handling

```typescript
import { ApolloError } from '@apollo/client';

const handleGraphQLError = (error: ApolloError) => {
  if (error.networkError) {
    console.error('Network error:', error.networkError);
    return 'Network connection failed';
  }

  if (error.graphQLErrors) {
    error.graphQLErrors.forEach(({ message, extensions }) => {
      console.error('GraphQL error:', message, extensions);
    });
    return error.graphQLErrors[0]?.message || 'Operation failed';
  }

  return 'An unexpected error occurred';
};

// Usage in component
const { data, error } = useQuery(GET_USER);

if (error) {
  const errorMessage = handleGraphQLError(error);
  return <ErrorMessage message={errorMessage} />;
}
```

## Custom Hook Pattern

```typescript
// hooks/use-user.ts
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER, UPDATE_USER } from '@/graphql/auth';

export const useUser = (userId: string) => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
  });

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
    refetchQueries: ['GetUser'],
  });

  const handleUpdate = async (updates: Partial<User>) => {
    await updateUser({
      variables: { id: userId, input: updates },
    });
  };

  return {
    user: data?.user,
    loading,
    error,
    updateUser: handleUpdate,
    updating,
  };
};
```

## Cache Management

```typescript
// Clear specific cache
client.cache.evict({ id: 'User:123' });
client.cache.gc();

// Clear all cache
client.cache.reset();

// Read from cache
const user = client.readQuery({
  query: GET_USER,
  variables: { id: '123' },
});

// Write to cache
client.writeQuery({
  query: GET_USER,
  variables: { id: '123' },
  data: { user: updatedUser },
});
```

## Checklist

When creating GraphQL operations, ensure:

- [ ] Query/mutation defined in separate file (`queries.ts`, `mutations.ts`)
- [ ] TypeScript interfaces for data and variables
- [ ] Proper error handling with `onError` or try/catch
- [ ] Loading states exposed for UI feedback
- [ ] Cache updates for mutations (`update`, `refetchQueries`)
- [ ] Fragments used for repeated field sets
- [ ] Skip condition when variables might be undefined
- [ ] Optimistic responses for better UX (when applicable)
- [ ] File uploads use apollo-upload-client pattern
- [ ] Subscriptions use graphql-ws for WebSocket connections
