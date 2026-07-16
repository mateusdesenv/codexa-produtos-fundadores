# Codexa — Produtos & Fundadores

Homepage institucional da Codexa com foco no portfólio de produtos digitais, nos fundadores e na forma como a empresa transforma estratégia e tecnologia em soluções úteis.

## Conteúdo

- Hero full-screen com identidade visual Codexa
- Produtos Brainlink, Vitrinefolio, Gestão Paroquial, MinutaAI e Iris
- Fundadores Mateus e Anderson em blocos editoriais alternados
- Princípios de construção de produto
- Portfólio, CTA de contato e footer institucional
- Layout responsivo para desktop, tablet e mobile

## Stack

- Next.js 15 com App Router
- React 18 e TypeScript
- Tailwind CSS 4
- Lucide React
- Vercel

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Validação

```bash
npm run typecheck
npm run lint
npm run build
```

## Formulário de contato

O formulário envia os dados para `POST /api/contact`. A integração de entrega transacional permanece isolada em `deliverLead`, em `src/app/api/contact/route.ts`, para configuração posterior do provedor de e-mail.
