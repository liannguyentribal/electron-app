import { MantineProvider } from '@mantine/core';
import { memo } from 'react';
import { Notifications } from '@mantine/notifications';
import { AppRoutes } from './app-routes';
import { mantineTheme } from './themes';

import 'tailwindcss/tailwind.css';

export const AppContainer = memo(() => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
      <Notifications position="top-center" />

      <AppRoutes />
    </MantineProvider>
  );
});
