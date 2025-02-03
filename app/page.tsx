"use client";

import { useEffect, useState } from "react";
import useMercadoPago from "./hooks/useMercadoPago";

export default function Home() {
  const { createMercadoPagoCheckout } = useMercadoPago();

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  // 🔹 Estados para armazenar os dados do Pix
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("✅ Conexão WebSocket estabelecida!");
    };

    socket.onmessage = (event) => {
      console.log("📩 Mensagem recebida:", event.data);
      const data = JSON.parse(event.data);

      if (data.status === "approved") {
        setPaymentStatus("✅ Pagamento Aprovado!");
      }
    };

    socket.onerror = (error) => {
      console.error("❌ Erro no WebSocket:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

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
        setPixCode(data.pix_code); // Código Pix Copia e Cola
        setQrCodeBase64(data.qr_code_base64); // QR Code Base64
      });
  };

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

      {paymentStatus && (
        <div className="text-green-600 font-semibold text-lg">
          {paymentStatus}
        </div>
      )}

      {/* 🔹 Exibição do Código Pix e QR Code */}
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
    </div>
  );
}
