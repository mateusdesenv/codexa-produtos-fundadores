export type Product = {
  /** slug estável usado em âncoras e no formulário B2B */
  id: string;
  name: string;
  /** frase curta de posicionamento */
  tagline: string;
  description: string;
  /** capacidades destacadas no card */
  highlights: string[];
  /** rótulo de categoria */
  category: string;
  /** link real do produto (site/app em produção); vazio quando "em breve" */
  url: string;
  /** screenshot real do produto (card) */
  image: string;
  /** screenshot real reduzido (órbita) */
  thumb: string;
  /** arte final decorativa do card na homepage */
  background: string;
  /** produto ainda não lançado publicamente — sem link, com fita "Em breve" */
  comingSoon?: boolean;
};

export const products: Product[] = [
  {
    id: "brainlink",
    name: "Brainlink",
    category: "Memória & Contexto para IA",
    tagline: "A memória que seus agentes de IA nunca esquecem.",
    description:
      "Memória persistente e busca de contexto para equipes e agentes de IA. Recuperação híbrida (RAG + CAG), grafo de conhecimento e um vault cifrado que mantém decisões, padrões e credenciais sempre à mão — entre sessões e entre ferramentas.",
    highlights: [
      "Busca híbrida (semântica + full-text)",
      "Grafo de conhecimento conectado",
      "Vault cifrado em repouso",
    ],
    url: "",
    image: "/products/brainlink.jpg",
    thumb: "/products/brainlink-thumb.jpg",
    background: "/assets/codexa/homepage-products/cards/card-bg-brainlink.png",
    comingSoon: true,
  },
  {
    id: "vitrinefolio",
    name: "Vitrinefolio",
    category: "Portfólios & Vitrines",
    tagline: "Portfólios únicos que vendem por você.",
    description:
      "Construtor de portfólios e vitrines profissionais com templates exclusivos que lideram pelo trabalho. Personalize com preview ao vivo e publique uma página pública hospedada em minutos — sem código, sem mensalidade.",
    highlights: [
      "Templates que destacam projetos",
      "Preview ao vivo e publicação instantânea",
      "Pagamento único, sem mensalidade",
    ],
    url: "https://vitrinefolio.vercel.app",
    image: "/products/vitrinefolio.jpg",
    thumb: "/products/vitrinefolio-thumb.jpg",
    background: "/assets/codexa/homepage-products/cards/card-bg-vitrinefolio.png",
  },
  {
    id: "gestao-paroquial",
    name: "Gestão Paroquial",
    category: "Gestão para Paróquias",
    tagline: "Tesouraria paroquial sem caos.",
    description:
      "Plataforma de gestão para paróquias: dízimos, despesas, recibos, balancete e portal do dizimista — tudo num lugar só. Simples para padre, secretária e tesoureiro, com dados isolados por paróquia e segurança de ponta.",
    highlights: [
      "Dízimos, despesas e balancete",
      "Portal do dizimista",
      "Multi-tenant com dados isolados",
    ],
    url: "https://gestaoparoquial.com",
    image: "/products/gestao-paroquial.jpg",
    thumb: "/products/gestao-paroquial-thumb.jpg",
    background: "/assets/codexa/homepage-products/cards/card-bg-gestao-paroquial.png",
  },
  {
    id: "minutaai",
    name: "MinutaAI",
    category: "Automação Jurídica",
    tagline: "Crie, revise e analise documentos jurídicos com a Mia.",
    description:
      "A Mia é a assistente jurídica do Minuta: da primeira minuta à revisão final, ela apoia cada etapa para o seu escritório entregar mais rápido e com critério. Procurações, contratos e minutas a partir da ficha do cliente.",
    highlights: [
      "Assistente jurídica com IA (Mia)",
      "Procurações e contratos automáticos",
      "Rastreabilidade e revisão",
    ],
    url: "https://minutaai.com",
    image: "/products/minutaai.jpg",
    thumb: "/products/minutaai-thumb.jpg",
    background: "/assets/codexa/homepage-products/cards/card-bg-minuta-ai.png",
  },
];
