import Image from "next/image";
import { ArrowUpRight, Bot, Church, ClipboardList, FileText, LayoutTemplate } from "lucide-react";
import { products } from "@/data/products";

const icons = {
  "aqui-comanda": ClipboardList,
  vitrinefolio: LayoutTemplate,
  minutaai: FileText,
  "gestao-paroquial": Church,
};

export function ProductsSection() {
  return (
    <section id="produtos" className="site-section scroll-mt-20" aria-labelledby="products-title">
      <div className="section-shell">
        <header className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="section-eyebrow">Ecossistema Codexa</p>
            <h2 id="products-title" className="section-title">Produtos pensados para a vida real.</h2>
          </div>
          <p className="section-copy lg:mb-1">
            Cada produto nasce de uma dor concreta e evolui com quem usa. Menos complexidade aparente, mais valor no dia a dia.
          </p>
        </header>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {products.map((product, index) => {
            const Icon = icons[product.id as keyof typeof icons];
            const content = (
              <>
                <Image
                  src={product.background}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[#050a12] via-[#071019]/78 to-[#071019]/12" />
                <span className="relative z-10 flex min-h-[390px] flex-col p-6 sm:min-h-[430px] sm:p-8">
                  <span className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-green/25 bg-[#071019]/75 text-green backdrop-blur-md">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full border border-white/12 bg-[#071019]/65 px-3 py-1.5 text-[.68rem] font-semibold uppercase tracking-[.13em] text-slate-300 backdrop-blur-md">
                      {product.comingSoon ? "Em breve" : product.category}
                    </span>
                  </span>
                  <span className="mt-auto block text-2xl font-semibold tracking-tight text-white sm:text-3xl">{product.name}</span>
                  <span className="mt-3 block max-w-md text-sm leading-6 text-slate-300 sm:text-base">{product.tagline}</span>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-strong">
                    {product.comingSoon ? "Acompanhar evolução" : "Conhecer produto"}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="absolute bottom-7 right-7 text-xs font-medium text-white/35">0{index + 1}</span>
                </span>
              </>
            );

            return product.comingSoon ? (
              <article key={product.id} data-particle-attractor className="product-card surface-card group relative overflow-hidden rounded-[1.5rem]">{content}</article>
            ) : (
              <a key={product.id} data-particle-attractor href={product.url} target="_blank" rel="noreferrer" aria-label={`Conhecer ${product.name} (abre em nova aba)`} className="product-card surface-card group relative overflow-hidden rounded-[1.5rem]">{content}</a>
            );
          })}
        </div>

        <article className="surface-card mt-5 flex flex-col items-start gap-5 rounded-[1.5rem] p-6 sm:flex-row sm:items-center sm:p-8">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-green/25 bg-green/10 text-green"><Bot className="h-5 w-5" aria-hidden="true" /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-green-strong">Em laboratório</p>
            <h3 className="mt-1.5 text-xl font-semibold text-white">Iris</h3>
            <p className="mt-1 text-sm leading-6 text-slate-400">Uma assistente inteligente para responder, orientar e simplificar decisões.</p>
          </div>
          <span className="mt-1 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:ml-auto sm:mt-0">Em evolução</span>
        </article>
      </div>
    </section>
  );
}
