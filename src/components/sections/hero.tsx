"use client";

import { ArrowRight } from "lucide-react";
import { useContact } from "@/components/ui/contact-dialog";
import { HeroParticleOrb } from "@/components/sections/hero-particle-orb";

export function Hero() {
  const { open } = useContact();
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <HeroParticleOrb />
      <div className="section-shell relative z-10 flex items-center">
        <div className="max-w-[700px]">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.045] px-3.5 py-2 text-xs font-black uppercase tracking-[.16em] text-green-strong">
            Produto · Software · Inteligência
          </p>
          <h1 id="hero-title" className="max-w-[700px] text-balance text-[2.8rem] font-[850] leading-[1.01] tracking-[-0.055em] text-white sm:text-6xl lg:text-[4.75rem]">
            Ideias que viram produtos. Produtos que geram <span className="text-green">impacto.</span>
          </h1>
          <p className="mt-7 max-w-[590px] text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Criamos soluções digitais próprias para problemas reais — da estratégia ao código, com clareza, tecnologia e visão de longo prazo.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#produtos" className="button-primary">Explorar produtos <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <button type="button" onClick={() => open()} className="button-secondary">Conversar com a equipe</button>
          </div>
          <dl className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6 text-sm">
            <div><dt className="text-slate-500">Produtos ativos</dt><dd className="mt-1 font-extrabold text-white">4 ecossistemas</dd></div>
            <div><dt className="text-slate-500">Atuação</dt><dd className="mt-1 font-extrabold text-white">Estratégia ao produto</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
