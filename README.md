# Next.js + Mercado Pago Payment Integration

Este projeto é uma aplicação Next.js que integra o Mercado Pago para processar pagamentos via **Checkout Pro** e **Checkout Transparente com Pix**. Ele permite que os usuários realizem pagamentos e visualizem o status do pagamento diretamente na interface.

## 🚀 Funcionalidades

- **Checkout Pro**: Redireciona o usuário para o site do Mercado Pago para completar o pagamento.
- **Checkout Transparente com Pix**: Gera um código Pix **Copia e Cola** e um **QR Code** para pagamento direto.
- **Atualização Automática**: Após a conclusão do pagamento, o usuário recebe uma mensagem de confirmação.

## 📌 Tecnologias Utilizadas

- **Next.js** (App Router)
- **TypeScript**
- **Mercado Pago SDK**
- **Ngrok** (para Webhooks em ambiente local)

---

## 🔧 Configuração e Uso

### 1️⃣ **Instalar dependências**

Antes de começar, instale as dependências do projeto:

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 2️⃣ **Configurar variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto e adicione as credenciais do Mercado Pago:

```env
MERCADO_PAGO_ACCESS_TOKEN=SEU_ACCESS_TOKEN
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=SUA_PUBLIC_KEY
MERCADO_PAGO_WEBHOOK_SECRET=SUA_WEBHOOK_SECRET
```

> **Observação:** Substitua os valores acima pelas credenciais da sua conta Mercado Pago.

### 3️⃣ **Executar o servidor de desenvolvimento**

Inicie o servidor Next.js:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### 4️⃣ **Configurar Webhooks com Ngrok**

O Mercado Pago não envia Webhooks para `localhost`, então é necessário utilizar o **Ngrok**:

1. Instale o Ngrok (caso ainda não tenha):
   ```bash
   npm install -g ngrok
   ```
2. Inicie o Ngrok apontando para a porta do Next.js:
   ```bash
   ngrok http 3000
   ```
3. Copie a URL gerada pelo Ngrok (exemplo: `https://random-ngrok-url.ngrok.io`).
4. Configure essa URL nos Webhooks do Mercado Pago.

### 5️⃣ **Testando os Pagamentos**

#### 🔹 **Pagamento via Checkout Pro**

1. Clique no botão **"Pagar no Mercado Pago"**.
2. O usuário será redirecionado para o Mercado Pago para finalizar o pagamento.
3. Após a conclusão, o status será atualizado automaticamente.

#### 🔹 **Pagamento via Pix (Checkout Transparente)**

1. Clique no botão **"Pagar com Pix"**.
2. O código **Pix Copia e Cola** e o **QR Code** aparecerão na tela.
3. Pague via aplicativo bancário.
4. O sistema verificará automaticamente o pagamento e exibirá a mensagem de confirmação.

---

## 🛠 Estrutura do Projeto

```bash
📂 app/
 ├── api/
 │   ├── mercadopago-webhook/   # Webhook para capturar pagamentos
 │   ├── mercadopago-checkout/  # Criar checkout Pix e Checkout Pro
 │   ├── payment-status/        # Endpoint para verificar status do pagamento
 ├── lib/
 │   ├── mercado-pago.ts        # Configuração do Mercado Pago SDK
 ├── server/
 │   ├── mercado-pago/handle-payment.ts # Lógica de processamento do pagamento
 ├── hooks/
 │   ├── useMercadoPago.ts      # Hook para integração com Mercado Pago no frontend
 ├── page.tsx                   # Tela principal com botões de pagamento
```

---

## 🚀 **Deploy**

A maneira mais fácil de fazer o deploy deste projeto é utilizando a **Vercel**:

```bash
vercel deploy
```

Certifique-se de configurar corretamente as **variáveis de ambiente** na Vercel.

---

## 📖 **Recursos Úteis**

- [Documentação Oficial do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)
- [Webhooks do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/pagos/webhooks)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ngrok](https://ngrok.com/)

---

## 📝 **Licença**

Este projeto é open-source e está disponível sob a licença MIT.

---

💡 **Dúvidas?** Abra uma issue no repositório! 🚀
