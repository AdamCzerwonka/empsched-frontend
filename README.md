# empsched-frontend

This is the frontend for the Employee Scheduling application, built with React and Vite.

## Features

- 🚀 Single Page Application & PWA Ready
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations with TanStack Query
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 🌍 Internationalization with i18next
- 🛡️ Type-safe routing with React Router
- ✍️ Form management with React Hook Form and Zod for validation
- 🏪 State management with Zustand
- 🔔 Push Notifications

## Getting Started

### Prerequisites

Make sure you have [pnpm](https://pnpm.io/installation) installed.

### Environment Variables

Before running the application, you need to set up your environment variables.

1.  Create a `.env` file in the root of the `empsched-frontend` directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
2.  Open the new `.env` file and fill in the required values. At a minimum, you will need:
    *   `VITE_API_URL`: The URL of the backend API gateway (e.g., `http://localhost:8080`).
    *   `VITE_VAPID_PUBLIC_KEY`: The public VAPID key for push notifications. This key is provided by the backend.

### Installation

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
pnpm run build
```

The build output will be in the `build` directory.

## Progressive Web App (PWA) Features

This application is a Progressive Web App, which includes features like offline capabilities and push notifications.

### Service Worker

The service worker is the backbone of the PWA features. The implementation is in `sw.ts` at the root of the project. It is responsible for:
- Handling push notifications from the backend.
- Managing the notification lifecycle, including click events.
- Caching assets for offline use (if configured).

The service worker is built using Vite and is automatically registered when the application starts.

### Push Notifications

The application can receive push notifications to alert users about important updates.

- **Subscription**: The `usePushSubscription` hook (`app/hooks/usePushSubscription.ts`) manages the user's subscription status. It prompts the user for permission and sends the subscription details to the backend.
- **State Management**: The `notificationStore` (`app/store/notificationStore.ts`) manages the state of notifications displayed within the application.
- **Configuration**: For push notifications to work, the `VITE_VAPID_PUBLIC_KEY` environment variable must be set. The frontend uses this key to subscribe to the push service. This key must correspond to the key pair being used by the backend.

## Developing the Project

### Adding a New Route

To add a new page to the application, you need to follow these steps:

1. **Create the component for the new page.**
   It's recommended to create it in the `app/routes` directory. For example, `app/routes/NewPage.tsx`.

2. **Add the new path to `app/constants/navigation.ts`.**
   This keeps all application paths in one place.

   ```typescript
   // app/constants/navigation.ts
   export const navigation = {
     // ...
     newPage: "/new-page",
   };
   ```

3. **Add the new route to `app/routes.ts`.**
   This file defines the application's routing structure.

   ```typescript
   // app/routes.ts
   import { navigation } from "./constants";
   // ...

   export default [
     layout("./components/layout/GlobalLayout.tsx", [
       // ...
       route(navigation.newPage, "./routes/NewPage.tsx"), // Add your new route here
       // ...
     ]),
   ] satisfies RouteConfig;
   ```

### Adding a New Navbar Link

To add a new link to the navigation bar, you need to modify the `app/constants/navbarLinks.ts` file.

1. **Make sure you have an icon for the link (optional).**
   You can use icons from `lucide-react`.

2. **Add a new entry to the `navbarLinks` array.**
   The `NavbarLink` type has the following structure:

   ```typescript
   export type NavbarLink = {
     i18nTextKey: string;
     i18nDescriptionKey: string | null;
     link: string;
     icon: LucideIcon | null;
     access: UserRole[]; // Roles that can see the link, empty for public
     child: NavbarLink[] | null;
   };
   ```

3. **Example of adding a new link:**

   ```typescript
   // app/constants/navbarLinks.ts
   import { HomeIcon } from "lucide-react";
   import { navigation } from "./navigation";
   import type { NavbarLink } from "~/types/general/NavbarLink";

   export const navbarLinks: NavbarLink[] = [
     // ... existing links
     {
       i18nTextKey: "newPage", // Key for translation
       i18nDescriptionKey: "newPageDescription", // Key for translation
       link: navigation.newPage,
       icon: HomeIcon,
       access: [], // Publicly accessible
       child: null,
     },
   ];
   ```

   Remember to add the corresponding translations in the `public/locales` directory.

### Layouts

The application uses a nested layout structure defined in `app/routes.ts`. There are two main layouts:

- **`GlobalLayout` (`app/components/layout/GlobalLayout.tsx`)**: This is the root layout of the application. It provides a background and centers the content. It's used for pages that don't require the main navigation, such as the sign-in and sign-up pages.

- **`Layout` (`app/components/layout/Layout.tsx`)**: This is the main layout for the authenticated part of the application. It includes the `Navbar`, `Sidebar`, and `Footer`. Routes that should have the main application chrome should be nested under this layout in `app/routes.ts`.

When adding a new route, decide which layout it should use. If it's a page for unauthenticated users (like a password reset page), it should probably be a direct child of `GlobalLayout`. If it's part of the main application, it should be a child of `Layout`.

### UI Components & Styling

The project uses [Tailwind CSS](https://tailwindcss.com/) for styling and [shadcn/ui](https://ui.shadcn.com/) for the component library.

- **Base Components**: The base UI components from `shadcn/ui` are located in `app/components/ui`.
- **Custom Components**: Custom components that are not part of the `shadcn/ui` library but are used across the application can be found in `app/components/ui/custom`.
- **Adding New Components**: To add new components from `shadcn/ui`, you can use their CLI:

  ```bash
  pnpm dlx shadcn-ui@latest add [component-name]
  ```

### State Management (Zustand)

Global client-side state is managed with [Zustand](https://github.com/pmndrs/zustand).

- **Stores**: All Zustand stores are located in the `app/store` directory.
- **Creating a Store**: To create a new store, create a new file in the `app/store` directory (e.g., `myStore.ts`) and define your store.
- **Usage**: You can then use your store in any component by calling the hook it provides.

### API & Data Fetching

The application uses [Axios](https://axios-http.com/) for making HTTP requests and [TanStack Query](https://tanstack.com/query/latest) for managing server state.

- **API Instance**: A pre-configured Axios instance can be found in `app/api/api.ts`. It should be used for all API calls.
- **API Hooks**: Custom hooks for API queries and mutations are located in `app/api/hooks`. It is recommended to group them by feature (e.g., `auth`, `organisation`).
- **Data Fetching (GET)**: For fetching data, use the `useQuery` hook. This handles caching, refetching, and loading states.
- **Data Mutations (POST, PUT, DELETE)**: For creating, updating, or deleting data, use the `useMutation` hook. This helps manage the mutation lifecycle, including optimistic updates.

### Forms & Validation

Forms are handled using [React Hook Form](https://react-hook-form.com/) for performance and [Zod](https://zod.dev/) for schema-based validation.

- **Schemas**: Zod validation schemas are defined in `app/types/schemas`. It's good practice to group them by feature.
- **Form Components**: The `app/components/form/CustomFormField.tsx` provides a reusable form field component that integrates with `React Hook Form`.
- **Usage**: When creating a form, define a Zod schema, use the `useForm` hook with the `zodResolver`, and build your form using the provided form components.

### Internationalization (i18n)

The application supports multiple languages using [i18next](https://www.i18next.com/) and automatically detects the user's browser language.

- **Configuration**: The base i18next configuration is in `app/i18n/i18n.ts`.
- **Translation Files**: Translation files are located in `public/locales`. The structure is based on namespaces, e.g., `public/locales/{namespace}/{language}.json`.
- **Adding Translations**: To add a new translation, find the appropriate namespace file for each language and add the key-value pair.
- **Namespaces**: To create a new namespace, simply create a new folder in `public/locales` and add your language files (e.g., `en.json`, `pl.json`). The namespace is then loaded on-demand in your component.
- **Usage**: Use the `useTranslation` hook from `react-i18next` to access the `t` function, specifying the namespace you want to use: `const { t } = useTranslation("my-namespace");`.

### Project Structure & Conventions

To keep the codebase organized and maintainable, the project follows a few conventions:

- **Constants**: Application-wide constants, such as navigation paths (`navigation.ts`) or navbar links (`navbarLinks.ts`), are stored in the `app/constants` directory. This centralizes static data and makes it easier to manage.
- **Barrel Files (`index.ts`)**: The project uses `index.ts` files (barrel files) to re-export modules from a directory. This allows for cleaner and more concise import statements. For example, instead of importing multiple files from `app/components/ui`, you can import them from `app/components/ui`.

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t empsched-frontend .

# Run the container
docker run -p 3000:3000 empsched-frontend
```

The containerized application can be deployed to any platform that supports Docker.

---

Built with ❤️ using React Router.
