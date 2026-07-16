import {
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  LucideIcon,
} from "lucide-react";

import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

interface SocialLink {
  icon: React.ComponentType<{ size?: number }>;
  href: string;
}

export default function Footer(): JSX.Element {
  const socialLinks: SocialLink[] = [
    {
      icon: FaInstagram,
      href: "#",
    },
    {
      icon: FaFacebook,
      href: "#",
    },
    {
      icon: FaWhatsapp,
      href: "#",
    },
  ];

  return (
    <footer className="border-t border-matcha-100 bg-cream-100 dark:border-matcha-800 dark:bg-matcha-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-matcha-500 font-bold text-cream-50">
                桜
              </span>

              <span className="text-lg font-semibold text-matcha-900 dark:text-cream-50">
                Matcha House
              </span>
            </div>

            <p className="text-sm leading-relaxed text-matcha-700 dark:text-cream-300">
              Pesan minuman dan camilan favoritmu, diseduh segar setiap hari
              dari daun teh matcha pilihan.
            </p>

            <div className="mt-4 flex gap-3">
              {socialLinks.map(({ icon: Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-matcha-500/10 text-matcha-700 transition hover:bg-matcha-500 hover:text-cream-50 dark:text-cream-200 dark:hover:bg-matcha-700"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Tautan */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-matcha-900 dark:text-cream-50">
              Tautan
            </h4>

            <ul className="space-y-2 text-sm text-matcha-700 dark:text-cream-300">
              {["Beranda", "Menu", "Promo", "Tentang Kami"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-matcha-500 dark:hover:text-foam-400"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-matcha-900 dark:text-cream-50">
              Bantuan
            </h4>

            <ul className="space-y-2 text-sm text-matcha-700 dark:text-cream-300">
              {[
                "Cara Pemesanan",
                "Kebijakan Refund",
                "Syarat & Ketentuan",
                "FAQ",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-matcha-500 dark:hover:text-foam-400"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-matcha-900 dark:text-cream-50">
              Kontak
            </h4>

            <ul className="space-y-2.5 text-sm text-matcha-700 dark:text-cream-300">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                <span>Jl. Teh Hijau No. 8, Semarang</span>
              </li>

              <li className="flex items-center gap-2">
                <Phone size={15} className="shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>

              <li className="flex items-center gap-2">
                <Mail size={15} className="shrink-0" />
                <span>halo@matchahouse.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-matcha-200 pt-6 text-xs text-matcha-600 dark:border-matcha-800 dark:text-cream-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Matcha House. Semua hak cipta
            dilindungi.
          </p>

          <div className="flex gap-4">
            <a
              href="#"
              className="hover:text-matcha-500 dark:hover:text-foam-400"
            >
              Privasi
            </a>

            <a
              href="#"
              className="hover:text-matcha-500 dark:hover:text-foam-400"
            >
              Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}