"use client";

import Image from "next/image";
import {
  ArrowRight,
  BrainCircuit,
  Code2,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useContact } from "@/components/ui/contact-dialog";

const founders = [
  {
    name: "Mateus",
    role: "Produto & Estratégia",
    bio: "Estratégia, experiência e visão de produto para transformar problemas reais em soluções digitais simples e úteis.",
    image: "/assets/codexa/homepage-products/founders/mateus.png",
    position: "center center",
  },
  {
    name: "Anderson",
    role: "Tecnologia & Operações",
    bio: "Engenharia de software, arquitetura escalável e execução técnica para construir produtos sólidos e eficientes.",
    image: "/assets/codexa/homepage-products/founders/anderson.jpeg",
    position: "center 28%",
  },
];

const principles = [
  {
    Icon: Sparkles,
    title: "Clareza antes da complexidade",
    text: "Cada decisão de produto começa pelo problema, pelas pessoas e pelo resultado que precisa ser alcançado.",
  },
  {
    Icon: ShieldCheck,
    title: "Tecnologia com responsabilidade",
    text: "Segurança, acessibilidade e desempenho fazem parte da solução desde a primeira versão.",
  },
  {
    Icon: Layers3,
    title: "Produtos que evoluem",
    text: "Criamos fundações consistentes para aprender, iterar e escalar sem perder simplicidade.",
  },
];

const portfolio = [
  { Icon: BrainCircuit, name: "Brainlink", text: "Memória e contexto para agentes de IA." },
  { Icon: Layers3, name: "Vitrinefolio", text: "Portfólios profissionais que vendem o trabalho." },
  { Icon: Code2, name: "Minuta AI", text: "Automação inteligente de documentos jurídicos." },
  { Icon: ShieldCheck, name: "Gestão Paroquial", text: "Operação financeira centralizada para paróquias." },
];

export function FoundersSection() {
  return (
    <section id="fundadores" className="light-section scroll-mt-20 px-5 py-20 sm:px-8 lg:px-12 lg:py-28 2xl:px-20">
      <div className="mx-auto max-w-[1200px]">
        <header className="max-w-[640px]">
          <p className="section-eyebrow">Fundadores</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            Experiência real. Visão de produto.
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-slate-600">
            Unimos estratégia e tecnologia para criar produtos que fazem a diferença.
          </p>
        </header>

        <div className="mt-12 space-y-6 lg:mt-14 lg:space-y-8">
          {founders.map((founder, index) => (
            <article
              key={founder.name}
              className={`founder-card grid overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white ${
                index === 0 ? "md:grid-cols-[58%_42%]" : "md:grid-cols-[42%_58%]"
              }`}
            >
              <div
                className={`relative min-h-72 sm:min-h-80 md:min-h-[420px] ${
                  index === 0 ? "md:order-2" : "md:order-1"
                }`}
              >
                <Image
                  src={founder.image}
                  alt={`Foto de ${founder.name}, fundador da Codexa`}
                  fill
                  sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: founder.position }}
                />
              </div>

              <div
                className={`relative flex flex-col justify-center p-7 sm:p-10 lg:p-14 ${
                  index === 0 ? "md:order-1" : "md:order-2"
                }`}
              >
                <span className="absolute left-7 top-7 h-px w-10 bg-green sm:left-10 sm:top-10 lg:left-14 lg:top-12" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-deep">
                  Cofundador · 0{index + 1}
                </p>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  {founder.name}
                </h3>
                <p className="mt-2 text-sm font-semibold text-green-deep">{founder.role}</p>
                <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600">{founder.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PrinciplesSection() {
  return (
    <section id="depoimentos" className="light-section scroll-mt-20 border-t border-slate-200/70 px-5 py-20 sm:px-8 lg:px-12 2xl:px-20">
      <div className="mx-auto max-w-[1200px]">
        <header className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Como construímos</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Confiança nasce do processo.</h2>
          <p className="mt-4 text-slate-600">Enquanto reunimos depoimentos públicos verificáveis, mostramos os princípios que orientam cada entrega.</p>
        </header>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {principles.map(({ Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-green/10 text-green-deep"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-6 text-lg font-semibold text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PortfolioSection() {
  return (
    <section id="portfolio" className="light-section scroll-mt-20 px-5 pb-24 pt-12 sm:px-8 lg:px-12 lg:pb-28 2xl:px-20">
      <div className="mx-auto max-w-[1200px]">
        <header className="text-center">
          <p className="section-eyebrow">Portfólio</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Produtos que geram impacto.</h2>
        </header>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {portfolio.map(({ Icon, name, text }) => (
            <article key={name} className="rounded-2xl border border-slate-200 bg-white p-6">
              <Icon className="h-7 w-7 text-green-deep" />
              <h3 className="mt-5 font-semibold text-slate-950">{name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactCta() {
  const { open } = useContact();
  return (
    <section id="contato" className="contact-cta scroll-mt-20 px-5 py-14 sm:px-8 lg:px-12 2xl:px-20">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Vamos criar o próximo<br />produto com <span className="text-green">você.</span>
          </h2>
          <p className="mt-3 text-slate-300">Conte sua ideia. Nós transformamos em solução.</p>
        </div>
        <button type="button" onClick={() => open()} className="button-primary">
          Falar com a equipe <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
