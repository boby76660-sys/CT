import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';

let broadcastChannel = null;

// Canal local para redundância em mesma máquina
try {
  if (typeof BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel('carta_telemetry_channel');
  }
} catch (e) {}

/**
 * Throttle para manter 60fps fluido sem sobrecarregar a rede
 */
export function throttle(func, limit = 80) {
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
 * Identifica o trecho da carta em foco no centro da tela
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
        textSnippet: el.innerText.trim().slice(0, 75) + (el.innerText.length > 75 ? '...' : ''),
        tag: el.tagName.toLowerCase()
      };
    }
  });

  return activeElement;
}

/**
 * Inicia o rastreamento SILENCIOSO na página do LEITOR
 */
export function startReaderTracking(sessionId) {
  const isFb = isFirebaseConfigured();
  const dbUrl = isFb ? firebaseConfig.databaseURL.replace(/\/$/, '') : null;

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
        timestamp: Date.now()
      }
    };
  }

  const enviar = throttle(async () => {
    const payload = coletarDados();

    // 1. Canal local
    if (broadcastChannel) {
      try { broadcastChannel.postMessage({ type: 'READER_UPDATE', payload }); } catch (e) {}
    }
    try {
      localStorage.setItem('carta_last_payload_' + sessionId, JSON.stringify(payload));
    } catch (e) {}

    // 2. Firebase Realtime Database
    if (dbUrl) {
      try {
        fetch(`${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/reader.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(() => {});
      } catch (e) {}
    }
  }, 40);

  // Função de envio instantâneo sem throttle (vital para quando o app é minimizado no celular)
  function enviarImediato(customOnline, customTabActive) {
    const payload = coletarDados();
    if (typeof customOnline === 'boolean') payload.isOnline = customOnline;
    if (typeof customTabActive === 'boolean') payload.isTabActive = customTabActive;

    // 1. Canal local
    if (broadcastChannel) {
      try { broadcastChannel.postMessage({ type: 'READER_UPDATE', payload }); } catch (e) {}
    }
    try {
      localStorage.setItem('carta_last_payload_' + sessionId, JSON.stringify(payload));
    } catch (e) {}

    // 2. Firebase com prioridade do SO via keepalive
    if (dbUrl) {
      try {
        fetch(`${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/reader.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(() => {});
      } catch (e) {}
    }
  }

  // Escuta o scroll contínuo com throttle de 40ms
  window.addEventListener('scroll', enviar, { passive: true });
  window.addEventListener('resize', enviar, { passive: true });

  // Disparo imediato SEM THROTTLE ao minimizar, alternar aba ou trocar de app
  document.addEventListener('visibilitychange', () => {
    enviarImediato(true, !document.hidden);
  });

  window.addEventListener('blur', () => {
    // No celular, ao arrastar para ir para a Home ou alternar apps, o 'blur' dispara antes
    enviarImediato(true, false);
  });

  window.addEventListener('focus', () => {
    // Ao voltar para o navegador, reativa o status ao vivo na mesma hora
    enviarImediato(true, true);
  });

  window.addEventListener('pagehide', () => {
    enviarImediato(true, false);
  });

  // Desconexão total ao fechar aba
  window.addEventListener('beforeunload', () => {
    enviarImediato(false, false);
  });

  // Envio inicial imediato
  enviarImediato(true, !document.hidden);
}

/**
 * Inicia a escuta em tempo real no ADMIN
 */
export function startAdminListening(sessionId, onUpdate) {
  const isFb = isFirebaseConfigured();
  const dbUrl = isFb ? firebaseConfig.databaseURL.replace(/\/$/, '') : null;

  // 1. Escuta local via BroadcastChannel
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', (event) => {
      if (event.data && event.data.payload && event.data.payload.sessionId === sessionId) {
        onUpdate(event.data.payload, 'Local (Broadcast)');
      }
    });
  }

  // 2. Escuta via EventSource (SSE) direto do Firebase Realtime Database
  if (dbUrl) {
    try {
      const sseUrl = `${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/reader.json`;
      const eventSource = new EventSource(sseUrl);

      eventSource.addEventListener('put', (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.path === '/' && parsed.data) {
            onUpdate(parsed.data, 'Firebase Realtime');
          } else if (parsed && parsed.data && typeof parsed.data === 'object') {
            onUpdate(parsed.data, 'Firebase Realtime');
          }
        } catch (e) {}
      });

      eventSource.addEventListener('patch', (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.data) {
            onUpdate(parsed.data, 'Firebase Realtime');
          }
        } catch (e) {}
      });

      eventSource.onerror = () => {
        // EventSource nativo reconecta automaticamente
      };
    } catch (e) {
      console.warn('Erro ao conectar EventSource Firebase:', e);
    }
  }

  // 3. Fallback inicial de leitura em cache
  try {
    const saved = localStorage.getItem('carta_last_payload_' + sessionId);
    if (saved) {
      onUpdate(JSON.parse(saved), 'Cache');
    }
  } catch (e) {}
}
