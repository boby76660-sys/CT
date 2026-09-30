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
 * Gera ou recupera um clientId único para este dispositivo/navegador.
 * Usa localStorage para persistir mesmo após fechar o navegador.
 * Escopado pela sessionId para não conflitar entre cartas diferentes.
 */
function getOrCreateClientId(sessionId) {
  let id = null;
  const key = 'ct_client_id_' + sessionId;
  try {
    id = localStorage.getItem(key);
    if (!id) {
      id = 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
      localStorage.setItem(key, id);
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
  const clientId = getOrCreateClientId(sessionId);
  const deviceLabel = getDeviceLabel();

  const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutos de ausência = nova sessão
  const startKey    = 'ct_reading_started_' + sessionId;
  const secsKey     = 'ct_active_secs_'    + sessionId + '_' + clientId.slice(0, 14);
  const sectionTimesKey = 'ct_section_times_' + sessionId + '_' + clientId.slice(0, 14);
  const sessionMetaKey  = 'ct_session_meta_'  + sessionId + '_' + clientId.slice(0, 14);
  const pastSessionsKey = 'ct_past_sessions_' + sessionId + '_' + clientId.slice(0, 14);

  // Leitura do estado persistido
  let sessionMeta = {};
  try { sessionMeta = JSON.parse(localStorage.getItem(sessionMetaKey) || '{}'); } catch(e) {}

  let activeReadingSeconds;
  try { activeReadingSeconds = parseInt(localStorage.getItem(secsKey) || '0', 10); } catch(e) { activeReadingSeconds = 0; }

  let sectionTimes = {};
  try { sectionTimes = JSON.parse(localStorage.getItem(sectionTimesKey) || '{}'); } catch(e) {}

  let readingStartedAt;
  try { readingStartedAt = parseInt(localStorage.getItem(startKey) || '0', 10); } catch(e) { readingStartedAt = 0; }

  let sessionNumber = sessionMeta.sessionNumber || 1;
  const lastDisconnectedAt = sessionMeta.lastDisconnectedAt || 0;

  // Detecta nova sessão: ausentou-se por mais de SESSION_TIMEOUT_MS
  const isNewSession = lastDisconnectedAt > 0 && (Date.now() - lastDisconnectedAt) > SESSION_TIMEOUT_MS;

  if (isNewSession) {
    // Arquiva a sessão anterior se tiver dados significativos
    if (activeReadingSeconds > 5) {
      let past = [];
      try { past = JSON.parse(localStorage.getItem(pastSessionsKey) || '[]'); } catch(e) {}
      past.push({
        sessionNumber,
        startedAt: readingStartedAt || lastDisconnectedAt,
        endedAt: lastDisconnectedAt,
        activeReadingSeconds,
        sectionTimes: JSON.parse(JSON.stringify(sectionTimes))
      });
      if (past.length > 20) past = past.slice(-20);
      try { localStorage.setItem(pastSessionsKey, JSON.stringify(past)); } catch(e) {}
    }

    // Reinicia contadores para nova sessão
    sessionNumber++;
    activeReadingSeconds = 0;
    sectionTimes = {};
    readingStartedAt = Date.now();
    try {
      localStorage.setItem(secsKey, '0');
      localStorage.setItem(sectionTimesKey, '{}');
      localStorage.setItem(startKey, String(readingStartedAt));
    } catch(e) {}
  } else if (!readingStartedAt) {
    readingStartedAt = Date.now();
    try { localStorage.setItem(startKey, String(readingStartedAt)); } catch(e) {}
  }

  // Persiste metadados da sessão atual
  try {
    localStorage.setItem(sessionMetaKey, JSON.stringify({ sessionNumber, lastDisconnectedAt: 0 }));
  } catch(e) {}

  // Contador de tempo ativo e por trecho
  setInterval(() => {
    if (!document.hidden) {
      activeReadingSeconds++;
      try { localStorage.setItem(secsKey, String(activeReadingSeconds)); } catch (e) {}

      const section = getActiveSectionInfo();
      if (section) {
        const sk = String(section.index);
        if (!sectionTimes[sk]) sectionTimes[sk] = { seconds: 0, snippet: section.textSnippet, tag: section.tag };
        sectionTimes[sk].seconds++;
        sectionTimes[sk].snippet = section.textSnippet;
        try { localStorage.setItem(sectionTimesKey, JSON.stringify(sectionTimes)); } catch (e) {}
      }
    }
  }, 1000);

  function getPastSessions() {
    try { return JSON.parse(localStorage.getItem(pastSessionsKey) || '[]'); } catch(e) { return []; }
  }

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
      readingStartedAt,
      activeReadingSeconds,
      sectionTimes,
      sessionNumber,
      pastSessions: getPastSessions(),
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

    // 2. Firebase Realtime Database isolado por cliente + espelho de compatibilidade
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

    // 2. Firebase isolado + espelho
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

  // Batimento cardíaco frequente para confirmar presença ativa (envia mesmo em background para não ser considerado morto)
  const heartbeatTimer = setInterval(() => {
    enviarImediato(true, !document.hidden);
  }, 2000);

  // Disparo imediato SEM THROTTLE ao minimizar, alternar aba ou trocar de app
  document.addEventListener('visibilitychange', () => {
    enviarImediato(true, !document.hidden);
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

    // Salva o momento da desconexão para detectar nova sessão no próximo acesso
    try {
      localStorage.setItem(sessionMetaKey, JSON.stringify({
        sessionNumber,
        lastDisconnectedAt: Date.now()
      }));
    } catch(e) {}

    enviarImediato(false, false);

    // Remove este cliente específico do Firebase ao fechar para não acumular
    if (dbUrl) {
      try {
        fetch(`${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/clients/${clientId}.json`, {
          method: 'DELETE',
          keepalive: true
        }).catch(() => {});
      } catch (e) {}
    }
  });

  // Envio inicial imediato
  enviarImediato(true, !document.hidden);
}

let currentAdminEventSource = null;

/**
 * Inicia a escuta em tempo real no ADMIN (com suporte a multi-abas e multi-dispositivos)
 */
export function startAdminListening(sessionId, onClientsUpdate) {
  const isFb = isFirebaseConfigured();
  const dbUrl = isFb ? firebaseConfig.databaseURL.replace(/\/$/, '') : null;
  const clientsMap = {};

  if (currentAdminEventSource) {
    try { currentAdminEventSource.close(); } catch (e) {}
    currentAdminEventSource = null;
  }

  // 1. Escuta local via BroadcastChannel
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', (event) => {
      if (event.data && event.data.payload && event.data.payload.sessionId === sessionId) {
        const payload = event.data.payload;
        const cId = payload.clientId || 'local_default';
        clientsMap[cId] = {
          ...payload,
          lastReceivedAt: Date.now()
        };
        onClientsUpdate(clientsMap, 'Local (Broadcast)', cId);
      }
    });
  }

  // 2. Escuta via EventSource (SSE) direto do Firebase na sessão inteira (/sessoes/{sessionId}.json)
  if (dbUrl) {
    try {
      const sseUrl = `${dbUrl}/sessoes/${encodeURIComponent(sessionId)}.json`;
      const eventSource = new EventSource(sseUrl);
      currentAdminEventSource = eventSource;

      eventSource.addEventListener('put', (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (!parsed) return;
          const now = Date.now();

          // Snapshot raiz da sessão inteira: { clients: {...}, reader: {...} }
          if (parsed.path === '/') {
            if (parsed.data && typeof parsed.data === 'object') {
              if (parsed.data.clients && typeof parsed.data.clients === 'object') {
                for (const [cId, cPayload] of Object.entries(parsed.data.clients)) {
                  if (cPayload && typeof cPayload === 'object') {
                    const prev = clientsMap[cId];
                    const clientTime = (cPayload.meta && cPayload.meta.timestamp) || 0;
                    // Se o pacote tem menos de 60 segundos de idade em relação ao now local:
                    const age = Math.abs(now - clientTime);
                    const isRecent = age < 60000;
                    const lastRecv = (prev && prev.lastReceivedAt) ? prev.lastReceivedAt : (isRecent ? now : (now - 60000));
                    let userAction = now;
                    if (prev && prev.scroll && cPayload.scroll) {
                      const diff = Math.abs(cPayload.scroll.y - prev.scroll.y);
                      userAction = (diff >= 3 || cPayload.isScrollEvent) ? now : (prev.lastUserActionAt || (now - 30000));
                    }
                    clientsMap[cId] = {
                      ...cPayload,
                      lastReceivedAt: lastRecv,
                      lastUserActionAt: userAction
                    };
                  }
                }
              }
              // Sincroniza também com parsed.data.reader
              if (parsed.data.reader && typeof parsed.data.reader === 'object') {
                const r = parsed.data.reader;
                const cId = r.clientId || 'default_reader';
                const clientTime = (r.meta && r.meta.timestamp) || 0;
                const isRecent = Math.abs(now - clientTime) < 60000;
                if (!clientsMap[cId]) {
                  clientsMap[cId] = {
                    ...r,
                    lastReceivedAt: isRecent ? now : (now - 60000),
                    lastUserActionAt: now
                  };
                }
              }
              onClientsUpdate(clientsMap, 'Firebase Realtime', null);
            }
          } else if (parsed.path && parsed.path.startsWith('/clients/')) {
            const parts = parsed.path.split('/').filter(Boolean); // ['clients', 'cId', ...]
            const cId = parts[1];
            if (cId) {
              if (parts.length === 2) {
                if (parsed.data === null) {
                  delete clientsMap[cId];
                } else if (typeof parsed.data === 'object') {
                  const prev = clientsMap[cId];
                  let userAction = now;
                  if (prev && prev.scroll && parsed.data.scroll) {
                    const diff = Math.abs(parsed.data.scroll.y - prev.scroll.y);
                    userAction = (diff >= 3 || parsed.data.isScrollEvent) ? now : (prev.lastUserActionAt || (now - 30000));
                  }
                  clientsMap[cId] = {
                    ...parsed.data,
                    lastReceivedAt: now,
                    lastUserActionAt: userAction
                  };
                }
              } else if (clientsMap[cId]) {
                const subProp = parts[2];
                clientsMap[cId][subProp] = parsed.data;
                clientsMap[cId].lastReceivedAt = now;
                if (subProp === 'scroll') {
                  clientsMap[cId].lastUserActionAt = now;
                }
              }
              onClientsUpdate(clientsMap, 'Firebase Realtime', cId);
            }
          } else if (parsed.path === '/reader' && parsed.data && typeof parsed.data === 'object') {
            const r = parsed.data;
            const cId = r.clientId || 'default_reader';
            const prev = clientsMap[cId];
            let userAction = now;
            if (prev && prev.scroll && r.scroll) {
              const diff = Math.abs(r.scroll.y - prev.scroll.y);
              userAction = (diff >= 3) ? now : (prev.lastUserActionAt || (now - 30000));
            }
            clientsMap[cId] = {
              ...(clientsMap[cId] || {}),
              ...r,
              lastReceivedAt: now,
              lastUserActionAt: userAction
            };
            onClientsUpdate(clientsMap, 'Firebase Realtime', cId);
          }
        } catch (e) {
          console.warn('Erro ao processar SSE put:', e);
        }
      });

      eventSource.addEventListener('patch', (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (!parsed) return;
          const now = Date.now();
          const parts = (parsed.path || '').split('/').filter(Boolean);

          if (parts[0] === 'clients' && parts[1]) {
            const cId = parts[1];
            if (!clientsMap[cId]) clientsMap[cId] = {};
            const prevScroll = clientsMap[cId].scroll;
            Object.assign(clientsMap[cId], parsed.data);
            clientsMap[cId].lastReceivedAt = now;
            if (parsed.data.scroll && prevScroll) {
              if (Math.abs(parsed.data.scroll.y - prevScroll.y) >= 3) {
                clientsMap[cId].lastUserActionAt = now;
              }
            }
            onClientsUpdate(clientsMap, 'Firebase Realtime', cId);
          } else if (parts[0] === 'reader' && parsed.data && typeof parsed.data === 'object') {
            const cId = parsed.data.clientId || 'default_reader';
            if (!clientsMap[cId]) clientsMap[cId] = {};
            Object.assign(clientsMap[cId], parsed.data);
            clientsMap[cId].lastReceivedAt = now;
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
          clientsMap[item.clientId] = { ...item, lastReceivedAt: Date.now() };
        }
      }
    }
    if (Object.keys(clientsMap).length > 0) {
      onClientsUpdate(clientsMap, 'Cache Local', null);
    }
  } catch (e) {}
}
