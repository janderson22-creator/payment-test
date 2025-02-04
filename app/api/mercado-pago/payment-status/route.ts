import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient from "@/app/lib/mercado-pago";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("payment_id");

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: paymentId });

    return NextResponse.json({ status: paymentData.status }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar status do pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao verificar status" },
      { status: 500 }
    );
  }
}
