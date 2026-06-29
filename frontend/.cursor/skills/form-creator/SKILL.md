---
name: form-creator
description: Generate React Hook Form with Zod validation following project patterns. Use when creating forms, validation schemas, input fields, or when user mentions forms, validation, Zod, or react-hook-form.
---

# Form Creator

Generate type-safe forms using React Hook Form + Zod validation with proper error handling and UI integration.

## When to Use

- Creating new forms (login, registration, settings, etc.)
- Adding form validation with Zod schemas
- Building form fields with error handling
- Integrating forms with GraphQL mutations
- Creating reusable form components

## Basic Form Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Step 1: Define Zod schema
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

// Step 2: Infer TypeScript type from schema
type FormData = z.infer<typeof formSchema>;

// Step 3: Create form component
export const RegistrationForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log('Form data:', data);
    // API call here
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          {...form.register('name')}
          className="input"
        />
        {form.formState.errors.name && (
          <span className="text-destructive text-sm">
            {form.formState.errors.name.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...form.register('email')}
          className="input"
        />
        {form.formState.errors.email && (
          <span className="text-destructive text-sm">
            {form.formState.errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...form.register('password')}
          className="input"
        />
        {form.formState.errors.password && (
          <span className="text-destructive text-sm">
            {form.formState.errors.password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="btn-primary"
      >
        {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

## Reusable Form Field Component

```typescript
// components/shared/FormField.tsx
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: any;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  required,
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="text-sm font-medium">
      {label}
      {required && <span className="text-destructive">*</span>}
    </label>
    <input
      id={name}
      type={type}
      placeholder={placeholder}
      {...register}
      className={cn(
        'input',
        error && 'border-destructive focus:ring-destructive'
      )}
    />
    {error && <span className="text-destructive text-sm">{error}</span>}
  </div>
);

// Usage
<FormField
  label="Email"
  name="email"
  type="email"
  error={form.formState.errors.email?.message}
  register={form.register('email')}
  required
/>
```

## Advanced Validation Patterns

```typescript
// Complex validation
const userSchema = z.object({
  // Email validation
  email: z.string().email('Invalid email'),
  
  // Password with regex
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number'),
  
  // Confirm password
  confirmPassword: z.string(),
  
  // Optional field
  phone: z.string().optional(),
  
  // Enum validation
  role: z.enum(['admin', 'user', 'moderator']),
  
  // Number validation
  age: z.number().min(18, 'Must be 18+').max(100),
  
  // Date validation
  birthDate: z.string().refine(
    (date) => new Date(date) < new Date(),
    'Birth date must be in the past'
  ),
  
  // Array validation
  tags: z.array(z.string()).min(1, 'At least one tag required'),
  
  // Boolean
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept terms',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});
```

## Integration with GraphQL Mutation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { z } from 'zod';
import { toast } from 'sonner';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

type UserFormData = z.infer<typeof userSchema>;

export const CreateUserForm = () => {
  const [createUser] = useMutation(CREATE_USER);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '' },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const result = await createUser({
        variables: { input: data },
      });
      
      toast.success('User created successfully');
      form.reset(); // Reset form after success
    } catch (error) {
      toast.error('Failed to create user');
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

## Form with File Upload

```typescript
const uploadSchema = z.object({
  title: z.string().min(3),
  file: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'File must be less than 5MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png'].includes(file.type),
    'Only JPEG and PNG files allowed'
  ),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export const UploadForm = () => {
  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const onSubmit = async (data: UploadFormData) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    
    // Upload via GraphQL or REST
    await uploadFile({ variables: { file: data.file } });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input
        type="file"
        {...form.register('file')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) form.setValue('file', file);
        }}
      />
      {form.formState.errors.file && (
        <span>{form.formState.errors.file.message}</span>
      )}
    </form>
  );
};
```

## Dynamic Fields (Array)

```typescript
import { useFieldArray } from 'react-hook-form';

const dynamicSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number().min(1),
    })
  ).min(1, 'At least one item required'),
});

type DynamicFormData = z.infer<typeof dynamicSchema>;

export const DynamicForm = () => {
  const form = useForm<DynamicFormData>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      items: [{ name: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...form.register(`items.${index}.name`)} />
          <input
            type="number"
            {...form.register(`items.${index}.quantity`, {
              valueAsNumber: true,
            })}
          />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => append({ name: '', quantity: 1 })}
      >
        Add Item
      </button>
    </form>
  );
};
```

## Form State Management

```typescript
// Access form state
const {
  formState: {
    errors,       // Validation errors
    isSubmitting, // Submitting state
    isValid,      // Is form valid
    isDirty,      // Has form been modified
    dirtyFields,  // Which fields are dirty
    touchedFields,// Which fields are touched
  },
} = form;

// Programmatic control
form.setValue('email', 'test@example.com'); // Set value
form.reset(); // Reset form
form.trigger(); // Trigger validation
form.clearErrors(); // Clear errors
form.setError('email', { message: 'Email taken' }); // Set error
```

## Validation Modes

```typescript
useForm({
  mode: 'onSubmit',    // Validate on submit (default)
  mode: 'onChange',    // Validate on every change
  mode: 'onBlur',      // Validate on blur
  mode: 'onTouched',   // Validate on touched + change
  mode: 'all',         // Validate on blur + change
});
```

## Checklist

When creating forms, ensure:

- [ ] Zod schema defined before component
- [ ] TypeScript type inferred with `z.infer<>`
- [ ] Form registered with `zodResolver`
- [ ] Default values provided
- [ ] Error messages displayed for each field
- [ ] Loading state shown during submission (`isSubmitting`)
- [ ] Submit button disabled while submitting
- [ ] Form reset after successful submission
- [ ] Toast notifications for success/error
- [ ] Labels have `htmlFor` matching input `id`
- [ ] Required fields marked visually
- [ ] Accessible (ARIA attributes if needed)
