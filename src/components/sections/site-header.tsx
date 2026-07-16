"use client";

import { Logo } from "@/components/brand/logo";
import { useContact } from "@/components/ui/contact-dialog";

export function SiteHeader() {
  const { open } = useContact();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#050b14]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12 2xl:px-20">
        <a href="#top" aria-label="Codexa — início" className="shrink-0">
          <Logo />
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center gap-7 md:flex">
          {[["Produtos", "#produtos"], ["Fundadores", "#fundadores"], ["Como construímos", "#depoimentos"], ["Portfólio", "#portfolio"], ["Contato", "#contato"]].map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-slate-300 transition-colors hover:text-white">{label}</a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => open()}
          className="button-secondary header-cta"
        >
          <span className="hidden sm:inline">Falar com a Codexa</span>
          <span className="sm:hidden">Contato</span>
        </button>
      </div>
    </header>
  );
}
