
//carregamento do .env
require("dotenv").config(); 

/*Importando as bibliotecas*/
const express = require("express"); //cria o servidor HTTP (endpoints do webhook).
const axios = require("axios"); //faz requisições HTTP (usado para chamar a API do WhatsApp).
const nodemailer = require("nodemailer"); //biblioteca para envio de e-mails via SMTP.*/

/*Inicializa o app Express.*/ 
const app = express(); //habilita o parsing de JSON no corpo das requisições (para receber os eventos do WhatsApp).
app.use(express.json());

/*Logs de diagnóstico para conferir se as variáveis chegaram.
  Mostra o SMTP_USER completo (ok se o terminal é privado) e, para a senha, apenas o tamanho (boa prática para não vazar o segredo).
  O trim() remove espaços invisíveis que, às vezes, vêm de colar a senha/token com espaço no fim/começo.*/
console.log("SMTP_USER:", (process.env.SMTP_USER||"").trim());
console.log("SMTP_PASS len:", (process.env.SMTP_PASS||"").trim().length);

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = "cher3374";

/*coloca o Bt para “dormir” por ms milissegundos.
  Útil para criar pequenos delays entre mensagens.*/
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ================== Função de envio de texto via WhatsApp ==================
/*Função que envia mensagem de texto via WhatsApp Cloud API.*/
async function sendText(to, text) {
  const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
  const body = {
    messaging_product: "whatsapp",
    to, // número do destinatário
    type: "text", // tipo da mensagem
    text: { body: text }, // conteúdo da mensagem
  };
  const headers = { // inclui o token do WhatsApp
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    "Content-Type": "application/json",
  };
  try {
    await axios.post(url, body, { headers });
  } catch (e) {
    console.error("Erro ao enviar:", e?.response?.data || e.message);
  }
}

// ================== Rota de teste de envio de mensagem ==================
app.get("/test-message", async (req, res) => {
  const TEST_NUMBER = "5511959522699"; // coloque aqui o número autorizado na Meta

  try {
    console.log("Enviando mensagem de teste para:", TEST_NUMBER);
    await sendText(TEST_NUMBER, "🔔 Mensagem de teste enviada com sucesso pelo Bot RH Kert!");
    return res.status(200).send("Mensagem de teste enviada!");
  } catch (e) {
    console.error("Erro ao enviar mensagem de teste:", e?.response?.data || e.message);
    return res.status(500).send("Erro ao enviar mensagem de teste.");
  }
});




//------------------------------------------------------------------------------------LISTA DE MENUS PRINCIPAIS---------------------------------------------------------------------------------------

// Mensagem de Saudação
const WELCOME_1 = "Olá 👋, eu sou o assistente virtual do RH.";

//Menu principal
const ROOT_MENU = [
  "O que você deseja fazer hoje?",
  "",
  "1️⃣ Informações sobre Ponto (Multi / My Ahgora)",
  "",
  "2️⃣ Folha & Benefícios (Meu RH)",
  "",
  "3️⃣ Dúvidas sobre holerite",
  "",
  "4️⃣ Falar com atendente",
].join("\n");

// Menu 1 Informações sobre Ponto (Multi / My Ahgora)
const PONTO_MENU = [
  "Por favor, escolha uma opção:",
  "",
  "1️⃣ Registrar ponto",
  "",
  "2️⃣ Consultar ponto",
  "",
  "3️⃣ Solicitar abonamento de horas",
  "",
  "4️⃣ Cancelar batida de ponto",
  "",
  "5️⃣ Incluir batida de ponto",
  "",
  "6️⃣ Falar com atendente",
  "",
  "7️⃣ Retornar ao menu inicial",
].join("\n");

// Menu 2 Folha & Benefícios (Meu RH / TOTVS)
const FOLHA_MENU = [
  "Por favor, escolha uma opção:",
  "",
  "1️⃣ Enviar atestado",
  "",
  "2️⃣ Acessar histórico de pagamentos",
  "",
  "3️⃣ Consultar histórico salarial",
  "",
  "4️⃣ Solicitar/consultar férias",
  "",
  "5️⃣ Consultar informe de rendimentos",
  "",
  "6️⃣ Retornar ao menu inicial",
  "",
  "7️⃣ Falar com atendente",
].join("\n");

//------------------------------------------------------------------------------------LISTA DE PASSO A PASSO SUBMENU 1 (PONTO)---------------------------------------------------------------------------------------

const PASSO_ATESTADO = [
  "*Passo a passo para enviar atestado:*",
  "",
  "🔷 Abra o app ou portal Meu RH e faça login com seu usuário e senha.",
  "🔷 Acesse a aba *Atestado* na parte inferior da tela.",
  "🔷 Preencha as informações: solicitadas, que correspondem aos dados presentes no atestado médico, como o tipo de atestado e o motivo de afastamento (Atestado Médico Faltas Justificadas).",
  "🔷 Anexe o documento: Toque em *Anexar Arquivo* para anexar a foto do atestado ou um documento escaneado em formato PDF.",
  "🔷 Escreva uma justificativa explicativa sobre o atestado.",
  "🔷 Confirme o envio para que o processo seja concluído e o atestado encaminhado ao departamento de Recursos Humanos.",
  "",
  "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/RL4oRAvbiOI",
].join("\n");

const PASSO_HIST_PAGAMENTOS = [
  "*Passo a passo para acessar histórico de pagamentos:*",
  "",
  "🔷 Abra: o aplicativo Meu RH e faça o login.",
  "🔷 Acesse a aba «Pagamentos» na parte inferior da tela.",
  "🔷 Selecione *Envelope de Pagamento*: A partir daí, selecione a opção *Envelope de Pagamento*.",
  "🔷 Escolha o período desejado: O seu envelope de pagamentos estará disponível para visualização e poderá baixar o documento em formato PDF.",
  "",
  "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/EUcOXLcAAW8",
].join("\n");

const PASSO_HIST_SALARIAL = [
  "*Passo a passo para consultar o histórico salarial:*",
  "",
  "🔷 Abra o app ou portal Meu RH e faça login com seu usuário e senha.",
  "🔷 Acesse a aba *Pagamentos* na parte inferior da tela",
  "🔷 Acesse *Histórico Salarial*",
  "🔷 Ao acessar esta seção, o aplicativo deve exibir o seu histórico salarial desde a admissão, detalhando alterações salariais, como promoções e reajustes.",
  "",
  "*Obs:* Utilize Filtros (se necessário) para buscar por um período específico (início e fim) ou por um motivo de alteração específico.",
  "",
  "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/tSYB3c9iS_I",
].join("\n");

const PASSO_FERIAS = [
  "*Passo a passo para solicitar/consultar férias*",
  "",
  "🔷 Abra o app ou portal Meu RH e faça login com seu usuário e senha.",
  "🔷 Acesse a aba *Férias* na parte inferior da tela.",
  "🔷 Nesta aba você irá visualizar :",
  "   ▫️Saldo de dias disponíveis: Mostra quantos dias de férias lhe restam.",
  "   ▫️Status da solicitação: Indica o estado atual de qualquer pedido de férias que tenha feito (por exemplo, se não foi solicitado, está em processamento ou foi aprovado).",
  "   ▫️Período aquisitivo: Informa o período de referência para as férias, como de 1 de janeiro a 31 de dezembro do ano anterior.",
  "   ▫️Histórico: Apresenta um registro com informações básicas das férias que já usufruiu no passado.",
  "",
  "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/qBv-vQE3srI",
].join("\n");

const PASSO_INFORME = [
  "*Passo a passo para consultar informe de rendimentos*",
  "",
  "🔷 Abra o app ou portal Meu RH e faça login com seu usuário e senha.",
  "🔷 Acesse a aba *Pagamentos* na parte inferior da tela.",
  "🔷 Acesse *Informe de Rendimentos*",
  "🔷 Ao clicar nesta opção, você poderá consultar, baixar ou até mesmo compartilhar o seu informe de rendimentos diretamente pelo aplicativo.",
  "",
  "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/d4JYoBy1qns",
].join("\n");

//------------------------------------------------------------------------------------MENSAGENS DE FINALIZAÇÃO ---------------------------------------------------------------------------------------

// Mensagem enviada após o envio dos tutoriais
const ASK_BACK = "Deseja voltar ao Menu Inicial?\n\nSim\n\nNão";

//Mensagem de encerramento de uma conversa por inatividade ou pelo usuário
const THANKS = "Atendimento encerrado. Obrigado por entrar em contato com o RH Kert! Se precisar de mais informações, é só mandar uma nova mensagem. 😉";

//Mensagem enviada quando o Bot está em estado hanover (inativo) e o usuário envia uma nova mensagem
const ASK_HANDOVER = "Como posso te ajudar agora?\n\n1️⃣ Retornar ao Menu inicial\n\n2️⃣ Aguardar o atendimento humano";

//------------------------------------------------------------------------------------ENVIO DO MENU PRINCIPAL E SUBMENU PONTO-------------------------------------------------------------------------
// Envia saudação + menu principal (com intervalo de 1s)
async function sendWelcomeAndMenu(to) {
  await sendText(to, WELCOME_1);//envia a mensagem pelo WhatsApp para "to", que é o número do destinatário
  await wait(1000); //pausa por 1 segundo antes de mandar o menu, pra conversa parecer mais natural.
  await sendText(to, ROOT_MENU); //envia a mensagem pelo WhatsApp.
}

// Envia o menu principal (sem saudação)
async function sendRootMenu(to) {
  await sendText(to, ROOT_MENU);
}

// Envia submenu do ponto
async function sendPontoMenu(to) {
  await sendText(to, PONTO_MENU);
}
//------------------------------------------------------------------------------------LISTA DE PASSO A PASSO SUBMENU 1 (BENEFICIOS)---------------------------------------------------------------------------------------

const PASSO_REGISTRAR = [
  "*Passo a passo para bater o ponto:*",
  "",
  "🔷 No seu smartphone, abra a aplicativo Multi.",
  "🔷 Na tela inicial do aplicativo, procure pelo botão *REGISTRAR PONTO*,","que permite registrar o ponto.",
  "🔷 Coloque a senha do smartphone para realizar a batida do ponto",
  "🔷 Após a confirmação da sua batida, um comprovante de ponto poderá ser fornecido.",
  "Sincronização offline: Caso não haja conexão de internet, o aplicativo permitirá fazer o registro normalmente,",
  "e os dados serão enviados automaticamente para os servidores assim que o sinal for restabelecido.",
  "",
  "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/rNXCT_0DoSY?feature=share",
].join("\n");

const PASSO_ESPELHO = [
  "*Passo a passo para acessar o espelho de ponto:*",
  "",
  "🔷 Na tela de login do aplicativo, insira o código da empresa, sua matrícula e senha, e toque em *Entrar*.",
  "🔷 Após o login, você será direcionado para a tela inicial do aplicativo.",
  "🔷 Toque em *Acessar espelho detalhado* para ver as informações do ponto.",
  "🔷 Toque no botão *Trocar competência*, localizado na parte superior esquerda do aplicativo.",
  "🔷 Escolha o período: Selecione o ano e mês do qual deseja visualizar o espelho de ponto e toque em *Ok*.",
  "",
  "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/ZVTW7ijmqy8",
].join("\n");

const PASSO_ABONO = [
  "*Passo a passo para solicitar um abono:*",
  "",
  "🔷 Abra o aplicativo My Ahgora em seu smartphone.",
  "🔷 Na página inicial toque em *Solicitar abono*.",
  "🔷 Preencha os dados do abono:",
  "   ▫️ Selecione o Motivo do abono",
  "   ▫️ Selecione o período",
  "🔷 Digite uma mensagem para o seu gestor ou RH no campo Mensagem justificando o abonamento.",
  "🔷 Toque em *Adicionar anexo* para selecionar e anexar o arquivo da sua justificativa (como um atestado médico).",
  "🔷 Toque em *Enviar Solicitação de abono* para que o pedido seja encaminhado ao gestor para aprovação.",
  "",
  "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/wdHo_ZivPbM",
].join("\n");

const PASSO_CANCELAR_BATIDA = [
  "*Passo a passo para solicitar o cancelamento de uma batida de ponto*",
  "",
  "⚠️ O Cancelamento da batida só pode ser realizado no mesmo  dia da marcação",
  "",
  "🔷 Acesse o aplicativo: Abra o aplicativo My Ahgora em seu smartphone.",
  "🔷 Inicie a solicitação: Toque em *Cancelar Batida*",
  "🔷 Selecione o horário que deseja desconsiderar",
  "🔷 Selecione o motivo",
  "🔷 Adicione uma mensagem: Digite uma mensagem para o seu gestor ou RH no campo Mensagem obrigatória.",
  "🔷 Envie a solicitação: Toque em *Incluir batida* para que o pedido seja encaminhado ao gestor para aprovação.",
  "",
  "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/SFn-UeU7Zhk",
].join("\n");

const PASSO_INCLUIR = [
  "*Passo a passo para solicitar a inclusão de uma batida de ponto*",
  "",
  "🔷 Acesse o aplicativo: Abra o aplicativo My Ahgora em seu smartphone.",
  "🔷 Inicie a solicitação: Toque em *Incluir Batida*",
  "🔷 Selecione a data que deseja incluir a batida",
  "🔷 Selecione o horário que deseja incluir",
  "🔷 Selecione o motivo",
  "🔷 Adicione uma mensagem: Digite uma mensagem para o seu gestor ou RH no campo Mensagem obrigatória.",
  "🔷 Envie a solicitação: Toque em *Incluir batida* para que o pedido seja encaminhado ao gestor para aprovação.",
  "",
  "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/V3FTCac-67c",
].join("\n");

//------------------------------------------------------------------------------------ENVIO PARA ATENDIMENTO HUMANO ---------------------------------------------------------------------------------------

//Mensagem de envio para atendente
const PASSO_ATENDENTE = [
  "🔄 Encaminhando para um atendente humano. Nosso time responderá em até 24 horas.",
].join("\n"); //Está dentro de um array ([...]) e depois usa .join("\n") — isso é só um jeito de permitir várias linhas, mesmo que agora tenha só uma.

//Essa é a lógica que lembra em que ponto da conversa o usuário está.
const state = new Map(); //Map() é uma estrutura tipo “dicionário”: chave → valor. O valor é o “estado” ou etapa do fluxo

//------------------------------------------------------------------------------------FLUXO MENU 3 (DÚVIDA SOBRE HOLERITE) ---------------------------------------------------------------------------------------

const holeriteSessions = new Map(); /*Cria um mapa na memória (tipo um “banco temporário”).
Isso permite ao bot saber, para cada pessoa, em que ponto do envio do holerite ela está.*/

/*Define o tempo limite (em milissegundos) antes de o bot encaminhar para o atendimento humano
após receber a mensagem e o print do holerite*/
const HOLERITE_FORWARD_MS = 03* 1000; // 3 segundos

//Essa função limpa o temporizador da sessão do usuário.
function clearHoleriteTimer(from) {
  const sess = holeriteSessions.get(from);//pega a sessão do número específico.
  if (sess?.forwardTimer) { //verifica se há um timer ativo.
    clearTimeout(sess.forwardTimer); //cancela o timer, evitando que ele dispare automaticamente (por exemplo, se o usuário já mandou tudo e o bot não precisa mais encaminhar).
    sess.forwardTimer = null;//garante que o campo fique “zerado”.
  }
}

//------------------------------------------------------------------------------------ ENVIO PARA ATENDIMENTO HUMANO ---------------------------------------------------------------------------------------
function armHoleriteForward(from) {
  /*Define a função armHoleriteForward, 
  responsável por agendar o encaminhamento automático do caso para um atendente humano,
  caso o usuário não envie tudo o que é necessário (texto + imagem) no tempo limite.*/
  clearHoleriteTimer(from);

  /*Recupera a sessão atual do usuário (se existir) a partir do holeriteSessions*/
  const sess = holeriteSessions.get(from) || { hasText: false, hasImage: false, forwardTimer: null };

  /*Aqui ele cria o temporizador (setTimeout) que vai rodar depois do tempo definido*/
  sess.forwardTimer = setTimeout(async () => {
    await sendText(from, "🔄 Encaminhando para um atendente humano. Nosso time responderá em até 24 horas.");
    state.set(from, "handover");
    stopInactivity(from); // não encerrar por inatividade durante handover

//------------------------------------------------------------------------ ORDEM DE CHAMADOS ENCAMINHADOS PARA ATENDIMENTO HUMANO ----------------------------------------------------------------------------

//Esse trecho tenta enfileirar e notificar o RH por email sobre o novo atendimento
    try {
      const position = enqueueHandover(from); //adiciona o usuário à fila de atendimento humano e retorna a posição (ex.: 1º da fila, 2º, etc.).
      await notifyRH({ from, position }); //envia um e-mail ou alerta interno pro time do RH avisando:
    } catch (err) {
      console.error("Falha ao notificar RH:", err?.message || err);
    }

  }, HOLERITE_FORWARD_MS);//é o tempo de espera definido anteriormente(5 segundos)
  holeriteSessions.set(from, sess);
}

//----------------------------------------------------------------------------------------- CONTROLE DE INATIVIDADE ----------------------------------------------------------------------------------------

const inactivityTimers = new Map(); //guarda um timer por usuário pra detectar quem não interagiu mais
const INACTIVITY_MS = 3 * 60 * 1000; // 3 minutos

//Serve pra cancelar o contador de inatividade de um usuário específico.
function stopInactivity(from) {
  if (inactivityTimers.has(from)) { //verifica se o timer existe.
    clearTimeout(inactivityTimers.get(from)); //para o cronômetro.
    inactivityTimers.delete(from); //remove o registro do mapa.
  }
}


function resetInactivityTimer(from) {/* funçao camada Ela é toda vez que o usuário interage com o bot (manda uma nova mensagem).
A função “reinicia” o cronômetro de inatividade daquele número.*/

    if (state.get(from) === "handover") return;// Se o usuário está em modo de atendimento humano (handover), o bot não cria o timer de inatividade.
  stopInactivity(from); //Cancela qualquer timer antigo de inatividade que esse número possa ter.

  const t = setTimeout(async () => { //Cria um novo temporizador (timer) e guarda a referência na variável t.
   
    const current = state.get(from); //Quando o tempo expira, o bot verifica novamente o estado
    if (current === "handover" || current === "ended") return;
        await sendText(from, THANKS); //Caso contrário, significa que o usuário ficou inativo, então:
    state.set(from, "ended");
  }, INACTIVITY_MS); // Define o tempo de espera
  inactivityTimers.set(from, t);
}
//----------------------------------------------------------------------------------------- PADRONIZAÇÃO DE ENTRADA DE TEXTO ----------------------------------------------------------------------------------------

/*Garante que o texto de entrada seja tratado de forma padronizada, removendo variações.
Usada quando o bot precisa comparar respostas do usuário (“sim”, “Sim”, “ SIM ” → tudo vira “sim”).*/
function normalize(txt) {
  return (txt || "").toString().trim().toLowerCase();
}

//----------------------------------------------------------------------------- CONFIGURAÇÃO ENVIO DE EMAIL PARA FILA DE CHAMADOS ------------------------------------------------------------------------------------

// Lê as credenciais do .env. para conseguir enviar o email
const smtpUser = (process.env.SMTP_USER || "").trim();//o e-mail usado para enviar as notificações
const smtpPass = (process.env.SMTP_PASS || "").replace(/\s+/g, "").trim(); //a senha de app do Gmail (não é a senha normal da conta).

//Cria o transporte SMTP (é o “canal” que envia os e-mails).
const mailer = nodemailer.createTransport({
  service: "gmail",//usa as configurações padrão do Gmail.
  auth: { user: smtpUser, pass: smtpPass },//autenticação com usuário e senha.
});

// Faz um teste automático ao iniciar o servidor com o gmail.
mailer.verify((err) => {
  if (err) {
    console.error("❌ SMTP verify FAILED:", err);//Se der erro (senha errada, autenticação bloqueada, etc.), o log mostra:
  } else {
    console.log("✅ SMTP verify OK");//Se as credenciais estiverem corretas, aparece no console:
  }
});

//---------------Configura a lista de forma ordenada

const handoverQueue = []; // é um array (LISTA ORDENADA DE VALORES) que guarda a ordem de chegada dos usuários que estão esperando atendimento humano.
const inQueue = new Set(); //é um Set (estrutura sem duplicados) usado só pra evitar que o mesmo número entre na fila mais de uma vez.

//---------------Verifica se o úsuário ja esta na fila

function enqueueHandover(from) {
  if (!inQueue.has(from)) { //Verifica se o número já está na fila
    inQueue.add(from);/*Se não está, adiciona o número no inQueue (para marcá-lo como “em fila”)
e também insere no array handoverQueue com o horário atual.*/
    handoverQueue.push({ from, ts: Date.now() }); //procura a posição (base 0), por isso soma +1 para deixar “base 1” (ex.: 1º, 2º, 3º).
  }
  return handoverQueue.findIndex((x) => x.from === from) + 1; // posição 1-based
}

//---------------Remove o usuário da fila quando ele for atendido ou a conversa encerrar.

function removeFromQueue(from) {
  const idx = handoverQueue.findIndex((x) => x.from === from);
  if (idx >= 0) handoverQueue.splice(idx, 1);
  inQueue.delete(from);
}

//----------------------------------------------------------------------------- MENSAGEM DO EMAIL COM O CHAMADO ENVIADO AO RH---------------------------------------------------------------------------------

async function notifyRH({ from, position }) {/*Declara uma função assíncrona (porque ela usa await dentro).
Recebe um objeto com dois dados:
from = o número do usuário (ex.: "5511999999999"),
position = a posição dele na fila (1, 2, 3...).*/

  const subject = `BOT RH - Aguardando Atendimento (#${position}) - ${from}`; //Cria o assunto (subject) do e-mail.
  const fmtDate = new Date().toLocaleString("pt-BR", { hour12: false }); //Cria a data e hora atual no formato brasileiro
  const body = //Cria o corpo do e-mail (body)
`Olá, RH 👋

Há um novo contato aguardando atendimento humano no WhatsApp.

• Número: ${from}
• Posição na fila: #${position}
• Recebido em: ${fmtDate}

Sugestão: responder via WhatsApp Web
https://wa.me/${from.replace(/\D/g, "")}

Obs.: quando o atendimento for iniciado/concluído, o contato pode sair da fila automaticamente (ou quando o usuário retornar ao menu).`;

//--------------Envio do email

  await mailer.sendMail({ //Envia o e-mail
    from: process.env.NOTIFY_FROM || process.env.SMTP_USER,/*o remetente.Se existir NOTIFY_FROM no .env, usa ele.Caso contrário, usa SMTP_USER (o e-mail autenticado).*/
    to: process.env.NOTIFY_TO, //destinatário
    subject, //o título do e-mail (montado lá em cima).
    text: body, //o corpo do e-mail (sem HTML, só texto puro).
  });
}
//--------------------------------------------------------------------TRECHO RESPONSÁVEL POR RECEBER E RESPONDER AS MENSAGENS -----------------------------------------------------------------------

//--------------------Verificar conexão coma Meta

/*Esse endpoint é chamado uma única vez quando você conecta seu bot ao Meta Developers (WhatsApp Cloud API).
Ele serve apenas para confirmar que o servidor do seu bot está ativo e seguro.*/
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];//O Meta envia esse valor ("subscribe") pra indicar uma verificação.
  const token = req.query["hub.verify_token"];// É o token que você configurou no painel e também no seu código (VERIFY_TOKEN = "cher3374") (VERIFY_TOKEN).
  const challenge = req.query["hub.challenge"];//um número que o Meta gera e espera que você devolva para confirmar que seu servidor é válido.
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);/*Se o mode for "subscribe" e o token for igual ao que você definiu (VERIFY_TOKEN), então o bot responde com o challenge.
      Isso confirma a verificação e o Meta ativa o webhook.*/
  }
  return res.sendStatus(403);// Se algo estiver errado → retorna 403 Forbidden.
});


//Toda mensagem enviada por um usuário no WhatsApp é enviada pelo Meta ao seu servidor via POST.
app.post("/webhook", async (req, res) => {
  try {
    const change = req.body?.entry?.[0]?.changes?.[0];//é o caminho dentro do JSON que contém a mensagem real.
    const msg = change?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);//se não houver mensagem (por exemplo, é só confirmação de entrega), o bot ignora e responde 200 para o Meta (pra não gerar erro).

    const from = msg.from; //from é o número do usuário que enviou a mensagem (exemplo: "5511999999999").

    const text = msg.text?.body || msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || ""; //Pega o conteúdo da mensagem, considerando vários tipos:
    const n = normalize(text); //deixa o texto sem espaços e em minúsculas para trabalhar com um padrão
    const stage = state.get(from) || "idle"; //Pega o estado atual da conversa desse número (guardado no Map state)

    // A cada nova mensagem recebida, o bot reinicia o temporizador de inatividade
    resetInactivityTimer(from);

  //------------------------------------------------------------------------------CONTROLE DE INICIO DE CONVERSA -----------------------------------------------------------------------


  /*Se o usuário é novo (idle) ou acabou de encerrar a conversa (ended), o bot:
    Manda a saudação + menu principal (sendWelcomeAndMenu(from));
    Atualiza o estado para "await_main_choice" (aguardando escolha do menu);
    Retorna 200 pro Meta pra confirmar que a mensagem foi processada.*/
    if (stage === "ended" || stage === "idle") {
      await sendWelcomeAndMenu(from);
      state.set(from, "await_main_choice");
      return res.sendStatus(200);
    }

  //------------------------------------------------------------------------------ TRATATIVA DAS OPÇÕES DO MENU PRINCIPAL   -----------------------------------------------------------------------

    if (stage === "await_main_choice") { //Só entra aqui se o estado atual do usuário for “aguardando escolha do menu principal”.
      if (["1", "2", "3", "4"].includes(n)) { //Garante que a resposta seja uma das opções válidas
        //Envia os Submenus
        if (n === "1") {
          await sendPontoMenu(from);
          state.set(from, "await_ponto_choice");
        } else if (n === "2") {
          // entrar no submenu Folha & Benefícios
          await sendText(from, FOLHA_MENU);
          state.set(from, "await_folha_choice");
        } else if (n === "3") {
          // Dúvidas sobre holerite
          await sendText(from, "Escreva a sua dúvida e envie um print de seu holerite para que eu possa te direcionar ao atendimento humano");
          holeriteSessions.set(from, { hasText: false, hasImage: false, forwardTimer: null });
          state.set(from, "await_holerite_question");
        } else if (n === "4") {
          await sendText(from, "🔄 Encaminhando para um atendente humano. Nosso time responderá em até 24 horas.");
          state.set(from, "handover"); // agora está no humano
          stopInactivity(from); // não encerrar por inatividade durante handover

          try { // Coloca o usuário na fila de atendimento e manda um e-mail pro RH avisando
            const position = enqueueHandover(from);
            await notifyRH({ from, position });
          } catch (err) {
            console.error("Falha ao notificar RH:", err?.message || err);
            /*Se qualquer parte dentro do try der erro (por exemplo, problema de conexão SMTP, senha incorreta, fila corrompida etc.), o erro é capturado e exibido no console.*/
          }
        
          return res.sendStatus(200);//é o fechamento do endpoint /webhook, serve pra responder o WhatsApp (Meta) dizendo que o bot recebeu e processou a mensagem com sucesso.
        }

        /*esse trecho é o tratamento de respostas inválidas, ou seja, 
        o que o bot faz quando o usuário manda algo que não corresponde a nenhuma opção esperada.*/
      } else {
        await sendText(from, "Não consegui identificar sua resposta.");
        await wait(1000);
        await sendRootMenu(from);
        state.set(from, "await_main_choice");
      }
      return res.sendStatus(200);//é o fechamento do endpoint /webhook, serve pra responder o WhatsApp (Meta) dizendo que o bot recebeu e processou a mensagem com sucesso.
    }
//-------------------------------------------------------------------INTERAÇÃO OPÇÃO 3 MENU (HOLERITE) -----------------------------------------------------------
    // Menu 3, dúvida sobre holerite (texto + imagem)
    if (stage === "await_holerite_question") { //pede para o usuário enviar um texto com a dúvida e uma imagem (print) do holerite;
      
    //Atualiza a sessão de holerite
      const sess = holeriteSessions.get(from) || { hasText: false, hasImage: false, forwardTimer: null };
      const hasText = !!(msg.text?.body);
      const hasImage = !!(msg.image);

      //Atualiza o progresso da sessão:
      if (hasText) sess.hasText = true;
      if (hasImage) sess.hasImage = true;
      holeriteSessions.set(from, sess);

      // Feedback mínimo para guiar o usuário
      if (!sess.hasText) {
        await sendText(from, "Recebi sua imagem. Agora, por favor, escreva a sua dúvida em texto.");
      } else if (!sess.hasImage) {
        await sendText(from, "Recebi sua mensagem. Agora, por favor, envie um print (imagem) do seu holerite.");
      }

      // Arma o temporizador
      if (sess.hasText && sess.hasImage) {
        armHoleriteForward(from);
      }

      // Não muda de estado ainda; handover será disparado pelo timer
      return res.sendStatus(200);
    }
  //------------------------------------------------------------------------------ TRATATIVA DAS OPÇÕES DO SUBMENU 1 PONTO   -----------------------------------------------------------------------

    if (stage === "await_ponto_choice") {
      // inclui o "7" na validação
      if (["1", "2", "3", "4", "5", "6", "7"].includes(n)) {
        if (n === "7") {
          // volta ao menu inicial SEM saudação
          removeFromQueue(from); // garante que o usuário seja removido da fila de atendimento
          await sendRootMenu(from);
          state.set(from, "await_main_choice");
          return res.sendStatus(200);
        }

        // 6 = falar com atendente (handover), sem pergunta de voltar ao menu
        if (n === "6") {
          await sendText(from, PASSO_ATENDENTE);
          state.set(from, "handover");
          stopInactivity(from); // << não encerrar por inatividade durante handover

          // Coloca o usuário na fila de espera dos chamados e envia o email para o RH
          try {
            const position = enqueueHandover(from);
            await notifyRH({ from, position });
          } catch (err) {
            console.error("Falha ao notificar RH:", err?.message || err);
          }
         
          return res.sendStatus(200);      // Não muda de estado ainda; handover será disparado pelo timer
        }

        // envia o passo a passo conforme opção (1..5)
        const map = {
          "1": PASSO_REGISTRAR,
          "2": PASSO_ESPELHO,
          "3": PASSO_ABONO,
          "4": PASSO_CANCELAR_BATIDA,
          "5": PASSO_INCLUIR,
        };
        await sendText(from, map[n]);
        await wait(1000);
        await sendText(from, ASK_BACK);
        state.set(from, "await_back_menu");
      } else {
        await sendText(from, "Não consegui identificar sua resposta.");
        await wait(1000);
        await sendPontoMenu(from);
        state.set(from, "await_ponto_choice");
      }
      return res.sendStatus(200);      // Não muda de estado ainda; handover será disparado pelo timer
    }

     //------------------------------------------------------------------------------ TRATATIVA DAS OPÇÕES DO SUBMENU 2 (FOLHA E BENEFÍCIOS)  -----------------------------------------------------------------------

    if (stage === "await_folha_choice") {
      if (["1", "2", "3", "4", "5", "6", "7"].includes(n)) { //Garante que a resposta seja uma das opções do submenu.
        if (n === "6") {
          // retornar ao menu inicial
          removeFromQueue(from); // garante limpeza do usuário na lista de chamados, se estava em fila
          await sendRootMenu(from); //Reenvia o menu principal e volta o estado para await_main_choice.
          state.set(from, "await_main_choice");
          return res.sendStatus(200);
        }
        if (n === "7") {
          // Muda oara o handover com looping natural
          await sendText(from, "🔄 Encaminhando para um atendente humano. Nosso time responderá em até 24 horas.");
          state.set(from, "handover");
          stopInactivity(from); // não encerrar por inatividade durante handover

          
          try {// Coloca o usuário na fila de espera dos chamados e envia o email para o RH
            const position = enqueueHandover(from);
            await notifyRH({ from, position });
          } catch (err) {
            console.error("Falha ao notificar RH:", err?.message || err);
          }
        
          return res.sendStatus(200); // Não muda de estado ainda; handover será disparado pelo timer
        }
        /* Envia o conteúdo correspondente aos textos já prontos: atestado, histórico de pagamentos, etc.*/
        const map = {
          "1": PASSO_ATESTADO,
          "2": PASSO_HIST_PAGAMENTOS,
          "3": PASSO_HIST_SALARIAL,
          "4": PASSO_FERIAS,
          "5": PASSO_INFORME,
        };

//------------------------------------------------------------------------------ RETORNA AO MENU INICIAL  -----------------------------------------------------------------------
      
        //Depois de 1s, pergunta “Deseja voltar ao Menu Inicial? 
        await sendText(from, map[n]);
        await wait(1000); // espera 1s
        await sendText(from, ASK_BACK);
        state.set(from, "await_back_menu");
      } else { // se o usuários da uma resposta inválida
        await sendText(from, "Não consegui identificar sua resposta.");
        await wait(1000);// espera 1s
        await sendText(from, FOLHA_MENU);//envia novamente o menu
        state.set(from, "await_ponto_choice");
      }
      return res.sendStatus(200);
    }

    if (stage === "await_back_menu") {
      if (["sim", "s"].includes(n)) { // Se a resposta do usuário for sim
        removeFromQueue(from); //Remove ele da fila de chamados caso ele esteja
        await sendRootMenu(from);//Reenvia o menu inicial sem saldação
        state.set(from, "await_main_choice");

      } else if (["nao", "não", "n"].includes(n)) {// Se o usuário responde não
        await sendText(from, THANKS);// Envia mensagem de agradecimento e encerra o atendimento
        removeFromQueue(from); // Remove o usuário da fila de chamados pois o atendimento encerrou
        state.set(from, "ended");// encerra o atendimento; próxima mensagem reinicia o bot com saudação+menu

      } else {//caso o usuário envie uma esposta errada
        await sendText(from, 'Não consegui identificar. Responda com "sim" ou "não".'); 
        await wait(1000); //espera 1s
        await sendText(from, ASK_BACK); //reenvia a mensagem de voltar ao menu
        state.set(from, "await_back_menu");
      }
      return res.sendStatus(200);
    }

//------------------------------------------------------------------------------ BOT EM ESTADO HANOVER (DORMINDO)  -----------------------------------------------------------------------

    // Se o usuário  manda mensagem estando no estado Hanover o bot oferece algumas opções de saída
    if (stage === "handover") {
      await sendText(from, ASK_HANDOVER); // envia  o menu com as duas opções
      state.set(from, "await_handover_choice"); // entra em estado de espera da resposta com a escolha
      return res.sendStatus(200);
    }

    // se o bot está em estado de espera, aguardando a escolha
    if (stage === "await_handover_choice") {
      if (n === "1") { //e se a resposta do usuário for 1
        removeFromQueue(from); // Ele remove o usuário da fila de chamados 
        //retoma o fluxo do bot 
        await sendRootMenu(from);
        state.set(from, "await_main_choice");
        return res.sendStatus(200);

      } else if (n === "2") {//e se a resposta do usuário for 1
        // o Bot reenvia a mensagem de encaminhameneto 
        await sendText(from, "🔄 Encaminhando para um atendente humano. Nosso time responderá em até 24 horas.");
        state.set(from, "handover");// e retorna para o estado "Dormindo"
        stopInactivity(from); // mantém regra de não encerrar por inatividade no handover

        // Garante o a posição do usuário na fila e garante que o RH foi avisado 
        try {
          const position = enqueueHandover(from);
          await notifyRH({ from, position });
        } catch (err) {
          console.error("Falha ao notificar RH:", err?.message || err);
        }
   
        return res.sendStatus(200);
      } else { // Itentific uma resposta inválida e reenvia a pergunta
        await sendText(from, "Não consegui identificar sua resposta. Por favor, escolha uma das opções.");
        await sendText(from, ASK_HANDOVER);
        return res.sendStatus(200);
      }
    }

    // verificação de segurança, volta para o menu principal (sem saudação)
    removeFromQueue(from); // Limpa qualquer resíduo na fila de chamados
    await sendRootMenu(from);
    state.set(from, "await_main_choice");
    return res.sendStatus(200);
  } catch (e) {
    console.error("Erro no webhook:", e?.response?.data || e.message);
    return res.sendStatus(200);
  }
});

//------------------------------------------------------------------------------ TESTE DE VERIFICAÇÃO DE CONEXÃO COM O EMAIL  -----------------------------------------------------------------------

app.get("/test-email", async (req, res) => { //Cria uma rota GET /test-email para disparar um envio de teste via Nodemailer.
  try {
    const info = await mailer.sendMail({//Usa o transporter mailer JA CRIADO para enviar e-mail.
      from: `BOT RH Kert <${process.env.SMTP_USER}>`,//mostra “BOT RH Kert” com o remetente do .env
      to: process.env.NOTIFY_TO || process.env.SMTP_USER, //manda para NOTIFY_TO se existir; senão, vai para o próprio SMTP_USER.
      //Mensagem
      subject: "Teste de envio (Nodemailer)",
      text: "Olá! Este é um teste de envio via Nodemailer.",
      html: "<p>Olá! Este é um <b>teste</b> de envio via Nodemailer.</p>",
    });
    return res.status(200).send(`✅ Email enviado! MessageId: ${info.messageId || "(n/a)"}`); //Se deu certo, retorna 200 com o messageId.
  } catch (err) {//Se der erro, cai no catch.
    console.error("Falha ao enviar email:", err);
    return res.status(500).send(`❌ Erro ao enviar: ${err?.response || err?.message || err}`);
  }
});

//------------------------------------------------------------------------------ FINALIZA O CICLO PRINCIPAL DO BOT  -----------------------------------------------------------------------

app.get("/", (req, res) => res.send("Servidor do Bot RH ativo!"));//rota raiz: confirma que o servidor está ativo

app.get("/healthz", (req, res) => res.status(200).send("ok"));// rota de healthcheck (para serviços de hospedagem monitorarem)


app.listen(PORT, () => { //inicialização do boot no servidor
  //logs de depuração
  console.log(`Servidor rodando na porta ${PORT}`);//✔️ Confirma visualmente no terminal que o servidor iniciou corretamente.
  console.log("DEBUG TOKEN len:", (process.env.WHATSAPP_TOKEN || "").length);/*✔️ Mostra apenas o tamanho do token, e não o valor real — boa prática de segurança.
  Serve para garantir que a variável de ambiente foi lida (e não está vazia).*/
  console.log("DEBUG PHONE_NUMBER_ID:", process.env.PHONE_NUMBER_ID);//✔️ Mostra o ID do número de WhatsApp que está configurado — útil para checar se está certo antes de testar a API.

  // Verificação básica das variáveis de ambiente
  if (!process.env.WHATSAPP_TOKEN) {
    console.warn("⚠️  Atenção: variável WHATSAPP_TOKEN não encontrada no .env!");
  }
  if (!process.env.PHONE_NUMBER_ID) {
    console.warn("⚠️  Atenção: variável PHONE_NUMBER_ID não encontrada no .env!");
  }
  if (!process.env.SMTP_USER) {
    console.warn("⚠️  Atenção: variável SMTP_USER não encontrada no .env!");
  }
});

// === Tratamentos globais de erro ===
process.on("unhandledRejection", (err) => {
  console.error("🚨 Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("🚨 Uncaught Exception:", err);
});
