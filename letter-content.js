import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';

/**
 * Conteúdo padrão da carta (usado como modelo inicial)
 */
export const DEFAULT_LETTER_BLOCKS = [
  {
    "id": "p_1790969848672_0",
    "text": "Oi vih",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_1",
    "text": "Quanto tempo.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_2",
    "text": "Talvez ache estranho receber uma mensagem minha agora, mas é q resolvi escrever um pouco sobre o q ficou preso aqui comigo. Pode até achar graça de eu estar mandando isso, achar ridículo ou até raiva, mas to mostrando do mesmo jeito. É só um desabafo meu. N quero me intrometer na sua vida, reabrir nada, criar algum contato entre a gente e nem te deixar desconfortável, mas gostaria que vc lesse, pq são coisas que eu precisava colocar pra fora desde muito tempo. Se preferir n receber isso, pode só fechar e ignorar, sem problema. N to te mandando isso esperando uma resposta, mas se depois de ler quiser responder alguma coisa, eu gostaria muito de te ouvir. Só de eu conseguir falar um pouco já me dá um alívio.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_3",
    "text": "Quero ser sincero sobre tudo. Pode ser que esse texto n faça sentido algum, pode ser que tenha contradições ou talvez vc nem queira saber do que se trata, mas quero pôr pra fora tudo que precisava desde nosso último contato.\nN to tentando reabrir nosso passado com isso e n quero q faça nada, só preciso ter uma \"conversa\" que a gente nunca teve e que ficou faltando.\nEu tentei me enganar até hoje de q nosso passado foi só mais uma história q ficou pra trás, mas aquilo não terminou como deveria e virou uma sombra pra mim q me atormenta todo dia. N quero arrumar nada, só quero colocar um fim naquilo.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_4",
    "text": "Quero falar com a mulher q vc é hoje, mesmo n te conhecendo mais.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_5",
    "text": "Naquela época eu n tinha noção do quão importante vc tava sendo pra mim e de quanto aquilo tudo ajudaria a me tornar quem eu sou agora. Te conhecer foi uma benção q tive na vida e q agradeço por ter acontecido. Depois daquele dia eu me senti desejado pela primeira vez, me senti atraído de verdade por alguém pela primeira vez e comecei uma história pela primeira vez. Tudo mudou depois daquilo.\nEu passei a ter um lugar de paz quando minha casa parecia uma cadeia, tive muita aventura, tive sensação de liberdade, tive uma intimidade que provavelmente nunca vou ter igual, me senti acolhido, podia ser quem eu era de verdade, comecei a viver. Vc foi a primeira pessoa com quem senti de verdade o amor, o prazer, a ânsia, a adrenalina e a vontade de ter uma vida. Com vc tive meu primeiro olhar profundo, primeiro amor, primeira relação, primeira intimidade, primeiros problemas e primeiras experiências. Senti pela primeira vez o que é ser amado e q eu podia ser alguém q mais ninguém conhecia.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_6",
    "text": "Eu tive medo de tudo, mas procurava em vc uma saída, uma liberdade q era importante pra eu poder ser quem eu era. Eu acreditava q te amar iria me trazer a paz q precisava, e trouxe por um tempo. A gente só n tava pronto pra isso. Eu pelo menos pude me conhecer, pude saber q eu era capaz de fazer qualquer coisa por alguém q eu amava e por quem me importava.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_7",
    "text": "Hoje eu te agradeço por ter estado do meu lado sempre quando precisei, por ter entendido quem eu era, por ter confiado em mim e eu em vc, por ter dividido uma fase da vida em q nós dois estávamos crescendo, por ter me dado a vida q eu n teria vivido e por ter me amado.\nMas também n foi perfeito. Ciúmes, chantagem, controle, inseguranças, muita briga, atitudes q machucavam, coisas q planejávamos melhorar, coisas que n chegamos a melhorar. Isso nem só eu, nem só vc, mas a gente. A gente era imaturo e orgulhoso demais pra aprender certas coisas ainda, e essa era a nossa primeira bagagem da vida, sem experiência alguma. Nos machucamos muito e aprendemos com isso. Quando percebi que começamos a criar maturidade e aprender com os erros, eu já tava no meu limite, n podia fingir q aguentava mais.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_8",
    "text": "Eu realmente te amava, amava uma das pessoas mais importantes da minha vida. N digo agora, mas sim quando a gente tava junto. Naquela época, eu faria qualquer absurdo pra estar com vc e mostrar q te amava, suportaria até n aguentar mais, já imaginava o futuro q a gente teria e n tinha medo de correr atrás dele, era o q mais importava pra mim. Isso tudo foi verdade. Inventava qualquer motivo pra conseguir te ver, lutava pra ter a gente junto. Vc precisa saber q aquilo tudo foi real pra mim.\nSei q vc pensava q era simplesmente a gente se encontrar, mas o esforço que eu fazia pra isso, pra manter a gente de pé e manter nossa vida funcionando, eu até hoje nunca fiz igual pra mais nada. Dava tudo de mim pra fazer dar certo, em momento bom ou ruim.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_9",
    "text": "Quero q vc saiba q sempre me importei em estar ao seu lado. Eu n queria ser só seu namorado, mas sim a pessoa em quem você poderia confiar a vida pra qualquer coisa q fosse. Eu me importava e queria ser sua família, seu conforto. Eu sofria seu sofrimento e sentia em dobro sua felicidade. Eu ainda n sei colocar em palavras oq foi estar com vc nas suas fases mais difíceis, mas tudo q eu quis era te dar a paz q vc merece. Eu senti sua tristeza, sua ansiedade, sua dor, seu medo e seu luto. Aquilo tudo me mudou como pessoa.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_10",
    "text": "Eu n acabei com tudo pq deixei de te amar e me preocupar com vc. Eu tava exausto, cansado de viver duas vidas, de mentir, de fingir q tava tudo normal, de ter q lutar pra poder fazer coisas simples, de perder a confiança dentro de casa. Eu tava me perdendo, perdendo amizades, perdendo a escola, perdendo a cabeça e perdendo a vida. Eu n dei conta de resolver a minha vida enquanto me entregava pro nosso relacionamento. N conseguia mais engolir o orgulho pra ver vc sorrir de novo. N passávamos uma semana sem confusão e eu n tinha mais força pra tentar. Eu acordava e dormia pensando se eu deveria me privar da vida e manter a rotina ou me doar pra vc. Quando eu pensava em terminar com tudo, eu chorava e sentia minha vida perdendo o sentido. Quando eu pensava em continuar, eu n conseguia imaginar até quando eu iria aguentar as duas vidas, aquele esforço. Eu só precisava respirar, precisava de um tempo pra mim, de n ter que ouvir nem agradar ninguém, de n ter que machucar ninguém com as minhas escolhas.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_11",
    "text": "Eu queria tempo pra mim, tempo q nunca tive.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_12",
    "text": "Eu nem sei oq era pra ter sido esse tempo q eu tanto queria. Talvez seria pra n dar satisfação a mais ninguém, pra tirar um tempo pra mim, pra dormir tranquilo, pra voltar a ter amizades, pra ter uma vida normal, pra sentir q ninguém dependia de mim, pra poder ter condições de pensar oq seria melhor pra gente ou talvez só n queria tomar nenhuma decisão por algum tempo.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_13",
    "text": "Eu só queria descansar daquele peso q carregava o tempo inteiro, eu queria voltar mais tarde pra ter uma conclusão. Eu queria pensar se continuava ou se n continuava, se tinha algum outro jeito de resolver. Queria ter outra conversa. Eu fugi, te magoei, te disse q era o fim, mas eu me enganei, te enganei e n consegui ter a resposta q queria. Eu quis voltar, talvez pra tentar mais uma vez ou até q fosse pra ter a última conversa, mas tudo acabou sem resposta, num vazio e sem sinal de nada. Quero ser sincero com vc, aquilo n era pra ser o final de tudo.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_14",
    "text": "Depois, a vida seguiu sem que a gente tivesse escolha. Antes mesmo de eu conseguir respirar, pensar e decidir qualquer coisa, comecei uma vida q parecia completamente diferente, com outra pessoa. Eu me desesperei tanto q n me dei limites pra ter meu próprio tempo e processar o q tava acontecendo, e até hoje pago o preço por n ter respirado um pouco. Isso é difícil de escrever. Eu senti alívio quando entrei numa nova vida, liberdade, mas também medo e muita culpa.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_15",
    "text": "Sinto muito em ter ignorado suas mensagens. Sinto muito em n ter conversado mais uma vez. Sinto muito se te deixei com alguma esperança, eu tbm tinha uma, mesmo fingindo q n. Me dói muito saber q talvez te deixei esperando uma conversa que eu também esperava. Sinto muito por ter feito vc acreditar em algo q n era real.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_16",
    "text": "Eu n te peço desculpas por eu n ter aguentado, por ter ido até meu limite, por ter precisado de um tempo, mas peço desculpas pela forma q eu decidi tentar resolver isso.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_17",
    "text": "Lembro muito da gente. Olhando hoje, a gente foi 2 crianças imaturas tentando levar um relacionamento q precisava de muita maturidade pra funcionar. Era grande demais pra gente. Talvez a gente tenha aprendido muito com isso. Talvez agora a gente saiba conversar, controlar ciúmes, reconhecer nossos erros, engolir o orgulho, respeitar limites e valorizar o poder da escolha.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_18",
    "text": "Mudei muito. Vc conheceu uma versão de mim q n existe mais, essa q aprendeu com os erros. Tenho maturidade, respeito, compromisso, aprendi a lidar com problemas, trabalho, estudo. Mudei meu jeito de agir, de pensar, de ouvir mais do que falar. Eu vou bem, muito bem, mas o passado ainda me dói. Ainda n consegui processar tudo q aconteceu.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_19",
    "text": "Do mesmo jeito eu conheci vc daquela época, aquela pessoa q vc foi. Me incomoda um pouco ter na cabeça só o vc de antes, sem saber nada de quem vc se tornou. N sei quem é vc hoje.\nQueria saber um pouco de vc. N para entrar na sua vida, mas pq vc foi uma pessoa tão importante na minha q é estranho pensar q hoje eu só conheço uma lembrança sua e mais nada.\nEu gostaria de saber como vc ta. Oq viveu depois de mim. Oq vc lembra daquela época. Oq vc pensa hoje sobre tudo aquilo. Se ficou com raiva de mim, se me perdoou, se alguma coisa ficou sem resposta para vc também.\nN precisa responder tudo isso. Nem precisa responder nada. Eu só queria q, pela primeira vez, vc tivesse a oportunidade de me falar, e eu ouvir, o q ficou do seu lado dessa história.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_20",
    "text": "Pensando hoje, é até engraçado lembrar de quem a gente era. A gente achava q sabia de tudo, fazia planos enormes, brigava por umas coisas completamente nada a ver e ao mesmo tempo achava q tava vivendo o maior problema do mundo. A gente era muito novo kkkkk. Tinha coisa q hoje eu olho e penso \"pqp, como q eu tinha coragem de fazer isso?\". E acho q é justamente isso q faz essas lembranças tão boas. Eu n sinto vergonha de ter sido aquela pessoa. Eu só era eu naquela época, aprendendo tudo pela primeira vez",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_21",
    "text": "N vou negar, desde o fim minha mente acaba voltando pro passado. Procuro por vc em casa, nos lugares. Acabo indo atrás de notícias suas pra preencher esse vazio q ficou no tempo. Te procuro na galeria, na internet, na rua. Às vezes visito alguns lugares q a gente já viveu. N pra continuar oq acabou, mas pra procurar algum sentido em tudo, pra voltar nas boas memórias, pra saber como vc ta, pra saber se vc ta bem.\nSendo sincero, é estranho. Olho sua foto de perfil de mês em mês procurando novidade. Às vezes procuro alguma postagem sua. Algumas poucas vezes vi seu rosto ali. Lembrei de vc, imaginei como estaria, mas nada parecia me responder. Ainda n entendia q a vida continuou, q vc é outra pessoa, q eu mudei e q aquilo acabou. Eu percebi q n precisava só saber como vc ta, eu precisava desabafar, precisava dizer tudo q nunca consegui antes, precisava aceitar q tudo mudou. E o q mais dói em mim é q eu precisava colocar um ponto final no q nunca teve um fim. Nossa história teve um começo, um meio, uma aventura, uma evolução, um cansaço, um tempo, mas n teve um fim, só um momento eterno de pouca esperança q nunca teve resposta.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_22",
    "text": "Mas n lembro só de coisa ruim. Às vezes lembro de um monte de coisa boba que a gente viveu. Era cada coisa que a gente arrumava né. Lembra daquela vez que vc tava doida pra comer um temaki frito q viu no tiktok? Quando finalmente compramos, o temaki parecia ter sido fritado no óleo mais velho do mundo, e seu irmão ainda teve a coragem de me ajudar a comer aquilo. E quando a gente matou aula pra ficar o dia todo la no clube, lembra? Voltei pra casa todo queimado e qual a melhor desculpa que eu arrumei? \"Não pai, eu fiquei muito no sol com os meninos lá na escola\", como se fizesse algum sentido eu estar queimado de sol no meio de um dia de aula kkkk. Hoje eu penso nisso e só consigo rir da nossa inteligência naquela época. Lembra também da vez que entrei escondido na sua casa e sua vó reparou? Fui inventar de esconder naquele beco do lado da sua casa achando que era o melhor lugar de todos, e pro meu azar bati de frente com ela na escada de cima kkkk. Tenho um monte de lembraça besta assim da gente q pego pensando às vezes. Lembro da vez que nós dois, pelados, decidimos fazer um mousse de morango na minha casa. Também das vezes que a gente tinha q segurar a risada no banho quando alguém chegava de surpresa na sua casa. E o dia que seu irmão quebrou o braço e ficamos quem nem bobos na chuva. A gente era só 2 adolescentes fazendo merda e vivendo a vida.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_23",
    "text": "Apesar de tudo, foi uma época muito boa da minha vida",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_24",
    "text": "Foi justamente quando consegui olhar pra nossa história desse jeito que minha ficha caiu sobre o quanto a sua vida continuou. Pra minha surpresa, vc teve um filho. Vc agora é mãe e tem uma família. Pode ser absurdo e até engraçado, mas a primeira coisa q pensei foi na possibilidade de ser meu, mas o tempo n fez sentido. Talvez eu até desejasse isso, mas também torcia pra q fosse mentira, só um engano. Depois tentei engolir a seco essa bomba, mas n deu certo. N fiz parte dessa história e esse susto me fez perceber q o tempo passou e tudo acabou mesmo, mesmo com uma esperança vagando por aí, sem nunca ter tido um fim de verdade. O tempo só passou. Choro igual criança, choro demais mesmo, a garganta trava. N sei oq senti quando vi seu bebê. N sei se é saudade da nossa época, se foi o fato de eu n ter nada a ver com isso, se foi ver meu antigo sonho sendo realizado por outra pessoa, se foi o choque de realidade ou se a confirmação de q tudo acabou e q eu ainda n tinha aceitado. Por mais doloroso q seja, meu sofrimento agora tem um prazo. Finalmente consegui entender q tudo passou e q a vida continua. Foi um choque q eu n esperava ter tão cedo, mas q eu torcia pra acontecer uma hora e n sabia como seria. Fico imaginando quem é vc hoje, como é sua vida, se vc mudou. Fico pensando no que aconteceu depois de mim, se me odeia, se lembra de mim, se entendeu pq eu fui embora, se acha q fui babaca, se me perdoou, se acha q te amei de verdade, se acha q te abandonei. Oq eu poderia ter feito diferente? Vc também achou que teria mais alguma conversa? Admito q hoje, mesmo depois de muito tempo, senti uma pontada de ciúmes, mesmo n tendo mais amor, vínculo com vc e nem interesse em voltar atrás. Dói sim imaginar vc se entregando pra outra pessoa, dando prazer pra outra pessoa, tendo uma família com outra pessoa.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_25",
    "text": "Falando com você de quase 2 anos atrás:\nEu n te abandonei. Eu n te descartei. Vc n deixou de ser importante. Eu n terminei pq vc n era suficiente. Eu n terminei por qualquer insegurança sua. Eu n terminei pq tinha deixado de te amar. Eu só tava tentando arrumar forças pra tentar resolver, precisava de um tempo pra pensar. Eu nunca tive esse tempo e n resolvi nada.\nPor mais q eu tenha insistido pra vc q era o fim, eu n sabia q aquilo seria nossa última conversa, nosso último abraço, nosso último olhar. Eu achei q iríamos conversar mais uma vez, nem que fosse pra despedida e término de tudo. Eu n sabia q, ignorando aquelas mensagens, eu tava fechando uma porta q nunca mais seria aberta.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_26",
    "text": "Sua vida n é mais responsabilidade minha, eu n quero mais carregar a angústia de imaginar se vc ficou bem depois de mim, queria poder n sofrer pra te esquecer. Mas ficam comigo as lembranças de tudo q tivemos, as experiências, a intimidade, os erros, o amadurecimento, a parte de vc q ficou em mim e a parte da minha adolescência q foi nossa. Eu n quero apagar vc da minha cabeça, só quero q a gente fique como passado, aprendizado e uma parte da minha vida q fez quem eu sou hoje, q n volta mais.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_27",
    "text": "Entrei agora na parte de finalmente aceitar q nunca vou saber como seria o final daquilo. Eu agradeço por tudo, tudo q a gente viveu, inclusive as coisas ruins. Sem vc eu n seria quem eu sou hoje.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_28",
    "text": "Nossa história acabou naquele último dia q nos vimos, mas só agora to aceitando isso. N foi como eu queria, como vc queria, mas foi como foi. Era pra ter acontecido pelo menos uma última despedida de verdade.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_29",
    "text": "Acho engraçado pensar q naquela época eu achava q aquelas coisas iam durar pra sempre. Hoje eu sei q n. A gente cresceu, mudou, tomou caminhos diferentes e criou vidas q nenhum dos dois imaginava naquela época. E acho q tudo bem né. Talvez uma das coisas mais bonitas de crescer seja perceber q algumas pessoas n precisam continuar na nossa vida pra continuarem sendo importantes na história dela.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_30",
    "text": "Enfim, depois de escrever um texto desse tamanho, acho q já deu pra perceber q eu tinha coisa demais entalada kkkkk. Se eu tivesse falado tudo isso naquela época, provavelmente a gente teria ficado horas conversando e no final ainda ia sair sem saber oq fazer.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_31",
    "text": "Eu espero de coração q vc esteja bem e feliz. Te desejo tudo q tem de melhor no mundo. Eu fico muito feliz mesmo pela sua nova vida, seu filho, e torço pra q vc sempre consiga tudo q deseja. Eu n sou seu inimigo. Sinto muito por tudo.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_32",
    "text": "Eu n quero voltar atrás, n quero recomeçar nada, n quero entrar na sua vida e n quero q essa mensagem abra qualquer tipo de contato entre a gente. Só precisava finalmente falar tudo isso e colocar um ponto final no que ficou sem fim. Se vc quiser me responder, eu vou gostar muito de te ouvir, mas n precisa.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_33",
    "text": "Tenha uma ótima vida, e eu vou vivendo a minha também.",
    "type": "paragraph"
  },
  {
    "id": "p_1790969848672_34",
    "text": "Eu te amei muito Vih",
    "type": "paragraph"
  },
  {
    "buttonText": "Enviar Resposta",
    "id": "reply_1790965157276",
    "label": "Deixe suas palavras para quem escreveu",
    "placeholder": "Escreva aqui o que sentiu ao ler esta carta...",
    "type": "reply_box"
  }
]

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
      const text = escapeHtml(block.text || '').replace(/\r\n|\r|\n/g, '<br>');
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
            <div class="reply-actions-row">
              <button type="button" id="btnEditReply" class="btn-edit-reply" disabled title="Editar resposta">
                <span class="btn-edit-text">Editar</span>
              </button>
              <button type="button" id="btnSendReply" class="btn-send-reply">
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
        if (textSpan) textSpan.textContent = preservedReply.btnSendText.replace(/^[✓\s]+/, '');
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
/**
 * Retorna os blocos salvos no cache local de forma estritamente síncrona (0ms)
 */
export function getCachedLetterContent(sessionId) {
  const sessionKey = 'ct_letter_content_' + sessionId;
  const defaultKey = 'ct_letter_content_default';
  try {
    const raw = localStorage.getItem(sessionKey) || localStorage.getItem(defaultKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      const norm = normalizeBlocks(parsed);
      if (norm && norm.length > 0) {
        return ensureReplyBox(norm);
      }
    }
  } catch (e) {}
  return DEFAULT_LETTER_BLOCKS;
}

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
