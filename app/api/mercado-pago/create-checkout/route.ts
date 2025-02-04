import { NextRequest, NextResponse } from "next/server";
import { Preference, Payment } from "mercadopago";
import mpClient from "@/app/lib/mercado-pago";

export async function POST(req: NextRequest) {
  const { testeId, userEmail, transaction_amount, payment_method } =
    await req.json();

  try {
    if (payment_method === "pix") {
      const payment = new Payment(mpClient);
      const createdPayment = await payment.create({
        body: {
          transaction_amount,
          description: "Pagamento via Pix",
          payment_method_id: "pix",
          payer: { email: userEmail },
        },
      });

      // 🔹 Verifica se 'point_of_interaction' está presente antes de acessar as propriedades
      const pointOfInteraction = createdPayment.point_of_interaction;
      if (!pointOfInteraction || !pointOfInteraction.transaction_data) {
        throw new Error("Erro ao obter os dados do Pix");
      }

      return NextResponse.json({
        pix_code: pointOfInteraction.transaction_data.qr_code,
        qr_code_base64: pointOfInteraction.transaction_data.qr_code_base64,
        payment_id: createdPayment.id,
      });
    } else {
      const preference = new Preference(mpClient);

      const createdPreference = await preference.create({
        body: {
          external_reference: testeId, // IMPORTANTE: Isso aumenta a pontuação da sua integração com o Mercado Pago - É o id da compra no nosso sistema
          metadata: {
            testeId, // O Mercado Pago converte para snake_case, ou seja, testeId vai virar teste_id
            // userEmail: userEmail,
            // plan: '123'
            //etc
          },
          ...(userEmail && {
            payer: {
              email: userEmail,
            },
          }),

          items: [
            {
              id: "id-do-seu-produto",
              description: "Descrição do produto",
              title: "Nome do produto",
              quantity: 1,
              unit_price: 1.0,
              currency_id: "BRL",
              category_id: "category", // Recomendado inserir, mesmo que não tenha categoria - Aumenta a pontuação da sua integração com o Mercado Pago
            },
          ],
          payment_methods: {
            // Descomente para desativar métodos de pagamento
            //   excluded_payment_methods: [
            //     {
            //       id: "bolbradesco",
            //     },
            //     {
            //       id: "pec",
            //     },
            //   ],
            //   excluded_payment_types: [
            //     {
            //       id: "debit_card",
            //     },
            //     {
            //       id: "credit_card",
            //     },
            //   ],
            installments: 12, // Número máximo de parcelas permitidas - calculo feito automaticamente
          },
          auto_return: "approved",
          back_urls: {
            success: `${req.headers.get("origin")}/?status=sucesso`,
            failure: `${req.headers.get("origin")}/?status=falha`,
            pending: `${req.headers.get("origin")}/api/mercado-pago/pending`, // Criamos uma rota para lidar com pagamentos pendentes
          },
        },
      });

      if (!createdPreference.id) {
        throw new Error("No preferenceID");
      }

      return NextResponse.json({
        preferenceId: createdPreference.id,
        initPoint: createdPreference.init_point,
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
