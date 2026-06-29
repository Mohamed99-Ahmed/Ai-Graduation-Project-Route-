---
name: i18n-translation
description: Add internationalization using i18next and react-i18next for multilingual support. Use when adding translations, language switching, or when user mentions i18n, translations, languages, or internationalization.
---

# i18n Translation Manager

Add multilingual support using i18next and react-i18next following project standards.

## When to Use

- Adding new translation keys
- Creating translation files for new features
- Setting up language switching
- Implementing pluralization and interpolation
- Creating multilingual components

## File Structure

```
src/
├── locales/
│   ├── en/
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── users.json
│   │   └── errors.json
│   ├── ar/
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── users.json
│   │   └── errors.json
│   └── index.ts
└── i18n.ts
```

## i18n Configuration

```typescript
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import arCommon from './locales/ar/common.json';
import arAuth from './locales/ar/auth.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
      },
      ar: {
        common: arCommon,
        auth: arAuth,
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
```

## Translation File Structure

```json
// locales/en/common.json
{
  "app": {
    "title": "Social Management",
    "description": "Manage your social media"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "search": "Search",
    "filter": "Filter"
  },
  "navigation": {
    "dashboard": "Dashboard",
    "users": "Users",
    "settings": "Settings",
    "logout": "Logout"
  },
  "messages": {
    "success": "Operation successful",
    "error": "An error occurred",
    "loading": "Loading...",
    "noData": "No data available"
  }
}
```

```json
// locales/en/auth.json
{
  "login": {
    "title": "Sign In",
    "email": "Email Address",
    "password": "Password",
    "submit": "Sign In",
    "forgotPassword": "Forgot Password?",
    "noAccount": "Don't have an account?"
  },
  "register": {
    "title": "Create Account",
    "name": "Full Name",
    "email": "Email Address",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "submit": "Create Account",
    "hasAccount": "Already have an account?"
  },
  "errors": {
    "invalidCredentials": "Invalid email or password",
    "emailTaken": "Email already in use",
    "weakPassword": "Password is too weak"
  }
}
```

## Basic Usage in Components

```typescript
import { useTranslation } from 'react-i18next';

export const LoginForm = () => {
  const { t } = useTranslation('auth');

  return (
    <form>
      <h1>{t('login.title')}</h1>
      
      <label>{t('login.email')}</label>
      <input type="email" placeholder={t('login.email')} />
      
      <label>{t('login.password')}</label>
      <input type="password" placeholder={t('login.password')} />
      
      <button type="submit">{t('login.submit')}</button>
      
      <a href="/forgot-password">{t('login.forgotPassword')}</a>
    </form>
  );
};
```

## Multiple Namespaces

```typescript
import { useTranslation } from 'react-i18next';

export const Header = () => {
  // Use multiple namespaces
  const { t } = useTranslation(['common', 'auth']);

  return (
    <header>
      <h1>{t('common:app.title')}</h1>
      <button>{t('auth:login.submit')}</button>
      <button>{t('common:actions.save')}</button>
    </header>
  );
};
```

## Interpolation (Dynamic Values)

```typescript
// Translation
{
  "welcome": "Welcome, {{name}}!",
  "itemCount": "You have {{count}} items",
  "greeting": "Hello, {{firstName}} {{lastName}}"
}

// Component
const { t } = useTranslation();

<p>{t('welcome', { name: user.name })}</p>
<p>{t('itemCount', { count: items.length })}</p>
<p>{t('greeting', { firstName: 'John', lastName: 'Doe' })}</p>
```

## Pluralization

```typescript
// Translation
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items",
  "notification": "You have {{count}} notification",
  "notification_plural": "You have {{count}} notifications"
}

// Component
const { t } = useTranslation();

<p>{t('items', { count: 1 })}</p>     // "1 item"
<p>{t('items', { count: 5 })}</p>     // "5 items"
<p>{t('notification', { count: 0 })}</p>  // "You have 0 notifications"
```

## Language Switcher Component

```typescript
import { useTranslation } from 'react-i18next';
import { Select } from '@/components/ui';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    // Optionally save to localStorage
    localStorage.setItem('language', langCode);
    // Update document direction for RTL languages
    document.dir = langCode === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <Select
      value={i18n.language}
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </Select>
  );
};
```

## Custom Hook for Translations

```typescript
// hooks/use-app-translation.ts
import { useTranslation } from 'react-i18next';

export const useAppTranslation = (namespace?: string) => {
  const { t, i18n } = useTranslation(namespace);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  return {
    t,
    currentLanguage: i18n.language,
    changeLanguage,
    isRTL: i18n.language === 'ar',
  };
};

// Usage
const { t, currentLanguage, changeLanguage, isRTL } = useAppTranslation('auth');
```

## RTL Support

```typescript
// App.tsx or layout component
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const AppLayout = ({ children }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document direction based on language
    const isRTL = i18n.language === 'ar';
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return <div>{children}</div>;
};
```

## Date and Number Formatting

```typescript
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import 'dayjs/locale/fr';

export const DateDisplay = ({ date }: { date: Date }) => {
  const { i18n } = useTranslation();

  // Set dayjs locale
  dayjs.locale(i18n.language);

  return (
    <div>
      <p>{dayjs(date).format('LL')}</p>
      <p>{dayjs(date).fromNow()}</p>
    </div>
  );
};

// Number formatting
export const PriceDisplay = ({ amount }: { amount: number }) => {
  const { i18n } = useTranslation();

  const formatted = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return <span>{formatted}</span>;
};
```

## Loading Translations Dynamically

```typescript
// Lazy load translations for better performance
import i18n from 'i18next';

export const loadNamespace = async (namespace: string, lang: string) => {
  if (!i18n.hasResourceBundle(lang, namespace)) {
    const translations = await import(`./locales/${lang}/${namespace}.json`);
    i18n.addResourceBundle(lang, namespace, translations.default);
  }
};

// Usage
const MyFeature = () => {
  const { t, ready } = useTranslation('users', { useSuspense: false });

  useEffect(() => {
    loadNamespace('users', i18n.language);
  }, []);

  if (!ready) return <Spinner />;

  return <div>{t('users:title')}</div>;
};
```

## Translation Helper for Validation

```typescript
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

export const useValidationSchema = () => {
  const { t } = useTranslation('validation');

  return z.object({
    email: z.string().email(t('invalidEmail')),
    password: z.string().min(8, t('passwordMinLength', { min: 8 })),
    name: z.string().min(2, t('nameMinLength', { min: 2 })),
  });
};

// locales/en/validation.json
{
  "invalidEmail": "Please enter a valid email address",
  "passwordMinLength": "Password must be at least {{min}} characters",
  "nameMinLength": "Name must be at least {{min}} characters"
}
```

## Translation Keys Helper

```typescript
// types/i18n.ts - Type-safe translation keys
type TranslationKeys = {
  common: {
    actions: {
      save: string;
      cancel: string;
      delete: string;
    };
  };
  auth: {
    login: {
      title: string;
      submit: string;
    };
  };
};

// Extend useTranslation for type safety (optional)
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: TranslationKeys;
  }
}
```

## Best Practices

1. **Namespace Organization**: Group by feature or domain
   - `common.json` - Shared strings (buttons, labels)
   - `auth.json` - Authentication-related
   - `users.json` - User management
   - `errors.json` - Error messages

2. **Key Naming**: Use clear, hierarchical keys
   - ✅ Good: `auth.login.submit`, `common.actions.save`
   - ❌ Bad: `loginBtn`, `save_button`

3. **Avoid Hardcoded Strings**: Always use translation keys
   - ✅ Good: `{t('common:actions.save')}`
   - ❌ Bad: `Save`

4. **Pluralization**: Use i18next's plural forms
   - Use `_plural` suffix for plural forms
   - Pass `count` in interpolation

5. **RTL Support**: Test with Arabic/Hebrew
   - Set `document.dir = 'rtl'`
   - Use logical CSS properties (`margin-inline-start` instead of `margin-left`)

## Checklist

When adding translations, ensure:

- [ ] Translation files organized by namespace
- [ ] Keys follow hierarchical structure
- [ ] All hardcoded strings replaced with `t()` calls
- [ ] Pluralization rules added where needed
- [ ] Dynamic values use interpolation
- [ ] RTL support implemented for Arabic
- [ ] Language switcher accessible
- [ ] Default language set in i18n config
- [ ] Fallback language configured
- [ ] Translation keys typed (if using TypeScript strict mode)
- [ ] Date/number formatting respects locale
- [ ] No translation keys duplicated across namespaces
