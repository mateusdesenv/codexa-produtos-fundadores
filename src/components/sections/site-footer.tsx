import { Github, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const navigation = [["Produtos", "/#produtos"], ["Fundadores", "/#fundadores"], ["Como construímos", "/#depoimentos"], ["Portfólio", "/portfolio"], ["Contato", "/#contato"]];
const productLinks = [["Aqui Comanda", "/#produtos"], ["Vitrinefolio", "https://vitrinefolio.vercel.app"], ["Minuta AI", "https://minutaai.com"], ["Gestão Paroquial", "https://gestaoparoquial.com"], ["Iris", "/#produtos"]];

export function SiteFooter() {
  return (
    <footer className="bg-[#050b14] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-[var(--page-gutter)] py-14 sm:grid-cols-2 lg:grid-cols-[1.45fr_0.8fr_0.9fr_1fr]">
        <div>
          <Logo height={32} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">Desenvolvemos produtos digitais simples, eficientes e escaláveis que impulsionam operações e impactam resultados.</p>
          <div className="mt-5 flex gap-2">
            {[["LinkedIn", "https://www.linkedin.com/company/codexa-web/", Linkedin], ["Instagram", "https://www.instagram.com/co.dexaweb", Instagram], ["GitHub", "https://github.com/andersonflima", Github]].map(([label, href, Icon]) => {
              const SocialIcon = Icon as typeof Linkedin;
              return <a key={label as string} href={href as string} target="_blank" rel="noreferrer" aria-label={label as string} className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 text-slate-300 transition-colors hover:border-green/50 hover:text-green"><SocialIcon className="h-4 w-4" /></a>;
            })}
          </div>
        </div>
        <FooterLinks title="Navegação" links={navigation} />
        <FooterLinks title="Produtos" links={productLinks} />
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-300">Contato</h2>
          <Link href="/#contato" className="mt-5 block text-sm text-slate-400 transition-colors hover:text-white">Falar com a equipe</Link>
          <a href="https://codexa-web.online" target="_blank" rel="noreferrer" className="mt-3 block text-sm text-slate-400 transition-colors hover:text-white">codexa-web.online</a>
        </div>
      </div>
      <div className="border-t border-white/[0.07]"><p className="mx-auto max-w-[1440px] px-[var(--page-gutter)] py-6 text-center text-xs text-slate-500">© {new Date().getFullYear()} <span className="text-green">Codexa.</span> Todos os direitos reservados.</p></div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[][] }) {
  return <div><h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-300">{title}</h2><ul className="mt-5 grid gap-3">{links.map(([label, href]) => <li key={label}>{href.startsWith("/") ? <Link href={href} className="text-sm text-slate-400 transition-colors hover:text-white">{label}</Link> : <a href={href} target="_blank" rel="noreferrer" className="text-sm text-slate-400 transition-colors hover:text-white">{label}</a>}</li>)}</ul></div>;
}
