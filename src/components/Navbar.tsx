"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Profil" },
  { href: "/katalog", label: "Katalog" },
  { href: "/lacak-material", label: "Lacak Material" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded overflow-hidden flex items-center justify-center bg-white border border-gray-200 shadow-sm">
              <img src="/gunze-logo.jpg" alt="Gunze Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#1a3a5c] tracking-wide uppercase group-hover:text-[#234e7a] transition-colors">
                Gunze Indonesia
              </span>
              <span className="hidden sm:block text-[10px] text-gray-500 uppercase tracking-widest -mt-0.5">
                Material Tracking
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-[#1a3a5c] text-white"
                      : "text-gray-600 hover:text-[#1a3a5c] hover:bg-gray-50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu */}
          <MobileMenu pathname={pathname} />
        </div>
      </div>

      {/* Mobile Nav */}
      <MobileNav links={navLinks} pathname={pathname} />
    </header>
  );
}

function MobileMenu({
  pathname,
}: {
  pathname: string;
}) {
  return (
    <div className="md:hidden flex items-center gap-2">
      {navLinks.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
              isActive
                ? "bg-[#1a3a5c] text-white"
                : "text-gray-600 hover:text-[#1a3a5c]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

function MobileNav({
  links,
  pathname,
}: {
  links: { href: string; label: string }[];
  pathname: string;
}) {
  return (
    <nav className="md:hidden border-t border-gray-100 bg-white">
      <div className="px-4 py-2 flex flex-wrap gap-1">
        {links.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                isActive
                  ? "bg-[#1a3a5c] text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
