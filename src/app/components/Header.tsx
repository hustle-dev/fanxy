'use client';

import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

import cn from '~/app/utils/cn';

import Button from './Button';

const Header = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const isHome = pathname === '/';
  return (
    <header className="mx-auto my-6 flex w-full max-w-3xl flex-1 justify-between px-6">
      <nav className="flex items-center">
        <Link
          href="/"
          className={cn(
            'text-muted-foreground hover:text-foreground transition-colors',
            { 'text-foreground': isHome },
          )}
        >
          Home
        </Link>
      </nav>
      <Button
        className="group relative h-[1.5rem] w-[1.5rem] cursor-pointer dark:hover:bg-transparent"
        variant="ghost"
        size="icon"
        onClick={() => {
          setTheme(isDark ? 'light' : 'dark');
        }}
      >
        <Sun
          className={cn(
            'text-muted-foreground group-hover:text-foreground h-[1rem] w-[1rem] scale-100 rotate-0 transition-all',
            { 'scale-0 -rotate-90': isDark },
          )}
          suppressHydrationWarning
        />
        <Moon
          className={cn(
            'text-muted-foreground group-hover:text-foreground absolute h-[1rem] w-[1rem] scale-0 rotate-90 transition-all',
            { 'scale-100 rotate-0': isDark },
          )}
          suppressHydrationWarning
        />
        <span className="sr-only">테마 전환</span>
      </Button>
    </header>
  );
};

export default Header;
