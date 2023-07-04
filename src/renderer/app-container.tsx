import { MantineProvider } from '@mantine/core';
import { memo } from 'react';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppRoutes } from './app-routes';
import { mantineTheme } from './themes';

import 'tailwindcss/tailwind.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const AppContainer = memo(() => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <Notifications position="top-center" />
      </QueryClientProvider>
    </MantineProvider>
  );
});
