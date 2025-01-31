"use client";

import useMercadoPago from "./hooks/useMercadoPago";

export default function Home() {
  const { createMercadoPagoCheckout } = useMercadoPago();
  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={() =>
          createMercadoPagoCheckout({
            teste_id: "123",
            user_email: "cliente123@gmail.com",
          })
        }
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Comprar
      </button>
    </div>
  );
}
