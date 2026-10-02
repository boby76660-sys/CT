import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';

/**
 * Conteúdo padrão da carta (usado como modelo inicial)
 */
export const DEFAULT_LETTER_BLOCKS = [
  {
    id: 'b1',
    type: 'paragraph',
    text: 'Há momentos na cadência dos dias em que as horas parecem suspensas por um fio invisível de calmaria. Escrevo-lhe não pela urgência das notícias do mundo exterior, mas pela necessidade sutil de ancorar pensamentos que, de outro modo, evaporariam na bruma do esquecimento. Enquanto as sombras se alongam suavemente pelo assoalho de madeira, percebo que certas palavras só ganham vida quando encontram a paciência de quem sabe escutar.'
  },
  {
    id: 'b2',
    type: 'photo',
    src: 'images/photo-1.jpg',
    alt: 'Foto colada',
    caption: 'Fim de tarde na praia',
    position: 'photo-left',
    angle: -2.8,
    tape: 'tape-top'
  },
  {
    id: 'b3',
    type: 'paragraph',
    text: 'O silêncio que acompanha esta escrita não é vazio; é antes uma tela clara sobre a qual todas as inquietações humanas se revelam com uma nitidez quase desconcertante. Costumamos acreditar que o tempo é um rio contínuo e impassível, fluindo sempre na mesma direção com a indiferença das grandes correntes. No entanto, nas esquinas secretas da memória, descobrimos que o tempo é muito mais uma tapeçaria circular, onde o passado, o presente e o que ainda há de vir se tocam e se influenciam mutuamente.'
  },
  {
    id: 'b4',
    type: 'paragraph',
    text: 'Lembro-me das noites de vigília em que observávamos a marcha das constelações pela abóbada escura. Cada estrela que nos enviava seu vislumbre já havia, talvez, deixado de existir há milênios, e mesmo assim sua luz persistia em nos guiar, cruzando abismos incomensuráveis apenas para encontrar nossos olhos curiosos. Não é essa, afinal, a mesma magia que habita cada frase registrada em uma página? Um pensamento nascido no recôndito de uma mente que viaja no espaço para desabrochar no peito de quem lê.'
  },
  {
    id: 'b5',
    type: 'paragraph',
    text: 'Vivemos perseguindo a firmeza dos monumentos e a solidez das promessas inabaláveis. Erguemos castelos de lógica na tentativa de domar a imponderabilidade do destino, como se pudéssemos traçar linhas retas num oceano revolto. Mas quanto mais avançamos, mais evidente se torna que a beleza da existência reside justamente em sua vulnerabilidade intrínseca.'
  },
  {
    id: 'b6',
    type: 'photo',
    src: 'images/photo-2.jpg',
    alt: 'Foto colada',
    caption: 'Aquele café da tarde',
    position: 'photo-right',
    angle: 3.2,
    tape: 'tape-double'
  },
  {
    id: 'b7',
    type: 'paragraph',
    text: 'As árvores que sobrevivem às tempestades de inverno não são as mais rígidas ou austeras, mas aquelas que aceitam dobrar seus ramos sob a fúria do vento. Há uma nobreza profunda na flexibilidade do espírito. Quando nos desarmamos da vaidade de controlar cada desfecho, permitimos que a vida nos surpreenda com caminhos que nossa imaginação limitada jamais ousaria arquitetar.'
  },
  {
    id: 'b8',
    type: 'paragraph',
    text: 'Veja, por exemplo, o ritmo das estações. As folhas de outono não resistem à gravidade; elas se desprendem com uma elegância que parece mais um voo do que uma queda. Sabem que o repouso no solo úmido é o prelúdio silencioso do renascimento na primavera seguinte. Por que, então, relutamos tanto diante dos términos inevitáveis que pontuam nossas trajetórias? Cada adeus carrega a semente adormecida de um novo começo.'
  },
  {
    id: 'b9',
    type: 'paragraph',
    text: 'Costuma-se dizer que os lugares onde fomos felizes guardam fragmentos perpétuos de nossa alma. Acredito que os lugares são testemunhas silenciosas; são as pessoas com quem compartilhamos o pão, as risadas e o pranto que consagram as pedras e as janelas com significado imortal. O valor das coisas terrenas não repousa em sua substância, mas na ressonância que produzem em nós.'
  },
  {
    id: 'b10',
    type: 'photo',
    src: 'images/photo-1.jpg',
    alt: 'Foto colada',
    caption: 'O horizonte que sempre esteve lá',
    position: 'photo-center',
    angle: -1.0,
    tape: 'tape-top'
  },
  {
    id: 'b11',
    type: 'paragraph',
    text: 'Reflita sobre os diálogos que moldaram seu caráter. Raras vezes foram os discursos inflamados ou as teorias rebuscadas que lhe deram coragem nos momentos de desespero; quase invariavelmente, foi a frase despretensiosa de um companheiro leal, dita à meia-luz, enquanto o café esfriava sobre a mesa. A sabedoria mais genuína costuma sussurrar, dispensando o alarido das trombetas.'
  },
  {
    id: 'b12',
    type: 'paragraph',
    text: 'Ao contemplarmos o horizonte que se avizinha, é natural que sintamos o peso da expectativa. O amanhã nos desafia com suas perguntas ainda não formuladas, cobrando decisões para as quais nem sempre nos sentimos preparados. Contudo, quero lembrá-lo de que ninguém caminha senão um passo de cada vez. O fardo do ano inteiro se torna intolerável se tentarmos carregá-lo num único dia de angústia.'
  },
  {
    id: 'b13',
    type: 'paragraph',
    text: 'Cultive a paciência para com seus próprios processos de maturação. O vinho mais refinado não apressa seu tempo nas barricas de carvalho, e a pérola exige anos de paciente clausura na ostra antes de exibir seu brilho iridescente. Por que exigir de si mesmo a perfeição instantânea que a própria natureza recusa a todas as suas criaturas?'
  },
  {
    id: 'b14',
    type: 'paragraph',
    text: 'Permita-se errar sem carregar a culpa como um grilhão de ferro. O erro nada mais é do que a bússola recalibrando a rota rumo à maturidade. Quem nunca tropeçou nas pedras do caminho jamais conheceu a alegria redentora de se reerguer com os olhos fixos na alvorada.'
  },
  {
    id: 'b15',
    type: 'paragraph',
    text: 'Guarde estas palavras como quem guarda uma folha seca entre as páginas de um volume antigo. Não pretendo que elas sejam mandamentos ou dogmas, mas simples lanternas dispostas ao longo de uma vereda escura, lembrando-lhe de que, por mais solitária que pareça a estrada, outros já passaram por aqui e deixaram pequenos rastros de calor e companheirismo.'
  },
  {
    id: 'b16',
    type: 'paragraph',
    text: 'Que a serenidade acompanhe seus passos nas horas claras e que a esperança seja seu escudo quando o crepúsculo trouxer o manto das dúvidas. O mundo continuará girando com sua pressa insaciável, mas você tem o poder soberano de escolher quando pausar, respirar fundo e honrar o milagre singular de estar vivo.'
  },
  {
    id: 'b17',
    type: 'reply_box',
    label: 'Deixe suas palavras para quem escreveu',
    placeholder: 'Escreva aqui o que sentiu ao ler esta carta...',
    buttonText: 'Enviar Resposta'
  }
];

/**
 * Escapa strings para inserção segura no HTML
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Garante que a lista de blocos possua um campo de resposta se ainda não tiver
 */
function ensureReplyBox(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return blocks;
  const hasReply = blocks.some(b => b.type === 'reply_box');
  if (!hasReply) {
    blocks.push({
      id: 'reply_' + Date.now(),
      type: 'reply_box',
      label: 'Deixe suas palavras para quem escreveu',
      placeholder: 'Escreva aqui o que sentiu ao ler esta carta...',
      buttonText: 'Enviar Resposta'
    });
  }
  return blocks;
}

/**
 * Converte dados de blocos do Firebase para Array seguro (trata tanto arrays quanto objetos indexados)
 */
export function normalizeBlocks(data) {
  if (!data) return null;
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    const keys = Object.keys(data).filter(k => !isNaN(parseInt(k, 10))).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    if (keys.length > 0) {
      return keys.map(k => data[k]);
    }
  }
  return null;
}

/**
 * Renderiza os blocos da carta no elemento DOM fornecido
 * Preserva o texto digitado pelo leitor no campo de resposta, seleção do cursor e status de envio
 */
export function renderLetterBlocks(blocks, container) {
  if (!container || !Array.isArray(blocks) || blocks.length === 0) return;

  const finalBlocks = ensureReplyBox(blocks);
  const newSignature = JSON.stringify(finalBlocks);

  // Se o conteúdo da carta for estritamente o mesmo já renderizado, evita refazer o DOM
  if (container._renderedSignature === newSignature) {
    return;
  }

  // 1. Preserva o estado do campo de resposta digitado pelo leitor
  const existingTa = container.querySelector('#letterReplyTextarea');
  const existingBtnSend = container.querySelector('#btnSendReply');
  const existingBtnEdit = container.querySelector('#btnEditReply');
  const existingMsgSuccess = container.querySelector('#replySuccessMessage');

  let preservedReply = null;
  if (existingTa) {
    preservedReply = {
      value: existingTa.value,
      isReadOnly: existingTa.readOnly || existingTa.hasAttribute('readonly'),
      selectionStart: existingTa.selectionStart,
      selectionEnd: existingTa.selectionEnd,
      hasFocus: document.activeElement === existingTa,
      isSendDisabled: existingBtnSend ? existingBtnSend.disabled : false,
      isSentClass: existingBtnSend ? existingBtnSend.classList.contains('sent') : false,
      btnSendText: existingBtnSend ? (existingBtnSend.querySelector('.btn-send-text')?.textContent || '') : '',
      isEditDisabled: existingBtnEdit ? existingBtnEdit.disabled : true,
      isSuccessVisible: existingMsgSuccess ? (existingMsgSuccess.style.display !== 'none') : false
    };
  }

  const html = finalBlocks.map(block => {
    if (block.type === 'paragraph') {
      const text = escapeHtml(block.text || '');
      return `<p>${text}</p>`;
    } else if (block.type === 'photo') {
      const posClass = block.position || 'photo-center';
      const tapeClass = block.tape === 'tape-double' 
        ? 'tape-double' 
        : (block.tape === 'tape-none' ? 'tape-none' : '');
      const angle = (block.angle !== undefined && block.angle !== null && block.angle !== '') 
        ? `${block.angle}deg` 
        : '0deg';
      const caption = block.caption 
        ? `<figcaption class="photo-caption">${escapeHtml(block.caption)}</figcaption>` 
        : '';
      const src = block.src || 'images/photo-1.jpg';
      const alt = escapeHtml(block.alt || 'Foto colada');
      return `
        <figure class="taped-photo ${posClass} ${tapeClass}" style="--angle: ${angle};">
          <img src="${src}" alt="${alt}">
          ${caption}
        </figure>
      `;
    } else if (block.type === 'reply_box') {
      const label = block.label !== undefined ? block.label : 'Deixe suas palavras para quem escreveu';
      const placeholder = block.placeholder !== undefined ? block.placeholder : 'Escreva aqui o que sentiu ao ler esta carta...';
      const buttonText = block.buttonText || 'Enviar Resposta';
      return `
        <div class="letter-reply-container" id="replyContainer">
          ${label ? `<label class="letter-reply-label" for="letterReplyTextarea"><span class="reply-pen-icon">✍️</span> ${escapeHtml(label)}</label>` : ''}
          <textarea id="letterReplyTextarea" class="letter-reply-textarea" placeholder="${escapeHtml(placeholder)}" rows="5"></textarea>
          <div class="letter-reply-footer">
            <span class="letter-reply-hint">Suas palavras são guardadas com carinho.</span>
            <div class="reply-actions-row">
              <button type="button" id="btnEditReply" class="btn-edit-reply" disabled title="Editar resposta">
                <span class="btn-edit-icon">✏️</span>
                <span class="btn-edit-text">Editar</span>
              </button>
              <button type="button" id="btnSendReply" class="btn-send-reply">
                <span class="btn-send-icon">💌</span>
                <span class="btn-send-text">${escapeHtml(buttonText)}</span>
              </button>
            </div>
          </div>
          <div id="replySuccessMessage" class="reply-success-message" style="display: none;">
            <span class="reply-success-icon">✓</span>
            <div class="reply-success-content">
              <strong>Sua resposta foi enviada com sucesso!</strong>
              <span>Obrigado por responder com tanto carinho. Suas palavras foram entregues.</span>
            </div>
          </div>
        </div>
      `;
    }
    return '';
  }).join('\n');

  container.innerHTML = html;
  container._renderedSignature = newSignature;

  // 2. Restaura estado do campo de resposta
  const newTa = container.querySelector('#letterReplyTextarea');
  const newBtnSend = container.querySelector('#btnSendReply');
  const newBtnEdit = container.querySelector('#btnEditReply');
  const newMsgSuccess = container.querySelector('#replySuccessMessage');

  if (preservedReply) {
    if (newTa) {
      if (preservedReply.value !== undefined) {
        newTa.value = preservedReply.value;
      }
      if (preservedReply.isReadOnly) {
        newTa.setAttribute('readonly', 'true');
        newTa.readOnly = true;
      }
      if (preservedReply.hasFocus) {
        try {
          newTa.focus();
          if (preservedReply.selectionStart !== null && preservedReply.selectionEnd !== null) {
            newTa.setSelectionRange(preservedReply.selectionStart, preservedReply.selectionEnd);
          }
        } catch (e) {}
      }
    }

    if (newBtnSend) {
      if (preservedReply.isSentClass) {
        newBtnSend.classList.add('sent');
        newBtnSend.disabled = true;
      } else if (preservedReply.isSendDisabled) {
        newBtnSend.disabled = true;
      }
      if (preservedReply.btnSendText) {
        const textSpan = newBtnSend.querySelector('.btn-send-text');
        if (textSpan) textSpan.textContent = preservedReply.btnSendText;
      }
    }

    if (newBtnEdit && preservedReply.isEditDisabled !== undefined) {
      newBtnEdit.disabled = preservedReply.isEditDisabled;
    }

    if (newMsgSuccess && preservedReply.isSuccessVisible) {
      newMsgSuccess.style.display = 'flex';
    }
  }

  // Notifica o window de que novos blocos foram renderizados (para recalibrar seções se necessário)
  try {
    window.dispatchEvent(new CustomEvent('letter_blocks_rendered', { detail: { blocks: finalBlocks } }));
  } catch (e) {}
}

/**
 * Carrega o conteúdo da carta de forma resiliente:
 * 1. Cache instantâneo no localStorage
 * 2. Atualização via Firebase Realtime Database
 * 3. Fallback para os blocos padrão
 */
export async function loadLetterContent(sessionId) {
  let local = null;
  const sessionKey = 'ct_letter_content_' + sessionId;
  const defaultKey = 'ct_letter_content_default';

  try {
    const raw = localStorage.getItem(sessionKey) || localStorage.getItem(defaultKey);
    if (raw) local = JSON.parse(raw);
  } catch (e) {}

  if (isFirebaseConfigured()) {
    const dbUrl = firebaseConfig.databaseURL.replace(/\/$/, '');
    try {
      const resp = await fetch(`${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/letter_content.json?t=${Date.now()}`);
      if (resp.ok) {
        const data = await resp.json();
        const norm = normalizeBlocks(data);
        if (norm && norm.length > 0) {
          const finalData = ensureReplyBox(norm);
          try {
            localStorage.setItem(sessionKey, JSON.stringify(finalData));
          } catch(e) {}
          return finalData;
        }
      }

      // Se a sessão específica não tem conteúdo personalizado, tenta o default
      const defaultResp = await fetch(`${dbUrl}/letter_content_default.json?t=${Date.now()}`);
      if (defaultResp.ok) {
        const defaultData = await defaultResp.json();
        const normDef = normalizeBlocks(defaultData);
        if (normDef && normDef.length > 0) {
          const finalDefault = ensureReplyBox(normDef);
          try {
            localStorage.setItem(defaultKey, JSON.stringify(finalDefault));
          } catch(e) {}
          return finalDefault;
        }
      }
    } catch (e) {
      console.warn('Aviso: Falha ao sincronizar com Firebase, usando cache local:', e);
    }
  }

  return (Array.isArray(local) && local.length > 0) ? ensureReplyBox(local) : DEFAULT_LETTER_BLOCKS;
}

/**
 * Inicia a escuta em tempo real do conteúdo da carta:
 * 1. Firebase Realtime Database SSE (EventSource) para atualizações instantâneas cross-device
 * 2. BroadcastChannel para sincronização instantânea entre abas no mesmo navegador
 * 3. Evento 'storage' do window para suporte a múltiplas abas locais
 * 4. Polling inteligente e reconexão automática ao acordar o celular (visibilitychange / focus)
 *
 * @param {string} sessionId
 * @param {function(blocks: Array): void} onUpdate
 * @returns {function(): void} cleanup function
 */
export function startLetterContentListening(sessionId, onUpdate) {
  if (typeof onUpdate !== 'function') return () => {};

  let isStopped = false;
  let currentJson = '';
  let eventSourceSession = null;
  let pollTimer = null;

  function handleNewBlocks(blocks, source) {
    if (isStopped || !Array.isArray(blocks) || blocks.length === 0) return;
    const finalBlocks = ensureReplyBox(blocks);
    const jsonStr = JSON.stringify(finalBlocks);
    if (jsonStr === currentJson) return;

    currentJson = jsonStr;
    const sessionKey = 'ct_letter_content_' + sessionId;
    try {
      localStorage.setItem(sessionKey, jsonStr);
    } catch (e) {}

    onUpdate(finalBlocks);
  }

  // 1. BroadcastChannel (mesmo navegador, tabs diferentes)
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('carta_telemetry_channel');
      bc.onmessage = (e) => {
        if (e.data && e.data.type === 'LETTER_CONTENT_UPDATED' && Array.isArray(e.data.blocks)) {
          if (!e.data.sessionId || e.data.sessionId === sessionId) {
            handleNewBlocks(e.data.blocks, 'BroadcastChannel');
          }
        }
      };
    }
  } catch (e) {}

  // 2. Storage event (fallback para abas no mesmo navegador)
  window.addEventListener('storage', (e) => {
    if (e.key === 'ct_letter_content_' + sessionId || e.key === 'ct_letter_content_default') {
      if (e.newValue) {
        try {
          const blocks = JSON.parse(e.newValue);
          handleNewBlocks(blocks, 'StorageEvent');
        } catch (err) {}
      }
    }
  });

  // 3. Firebase Realtime Database SSE (cross-device: PC -> Celular)
  if (isFirebaseConfigured()) {
    const dbUrl = firebaseConfig.databaseURL.replace(/\/$/, '');
    const sseUrl = `${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/letter_content.json`;

    function connectSSE() {
      if (isStopped) return;
      if (eventSourceSession) {
        try { eventSourceSession.close(); } catch (e) {}
        eventSourceSession = null;
      }

      try {
        eventSourceSession = new EventSource(sseUrl);

        eventSourceSession.addEventListener('put', (e) => {
          try {
            const parsed = JSON.parse(e.data);
            if (!parsed) return;
            let blocksData = null;
            if (parsed.path === '/' || parsed.path === '') {
              blocksData = parsed.data;
            }
            if (blocksData) {
              const blocks = normalizeBlocks(blocksData);
              if (blocks && blocks.length > 0) {
                handleNewBlocks(blocks, 'Firebase SSE');
              }
            } else if (parsed.path === '/' && parsed.data === null) {
              checkFirebaseDefaultDirectly();
            }
          } catch (err) {
            console.warn('Erro ao processar SSE da carta:', err);
          }
        });

        eventSourceSession.onerror = () => {
          // EventSource tenta reconectar nativamente
        };
      } catch (e) {
        console.warn('Erro ao inicializar EventSource da carta:', e);
      }
    }

    connectSSE();

    // 4. Verificação periódica e reconexão (resiliência para celular / lock screen)
    async function checkFirebaseDirectly() {
      if (isStopped || document.hidden) return;
      try {
        const resp = await fetch(`${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/letter_content.json?t=${Date.now()}`);
        if (resp.ok) {
          const data = await resp.json();
          const blocks = normalizeBlocks(data);
          if (blocks && blocks.length > 0) {
            handleNewBlocks(blocks, 'DirectPollSession');
            return;
          }
        }
        await checkFirebaseDefaultDirectly();
      } catch (e) {}
    }

    async function checkFirebaseDefaultDirectly() {
      if (isStopped) return;
      try {
        const resp = await fetch(`${dbUrl}/letter_content_default.json?t=${Date.now()}`);
        if (resp.ok) {
          const data = await resp.json();
          const blocks = normalizeBlocks(data);
          if (blocks && blocks.length > 0) {
            handleNewBlocks(blocks, 'DirectPollDefault');
          }
        }
      } catch (e) {}
    }

    // Polling a cada 3.5 segundos quando a tela estiver visível
    pollTimer = setInterval(checkFirebaseDirectly, 3500);

    // Quando o leitor reabre o navegador ou desbloqueia o celular
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        checkFirebaseDirectly();
        if (!eventSourceSession || eventSourceSession.readyState === EventSource.CLOSED) {
          connectSSE();
        }
      }
    });

    window.addEventListener('focus', () => {
      checkFirebaseDirectly();
      if (!eventSourceSession || eventSourceSession.readyState === EventSource.CLOSED) {
        connectSSE();
      }
    });
  }

  return function stop() {
    isStopped = true;
    if (eventSourceSession) {
      try { eventSourceSession.close(); } catch (e) {}
      eventSourceSession = null;
    }
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  };
}

/**
 * Salva o conteúdo da carta tanto no Firebase quanto no localStorage e notifica abas abertas
 */
export async function saveLetterContent(sessionId, blocks) {
  if (!Array.isArray(blocks)) return false;

  const sessionKey = 'ct_letter_content_' + sessionId;
  const defaultKey = 'ct_letter_content_default';
  const raw = JSON.stringify(blocks);

  // 1. Salva localmente
  try {
    localStorage.setItem(sessionKey, raw);
    localStorage.setItem(defaultKey, raw);
  } catch (e) {
    console.warn('Aviso: localStorage quota ou indisponível:', e);
  }

  // 2. Transmite atualização para abas abertas (BroadcastChannel)
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('carta_telemetry_channel');
      bc.postMessage({ type: 'LETTER_CONTENT_UPDATED', sessionId, blocks });
    }
  } catch (e) {}

  // 3. Salva no Firebase Realtime Database
  if (isFirebaseConfigured()) {
    const dbUrl = firebaseConfig.databaseURL.replace(/\/$/, '');
    try {
      await Promise.all([
        fetch(`${dbUrl}/sessoes/${encodeURIComponent(sessionId)}/letter_content.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: raw
        }),
        fetch(`${dbUrl}/letter_content_default.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: raw
        })
      ]);
      return true;
    } catch (e) {
      console.error('Erro ao salvar no Firebase:', e);
      return false;
    }
  }

  return true;
}

/**
 * Comprime imagens enviadas pelo usuário (celular/computador)
 * Gera um Data URL JPEG leve de ~100-250KB adequado para Firebase e localStorage
 */
export function compressImageFile(file, maxDimension = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selecione um arquivo de imagem válido.'));
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
