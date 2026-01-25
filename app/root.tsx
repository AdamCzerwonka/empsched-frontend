import { useEffect, useState } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import "./i18n/i18n";
import { ThemeProvider } from "./components/theme-provider";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { showApiErrorToast } from "./lib/toastUtils";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "./types/api";
import { useTranslation } from "react-i18next";
import { ToasterWrapper } from "./components/system";
import { getSerwist } from "virtual:serwist";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { Serwist } from "@serwist/window";
import { Button } from "./components/ui";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "manifest", href: "/manifest.json" },
  { rel: "mask-icon", href: "/icons/icon-192x192.png" },

  { rel: "shortcut icon", href: "/favicon.ico" },
  { rel: "icon", type: "image/png", href: "/icons/logo.png" },

  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Employe Scheduler</title>
        <meta name="description" content="Best Scheduler!" />

        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://p.lodz.pl/" />
        <meta name="twitter:title" content="Employee Scheduler" />
        <meta name="twitter:description" content="Best Scheduler!" />
        <meta name="twitter:image" content="/icons/icon-512x512.png" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Employee Scheduler" />
        <meta property="og:description" content="Best Employee Scheduler!" />
        <meta property="og:site_name" content="Employee Scheduler" />
        <meta property="og:url" content="https://p.lodz.pl/" />
        <meta property="og:image" content="/icons/icon-512x512.png" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { t } = useTranslation("errors");
  const { t: tInfo } = useTranslation("information");

  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const [serwistInstance, setSerwistInstance] = useState<Serwist | null>(null);

  useEffect(() => {
    const loadSerwist = async () => {
      if ("serviceWorker" in navigator) {
        const serwist = await getSerwist();

        serwist?.addEventListener("waiting", () => {
          console.log("new versionn!");
          setShowRefreshButton(true);
        });

        serwist?.addEventListener("installed", () => {
          console.log("New version installed offline!");
        });

        serwist?.addEventListener("controlling", () => {
          window.location.reload();
        });

        void serwist?.register();
        if (serwist) setSerwistInstance(serwist);
      }
    };

    loadSerwist();
  }, []);

  const handleUpdateClick = () => {
    if (serwistInstance) {
      serwistInstance?.messageSkipWaiting();
    }
  };

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        showApiErrorToast(error as AxiosError<ErrorResponse>, t);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _, __, ___) => {
        showApiErrorToast(error as AxiosError<ErrorResponse>, t);
      },
    }),
    defaultOptions: {
      queries: {
        networkMode: "offlineFirst",
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 60 * 24, //24h
      },
      mutations: {
        networkMode: "offlineFirst",
        retry: 3,
      },
    },
  });

  const persister = createAsyncStoragePersister({
    storage: window.localStorage,
  });

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: 1000 * 60 * 60 * 24, // 24h
        }}
        onSuccess={() => {
          queryClient.resumePausedMutations().then(() => {
            queryClient.invalidateQueries();
          });
        }}
      >
        <Outlet />
        <ToasterWrapper />
      </PersistQueryClientProvider>
      {showRefreshButton && (
        <div className="fixed right-5 bottom-5 z-[9999] flex flex-col gap-2 rounded-lg bg-[#333] p-5 text-white">
          {tInfo("newVersion.description")}
          <Button onClick={handleUpdateClick}>
            {tInfo("newVersion.triggerButton")}
          </Button>
        </div>
      )}
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
