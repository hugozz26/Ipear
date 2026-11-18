// Script principal da PearStore Online 2011 - Programacao Web 1 (IFB)

var catalogoProdutos = [
  {
    id: "pearphone-xt",
    nome: "PearPhone XT",
    categoria: "pearphones",
    etiqueta: "Lançamento",
    destaque: true,
    imagem: "assets/img/pearphone-xt-hero.jpg",
    precoBase: 1799,
    descricao: "Tela curva formato pera, PearSiri em português e câmera HD 8MP.",
    specs: [
      ["Tela", "Retina curva formato pera de 3,5 polegadas (960 x 640 px)"],
      ["Processador", "Chip Pear A5 Dual-Core de 1,0 GHz"],
      ["Assistente", "PearSiri por comando de voz"],
      ["Recursos", "PearChat, SplashFace HD, PearTunes, GPS e bússola"],
      ["Acabamento", "Faixa lateral em aço escovado com traseira colorida"]
    ]
  },
  {
    id: "pearphone-gx",
    nome: "PearPhone GX (16 GB)",
    categoria: "pearphones",
    etiqueta: "Clássico",
    destaque: false,
    imagem: "assets/img/pearphone-original.jpg",
    precoBase: 1399,
    descricao: "O modelo icônico de 2011 com faixa metálica de sinal e PearChat.",
    specs: [
      ["Tela", "Display multitoque em formato de pera com vidro reforçado"],
      ["Armazenamento", "16 GB de memória flash"],
      ["Conectividade", "3G, Wi-Fi 802.11n e Bluetooth 2.1"],
      ["Apps", "Messages, Camera, SplashFace, PearTunes e PearPod integrados"],
      ["Cor", "Azul Metálico Clássico"]
    ]
  },
  {
    id: "pearpad-2",
    nome: "PearPad 2 (32 GB)",
    categoria: "computadores",
    etiqueta: "Novo",
    destaque: true,
    imagem: "assets/img/pearpad-2.jpg",
    precoBase: 1699,
    descricao: "Mais fino, leve e mágico em alumínio escovado com bateria de 10h.",
    specs: [
      ["Tela", "Display Pera IPS de 9,7 polegadas com retroiluminação LED"],
      ["Espessura", "8,8 mm em corpo unibody de alumínio"],
      ["Bateria", "Até 10 horas de navegação contínua via Wi-Fi"],
      ["Câmeras", "Frontal para chamadas de vídeo e traseira HD"]
    ]
  },
  {
    id: "pearbook-pro",
    nome: 'PearBook Pro 13"',
    categoria: "computadores",
    etiqueta: "Unibody",
    destaque: false,
    imagem: "assets/img/pearbook-pro.jpg",
    precoBase: 3499,
    descricao: "Notebook em alumínio unibody, processador Core i5 e logo iluminado.",
    specs: [
      ["Tela", 'Widescreen brilhante de 13,3" retroiluminada por LED'],
      ["Processador", "Intel Core i5 Dual-Core de 2,3 GHz"],
      ["Memória", "4 GB DDR3 + Disco rígido de 320 GB"],
      ["Sistema", "Pear OS X 10.6 Snow Leopard com PearLife"]
    ]
  },
  {
    id: "pearpod-touch",
    nome: "PearPod Touch (32 GB)",
    categoria: "acessorios",
    etiqueta: "Música",
    destaque: false,
    imagem: "assets/img/pearpod-touch.jpg",
    precoBase: 799,
    descricao: "Sua biblioteca do PearTunes e jogos da App Pear sempre no bolso.",
    specs: [
      ["Capacidade", "32 GB (até 7.000 músicas no PearTunes)"],
      ["Autonomia", "Até 40 horas de reprodução de áudio"],
      ["Extras", "Inclui fones brancos clássicos e cabo USB Pear"]
    ]
  },
  {
    id: "pear-kit",
    nome: "Kit Bumper & PearPods",
    categoria: "acessorios",
    etiqueta: "Acessório",
    destaque: false,
    imagem: "assets/img/pear-accessories.jpg",
    precoBase: 149,
    descricao: "Capa Bumper protetora em pera, fones estéreo e carregador USB 5W.",
    specs: [
      ["Proteção", "Bumper de borracha azul e grafite absorvente de impacto"],
      ["Áudio", "Fones PearPods brancos com controle de volume no cabo"],
      ["Energia", "Adaptador de tomada compacto USB 5W bivolt"]
    ]
  }
];

var noticiasHotNews = [
  "Lançamento: Novo PearPhone XT chega à PearStore com 5% de desconto no PIX ou Dinheiro.",
  "PearStore Brasil: Parcele seu PearPhone, PearPad ou PearBook em até 10x sem juros no Cartão.",
  "Novidade: Agora você pode pagar com Pituca Coins™ na PearStore (1 pituca = R$ 100,00).",
  "PearOS 4.3 disponível: SplashFace HD, PeeMiner e PearTunes sincronizados na nuvem.",
  "Frete grátis para todo o Brasil em pedidos acima de R$ 200,00 na PearStore Online."
];

// Variaveis do pedido atual
var categoriaAtiva = "todos";
var termoBusca = "";
var xtCor = "Azul Clássico";
var xtCapacidade = "16GB";
var xtPreco = 1799;

var quantidades = {
  "pearphone-xt": 0,
  "pearphone-gx": 0,
  "pearpad-2": 0,
  "pearbook-pro": 0,
  "pearpod-touch": 0,
  "pear-kit": 0
};

var calculoRealizado = false;
var calculoDesatualizado = false;
var totalCalculado = 0;
var formaPagamento = "";
var parcelasSelecionadas = 1;
var noticiaAtual = 0;

function formatarMoeda(valor) {
  return "R$ " + Number(valor).toFixed(2).replace(".", ",");
}

function formatarPitucas(valorReais) {
  var pitucas = Number(valorReais) / 100;
  return pitucas.toFixed(2).replace(".", ",") + " Pituca Coins™";
}

function pegarPrecoProduto(prod) {
  if (prod.id === "pearphone-xt") {
    return xtPreco;
  }
  return prod.precoBase;
}

function pegarNomeNoPedido(prod) {
  if (prod.id === "pearphone-xt") {
    return prod.nome + " (" + xtCapacidade + " - " + xtCor + ")";
  }
  return prod.nome;
}

function buscarProdutoPorId(id) {
  for (var i = 0; i < catalogoProdutos.length; i++) {
    if (catalogoProdutos[i].id === id) {
      return catalogoProdutos[i];
    }
  }
  return null;
}

function pegarItensSelecionados() {
  var lista = [];
  for (var i = 0; i < catalogoProdutos.length; i++) {
    var prod = catalogoProdutos[i];
    var qtd = quantidades[prod.id] || 0;
    if (qtd > 0) {
      var unitario = pegarPrecoProduto(prod);
      lista.push({
        id: prod.id,
        nome: pegarNomeNoPedido(prod),
        quantidade: qtd,
        precoUnitario: unitario,
        subtotal: unitario * qtd
      });
    }
  }
  return lista;
}

// Monta a grade de produtos na tela
function renderizarCatalogo(idDestaque) {
  var grid = document.getElementById("product-grid");
  var faixaFiltro = document.getElementById("catalog-filter-status");
  var textoFiltro = document.getElementById("filter-status-text");
  var termo = termoBusca.trim().toLowerCase();

  var filtrados = [];
  for (var i = 0; i < catalogoProdutos.length; i++) {
    var prod = catalogoProdutos[i];
    var bateCat = categoriaAtiva === "todos" || prod.categoria === categoriaAtiva;
    var bateBusca =
      termo === "" ||
      prod.nome.toLowerCase().indexOf(termo) !== -1 ||
      prod.descricao.toLowerCase().indexOf(termo) !== -1;

    if (bateCat && bateBusca) {
      filtrados.push(prod);
    }
  }

  if (categoriaAtiva !== "todos" || termo !== "") {
    faixaFiltro.classList.remove("escondido");
    var partes = [];
    if (categoriaAtiva !== "todos") {
      partes.push('Categoria: "' + categoriaAtiva + '"');
    }
    if (termo !== "") {
      partes.push('Busca: "' + termo + '"');
    }
    textoFiltro.innerText = "Exibindo " + filtrados.length + " produto(s) • " + partes.join(" • ");
  } else {
    faixaFiltro.classList.add("escondido");
  }

  if (filtrados.length === 0) {
    grid.innerHTML =
      '<div style="grid-column: 1 / -1; padding: 24px; text-align: center; border: 1px dashed #cccccc; border-radius: 5px;">' +
      '<p style="margin: 0 0 10px; color: #555;">Nenhum produto encontrado para "' + termo + '".</p>' +
      '<button type="button" class="silver-btn" onclick="limparFiltros()">Mostrar todos os produtos</button>' +
      "</div>";
    return;
  }

  var html = "";
  for (var j = 0; j < filtrados.length; j++) {
    var item = filtrados[j];
    var qtd = quantidades[item.id] || 0;
    var preco = pegarPrecoProduto(item);
    var titulo = item.id === "pearphone-xt" ? item.nome + " (" + xtCapacidade + ")" : item.nome;
    var desc =
      item.id === "pearphone-xt"
        ? "Cor selecionada: " + xtCor + ". " + item.descricao
        : item.descricao;

    var classeCard = "product-card";
    if (qtd > 0) classeCard += " has-qty";
    if (idDestaque === item.id) classeCard += " is-highlighted";

    var classeBadge = item.destaque ? "product-badge is-new" : "product-badge";

    html +=
      '<article class="' + classeCard + '" id="card-' + item.id + '">' +
      "  <div>" +
      '    <div class="product-top">' +
      '      <span class="' + classeBadge + '">' + item.etiqueta + "</span>" +
      '      <button type="button" class="specs-link-btn" onclick="abrirModalSpecs(\'' + item.id + '\')">Especificações &rsaquo;</button>' +
      "    </div>" +
      '    <div class="product-image-wrap">' +
      '      <img src="' + item.imagem + '" alt="' + titulo + '">' +
      "    </div>" +
      '    <h3 class="product-title">' + titulo + "</h3>" +
      '    <p class="product-desc">' + desc + "</p>" +
      "  </div>" +
      '  <div class="product-footer">' +
      '    <span class="product-price">' + formatarMoeda(preco) + "</span>" +
      '    <div class="qty-control">' +
      '      <button type="button" class="qty-btn" onclick="mudarQtd(\'' + item.id + '\', -1)">−</button>' +
      '      <input type="number" class="qty-input" id="qty-' + item.id + '" min="0" max="99" value="' + qtd + '" onchange="atualizarQuantidade(\'' + item.id + '\', this.value)">' +
      '      <button type="button" class="qty-btn" onclick="mudarQtd(\'' + item.id + '\', 1)">+</button>' +
      "    </div>" +
      "  </div>" +
      "</article>";
  }

  grid.innerHTML = html;
}

// Monta a lista lateral do resumo
function renderizarResumo() {
  var itens = pegarItensSelecionados();
  var listaEl = document.getElementById("selected-items-list");
  var badgeEl = document.getElementById("total-units-badge");

  var totalUnidades = 0;
  for (var i = 0; i < itens.length; i++) {
    totalUnidades += itens[i].quantidade;
  }

  badgeEl.innerText = totalUnidades === 1 ? "1 item" : totalUnidades + " itens";

  if (itens.length === 0) {
    listaEl.innerHTML =
      '<p class="empty-cart-msg">' +
      "Selecione a quantidade desejada nos produtos ao lado para montar sua compra." +
      "</p>";
    return;
  }

  var html = "";
  for (var j = 0; j < itens.length; j++) {
    var item = itens[j];
    html +=
      '<div class="cart-item-row">' +
      '  <div class="cart-item-info">' +
      "    <strong>" + item.quantidade + "× " + item.nome + "</strong>" +
      "    <small>" + formatarMoeda(item.precoUnitario) + " cada</small>" +
      "  </div>" +
      '  <div class="cart-item-right">' +
      "    <span>" + formatarMoeda(item.subtotal) + "</span>" +
      '    <button type="button" class="remove-item-btn" onclick="atualizarQuantidade(\'' + item.id + '\', 0)">Remover</button>' +
      "  </div>" +
      "</div>";
  }

  listaEl.innerHTML = html;
}

// Alterar quantidades
function mudarQtd(produtoId, delta) {
  var atual = quantidades[produtoId] || 0;
  atualizarQuantidade(produtoId, atual + delta);
}

function atualizarQuantidade(produtoId, novaQtd) {
  var valor = parseInt(novaQtd);
  if (isNaN(valor) || valor < 0) valor = 0;
  if (valor > 99) valor = 99;

  quantidades[produtoId] = valor;

  renderizarCatalogo();
  renderizarResumo();

  if (valor > 0) {
    document.getElementById("calc-warning").classList.add("escondido");
  }

  if (calculoRealizado) {
    calculoDesatualizado = true;
    document.getElementById("stale-warning").classList.remove("escondido");
  }
}

// Configurador do PearPhone XT
function mudarCorXT(cor, botao) {
  var botoes = document.getElementById("xt-color-swatches").getElementsByClassName("swatch");
  for (var i = 0; i < botoes.length; i++) {
    botoes[i].classList.remove("is-selected");
  }
  botao.classList.add("is-selected");
  xtCor = cor;

  renderizarCatalogo();
  renderizarResumo();
}

function mudarCapXT(capacidade, preco, botao) {
  var botoes = document.getElementById("xt-storage-options").getElementsByClassName("storage-btn");
  for (var i = 0; i < botoes.length; i++) {
    botoes[i].classList.remove("is-selected");
  }
  botao.classList.add("is-selected");

  xtCapacidade = capacidade;
  xtPreco = preco;
  document.getElementById("config-unit-price").innerText = formatarMoeda(xtPreco);

  if (calculoRealizado && (quantidades["pearphone-xt"] || 0) > 0) {
    calculoDesatualizado = true;
    document.getElementById("stale-warning").classList.remove("escondido");
  }

  renderizarCatalogo();
  renderizarResumo();
}

// Calculo principal (ao clique do botao)
function calcularCompra() {
  var itens = pegarItensSelecionados();
  var aviso = document.getElementById("calc-warning");
  var boxCalculo = document.getElementById("order-calculation-box");

  if (itens.length === 0) {
    aviso.innerText =
      "Escolha pelo menos 1 unidade de algum produto ao lado antes de calcular o valor da compra.";
    aviso.classList.remove("escondido");
    boxCalculo.classList.add("escondido");
    calculoRealizado = false;
    return;
  }

  var total = 0;
  for (var i = 0; i < itens.length; i++) {
    total += itens[i].subtotal;
  }

  calculoRealizado = true;
  calculoDesatualizado = false;
  totalCalculado = total;

  aviso.classList.add("escondido");
  document.getElementById("stale-warning").classList.add("escondido");
  document.getElementById("display-total-bruto").innerText = formatarMoeda(total);
  boxCalculo.classList.remove("escondido");

  atualizarPainelPagamento();
}

function escolherPagamento(tipo) {
  formaPagamento = tipo;
  atualizarPainelPagamento();
}

function atualizarParcelas() {
  parcelasSelecionadas = Number(document.getElementById("select-parcelas").value) || 1;
  atualizarPainelPagamento();
}

function atualizarPainelPagamento() {
  var labelPix = document.getElementById("opt-pix-label");
  var labelCartao = document.getElementById("opt-cartao-label");
  var labelPituca = document.getElementById("opt-pituca-label");
  var boxPix = document.getElementById("pix-result-box");
  var boxCartao = document.getElementById("cartao-result-box");
  var boxPituca = document.getElementById("pituca-result-box");
  var btnFinalizar = document.getElementById("btn-finalizar");

  if (formaPagamento === "pix") {
    labelPix.classList.add("is-selected");
  } else {
    labelPix.classList.remove("is-selected");
  }

  if (formaPagamento === "cartao") {
    labelCartao.classList.add("is-selected");
  } else {
    labelCartao.classList.remove("is-selected");
  }

  if (formaPagamento === "pituca") {
    labelPituca.classList.add("is-selected");
  } else {
    labelPituca.classList.remove("is-selected");
  }

  if (formaPagamento === "pix") {
    var desconto = totalCalculado * 0.05;
    var finalPix = totalCalculado - desconto;

    document.getElementById("pix-valor-original").innerText = formatarMoeda(totalCalculado);
    document.getElementById("pix-valor-desconto").innerText = "- " + formatarMoeda(desconto);
    document.getElementById("pix-valor-final").innerText = formatarMoeda(finalPix);

    boxPix.classList.remove("escondido");
    boxCartao.classList.add("escondido");
    boxPituca.classList.add("escondido");
    btnFinalizar.classList.remove("escondido");
  } else if (formaPagamento === "cartao") {
    var qtdParcelas = Number(parcelasSelecionadas) || 1;
    if (qtdParcelas < 1) qtdParcelas = 1;
    if (qtdParcelas > 10) qtdParcelas = 10;
    var valorParcela = totalCalculado / qtdParcelas;

    document.getElementById("cartao-qtd-parcelas").innerText = qtdParcelas + "x sem juros";
    document.getElementById("cartao-valor-parcela").innerText = formatarMoeda(valorParcela);
    document.getElementById("cartao-total-geral").innerText = formatarMoeda(totalCalculado);

    boxPix.classList.add("escondido");
    boxCartao.classList.remove("escondido");
    boxPituca.classList.add("escondido");
    btnFinalizar.classList.remove("escondido");
  } else if (formaPagamento === "pituca") {
    document.getElementById("pituca-valor-reais").innerText = formatarMoeda(totalCalculado);
    document.getElementById("pituca-valor-total").innerText = formatarPitucas(totalCalculado);

    boxPix.classList.add("escondido");
    boxCartao.classList.add("escondido");
    boxPituca.classList.remove("escondido");
    btnFinalizar.classList.remove("escondido");
  } else {
    boxPix.classList.add("escondido");
    boxCartao.classList.add("escondido");
    boxPituca.classList.add("escondido");
    btnFinalizar.classList.add("escondido");
  }
}

function zerarPedido() {
  for (var i = 0; i < catalogoProdutos.length; i++) {
    quantidades[catalogoProdutos[i].id] = 0;
  }
  calculoRealizado = false;
  calculoDesatualizado = false;
  totalCalculado = 0;
  formaPagamento = "";
  parcelasSelecionadas = 1;

  document.getElementById("pay-pix").checked = false;
  document.getElementById("pay-cartao").checked = false;
  document.getElementById("pay-pituca").checked = false;
  document.getElementById("select-parcelas").value = "1";
  document.getElementById("order-calculation-box").classList.add("escondido");
  document.getElementById("calc-warning").classList.add("escondido");

  renderizarCatalogo();
  renderizarResumo();
  atualizarPainelPagamento();
}

// Janelas modais estilo Mac OS X Snow Leopard
function abrirModal(titulo, html) {
  document.getElementById("modal-window-title").innerText = titulo;
  document.getElementById("modal-window-body").innerHTML = html;
  document.getElementById("mac-modal-backdrop").classList.remove("escondido");
}

function fecharModal() {
  document.getElementById("mac-modal-backdrop").classList.add("escondido");
}

function fecharModalFundo(evento) {
  if (evento.target === document.getElementById("mac-modal-backdrop")) {
    fecharModal();
  }
}

function abrirModalSpecs(produtoId) {
  var prod = buscarProdutoPorId(produtoId);
  if (!prod) return;

  var linhas = "";
  for (var i = 0; i < prod.specs.length; i++) {
    linhas += "<tr><th>" + prod.specs[i][0] + "</th><td>" + prod.specs[i][1] + "</td></tr>";
  }

  var conteudo =
    '<div style="display:flex; gap:14px; align-items:center; margin-bottom:12px;">' +
    '  <img src="' + prod.imagem + '" alt="' + prod.nome + '" style="width:110px; height:90px; object-fit:contain;">' +
    "  <div>" +
    '    <h4 style="margin:0 0 4px; font-size:17px;">' + prod.nome + "</h4>" +
    '    <p style="margin:0; color:#555;">' + prod.descricao + "</p>" +
    '    <strong style="display:inline-block; margin-top:6px; color:#1b6fc1;">A partir de ' + formatarMoeda(prod.precoBase) + "</strong>" +
    "  </div>" +
    "</div>" +
    '<table class="specs-table">' + linhas + "</table>";

  abrirModal("Especificações — " + prod.nome, conteudo);
}

function abrirModalKeynote() {
  var conteudo =
    '<div style="text-align:center;">' +
    '  <img src="assets/img/pearphone-xt-hero.jpg" alt="PearPhone XT" style="max-height:200px; margin:0 auto 12px;">' +
    '  <h4 style="margin:0 0 6px; font-size:18px;">“Dois é melhor que um. Apresentamos o PearPhone XT.”</h4>' +
    '  <p style="color:#555; margin:0 0 10px;">' +
    "    Inspirado nos clássicos aparelhos de 2011, o novo <strong>PearPhone XT</strong> mantém a icônica silhueta em pera com faixa metálica de sinal, ganha o assistente de voz <strong>PearSiri</strong> e estreia em 5 cores vibrantes na <strong>PearStore Online</strong>." +
    "  </p>" +
    '  <p style="margin:0; font-size:11px; color:#777;">' +
    "    Promoção de lançamento: 5% de desconto no Dinheiro ou PIX, até 10x sem juros no Cartão de Crédito ou pague em Pituca Coins™." +
    "  </p>" +
    "</div>";

  abrirModal("Pear Special Event — Fevereiro de 2011", conteudo);
}

function abrirModalAppPear() {
  var conteudo =
    '<div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">' +
    '  <img src="assets/img/pear-appstore.jpg" alt="Pear App Store" style="width:150px; object-fit:contain; margin:0 auto;">' +
    '  <div style="flex:1; min-width:220px;">' +
    '    <h4 style="margin:0 0 6px; font-size:16px;">Mais de 350.000 aplicativos para seu PearPhone</h4>' +
    '    <ul style="margin:0; padding-left:18px; color:#444;">' +
    "      <li><strong>SplashFace</strong> — Compartilhe fotos e recados instantâneos.</li>" +
    "      <li><strong>PearChat</strong> — Mensagens rápidas em tempo real entre aparelhos Pear.</li>" +
    "      <li><strong>PearTunes</strong> — Sincronize músicas, podcasts e vídeos.</li>" +
    "      <li><strong>PeeMiner</strong> — O jogo viciante número 1 de 2011.</li>" +
    "    </ul>" +
    "  </div>" +
    "</div>";

  abrirModal("Pear App Store & PearTunes 10", conteudo);
}

function abrirModalSuporte() {
  var conteudo =
    '<h4 style="margin:0 0 8px; font-size:16px;">Como funciona a compra na PearStore Online?</h4>' +
    '<ol style="margin:0 0 12px; padding-left:18px; color:#444;">' +
    "  <li>Escolha a cor e capacidade do seu <strong>PearPhone XT</strong> e informe as quantidades desejadas nos produtos do catálogo.</li>" +
    "  <li>Clique em <strong>Calcular Valor da Compra</strong> no painel à direita para ver o total detalhado.</li>" +
    "  <li>Escolha pagar via <strong>Dinheiro / PIX</strong> (com 5% de desconto automático), <strong>Cartão de Crédito</strong> (até 10x sem juros) ou <strong>Pituca Coins™</strong> (1 pituca = R$ 100,00).</li>" +
    "</ol>" +
    '<p style="margin:0; color:#666; font-size:11px;">' +
    "  Atendimento PearCare: 0800-PEAR-2011 • Garantia limitada de 1 ano em todos os produtos Pear Company." +
    "</p>";

  abrirModal("Suporte PearCare — Central de Atendimento", conteudo);
}

function abrirComprovante() {
  if (!calculoRealizado || formaPagamento === "") return;

  if (calculoDesatualizado) {
    calcularCompra();
  }

  var itens = pegarItensSelecionados();
  var total = totalCalculado;
  var codigo = "PEAR-2011-" + Math.floor(1000 + Math.random() * 9000);

  var linhasItens = "";
  for (var i = 0; i < itens.length; i++) {
    linhasItens +=
      '<div class="receipt-row">' +
      "  <span>" + itens[i].quantidade + "× " + itens[i].nome + "</span>" +
      "  <strong>" + formatarMoeda(itens[i].subtotal) + "</strong>" +
      "</div>";
  }

  var resumoPagamento = "";
  if (formaPagamento === "pix") {
    var desconto = total * 0.05;
    var finalPix = total - desconto;
    resumoPagamento =
      '<div class="receipt-row"><span>Forma de pagamento</span><strong>Dinheiro / PIX (5% de desconto)</strong></div>' +
      '<div class="receipt-row"><span>Desconto aplicado (5%)</span><strong style="color:#1b6f38;">- ' + formatarMoeda(desconto) + "</strong></div>" +
      '<div class="receipt-total"><span>Total Final à Vista</span><span style="color:#145e2e;">' + formatarMoeda(finalPix) + "</span></div>";
  } else if (formaPagamento === "pituca") {
    resumoPagamento =
      '<div class="receipt-row"><span>Forma de pagamento</span><strong>Pituca Coins™</strong></div>' +
      '<div class="receipt-row"><span>Cotação aplicada</span><strong>1 pituca = R$ 100,00</strong></div>' +
      '<div class="receipt-row"><span>Valor em Reais</span><strong>' + formatarMoeda(total) + "</strong></div>" +
      '<div class="receipt-total"><span>Total em Pituca Coins™</span><span style="color:#8a5a00;">' + formatarPitucas(total) + "</span></div>";
  } else {
    var qtdP = parcelasSelecionadas;
    var valorP = total / qtdP;
    resumoPagamento =
      '<div class="receipt-row"><span>Forma de pagamento</span><strong>Cartão de Crédito</strong></div>' +
      '<div class="receipt-row"><span>Parcelamento escolhido</span><strong>' + qtdP + "x de " + formatarMoeda(valorP) + " sem juros</strong></div>" +
      '<div class="receipt-total"><span>Valor Total Parcelado</span><span>' + formatarMoeda(total) + "</span></div>";
  }

  var conteudo =
    '<p style="margin:0 0 10px; color:#1b6f38; font-weight:700;">Pedido registrado com sucesso na PearStore Online!</p>' +
    '<div class="receipt-box">' +
    '  <div style="font-size:11px; color:#666; margin-bottom:8px;">Pedido <strong>#' + codigo + "</strong> • IFB Programação Web 1</div>" +
    linhasItens +
    '  <div style="height:8px;"></div>' +
    resumoPagamento +
    "</div>" +
    '<div style="margin-top:14px; padding-top:10px; border-top:1px solid #e6e6e6; display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">' +
    '  <button type="button" class="silver-btn" onclick="novoPedidoModal()">Iniciar Novo Pedido</button>' +
    '  <button type="button" class="aqua-pill-btn" onclick="window.print()">Imprimir Recibo</button>' +
    "</div>";

  abrirModal("Comprovante do Pedido #" + codigo, conteudo);
}

function novoPedidoModal() {
  zerarPedido();
  fecharModal();
}

// Filtros, menu, busca e ticker de noticias
function selecionarCategoria(categoria, idDestaque) {
  categoriaAtiva = categoria || "todos";

  var abas = document.getElementsByClassName("store-tab");
  for (var i = 0; i < abas.length; i++) {
    abas[i].classList.remove("is-active");
  }
  var abaAtiva = document.getElementById("tab-" + categoriaAtiva);
  if (abaAtiva) {
    abaAtiva.classList.add("is-active");
  }

  renderizarCatalogo(idDestaque);

  if (idDestaque) {
    var card = document.getElementById("card-" + idDestaque);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

function limparFiltros() {
  termoBusca = "";
  document.getElementById("global-search").value = "";
  document.getElementById("search-suggestions").classList.add("escondido");
  selecionarCategoria("todos");
}

function marcarMenu(link) {
  var itens = document.getElementById("globalnav").getElementsByClassName("gn-item");
  for (var i = 0; i < itens.length; i++) {
    itens[i].classList.remove("is-active");
  }
  if (link && link.parentElement) {
    link.parentElement.classList.add("is-active");
  }
}

function clicarMenu(link, categoria, secao) {
  marcarMenu(link);
  if (categoria) {
    selecionarCategoria(categoria);
  }
  var alvo = document.querySelector(secao);
  if (alvo) {
    alvo.scrollIntoView({ behavior: "smooth" });
  }
}

function irParaProdutoPromo(categoria, produtoId) {
  var loja = document.getElementById("pearstore");
  if (loja) loja.scrollIntoView({ behavior: "smooth" });
  selecionarCategoria(categoria, produtoId);
}

function trocarVisaoHero(botao, srcImagem, altTexto) {
  var botoes = document.getElementsByClassName("view-pill");
  for (var i = 0; i < botoes.length; i++) {
    botoes[i].classList.remove("is-active");
  }
  botao.classList.add("is-active");

  var img = document.getElementById("hero-main-img");
  img.style.opacity = "0.35";
  setTimeout(function () {
    img.src = srcImagem;
    img.alt = altTexto;
    img.style.opacity = "1";
  }, 120);
}

function buscarNaLoja(texto) {
  termoBusca = texto;
  var q = texto.trim().toLowerCase();
  var caixaSugestoes = document.getElementById("search-suggestions");

  if (q === "") {
    caixaSugestoes.classList.add("escondido");
    renderizarCatalogo();
    return;
  }

  var encontrados = [];
  for (var i = 0; i < catalogoProdutos.length; i++) {
    var p = catalogoProdutos[i];
    if (
      p.nome.toLowerCase().indexOf(q) !== -1 ||
      p.descricao.toLowerCase().indexOf(q) !== -1
    ) {
      encontrados.push(p);
    }
  }

  if (encontrados.length === 0) {
    caixaSugestoes.innerHTML =
      '<div class="search-suggest-header">Pear Spotlight</div>' +
      '<div style="padding:10px 12px; color:#666; font-size:11px;">Nenhum resultado encontrado.</div>';
  } else {
    var html = '<div class="search-suggest-header">PearStore — Resultados</div>';
    for (var j = 0; j < encontrados.length; j++) {
      var prod = encontrados[j];
      html +=
        '<button type="button" class="search-suggest-item" onclick="irParaSugestao(\'' + prod.id + '\')">' +
        "  <strong>" + prod.nome + "</strong>" +
        "  <span>" + formatarMoeda(pegarPrecoProduto(prod)) + "</span>" +
        "</button>";
    }
    caixaSugestoes.innerHTML = html;
  }

  caixaSugestoes.classList.remove("escondido");
  renderizarCatalogo();
}

function irParaSugestao(idProduto) {
  document.getElementById("search-suggestions").classList.add("escondido");
  termoBusca = "";
  document.getElementById("global-search").value = "";
  selecionarCategoria("todos", idProduto);
}

function irParaLojaEnter() {
  document.getElementById("search-suggestions").classList.add("escondido");
  document.getElementById("pearstore").scrollIntoView({ behavior: "smooth" });
}

function mudarNoticia(passo) {
  noticiaAtual = (noticiaAtual + passo + noticiasHotNews.length) % noticiasHotNews.length;
  document.getElementById("news-ticker-text").innerText = noticiasHotNews[noticiaAtual];
}

// Fecha sugestoes de busca ao clicar fora ou modal com ESC
document.addEventListener("click", function (evento) {
  var buscaBox = document.getElementById("global-search-form");
  var sugestoes = document.getElementById("search-suggestions");
  if (!buscaBox.contains(evento.target) && !sugestoes.contains(evento.target)) {
    sugestoes.classList.add("escondido");
  }
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    fecharModal();
  }
});

// Troca noticia sozinha a cada 5 segundos
setInterval(function () {
  mudarNoticia(1);
}, 5000);

// Inicializa a pagina
renderizarCatalogo();
renderizarResumo();
