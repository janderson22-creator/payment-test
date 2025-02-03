// app/api/mercadopago-webhook/route.js

// import { NextResponse } from "next/server";
// import { Payment } from "mercadopago";
// import mpClient, { verifyMercadoPagoSignature } from "@/app/lib/mercado-pago";
// import { handleMercadoPagoPayment } from "@/app/server/mercado-pago/handle-payment";

import { broadcast } from "@/app/lib/websocket.mjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log(body, "ESSE É O NOVO EVENTO");

    // Verifica se o evento recebido é uma atualização de pagamento
    if (body.action === "payment.updated" && body.data.status === "approved") {
      console.log(`💰 Pagamento aprovado! ID: ${body.data.id}`);

      // 🔹 Enviar notificação para o front-end via WebSocket
      broadcast({ status: "approved", paymentId: body.data.id });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erro no Webhook:", error);
    return NextResponse.json({ error: "Falha no webhook" }, { status: 500 });
  }
}

// export async function POST(request: Request) {
//   try {
//     verifyMercadoPagoSignature(request);

//     const body = await request.json();

//     const { type, data } = body;

//     switch (type) {
//       case "payment":
//         const payment = new Payment(mpClient);
//         const paymentData = await payment.get({ id: data.id });
//         if (
//           paymentData.status === "approved" || // Pagamento por cartão OU
//           paymentData.date_approved !== null // Pagamento por Pix
//         ) {
//           await handleMercadoPagoPayment(paymentData);
//         }
//         break;
//       // case "subscription_preapproval": Eventos de assinatura
//       //   console.log("Subscription preapproval event");
//       //   console.log(data);
//       //   break;
//       default:
//         console.log("Unhandled event type:", type);
//     }

//     return NextResponse.json({ received: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error handling webhook:", error);
//     return NextResponse.json(
//       { error: "Webhook handler failed" },
//       { status: 500 }
//     );
//   }
// }
