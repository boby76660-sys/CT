# 📜 Carta Web com Espelhamento em Tempo Real & Emulador de Tela

Um sistema completo de carta web interativa com painel administrativo capaz de **emular a tela exata do leitor** (dimensões, quebras de linha e posição de rolagem em pixels) em tempo real via **Firebase Realtime Database**.

---

## 🚀 Como testar agora mesmo no seu computador

Você **não** precisa configurar o Firebase para ver a mágica funcionando! O projeto possui um canal local inteligente (`BroadcastChannel` / `localStorage`) que permite testar em abas divididas:

1. Inicie um servidor local qualquer ou use `npx serve .` no terminal.
2. Abra em uma janela: `http://localhost:3000/admin.html`
3. Clique no botão **"Testar Leitor"** no topo da tela do Admin (ou abra `http://localhost:3000/index.html` em outra janela).
4. Redimensione a janela do Leitor (ex: deixe fina como a tela de um celular) e role a página.
5. Veja no **Admin**: o simulador ajusta as dimensões exatas na hora e rola de forma 100% sincronizada!

---

## 🌐 Como colocar na Internet com o Firebase (Para enviar para outra pessoa)

Para funcionar com o leitor em outro celular ou computador na internet:

### 1. Criar o Projeto no Firebase (Gratuito)
1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e clique em **"Adicionar projeto"**.
2. No menu lateral esquerdo, vá em **Criação** > **Realtime Database** e clique em **"Criar banco de dados"**.
3. Escolha o local (ex: `Estados Unidos`) e inicie em **Modo de teste**.
4. Na aba **Regras (Rules)** do Realtime Database, certifique-se de que está assim:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
5. Vá em **Configurações do Projeto** (ícone de engrenagem ⚙️) > **Geral** > Role até "Seus aplicativos" e adicione um aplicativo **Web** (`</>`).
6. Copie as credenciais do `firebaseConfig`.

### 2. Colar no projeto
Abra o arquivo `firebase-config.js` e cole as credenciais:

```javascript
export const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "seu-projeto.firebaseapp.com",
  databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## ⚡ Como Hospedar na Vercel

O projeto já está 100% pronto com `vercel.json` configurado:
* `/carta` abre a carta do leitor (`index.html`).
* `/admin` abre o painel do administrador (`admin.html`).

### Pelo Vercel CLI:
```bash
npx vercel
```

### Pelo GitHub:
1. Suba esta pasta para um repositório no seu GitHub.
2. Conecte na Vercel e clique em **Deploy** (não precisa alterar nenhuma configuração de build, é um projeto web puro).

---

## 📝 Como trocar o texto da carta

Basta abrir o arquivo `index.html`:
* Altere o título (`<h1 class="letter-title">`).
* Substitua os parágrafos dentro de `<div class="letter-body">`.
* Ajuste o nome e assinatura no rodapé (`<div class="letter-signature-script">`).

---

## 📱 Recursos implementados:
* **Emulação 1:1 de Viewport:** A tela do admin adota a largura e altura reais do leitor, garantindo que as quebras de linha fiquem rigorosamente idênticas.
* **Auto-Fit Inteligente:** Se o leitor estiver em um celular longo, o painel do Admin escala o aparelho para caber confortavelmente no seu monitor sem cortar.
* **Detecção de Aba:** Informa se o leitor saiu da aba ou minimizou o navegador.
* **Indicador de Seção Atual:** Mostra qual parágrafo ou título está centralizado na visão dele.
* **Suporte a Múltiplas Sessões:** Você pode usar o parâmetro `?session=nome` para acompanhar leitores diferentes sem conflitos.
