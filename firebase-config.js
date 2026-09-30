/**
 * CONFIGURAÇÃO DO FIREBASE REALTIME DATABASE
 */

export const firebaseConfig = {
  databaseURL: "https://webct-8eec6-default-rtdb.firebaseio.com",
  projectId: "webct-8eec6"
};

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.databaseURL &&
    firebaseConfig.databaseURL.startsWith("https://")
  );
}
