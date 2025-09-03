import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import './globals.css';
import { AnalyticsPlaceholders } from '../components/analytics-placeholders';
import { CommandSearch } from '../components/search/CommandSearch';
import Link from 'next/link';
import { TextLogo } from '../components/TextLogo';
import { MainNav } from '../components/nav/MainNav';
import { MobileNav } from '../components/nav/MobileNav';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  title: 'Little Spring — Baby & Kids Essentials',
  description: 'Calm, spring, safety-first. Fast-ship essentials and local POD.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sora.variable}>
      <body className="min-h-screen bg-[var(--background)] text-charcoal">
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-black/10">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
            <MobileNav />
            <Link href="/" className="inline-flex items-center">
              <TextLogo />
            </Link>
            <div className="hidden lg:flex items-center ml-2">
              <MainNav />
            </div>
            <div className="flex-1" />
            <div className="flex-1 max-w-md mx-auto hidden md:block">
              <input aria-label="Search products" placeholder="Search products" className="w-full rounded-md border border-black/10 px-3 py-2 bg-white/80" />
            </div>
            <div className="flex-1" />
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/b/fast-ship-za" className="hover:underline hidden md:inline">Fast Ship</Link>
              <a href="#" className="hover:underline">Track</a>
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/cart" className="hover:underline">Cart</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
        <footer className="mt-16 border-t border-black/10 bg-white/70">
          <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-4 text-sm">
            <div>
              <div className="font-semibold mb-3">Shop</div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/c/feeding-mess" className="hover:underline">Feeding & Mess</Link>
                <Link href="/c/bath-care" className="hover:underline">Bath & Care</Link>
                <Link href="/c/nursery-sleep" className="hover:underline">Nursery & Sleep</Link>
                <Link href="/c/on-the-go" className="hover:underline">On-the-Go</Link>
                <Link href="/c/apparel" className="hover:underline">Apparel</Link>
                <Link href="/b/fast-ship-za" className="hover:underline">Fast Ship ZA</Link>
                <Link href="/b/local-pod" className="hover:underline">Local POD</Link>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-3">Help</div>
              <div className="grid gap-2">
                <Link href="/delivery" className="hover:underline">Delivery</Link>
                <Link href="/returns" className="hover:underline">Returns</Link>
                <Link href="/privacy" className="hover:underline">Privacy</Link>
                <Link href="/terms" className="hover:underline">Terms</Link>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-3">Company</div>
              <div className="grid gap-2">
                <Link href="/about" className="hover:underline">About Little Spring</Link>
                <a href="#" className="hover:underline">Contact</a>
              </div>
            </div>
            <div className="self-end text-right md:text-left">
              © {new Date().getFullYear()} Little Spring · WeMakeSites
            </div>
          </div>
        </footer>
        <AnalyticsPlaceholders />
        <CommandSearch />
      </body>
    </html>
  );
}
