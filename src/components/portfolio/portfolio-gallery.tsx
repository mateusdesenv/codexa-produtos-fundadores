"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Layers3, Search, X } from "lucide-react";
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

  const hasActiveFilters = Boolean(query.trim()) || category !== "Todos";

  const clearFilters = () => {
    setQuery("");
    setCategory("Todos");
  };

  return (
    <div className="portfolio-gallery">
      <div className="portfolio-gallery__intro">
        <div>
          <p className="section-eyebrow">Projetos cadastrados</p>
          <h2>Explore o que já construímos.</h2>
        </div>
        <div className="portfolio-gallery__total" aria-label={`${items.length} projetos no portfólio`}>
          <Layers3 aria-hidden="true" />
          <span>
            <strong>{String(items.length).padStart(2, "0")}</strong>
            projetos
          </span>
        </div>
      </div>

      <div className="portfolio-toolbar">
        <label className="portfolio-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Buscar projeto</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar projeto ou tecnologia"
          />
          {query ? (
            <button
              type="button"
              className="portfolio-search__clear"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
            >
              <X aria-hidden="true" />
            </button>
          ) : null}
        </label>

        <div className="portfolio-filters" aria-label="Filtrar por categoria">
          {categories.map((option) => {
            const optionCount =
              option === "Todos"
                ? items.length
                : items.filter((item) => item.category === option).length;

            return (
              <button
                key={option}
                type="button"
                aria-pressed={category === option}
                onClick={() => setCategory(option)}
                className="portfolio-filter"
              >
                <span>{option}</span>
                <small>{optionCount}</small>
              </button>
            );
          })}
        </div>
      </div>

      <div className="portfolio-results">
        <p aria-live="polite">
          <strong>{String(visibleItems.length).padStart(2, "0")}</strong>{" "}
          {visibleItems.length === 1 ? "projeto encontrado" : "projetos encontrados"}
          {category !== "Todos" ? <span> em {category}</span> : null}
        </p>
        {hasActiveFilters ? (
          <button type="button" onClick={clearFilters}>
            Limpar filtros
            <X aria-hidden="true" />
          </button>
        ) : null}
      </div>

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
                  {projectUrl ? (
                    <span className="portfolio-card__cta">
                      {item.primaryCtaLabel || "Ver projeto"}
                      <ArrowUpRight aria-hidden="true" />
                    </span>
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
          <button type="button" className="portfolio-empty__reset" onClick={clearFilters}>
            Ver todos os projetos
          </button>
        </div>
      )}
    </div>
  );
}
