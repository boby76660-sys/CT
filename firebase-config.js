/**
 * CONFIGURAÇÃO DO FIREBASE REALTIME DATABASE
 * 
 * Para conectar ao seu Firebase:
 * 1. Acesse https://console.firebase.google.com/
 * 2. Crie um projeto e adicione um app Web (</>).
 * 3. Vá em "Realtime Database" no menu lateral e clique em "Criar banco de dados".
 * 4. Em "Regras" do Realtime Database, para testes iniciais, você pode definir:
 *    {
 *      "rules": {
 *        ".read": true,
 *        ".write": true
 *      }
 *    }
 * 5. Substitua as credenciais abaixo pelas do seu projeto.
 * 
 * NOTA: Se você ainda não configurou as chaves, o sistema usará automaticamente
 * um canal local (BroadcastChannel) permitindo testar em abas separadas no mesmo navegador!
 */

export const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Verifica se as chaves reais foram inseridas
export function isFirebaseConfigured() {
  return (
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("SUA_API_KEY") &&
    firebaseConfig.databaseURL &&
    !firebaseConfig.databaseURL.includes("SEU_PROJETO")
  );
}
