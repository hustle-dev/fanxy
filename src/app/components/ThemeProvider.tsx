'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import type { ComponentProps } from 'react';

const ThemeProvider = ({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

export default ThemeProvider;
