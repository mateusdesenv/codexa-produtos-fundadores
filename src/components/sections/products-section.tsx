import Image from "next/image";
import { ArrowRight, Bot, BrainCircuit, Church, FileText, LayoutTemplate } from "lucide-react";
import { products } from "@/data/products";

const icons = {
  brainlink: BrainCircuit,
  vitrinefolio: LayoutTemplate,
  minutaai: FileText,
  "gestao-paroquial": Church,
};

export function ProductsSection() {
  return (
    <section id="produtos" className="light-section scroll-mt-20 px-5 py-20 sm:px-8 lg:px-12 lg:py-24 2xl:px-20">
      <div className="mx-auto max-w-[1200px]">
        <header className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Nossos produtos</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            Produtos criados para resolver,<br className="hidden sm:block" /> evoluir e escalar.
          </h2>
        </header>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const Icon = icons[product.id as keyof typeof icons];
            const card = (
              <>
                <Image src={product.background} alt="" fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#06101d] via-[#06101d]/65 to-[#06101d]/10" />
                <span className="relative z-10 flex min-h-[310px] flex-col p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-green/35 bg-green/10 text-green"><Icon className="h-6 w-6" /></span>
                  <span className="mt-auto block text-xl font-semibold text-white">{product.name}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-slate-300">{product.tagline}</span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">{product.comingSoon ? "Em breve" : "Conhecer produto"}<ArrowRight className="h-4 w-4 text-green" /></span>
                </span>
              </>
            );
            return product.comingSoon ? (
              <article key={product.id} className="product-card group relative overflow-hidden rounded-2xl">{card}</article>
            ) : (
              <a key={product.id} href={product.url} target="_blank" rel="noreferrer" aria-label={`Conhecer ${product.name}`} className="product-card group relative overflow-hidden rounded-2xl">{card}</a>
            );
          })}
        </div>

        <article className="mt-5 flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-slate-800 bg-[#07111f] p-6 text-white sm:flex-row sm:items-center">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-green/40 bg-green/10 text-green"><Bot className="h-6 w-6" /></span>
          <div><h3 className="font-semibold">Iris</h3><p className="mt-1 text-sm text-slate-300">Sua assistente inteligente para responder, orientar e simplificar.</p></div>
          <span className="sm:ml-auto rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300">Em evolução</span>
        </article>
      </div>
    </section>
  );
}
