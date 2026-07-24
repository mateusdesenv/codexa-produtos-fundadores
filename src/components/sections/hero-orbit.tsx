"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { products, type Product } from "@/data/products";

const ORBIT_SECONDS = 48;
const CODEXA_URL = "https://codexa-web.online";

/** Barra de janela (sem exibir URL). */
function WindowBar() {
  return (
    <span className="flex items-center gap-1 border-b border-border px-2.5 py-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
    </span>
  );
}

/** Fita diagonal "Em breve" no canto do card. */
function ComingSoonRibbon() {
  return (
    <span className="pointer-events-none absolute -right-9 top-3 z-20 rotate-45 bg-green px-9 py-[3px] text-center text-[9px] font-black uppercase tracking-wider text-ink shadow-md">
      Em breve
    </span>
  );
}

export function HeroOrbit() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[38rem] place-items-center 2xl:max-w-[44rem]">
      {/* anéis decorativos */}
      <div className="pointer-events-none absolute inset-[4%] rounded-full border border-border" />
      <div className="pointer-events-none absolute inset-[24%] rounded-full border border-dashed border-border-strong/40" />

      {/* halo pulsante */}
      <motion.div
        className="pointer-events-none absolute inset-[34%] rounded-full bg-green/20 blur-2xl"
        animate={reduce ? undefined : { opacity: [0.3, 0.6, 0.3], scale: [0.96, 1.05, 0.96] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* núcleo — print real do site da Codexa */}
      <a
        href={CODEXA_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir o site da Codexa"
        className="group glass-panel absolute left-1/2 top-1/2 z-10 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl shadow-[var(--shadow-glow)] transition-all hover:border-border-strong sm:w-52 lg:w-60 2xl:w-64"
      >
        <WindowBar />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/codexa-site.jpg"
          alt="Site da Codexa"
          width={1100}
          height={688}
          className="aspect-[16/10] w-full object-cover object-top"
        />
      </a>

      {/* anel de produtos — mini prints reais orbitando */}
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: ORBIT_SECONDS, repeat: Infinity, ease: "linear" }}
      >
        {products.map((product, index) => {
          const angle = (360 / products.length) * index;
          return (
            <span
              key={product.id}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotate(${angle}deg) translateX(var(--orbit-r)) rotate(-${angle}deg)`,
              }}
            >
              <motion.span
                className="-translate-x-1/2 -translate-y-1/2 block"
                animate={reduce ? undefined : { rotate: -360 }}
                transition={{ duration: ORBIT_SECONDS, repeat: Infinity, ease: "linear" }}
              >
                <OrbitCard product={product} />
              </motion.span>
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

function OrbitCard({ product }: { product: Product }) {
  const cardClass =
    "group glass-panel relative block w-24 overflow-hidden rounded-xl border-border shadow-xl transition-all sm:w-36 lg:w-40 2xl:w-44";

  const inner = (
    <>
      {product.comingSoon ? <ComingSoonRibbon /> : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.thumb}
        alt={`Tela do ${product.name}`}
        width={720}
        height={450}
        loading="lazy"
        className="aspect-[16/10] w-full object-cover object-top"
      />
      <span className="flex items-center justify-between gap-1 px-2 py-1.5 sm:px-2.5">
        <span className="truncate text-[11px] font-extrabold text-foreground sm:text-xs">
          {product.name}
        </span>
        {product.comingSoon ? null : (
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-green" />
        )}
      </span>
    </>
  );

  if (product.comingSoon) {
    return <span className={cardClass}>{inner}</span>;
  }

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Abrir ${product.name}`}
      className={`${cardClass} hover:-translate-y-0.5 hover:border-border-strong`}
    >
      {inner}
    </a>
  );
}
