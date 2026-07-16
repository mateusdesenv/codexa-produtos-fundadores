"use client";

import { ArrowRight } from "lucide-react";
import { useContact } from "@/components/ui/contact-dialog";

export function Hero() {
  const { open } = useContact();
  return (
    <section className="hero-section flex px-5 py-24 sm:px-8 lg:px-12 2xl:px-20">
      <div className="mx-auto flex w-full max-w-[1280px] items-center">
        <div className="relative z-10 max-w-[650px]">
          <h1 className="max-w-[650px] text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.7rem]">
            Produtos digitais que <span className="text-green">transformam</span> negócios.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Na Codexa, criamos produtos, software e soluções digitais que simplificam operações, conectam pessoas e impulsionam resultados reais.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#produtos" className="button-primary">Conhecer produtos <ArrowRight className="h-4 w-4" /></a>
            <button type="button" onClick={() => open()} className="button-secondary">Falar com a Codexa <ArrowRight className="h-4 w-4" /></button>
          </div>
          <p className="mt-10 flex items-center gap-3 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-green shadow-[0_0_12px_#00d95f]" />
            Software com propósito. Produto com impacto.
          </p>
        </div>
      </div>
    </section>
  );
}
