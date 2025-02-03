"use strict";

import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

console.log("🔌 Servidor WebSocket iniciado na porta 8080!");

wss.on("connection", (ws) => {
  console.log("✅ Cliente conectado ao WebSocket!");

  ws.on("message", (message) => {
    console.log(`📩 Mensagem recebida do cliente: ${message}`);
  });

  ws.on("close", () => {
    console.log("❌ Cliente desconectado.");
  });
});

// type data = {
//   status: string;
//   paymentId: number;
// };
// Função para enviar notificações a todos os clientes conectados
export function broadcast(data) {
  console.log("📢 Enviando atualização via WebSocket:", data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}
