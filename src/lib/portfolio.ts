const PORTFOLIO_API_URL =
  process.env.PORTFOLIO_API_URL ??
  "https://codexa-portifolio-api.vercel.app";

export type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  projectUrl: string;
  primaryCtaUrl: string;
  primaryCtaLabel: string;
  desktopImageUrl: string;
  altText: string;
  tags: string[];
  openInNewTab: boolean;
};

type PortfolioResponse = {
  data?: PortfolioItem[];
};

export function getPortfolioAssetUrl(path: string) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path, PORTFOLIO_API_URL).toString();
}

export async function getPortfolioItems() {
  const response = await fetch(
    `${PORTFOLIO_API_URL}/api/v1/portfolio-items?limit=100`,
    { next: { revalidate: 300 } },
  );

  if (!response.ok) {
    throw new Error(`Portfolio API returned ${response.status}`);
  }

  const payload = (await response.json()) as PortfolioResponse;
  return payload.data ?? [];
}
