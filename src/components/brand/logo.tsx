/**
 * Marca oficial da Codexa (assets reais, versão reversed para fundo escuro).
 * - Lockup horizontal (ícone + wordmark) para header/footer.
 * - Ícone isolado para o núcleo da órbita do hero.
 */

export function Logo({
  className,
  height = 28,
}: {
  className?: string;
  height?: number;
}) {
  const width = Math.round((height * 971) / 261);
  return (
    // O lockup legado é uma versão oficial já recortada e adequada à interface.
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/codexa-header-logo-reversed.png" alt="Codexa" width={width} height={height} className={className} style={{ height, width: "auto" }} />
  );
}

export function LogoIcon({
  className,
  size = 96,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span className={`relative inline-block overflow-hidden ${className ?? ""}`} style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/codexa/homepage-products/brand/logo-icon-only.png" alt="Codexa" width={1254} height={1254} className="absolute inset-0 h-full w-full object-cover" />
    </span>
  );
}
