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
 * Gera ou recupera um clientId único para esta aba específica (mantém o mesmo se der F5)
 */
function getOrCreateClientId() {
  let id = null;
  try {
    id = sessionStorage.getItem('ct_reader_client_id');
    if (!id) {
      id = 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
      sessionStorage.setItem('ct_reader_client_id', id);
    }
  } catch (e) {
    id = 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
  }
  return id;
}

/**
 * Identifica o modelo aproximado do dispositivo para identificação no Admin
 */
function getDeviceLabel() {
  const ua = navigator.userAgent || '';
  let os = 'Dispositivo';
  if (/iPhone/i.test(ua)) os = 'iPhone';
  else if (/iPad/i.test(ua)) os = 'iPad';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Macintosh|Mac OS/i.test(ua)) os = 'Mac';
  else if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Linux/i.test(ua)) os = 'Linux';

  const w = window.innerWidth;
  const h = window.innerHeight;
  return `${os} (${w}×${h})`;
}

/**
 * Inicia o rastreamento SILENCIOSO na página do LEITOR
 */
export function startReaderTracking(sessionId) {
  const isFb = isFirebaseConfigured();
  const dbUrl = isFb ? firebaseConfig.databaseURL.replace(/\/$/, '') : null;
  const clientId = getOrCreateClientId();
  const deviceLabel = getDeviceLabel();

  function coletarDados() {
    const maxY = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const percent = Math.min(100, Math.max(0, Math.round((scrollY / maxY) * 100)));

    return {
      sessionId,
      clientId,
      deviceLabel,
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
      try {
        broadcastChannel.postMessage({ type: 'READER_UPDATE', payload, clientId });
      } catch (e) {}
    }
    try {
      localStorage.setItem('carta_client_' + sessionId + '_' + clientId, JSON.stringify(payload));
    } catch (e) {}

    // 2. Firebase Realtime Database isolado por cliente
    if (dbUrl) {
      try {
        fetch(`${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/clients/${clientId}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(() => {});
      } catch (e) {}
    }
  }, 40);

  // Envio instantâneo sem throttle (vital para eventos de visibilidade e congelamento de abas)
  function enviarImediato(customOnline, customTabActive) {
    const payload = coletarDados();
    if (typeof customOnline === 'boolean') payload.isOnline = customOnline;
    if (typeof customTabActive === 'boolean') payload.isTabActive = customTabActive;

    // 1. Canal local
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type: 'READER_UPDATE', payload, clientId });
      } catch (e) {}
    }
    try {
      localStorage.setItem('carta_client_' + sessionId + '_' + clientId, JSON.stringify(payload));
    } catch (e) {}

    // 2. Firebase isolado
    if (dbUrl) {
      try {
        fetch(`${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/clients/${clientId}.json`, {
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

  // Batimento cardíaco frequente (1s) para confirmar presença ativa
  const heartbeatTimer = setInterval(() => {
    if (!document.hidden) {
      enviarImediato(true, true);
    }
  }, 1000);

  // Disparo imediato SEM THROTTLE ao minimizar, alternar aba ou trocar de app
  document.addEventListener('visibilitychange', () => {
    enviarImediato(true, !document.hidden);
  });

  window.addEventListener('blur', () => {
    enviarImediato(true, false);
  });

  window.addEventListener('focus', () => {
    enviarImediato(true, true);
  });

  window.addEventListener('pagehide', () => {
    enviarImediato(true, false);
  });

  document.addEventListener('freeze', () => {
    enviarImediato(true, false);
  });

  // Desconexão total ao fechar aba
  window.addEventListener('beforeunload', () => {
    clearInterval(heartbeatTimer);
    enviarImediato(false, false);
  });

  // Envio inicial imediato
  enviarImediato(true, !document.hidden);
}

/**
 * Inicia a escuta em tempo real no ADMIN (com suporte a multi-abas e multi-dispositivos)
 */
export function startAdminListening(sessionId, onClientsUpdate) {
  const isFb = isFirebaseConfigured();
  const dbUrl = isFb ? firebaseConfig.databaseURL.replace(/\/$/, '') : null;
  const clientsMap = {};

  // 1. Escuta local via BroadcastChannel
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', (event) => {
      if (event.data && event.data.payload && event.data.payload.sessionId === sessionId) {
        const payload = event.data.payload;
        const cId = payload.clientId || 'local_default';
        clientsMap[cId] = {
          ...payload,
          lastPing: Date.now()
        };
        onClientsUpdate(clientsMap, 'Local (Broadcast)', cId);
      }
    });
  }

  // 2. Escuta via EventSource (SSE) direto do Firebase Realtime Database em /clients.json
  if (dbUrl) {
    try {
      const sseUrl = `${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/clients.json`;
      const eventSource = new EventSource(sseUrl);

      eventSource.addEventListener('put', (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (!parsed) return;

          if (parsed.path === '/') {
            if (parsed.data && typeof parsed.data === 'object') {
              for (const [cId, cPayload] of Object.entries(parsed.data)) {
                if (cPayload && typeof cPayload === 'object') {
                  clientsMap[cId] = {
                    ...cPayload,
                    lastPing: cPayload.meta?.timestamp || Date.now()
                  };
                }
              }
              onClientsUpdate(clientsMap, 'Firebase Realtime', null);
            }
          } else if (parsed.path && parsed.path.startsWith('/')) {
            const parts = parsed.path.split('/').filter(Boolean);
            const cId = parts[0];
            if (cId) {
              if (parts.length === 1) {
                if (parsed.data === null) {
                  delete clientsMap[cId];
                } else if (typeof parsed.data === 'object') {
                  clientsMap[cId] = {
                    ...parsed.data,
                    lastPing: parsed.data.meta?.timestamp || Date.now()
                  };
                }
              } else if (clientsMap[cId]) {
                const subProp = parts[1];
                clientsMap[cId][subProp] = parsed.data;
                clientsMap[cId].lastPing = Date.now();
              }
              onClientsUpdate(clientsMap, 'Firebase Realtime', cId);
            }
          }
        } catch (e) {
          console.warn('Erro ao processar SSE put:', e);
        }
      });

      eventSource.addEventListener('patch', (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (!parsed) return;
          const parts = (parsed.path || '').split('/').filter(Boolean);
          const cId = parts[0];
          if (cId && parsed.data && typeof parsed.data === 'object') {
            if (!clientsMap[cId]) clientsMap[cId] = {};
            Object.assign(clientsMap[cId], parsed.data);
            clientsMap[cId].lastPing = Date.now();
            onClientsUpdate(clientsMap, 'Firebase Realtime', cId);
          }
        } catch (e) {
          console.warn('Erro ao processar SSE patch:', e);
        }
      });

      eventSource.onerror = () => {
        // EventSource nativo reconecta automaticamente
      };
    } catch (e) {
      console.warn('Erro ao conectar EventSource Firebase:', e);
    }
  }

  // 3. Fallback inicial de leitura em cache local
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('carta_client_' + sessionId + '_')) {
        const item = JSON.parse(localStorage.getItem(key));
        if (item && item.clientId) {
          clientsMap[item.clientId] = { ...item, lastPing: Date.now() };
        }
      }
    }
    if (Object.keys(clientsMap).length > 0) {
      onClientsUpdate(clientsMap, 'Cache Local', null);
    }
  } catch (e) {}
}
