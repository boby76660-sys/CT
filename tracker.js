import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';

let firebaseApp = null;
let firebaseDb = null;
let realtimeRef = null;
let broadcastChannel = null;

// Inicializa canal local para testes imediatos sem Firebase configurado
try {
  if (typeof BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel('carta_telemetry_channel');
  }
} catch (e) {}

/**
 * Inicializa a conexão com o Firebase (ou ativa o modo fallback local)
 */
export async function setupFirebase() {
  const configured = isFirebaseConfigured();
  if (configured) {
    try {
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js');
      const { getDatabase, ref, set, onValue, onDisconnect, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js');
      
      firebaseApp = initializeApp(firebaseConfig);
      firebaseDb = getDatabase(firebaseApp);
      return { isFirebase: true, db: firebaseDb, ref, set, onValue, onDisconnect, serverTimestamp };
    } catch (err) {
      return { isFirebase: false, error: err };
    }
  }
  return { isFirebase: false, error: 'Chaves do Firebase não configuradas. Usando simulação local.' };
}

/**
 * Utilitário de throttle para não inundar conexões no scroll rápido
 */
export function throttle(func, limit = 100) {
  let inThrottle = false;
  let lastArgs = null;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func.apply(this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * Determina o parágrafo ou cabeçalho mais próximo do centro da visão do leitor
 */
export function getActiveSectionInfo() {
  const paragraphs = document.querySelectorAll('.letter-body p, .letter-body blockquote, .letter-section-title');
  const viewportCenter = window.scrollY + (window.innerHeight / 2);
  let activeElement = null;
  let minDistance = Infinity;

  paragraphs.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    const elementCenter = window.scrollY + rect.top + (rect.height / 2);
    const dist = Math.abs(viewportCenter - elementCenter);
    if (dist < minDistance) {
      minDistance = dist;
      activeElement = {
        index: index + 1,
        total: paragraphs.length,
        textSnippet: el.innerText.trim().slice(0, 70) + (el.innerText.length > 70 ? '...' : ''),
        tag: el.tagName.toLowerCase()
      };
    }
  });

  return activeElement;
}

/**
 * Inicia o rastreador na página do LEITOR
 */
export async function startReaderTracking(sessionId, onLogMessage) {
  const fb = await setupFirebase();

  function coletarDados() {
    const maxY = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const percent = Math.min(100, Math.max(0, Math.round((scrollY / maxY) * 100)));

    return {
      sessionId,
      isOnline: true,
      isTabActive: !document.hidden,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        availWidth: window.screen ? window.screen.availWidth : window.innerWidth,
        availHeight: window.screen ? window.screen.availHeight : window.innerHeight,
        dpr: window.devicePixelRatio || 1
      },
      scroll: {
        y: Math.round(scrollY),
        maxY: Math.round(maxY),
        percent
      },
      activeSection: getActiveSectionInfo(),
      meta: {
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }
    };
  }

  const enviar = throttle(async () => {
    const payload = coletarDados();

    // 1. Envia via BroadcastChannel / localStorage para testes locais
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type: 'READER_UPDATE', payload });
      } catch (e) {}
    }
    try {
      localStorage.setItem('carta_last_payload_' + sessionId, JSON.stringify(payload));
    } catch (e) {}

    // 2. Envia via Firebase se configurado
    if (fb.isFirebase && fb.db) {
      try {
        const { ref, set } = fb;
        await set(ref(fb.db, `sessoes/${sessionId}/reader`), payload);
      } catch (err) {}
    }

    if (onLogMessage) {
      onLogMessage(payload);
    }
  }, 100);

  // Configura presença online/offline no Firebase
  if (fb.isFirebase && fb.db) {
    try {
      const { ref, onDisconnect } = fb;
      const statusRef = ref(fb.db, `sessoes/${sessionId}/reader/isOnline`);
      const disconnectRef = ref(fb.db, `sessoes/${sessionId}/reader/disconnectedAt`);
      onDisconnect(statusRef).set(false);
      onDisconnect(disconnectRef).set(Date.now());
    } catch (e) {}
  }

  // Escuta os eventos no leitor
  window.addEventListener('scroll', enviar, { passive: true });
  window.addEventListener('resize', enviar, { passive: true });
  document.addEventListener('visibilitychange', enviar);
  window.addEventListener('beforeunload', () => {
    const payload = coletarDados();
    payload.isOnline = false;
    payload.disconnectedAt = Date.now();
    if (broadcastChannel) {
      try { broadcastChannel.postMessage({ type: 'READER_DISCONNECT', payload }); } catch (e) {}
    }
  });

  // Envio imediato da primeira leitura
  enviar();

  return { isFirebase: fb.isFirebase };
}

/**
 * Inicia o ouvinte no painel do ADMIN
 */
export async function startAdminListening(sessionId, onUpdate) {
  const fb = await setupFirebase();

  // 1. Escuta via BroadcastChannel (local)
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', (event) => {
      if (event.data && event.data.payload && event.data.payload.sessionId === sessionId) {
        onUpdate(event.data.payload, 'Local (BroadcastChannel)');
      }
    });
  }

  // Escuta via storage event (para abas diferentes no mesmo domínio)
  window.addEventListener('storage', (e) => {
    if (e.key === 'carta_last_payload_' + sessionId && e.newValue) {
      try {
        const data = JSON.parse(e.newValue);
        onUpdate(data, 'Local (StorageEvent)');
      } catch (err) {}
    }
  });

  // Verifica se já havia algo gravado recentemente
  try {
    const saved = localStorage.getItem('carta_last_payload_' + sessionId);
    if (saved) {
      onUpdate(JSON.parse(saved), 'Local (Cache)');
    }
  } catch (e) {}

  // 2. Escuta via Firebase Realtime Database
  if (fb.isFirebase && fb.db) {
    const { ref, onValue } = fb;
    const sessionRef = ref(fb.db, `sessoes/${sessionId}/reader`);
    onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        onUpdate(data, 'Firebase Realtime');
      }
    });
  }

  return { isFirebase: fb.isFirebase };
}
