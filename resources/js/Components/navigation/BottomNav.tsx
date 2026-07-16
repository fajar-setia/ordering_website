import { Home, Search, ClipboardList, ShoppingBag, User, LucideIcon } from "lucide-react";
import { useState } from "react";

interface MobileBottomNavProps {
  cartCount?: number;
}

type NavKey = "home" | "search" | "orders" | "cart" | "profile";

interface NavItem {
  key: NavKey;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
}

export default function MobileBottomNav({
  cartCount = 2,
}: MobileBottomNavProps) {
  const [active, setActive] = useState<NavKey>("home");

  const items: NavItem[] = [
    {
      key: "home",
      label: "Beranda",
      icon: Home,
      href: "/",
    },
    {
      key: "search",
      label: "Cari",
      icon: Search,
      href: "/cari",
    },
    {
      key: "orders",
      label: "Pesanan",
      icon: ClipboardList,
      href: "/pesanan",
    },
    {
      key: "cart",
      label: "Keranjang",
      icon: ShoppingBag,
      href: "/keranjang",
      badge: cartCount,
    },
    {
      key: "profile",
      label: "Profil",
      icon: User,
      href: "/profil",
    },
  ];

  return (
    <nav
      className="
        fixed inset-x-0 bottom-0 z-40
        border-t border-matcha-100
        bg-cream-50/95
        backdrop-blur-md
        pb-[env(safe-area-inset-bottom)]
        dark:border-matcha-800
        dark:bg-matcha-900/95
        md:hidden
      "
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-2">
        {items.map(({ key, label, icon: Icon, href, badge }) => {
          const isActive = active === key;

          return (
            <a
              key={key}
              href={href}
              onClick={() => setActive(key)}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  isActive
                    ? "bg-matcha-500 text-cream-50"
                    : "text-matcha-400 dark:text-cream-300"
                }`}
              >
                <Icon size={18} />
              </span>

              <span
                className={`text-[11px] font-medium ${
                  isActive
                    ? "text-matcha-700 dark:text-foam-400"
                    : "text-matcha-400 dark:text-cream-400"
                }`}
              >
                {label}
              </span>

              {(badge ?? 0) > 0 && (
                <span
                  className="
                    absolute right-3 top-1
                    flex h-4 w-4 items-center justify-center
                    rounded-full
                    bg-foam-500
                    text-[9px] font-bold
                    text-matcha-900
                  "
                >
                  {badge}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}