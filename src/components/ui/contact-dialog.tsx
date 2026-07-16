"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { products } from "@/data/products";

type ContactContextValue = {
  open: (productId?: string) => void;
};

const ContactContext = createContext<ContactContextValue | null>(null);

export function useContact(): ContactContextValue {
  const ctx = useContext(ContactContext);
  if (!ctx) {
    throw new Error("useContact deve ser usado dentro de <ContactProvider>");
  }
  return ctx;
}

type Status = "idle" | "submitting" | "success" | "error";

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [productId, setProductId] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const open = useCallback((product?: string) => {
    setProductId(product ?? "");
    setStatus("idle");
    setErrorMessage("");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const value = useMemo<ContactContextValue>(() => ({ open }), [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(payload?.message ?? "Não foi possível enviar agora.");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Erro inesperado. Tente novamente.",
      );
    }
  }

  return (
    <ContactContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* scrim */}
            <button
              type="button"
              aria-label="Fechar"
              onClick={close}
              className="absolute inset-0 cursor-default bg-ink/70 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-title"
              className="glass-panel relative z-10 w-full max-w-lg overflow-hidden rounded-[var(--radius-card)] p-6 shadow-2xl sm:p-8"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Fechar formulário"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              {status === "success" ? (
                <div className="py-6 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green/15 text-green ring-1 ring-border-strong">
                    <Check className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-foreground">
                    Recebemos seu contato
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                    Nossa equipe vai retornar em breve pelo e-mail informado.
                    Obrigado pelo interesse na Codexa.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-6 rounded-full bg-green px-6 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green">
                    Fale com a Codexa
                  </p>
                  <h2 id="contact-title" className="mt-2 text-2xl font-bold text-foreground">
                    Entre em contato
                  </h2>
                  <p className="mt-1.5 text-sm text-muted">
                    Conte sobre sua operação. Retornamos com uma proposta sob medida.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 grid gap-4" noValidate>
                    <Field label="Nome" htmlFor="name">
                      <input
                        id="name"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Seu nome"
                        className={inputClass}
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="E-mail corporativo" htmlFor="email">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          inputMode="email"
                          placeholder="voce@empresa.com"
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Empresa" htmlFor="company">
                        <input
                          id="company"
                          name="company"
                          autoComplete="organization"
                          placeholder="Nome da empresa"
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <Field label="Produto de interesse" htmlFor="product">
                      <select
                        id="product"
                        name="product"
                        defaultValue={productId}
                        className={inputClass}
                      >
                        <option value="">Selecione um produto</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                        <option value="outro">Outro / não sei ainda</option>
                      </select>
                    </Field>

                    <Field label="Mensagem" htmlFor="message">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Como podemos ajudar?"
                        className={`${inputClass} resize-none`}
                      />
                    </Field>

                    {status === "error" ? (
                      <p role="alert" className="text-sm text-red-400">
                        {errorMessage}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-green px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Enviando…
                        </>
                      ) : (
                        "Enviar contato"
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ContactContext.Provider>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-ink/40 px-4 py-3 text-sm text-foreground placeholder:text-faint transition-colors focus:border-green focus:outline-none";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="grid gap-1.5">
      <span className="text-sm font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
