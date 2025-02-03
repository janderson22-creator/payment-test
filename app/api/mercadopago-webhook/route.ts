// app/api/mercadopago-webhook/route.js

import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient, { verifyMercadoPagoSignature } from "@/app/lib/mercado-pago";
import { handleMercadoPagoPayment } from "@/app/server/mercado-pago/handle-payment";

export async function POST(request: Request) {
  try {
    verifyMercadoPagoSignature(request);

    const body = await request.json();

    // if (body.action === "payment.updated" && body.data.status === "approved") {
    //   // 🔹 Enviar notificação para o front-end via WebSocket
    //   broadcast({ status: "approved", paymentId: body.data.id });
    // }

    const { type, data } = body;

    if (type === "payment") {
      const payment = new Payment(mpClient);
      const paymentData = await payment.get({ id: data.id });

      if (paymentData.status === "approved") {
        // paymentData.date_approved !== null
        console.log(`💰 Pagamento aprovado! DADOS: ${paymentData}`);
        await handleMercadoPagoPayment(paymentData);
      }
    } else {
      console.log("Unhandled event type:", type);
    }

    // if(type === 'subscription_preapproval') {
    //   Eventos de assinatura
    //    console.log("Subscription preapproval event");
    //    console.log(data);
    //    break;
    // }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
