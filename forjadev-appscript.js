// ForjaDev · Webhook para Google Sheets
// Cole este código no Apps Script da sua planilha
// Extensões → Apps Script → cole e salve → Implantar → Novo Implantação

const SHEET_NAME = 'Leads'; // Nome da aba (será criada automaticamente se não existir)

const HEADERS = [
  'Data/Hora',
  'Nome',
  'E-mail',
  'WhatsApp',
  'Idade do Aluno',
  'Perfil',
  'Áreas de Interesse',
  'Nível',
  'Faixa Etária',
  'Formato de Aula',
  'Como Conheceu',
  'Dias Preferidos',
  'Horários Preferidos',
  'Investimento Mensal',
  'Por que quer aprender',
  'Expectativa ForjaDev',
  'Limitações',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    const row = [
      new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      data.nome             || '',
      data.email            || '',
      data.whatsapp         || '',
      data.idade_aluno      || '',
      formatPerfil(data.perfil),
      Array.isArray(data.area) ? data.area.join(', ') : (data.area || ''),
      formatNivel(data.nivel),
      data.idade_faixa      || '',
      formatFormato(data.formato),
      data.origem           || '',
      Array.isArray(data.dias) ? data.dias.join(', ') : (data.dias || ''),
      Array.isArray(data.horarios) ? data.horarios.join(', ') : (data.horarios || ''),
      formatPreco(data.preco),
      data.motivo           || '',
      data.expectativa      || '',
      data.limitacao        || '',
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Também responde GET para facilitar testes no navegador
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'ForjaDev webhook ativo!' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Helpers ──────────────────────────────────────────────

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Cabeçalho
    sheet.appendRow(HEADERS);

    // Estilo do cabeçalho
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground('#e8511a');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(10);

    // Congela a primeira linha
    sheet.setFrozenRows(1);

    // Largura das colunas
    sheet.setColumnWidth(1, 150);  // Data
    sheet.setColumnWidth(2, 160);  // Nome
    sheet.setColumnWidth(3, 200);  // E-mail
    sheet.setColumnWidth(4, 140);  // WhatsApp
    sheet.setColumnWidth(5, 100);  // Idade
    sheet.setColumnWidth(6, 160);  // Perfil
    sheet.setColumnWidth(7, 220);  // Áreas
    sheet.setColumnWidth(8, 140);  // Nível
    sheet.setColumnWidth(9, 120);  // Faixa etária
    sheet.setColumnWidth(10, 150); // Formato
    sheet.setColumnWidth(11, 150); // Como conheceu
    sheet.setColumnWidth(12, 160); // Dias
    sheet.setColumnWidth(13, 130); // Horários
    sheet.setColumnWidth(14, 140); // Investimento
    sheet.setColumnWidth(15, 280); // Motivo
    sheet.setColumnWidth(16, 280); // Expectativa
    sheet.setColumnWidth(17, 240); // Limitações
  }

  return sheet;
}

function formatPerfil(val) {
  const map = {
    'adulto-transicao':  'Transição de carreira',
    'adulto-crescimento':'Evolução na área',
    'adulto-hobby':      'Interesse pessoal',
    'responsavel':       'Pai/Mãe/Responsável',
  };
  return map[val] || val || '';
}

function formatNivel(val) {
  const map = {
    'zero':          'Zero — nunca programou',
    'basico':        'Iniciante',
    'intermediario': 'Intermediário',
    'avancado':      'Avançado',
  };
  return map[val] || val || '';
}

function formatFormato(val) {
  const map = {
    '1-1':        '1-on-1 (individual)',
    'grupo':      'Grupo pequeno',
    'indiferente':'Indiferente',
  };
  return map[val] || val || '';
}

function formatPreco(val) {
  const map = {
    'ate200': 'Até R$200',
    '200-350':'R$200 – 350',
    '350-600':'R$350 – 600',
    '600+':   'R$600+',
  };
  return map[val] || val || '';
}
