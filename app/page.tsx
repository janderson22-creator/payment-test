"use client";

import { useEffect, useState } from "react";
import useMercadoPago from "./hooks/useMercadoPago";

export default function Home() {
  const { createMercadoPagoCheckout } = useMercadoPago();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);

  const pixPayment = () => {
    fetch("/api/mercado-pago/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testeId: "123",
        userEmail: "cliente123@gmail.com",
        transaction_amount: 1,
        payment_method: "pix",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPixCode(data.pix_code);
        setQrCodeBase64(data.qr_code_base64);
        setPaymentId(data.payment_id);
      });
  };

  useEffect(() => {
    if (!paymentId) return;

    const interval = setInterval(() => {
      fetch(`/api/mercado-pago/payment-status?payment_id=${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          setPaymentStatus(data.status);
          if (data.status === "approved") {
            setPixCode(null);
            setQrCodeBase64(null);
            clearInterval(interval);
          }
        })
        .catch((error) => console.error("Erro ao verificar status:", error));
    }, 5000);

    return () => clearInterval(interval);
  }, [paymentId]);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-6">
      <div className="flex gap-4">
        <button
          onClick={() =>
            createMercadoPagoCheckout({
              teste_id: "123",
              user_email: "cliente123@gmail.com",
              payment_method: "checkout",
            })
          }
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Pagar no Mercado Pago
        </button>

        <button
          onClick={pixPayment}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Pagar com Pix
        </button>
      </div>

      {pixCode && (
        <div className="w-6/12 bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Código Pix
          </h3>
          <textarea
            readOnly
            value={pixCode}
            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
            rows={3}
          />
        </div>
      )}

      {qrCodeBase64 && (
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            QR Code Pix
          </h3>
          <img
            src={`data:image/png;base64,${qrCodeBase64}`}
            alt="QR Code Pix"
            className="w-40 h-40 rounded-md shadow-md"
          />
        </div>
      )}

      {paymentStatus === "approved" && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mt-4">
          ✅ Pagamento aprovado! Obrigado pela compra.
        </div>
      )}

      {paymentStatus === "rejected" && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg mt-4">
          ❌ Pagamento recusado. Tente novamente.
        </div>
      )}
    </div>
  );
}
