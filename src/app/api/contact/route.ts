import { NextResponse } from "next/server";

/**
 * Recebe leads B2B do formulário "Entre em contato".
 *
 * Por enquanto valida e registra o lead no log do servidor. A entrega por
 * e-mail (transacional) será plugada depois — o ponto de integração está
 * isolado em `deliverLead` para não tocar no restante do fluxo.
 */

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  product?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { message: "Requisição inválida." },
      { status: 400 },
    );
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";

  if (name.length < 2) {
    return NextResponse.json(
      { message: "Informe seu nome." },
      { status: 422 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { message: "Informe um e-mail válido." },
      { status: 422 },
    );
  }

  const lead = {
    name,
    email,
    company: body.company?.trim() ?? "",
    product: body.product?.trim() ?? "",
    message: body.message?.trim() ?? "",
    receivedAt: new Date().toISOString(),
  };

  await deliverLead(lead);

  return NextResponse.json({ ok: true }, { status: 200 });
}

type Lead = {
  name: string;
  email: string;
  company: string;
  product: string;
  message: string;
  receivedAt: string;
};

/**
 * Ponto de integração de entrega do lead.
 * TODO: plugar envio transacional (e-mail) quando o remetente for configurado.
 */
async function deliverLead(lead: Lead): Promise<void> {
  // eslint-disable-next-line no-console
  console.info("[codexa] novo lead B2B:", lead);
}
