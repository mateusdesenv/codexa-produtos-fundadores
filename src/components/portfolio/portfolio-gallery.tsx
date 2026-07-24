"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import {
  getPortfolioAssetUrl,
  type PortfolioItem,
} from "@/lib/portfolio";

export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");

  const categories = useMemo(
    () => [
      "Todos",
      ...Array.from(
        new Set(items.map((item) => item.category).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, "pt-BR")),
    ],
    [items],
  );

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

    return items.filter((item) => {
      const matchesCategory =
        category === "Todos" || item.category === category;
      const searchableText = [
        item.title,
        item.category,
        item.shortDescription,
        ...(item.tags ?? []),
      ]
        .join(" ")
        .toLocaleLowerCase("pt-BR");

      return (
        matchesCategory &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    });
  }, [category, items, query]);

  return (
    <>
      <div className="portfolio-toolbar">
        <label className="portfolio-search">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Buscar projeto</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por projeto, categoria ou tecnologia"
          />
        </label>

        <div className="portfolio-filters" aria-label="Filtrar por categoria">
          {categories.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={category === option}
              onClick={() => setCategory(option)}
              className="portfolio-filter"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-500" aria-live="polite">
        {visibleItems.length}{" "}
        {visibleItems.length === 1 ? "projeto encontrado" : "projetos encontrados"}
      </p>

      {visibleItems.length ? (
        <div className="portfolio-grid">
          {visibleItems.map((item, index) => {
            const projectUrl = item.projectUrl || item.primaryCtaUrl;
            const cardContent = (
              <>
                <div className="portfolio-card__preview">
                  {item.desktopImageUrl ? (
                    // Images are served dynamically by the portfolio API.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getPortfolioAssetUrl(item.desktopImageUrl)}
                      alt={item.altText || `Preview do projeto ${item.title}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="portfolio-card__fallback" aria-hidden="true">
                      <span>{item.title.slice(0, 1)}</span>
                    </div>
                  )}
                  <span className="portfolio-card__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="portfolio-card__content">
                  <div className="flex items-center justify-between gap-4">
                    <span className="portfolio-card__category">
                      {item.category || "Projeto digital"}
                    </span>
                    {projectUrl ? (
                      <ArrowUpRight
                        className="h-5 w-5 text-green"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                  <h2>{item.title}</h2>
                  <p>
                    {item.shortDescription ||
                      "Produto digital criado pela Codexa."}
                  </p>
                  {item.tags?.length ? (
                    <ul className="portfolio-card__tags" aria-label="Tecnologias e áreas">
                      {item.tags.slice(0, 4).map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </>
            );

            return projectUrl ? (
              <a
                key={item.id}
                href={projectUrl}
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noreferrer" : undefined}
                className="portfolio-card"
                aria-label={`${item.primaryCtaLabel || "Ver projeto"}: ${item.title}${item.openInNewTab ? " (abre em nova aba)" : ""}`}
              >
                {cardContent}
              </a>
            ) : (
              <article key={item.id} className="portfolio-card">
                {cardContent}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="portfolio-empty">
          <Search className="h-6 w-6 text-green" aria-hidden="true" />
          <h2>Nenhum projeto por aqui.</h2>
          <p>Tente outro termo ou selecione uma categoria diferente.</p>
        </div>
      )}
    </>
  );
}
