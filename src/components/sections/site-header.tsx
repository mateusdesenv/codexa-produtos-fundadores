"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useContact } from "@/components/ui/contact-dialog";

const navigation = [
  ["Produtos", "#produtos"],
  ["Fundadores", "#fundadores"],
  ["Como construímos", "#depoimentos"],
  ["Portfólio", "#portfolio"],
  ["Contato", "#contato"],
];

export function SiteHeader() {
  const { open } = useContact();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[.07] bg-[#050a12]/82 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12 2xl:px-20">
        <a href="#top" aria-label="Codexa — início" className="relative z-10 shrink-0">
          <Logo height={27} />
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center gap-7 lg:flex">
          {navigation.map(([label, href]) => (
            <a key={href} href={href} className="relative py-3 text-sm font-medium text-slate-400 transition-colors hover:text-white after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-green after:transition-transform hover:after:scale-x-100">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => open()} className="button-secondary header-cta hidden sm:inline-flex">
            Falar com a Codexa
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-white transition-colors hover:border-green/50 hover:text-green lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="mobile-menu" aria-label="Navegação mobile" className="border-t border-white/[.07] bg-[#071019] px-5 py-5 shadow-2xl lg:hidden">
          <div className="mx-auto grid max-w-[1440px] gap-1">
            {navigation.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center rounded-xl px-4 text-base font-medium text-slate-200 hover:bg-white/[.05] hover:text-green">
                {label}
              </a>
            ))}
            <button type="button" onClick={() => { setMenuOpen(false); open(); }} className="button-primary mt-3 sm:hidden">
              Falar com a Codexa
            </button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
