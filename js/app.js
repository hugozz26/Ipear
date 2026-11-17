/**
 * Pear Company / PearStore Online 2011
 * Lógica em JavaScript Vanilla para catálogo, configurador, cálculo de compra
 * e formas de pagamento (Dinheiro/PIX com 5% de desconto e Cartão até 10x).
 */

(function () {
  "use strict";

  // =========================================================================
  // 1. Dados do Catálogo e Notícias (Pear Company 2011)
  // =========================================================================

  const CATALOGO_PEAR = [
    {
      id: "pearphone-xt",
      nome: "PearPhone XT",
      categoria: "pearphones",
      badge: "Lançamento",
      isNew: true,
      imagem: "assets/img/pearphone-xt-hero.jpg",
      precoBase: 1799,
      descricaoBase: "Tela curva formato pera, PearSiri em português e câmera HD 8MP.",
      specs: {
        Tela: "Retina curva formato pera de 3,5 polegadas (960 × 640 px)",
        Processador: "Chip Pear A5 Dual-Core de 1,0 GHz",
        Assistente: "PearSiri por comando de voz",
        Recursos: "PearChat, SplashFace HD, PearTunes, GPS e bússola",
        Acabamento: "Faixa lateral em aço escovado com traseira colorida"
      }
    },
    {
      id: "pearphone-gx",
      nome: "PearPhone GX (16 GB)",
      categoria: "pearphones",
      badge: "Clássico",
      isNew: false,
      imagem: "assets/img/pearphone-original.jpg",
      precoBase: 1399,
      descricaoBase: "O modelo icônico de 2011 com faixa metálica de sinal e PearChat.",
      specs: {
        Tela: "Display multitoque em formato de pera com vidro reforçado",
        Armazenamento: "16 GB de memória flash",
        Conectividade: "3G, Wi-Fi 802.11n e Bluetooth 2.1",
        Apps: "Messages, Camera, SplashFace, PearTunes e PearPod integrados",
        Cor: "Azul Metálico Clássico"
      }
    },
    {
      id: "pearpad-2",
      nome: "PearPad 2 (32 GB)",
      categoria: "computadores",
      badge: "Novo",
      isNew: true,
      imagem: "assets/img/pearpad-2.jpg",
      precoBase: 1699,
      descricaoBase: "Mais fino, leve e mágico em alumínio escovado com bateria de 10h.",
      specs: {
        Tela: "Display Pera IPS de 9,7 polegadas com retroiluminação LED",
        Espessura: "8,8 mm em corpo unibody de alumínio",
        Bateria: "Até 10 horas de navegação contínua via Wi-Fi",
        Cameras: "Frontal para chamadas de vídeo e traseira HD"
      }
    },
    {
      id: "pearbook-pro",
      nome: 'PearBook Pro 13"',
      categoria: "computadores",
      badge: "Unibody",
      isNew: false,
      imagem: "assets/img/pearbook-pro.jpg",
      precoBase: 3499,
      descricaoBase: "Notebook em alumínio unibody, processador Core i5 e logo iluminado.",
      specs: {
        Tela: 'Widescreen brilhante de 13,3" retroiluminada por LED',
        Processador: "Intel Core i5 Dual-Core de 2,3 GHz",
        Memoria: "4 GB DDR3 + Disco rígido de 320 GB",
        Sistema: "Pear OS X 10.6 Snow Leopard com PearLife"
      }
    },
    {
      id: "pearpod-touch",
      nome: "PearPod Touch (32 GB)",
      categoria: "acessorios",
      badge: "Música",
      isNew: false,
      imagem: "assets/img/pearpod-touch.jpg",
      precoBase: 799,
      descricaoBase: "Sua biblioteca do PearTunes e jogos da App Pear sempre no bolso.",
      specs: {
        Capacidade: "32 GB (até 7.000 músicas no PearTunes)",
        Autonomia: "Até 40 horas de reprodução de áudio",
        Extras: "Inclui fones brancos clássicos e cabo USB Pear"
      }
    },
    {
      id: "pear-kit",
      nome: "Kit Bumper & PearPods",
      categoria: "acessorios",
      badge: "Acessório",
      isNew: false,
      imagem: "assets/img/pear-accessories.jpg",
      precoBase: 149,
      descricaoBase: "Capa Bumper protetora em pera, fones estéreo e carregador USB 5W.",
      specs: {
        Protecao: "Bumper de borracha azul e grafite absorvente de impacto",
        Audio: "Fones PearPods brancos com controle de volume no cabo",
        Energia: "Adaptador de tomada compacto USB 5W bivolt"
      }
    }
  ];

  const NOTICIAS_HOT_NEWS = [
    "Lançamento: Novo PearPhone XT chega à PearStore com 5% de desconto no PIX ou Dinheiro.",
    "PearStore Brasil: Parcele seu PearPhone, PearPad ou PearBook em até 10x sem juros no Cartão.",
    "PearOS 4.3 disponível: SplashFace HD, PeeMiner e PearTunes sincronizados na nuvem.",
    "Frete grátis para todo o Brasil em pedidos acima de R$ 200,00 na PearStore Online."
  ];

  // =========================================================================
  // 2. Estado da Aplicação
  // =========================================================================

  const estado = {
    categoriaAtiva: "todos",
    termoBusca: "",
    xtCor: "Azul Clássico",
    xtCapacidade: "16GB",
    xtPreco: 1799,
    quantidades: {
      "pearphone-xt": 0,
      "pearphone-gx": 0,
      "pearpad-2": 0,
      "pearbook-pro": 0,
      "pearpod-touch": 0,
      "pear-kit": 0
    },
    calculoRealizado: false,
    calculoDesatualizado: false,
    totalCalculado: 0,
    formaPagamento: null, // "pix" | "cartao" | null
    parcelas: 1,
    noticiaAtual: 0
  };

  // =========================================================================
  // 3. Utilitários de Formatação e Segurança
  // =========================================================================

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function escapeHtml(texto) {
    return String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function obterPrecoUnitario(produto) {
    if (produto.id === "pearphone-xt") {
      return estado.xtPreco;
    }
    return produto.precoBase;
  }

  function obterTituloProdutoNoPedido(produto) {
    if (produto.id === "pearphone-xt") {
      return `${produto.nome} (${estado.xtCapacidade} • ${estado.xtCor})`;
    }
    return produto.nome;
  }

  function obterItensSelecionados() {
    return CATALOGO_PEAR
      .filter((prod) => (estado.quantidades[prod.id] || 0) > 0)
      .map((prod) => {
        const quantidade = estado.quantidades[prod.id];
        const precoUnitario = obterPrecoUnitario(prod);
        return {
          id: prod.id,
          nome: obterTituloProdutoNoPedido(prod),
          quantidade,
          precoUnitario,
          subtotal: precoUnitario * quantidade
        };
      });
  }

  // =========================================================================
  // 4. Referências ao DOM
  // =========================================================================

  const els = {
    productGrid: document.getElementById("product-grid"),
    configUnitPrice: document.getElementById("config-unit-price"),
    xtColorSwatches: document.getElementById("xt-color-swatches"),
    xtStorageOptions: document.getElementById("xt-storage-options"),
    storeTabs: document.querySelectorAll(".store-tab"),
    filterStatus: document.getElementById("catalog-filter-status"),
    filterStatusText: document.getElementById("filter-status-text"),
    btnClearFilter: document.getElementById("btn-clear-filter"),
    selectedItemsList: document.getElementById("selected-items-list"),
    totalUnitsBadge: document.getElementById("total-units-badge"),
    calcWarning: document.getElementById("calc-warning"),
    btnCalcular: document.getElementById("btn-calcular"),
    btnLimparPedido: document.getElementById("btn-limpar-pedido"),
    orderCalcBox: document.getElementById("order-calculation-box"),
    displayTotalBruto: document.getElementById("display-total-bruto"),
    staleWarning: document.getElementById("stale-warning"),
    payPixRadio: document.getElementById("pay-pix"),
    payCartaoRadio: document.getElementById("pay-cartao"),
    optPixLabel: document.getElementById("opt-pix-label"),
    optCartaoLabel: document.getElementById("opt-cartao-label"),
    pixResultBox: document.getElementById("pix-result-box"),
    pixValorOriginal: document.getElementById("pix-valor-original"),
    pixValorDesconto: document.getElementById("pix-valor-desconto"),
    pixValorFinal: document.getElementById("pix-valor-final"),
    cartaoResultBox: document.getElementById("cartao-result-box"),
    selectParcelas: document.getElementById("select-parcelas"),
    cartaoQtdParcelas: document.getElementById("cartao-qtd-parcelas"),
    cartaoValorParcela: document.getElementById("cartao-valor-parcela"),
    cartaoTotalGeral: document.getElementById("cartao-total-geral"),
    btnFinalizar: document.getElementById("btn-finalizar"),
    heroMainImg: document.getElementById("hero-main-img"),
    heroViewButtons: document.querySelectorAll(".view-pill"),
    newsTickerText: document.getElementById("news-ticker-text"),
    newsPrev: document.getElementById("news-prev"),
    newsNext: document.getElementById("news-next"),
    globalSearch: document.getElementById("global-search"),
    searchSuggestions: document.getElementById("search-suggestions"),
    modalBackdrop: document.getElementById("mac-modal-backdrop"),
    modalTitle: document.getElementById("modal-window-title"),
    modalBody: document.getElementById("modal-window-body"),
    modalCloseBtn: document.getElementById("modal-close-btn"),
    modalCloseDot: document.getElementById("modal-close-dot")
  };

  // =========================================================================
  // 5. Renderização do Catálogo e Resumo
  // =========================================================================

  function renderizarCatalogo(focusId) {
    const termo = estado.termoBusca.trim().toLowerCase();

    const produtosFiltrados = CATALOGO_PEAR.filter((produto) => {
      const bateCategoria =
        estado.categoriaAtiva === "todos" || produto.categoria === estado.categoriaAtiva;
      const bateBusca =
        !termo ||
        produto.nome.toLowerCase().includes(termo) ||
        produto.descricaoBase.toLowerCase().includes(termo);
      return bateCategoria && bateBusca;
    });

    // Atualiza faixa de filtro ativo
    if (estado.categoriaAtiva !== "todos" || termo) {
      els.filterStatus.hidden = false;
      const partes = [];
      if (estado.categoriaAtiva !== "todos") {
        partes.push(`Categoria: "${estado.categoriaAtiva}"`);
      }
      if (termo) {
        partes.push(`Busca: "${termo}"`);
      }
      els.filterStatusText.textContent = `Exibindo ${produtosFiltrados.length} produto(s) • ${partes.join(" • ")}`;
    } else {
      els.filterStatus.hidden = true;
    }

    if (produtosFiltrados.length === 0) {
      els.productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px; text-align: center; border: 1px dashed #cccccc; border-radius: 5px;">
          <p style="margin: 0 0 10px; color: #555;">Nenhum produto encontrado para "${escapeHtml(termo)}".</p>
          <button type="button" class="silver-btn" id="btn-reset-empty">Mostrar todos os produtos</button>
        </div>
      `;
      const resetEmpty = document.getElementById("btn-reset-empty");
      if (resetEmpty) {
        resetEmpty.addEventListener("click", limparFiltros);
      }
      return;
    }

    els.productGrid.innerHTML = produtosFiltrados
      .map((prod) => {
        const qtd = estado.quantidades[prod.id] || 0;
        const precoUnitario = obterPrecoUnitario(prod);
        const titulo =
          prod.id === "pearphone-xt"
            ? `${prod.nome} (${estado.xtCapacidade})`
            : prod.nome;
        const desc =
          prod.id === "pearphone-xt"
            ? `Cor selecionada: ${estado.xtCor}. ${prod.descricaoBase}`
            : prod.descricaoBase;

        return `
          <article class="product-card ${qtd > 0 ? "has-qty" : ""} ${focusId === prod.id ? "is-highlighted" : ""}" id="card-${prod.id}">
            <div>
              <div class="product-top">
                <span class="product-badge ${prod.isNew ? "is-new" : ""}">${escapeHtml(prod.badge)}</span>
                <button type="button" class="specs-link-btn" data-specs-id="${prod.id}">Especificações &rsaquo;</button>
              </div>
              <div class="product-image-wrap">
                <img src="${prod.imagem}" alt="${escapeHtml(titulo)}">
              </div>
              <h3 class="product-title">${escapeHtml(titulo)}</h3>
              <p class="product-desc">${escapeHtml(desc)}</p>
            </div>
            <div class="product-footer">
              <span class="product-price">${formatarMoeda(precoUnitario)}</span>
              <div class="qty-control" aria-label="Quantidade de ${escapeHtml(prod.nome)}">
                <button type="button" class="qty-btn" data-action="dec" data-id="${prod.id}" aria-label="Diminuir quantidade de ${escapeHtml(prod.nome)}">−</button>
                <input type="number" class="qty-input" id="qty-${prod.id}" data-id="${prod.id}" min="0" max="99" value="${qtd}" aria-label="Quantidade desejada para ${escapeHtml(prod.nome)}">
                <button type="button" class="qty-btn" data-action="inc" data-id="${prod.id}" aria-label="Aumentar quantidade de ${escapeHtml(prod.nome)}">+</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderizarResumoItens() {
    const itens = obterItensSelecionados();
    const totalUnidades = itens.reduce((acc, item) => acc + item.quantidade, 0);

    els.totalUnitsBadge.textContent =
      totalUnidades === 1 ? "1 item" : `${totalUnidades} itens`;

    if (itens.length === 0) {
      els.selectedItemsList.innerHTML = `
        <p class="empty-cart-msg">
          Selecione a quantidade desejada nos produtos ao lado para montar sua compra.
        </p>
      `;
      return;
    }

    els.selectedItemsList.innerHTML = itens
      .map(
        (item) => `
          <div class="cart-item-row">
            <div class="cart-item-info">
              <strong>${item.quantidade}× ${escapeHtml(item.nome)}</strong>
              <small>${formatarMoeda(item.precoUnitario)} cada</small>
            </div>
            <div class="cart-item-right">
              <span>${formatarMoeda(item.subtotal)}</span>
              <button type="button" class="remove-item-btn" data-remove-id="${item.id}">Remover</button>
            </div>
          </div>
        `
      )
      .join("");
  }

  // =========================================================================
  // 6. Cálculos de Compra e Pagamento (Requisitos do Projeto.pdf)
  // =========================================================================

  function atualizarQuantidade(produtoId, novaQtd) {
    const qtdLimpa = Math.max(0, Math.min(99, parseInt(novaQtd, 10) || 0));
    estado.quantidades[produtoId] = qtdLimpa;

    // Atualiza visual do card e sidebar
    renderizarCatalogo();
    renderizarResumoItens();

    // Esconde aviso de erro vazio caso usuário adicione um item
    if (qtdLimpa > 0) {
      els.calcWarning.hidden = true;
    }

    // Se já havia um cálculo exibido, avisa que houve mudança para clicar no botão
    if (estado.calculoRealizado) {
      estado.calculoDesatualizado = true;
      els.staleWarning.hidden = false;
    }
  }

  function calcularCompraAoClicar() {
    const itens = obterItensSelecionados();

    if (itens.length === 0) {
      els.calcWarning.textContent =
        "Escolha pelo menos 1 unidade de algum produto ao lado antes de calcular o valor da compra.";
      els.calcWarning.hidden = false;
      els.orderCalcBox.hidden = true;
      estado.calculoRealizado = false;
      return;
    }

    const totalBruto = itens.reduce((soma, item) => soma + item.subtotal, 0);

    estado.calculoRealizado = true;
    estado.calculoDesatualizado = false;
    estado.totalCalculado = totalBruto;

    els.calcWarning.hidden = true;
    els.staleWarning.hidden = true;
    els.displayTotalBruto.textContent = formatarMoeda(totalBruto);
    els.orderCalcBox.hidden = false;

    // Se uma forma de pagamento já estava selecionada, recalcula automaticamente
    atualizarPainelPagamento();
  }

  function atualizarPainelPagamento() {
    const total = estado.totalCalculado;

    els.optPixLabel.classList.toggle("is-selected", estado.formaPagamento === "pix");
    els.optCartaoLabel.classList.toggle("is-selected", estado.formaPagamento === "cartao");

    if (estado.formaPagamento === "pix") {
      // Dinheiro / PIX: 5% de desconto
      const desconto = total * 0.05;
      const totalComDesconto = total - desconto;

      els.pixValorOriginal.textContent = formatarMoeda(total);
      els.pixValorDesconto.textContent = `- ${formatarMoeda(desconto)}`;
      els.pixValorFinal.textContent = formatarMoeda(totalComDesconto);

      els.pixResultBox.hidden = false;
      els.cartaoResultBox.hidden = true;
      els.btnFinalizar.hidden = false;
    } else if (estado.formaPagamento === "cartao") {
      // Cartão de Crédito: até 10 parcelas
      const qtdParcelas = Math.min(10, Math.max(1, Number(estado.parcelas) || 1));
      const valorParcela = total / qtdParcelas;

      els.cartaoQtdParcelas.textContent = `${qtdParcelas}x sem juros`;
      els.cartaoValorParcela.textContent = formatarMoeda(valorParcela);
      els.cartaoTotalGeral.textContent = formatarMoeda(total);

      els.pixResultBox.hidden = true;
      els.cartaoResultBox.hidden = false;
      els.btnFinalizar.hidden = false;
    } else {
      els.pixResultBox.hidden = true;
      els.cartaoResultBox.hidden = true;
      els.btnFinalizar.hidden = true;
    }
  }

  function zerarPedido() {
    Object.keys(estado.quantidades).forEach((id) => {
      estado.quantidades[id] = 0;
    });
    estado.calculoRealizado = false;
    estado.calculoDesatualizado = false;
    estado.totalCalculado = 0;
    estado.formaPagamento = null;
    estado.parcelas = 1;

    els.payPixRadio.checked = false;
    els.payCartaoRadio.checked = false;
    els.selectParcelas.value = "1";
    els.orderCalcBox.hidden = true;
    els.calcWarning.hidden = true;

    renderizarCatalogo();
    renderizarResumoItens();
    atualizarPainelPagamento();
  }

  // =========================================================================
  // 7. Modais Mac OS X Snow Leopard (Specs, Keynote, App Pear, Suporte, Recibo)
  // =========================================================================

  function abrirModal(titulo, htmlConteudo) {
    els.modalTitle.textContent = titulo;
    els.modalBody.innerHTML = htmlConteudo;
    els.modalBackdrop.hidden = false;
  }

  function fecharModal() {
    els.modalBackdrop.hidden = true;
  }

  function abrirModalSpecs(produtoId) {
    const prod = CATALOGO_PEAR.find((p) => p.id === produtoId);
    if (!prod) return;

    const linhas = Object.entries(prod.specs)
      .map(([chave, valor]) => `<tr><th>${escapeHtml(chave)}</th><td>${escapeHtml(valor)}</td></tr>`)
      .join("");

    abrirModal(
      `Especificações — ${prod.nome}`,
      `
        <div style="display:flex; gap:14px; align-items:center; margin-bottom:12px;">
          <img src="${prod.imagem}" alt="${escapeHtml(prod.nome)}" style="width:110px; height:90px; object-fit:contain;">
          <div>
            <h4 style="margin:0 0 4px; font-size:17px;">${escapeHtml(prod.nome)}</h4>
            <p style="margin:0; color:#555;">${escapeHtml(prod.descricaoBase)}</p>
            <strong style="display:inline-block; margin-top:6px; color:#1b6fc1;">A partir de ${formatarMoeda(prod.precoBase)}</strong>
          </div>
        </div>
        <table class="specs-table">${linhas}</table>
      `
    );
  }

  function abrirModalKeynote() {
    abrirModal(
      "Pear Special Event — Fevereiro de 2011",
      `
        <div style="text-align:center;">
          <img src="assets/img/pearphone-xt-hero.jpg" alt="PearPhone XT" style="max-height:200px; margin:0 auto 12px;">
          <h4 style="margin:0 0 6px; font-size:18px;">“Dois é melhor que um. Apresentamos o PearPhone XT.”</h4>
          <p style="color:#555; margin:0 0 10px;">
            Inspirado nos clássicos aparelhos de 2011, o novo <strong>PearPhone XT</strong> mantém a icônica silhueta em pera com faixa metálica de sinal, ganha o assistente de voz <strong>PearSiri</strong> e estreia em 5 cores vibrantes na <strong>PearStore Online</strong>.
          </p>
          <p style="margin:0; font-size:11px; color:#777;">
            Promoção de lançamento: 5% de desconto no Dinheiro ou PIX, ou até 10x sem juros no Cartão de Crédito.
          </p>
        </div>
      `
    );
  }

  function abrirModalAppPear() {
    abrirModal(
      "Pear App Store & PearTunes 10",
      `
        <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
          <img src="assets/img/pear-appstore.jpg" alt="Pear App Store" style="width:150px; object-fit:contain; margin:0 auto;">
          <div style="flex:1; min-width:220px;">
            <h4 style="margin:0 0 6px; font-size:16px;">Mais de 350.000 aplicativos para seu PearPhone</h4>
            <ul style="margin:0; padding-left:18px; color:#444;">
              <li><strong>SplashFace</strong> — Compartilhe fotos e recados instantâneos.</li>
              <li><strong>PearChat</strong> — Mensagens rápidas em tempo real entre aparelhos Pear.</li>
              <li><strong>PearTunes</strong> — Sincronize músicas, podcasts e vídeos.</li>
              <li><strong>PeeMiner</strong> — O jogo viciante número 1 de 2011.</li>
            </ul>
          </div>
        </div>
      `
    );
  }

  function abrirModalSuporte() {
    abrirModal(
      "Suporte PearCare — Central de Atendimento",
      `
        <h4 style="margin:0 0 8px; font-size:16px;">Como funciona a compra na PearStore Online?</h4>
        <ol style="margin:0 0 12px; padding-left:18px; color:#444;">
          <li>Escolha a cor e capacidade do seu <strong>PearPhone XT</strong> e informe as quantidades desejadas nos produtos do catálogo.</li>
          <li>Clique em <strong>Calcular Valor da Compra</strong> no painel à direita para ver o total detalhado.</li>
          <li>Escolha pagar via <strong>Dinheiro / PIX</strong> (com 5% de desconto automático) ou <strong>Cartão de Crédito</strong> (selecione de 1x até 10x sem juros para ver o valor da parcela).</li>
        </ol>
        <p style="margin:0; color:#666; font-size:11px;">
          Atendimento PearCare: 0800-PEAR-2011 • Garantia limitada de 1 ano em todos os produtos Pear Company.
        </p>
      `
    );
  }

  function abrirComprovantePedido() {
    if (!estado.calculoRealizado || !estado.formaPagamento) return;

    // Garante que o cálculo reflita as quantidades atuais caso tenha ficado pendente
    if (estado.calculoDesatualizado) {
      calcularCompraAoClicar();
    }

    const itens = obterItensSelecionados();
    const total = estado.totalCalculado;
    const codigoPedido = `PEAR-2011-${Math.floor(1000 + Math.random() * 9000)}`;

    const linhasItens = itens
      .map(
        (item) => `
          <div class="receipt-row">
            <span>${item.quantidade}× ${escapeHtml(item.nome)}</span>
            <strong>${formatarMoeda(item.subtotal)}</strong>
          </div>
        `
      )
      .join("");

    let resumoPagamentoHtml = "";
    if (estado.formaPagamento === "pix") {
      const desconto = total * 0.05;
      const finalPix = total - desconto;
      resumoPagamentoHtml = `
        <div class="receipt-row">
          <span>Forma de pagamento</span>
          <strong>Dinheiro / PIX (5% de desconto)</strong>
        </div>
        <div class="receipt-row">
          <span>Desconto aplicado (5%)</span>
          <strong style="color:#1b6f38;">- ${formatarMoeda(desconto)}</strong>
        </div>
        <div class="receipt-total">
          <span>Total Final à Vista</span>
          <span style="color:#145e2e;">${formatarMoeda(finalPix)}</span>
        </div>
      `;
    } else {
      const parcelas = estado.parcelas;
      const valorParcela = total / parcelas;
      resumoPagamentoHtml = `
        <div class="receipt-row">
          <span>Forma de pagamento</span>
          <strong>Cartão de Crédito</strong>
        </div>
        <div class="receipt-row">
          <span>Parcelamento escolhido</span>
          <strong>${parcelas}x de ${formatarMoeda(valorParcela)} sem juros</strong>
        </div>
        <div class="receipt-total">
          <span>Valor Total Parcelado</span>
          <span>${formatarMoeda(total)}</span>
        </div>
      `;
    }

    abrirModal(
      `Comprovante do Pedido #${codigoPedido}`,
      `
        <p style="margin:0 0 10px; color:#1b6f38; font-weight:700;">
          Pedido registrado com sucesso na PearStore Online!
        </p>
        <div class="receipt-box">
          <div style="font-size:11px; color:#666; margin-bottom:8px;">
            Pedido <strong>#${codigoPedido}</strong> • IFB Programação Web 1
          </div>
          ${linhasItens}
          <div style="height:8px;"></div>
          ${resumoPagamentoHtml}
        </div>
        <div style="margin-top:14px; padding-top:10px; border-top:1px solid #e6e6e6; display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
          <button type="button" class="silver-btn" id="btn-novo-pedido">Iniciar Novo Pedido</button>
          <button type="button" class="aqua-pill-btn" id="btn-imprimir-recibo">Imprimir Recibo</button>
        </div>
      `
    );

    const btnNovo = document.getElementById("btn-novo-pedido");
    if (btnNovo) {
      btnNovo.addEventListener("click", () => {
        zerarPedido();
        fecharModal();
      });
    }

    const btnImprimir = document.getElementById("btn-imprimir-recibo");
    if (btnImprimir) {
      btnImprimir.addEventListener("click", () => window.print());
    }
  }

  // =========================================================================
  // 8. Filtros, Busca Spotlight 2011, Ticker e Hero
  // =========================================================================

  function selecionarCategoria(categoria, focusId) {
    estado.categoriaAtiva = categoria || "todos";
    els.storeTabs.forEach((tab) => {
      const ativo = tab.dataset.category === estado.categoriaAtiva;
      tab.classList.toggle("is-active", ativo);
      tab.setAttribute("aria-selected", String(ativo));
    });
    renderizarCatalogo(focusId);

    if (focusId) {
      const card = document.getElementById(`card-${focusId}`);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  function limparFiltros() {
    estado.termoBusca = "";
    els.globalSearch.value = "";
    els.searchSuggestions.hidden = true;
    selecionarCategoria("todos");
  }

  function atualizarSugestoesBusca(texto) {
    const q = texto.trim().toLowerCase();
    if (!q) {
      els.searchSuggestions.hidden = true;
      return;
    }

    const encontrados = CATALOGO_PEAR.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        p.descricaoBase.toLowerCase().includes(q)
    );

    if (encontrados.length === 0) {
      els.searchSuggestions.innerHTML = `
        <div class="search-suggest-header">Pear Spotlight</div>
        <div style="padding:10px 12px; color:#666; font-size:11px;">Nenhum resultado encontrado.</div>
      `;
    } else {
      els.searchSuggestions.innerHTML = `
        <div class="search-suggest-header">PearStore — Resultados</div>
        ${encontrados
          .map(
            (p) => `
              <button type="button" class="search-suggest-item" data-suggest-id="${p.id}">
                <strong>${escapeHtml(p.nome)}</strong>
                <span>${formatarMoeda(obterPrecoUnitario(p))}</span>
              </button>
            `
          )
          .join("")}
      `;
    }
    els.searchSuggestions.hidden = false;
  }

  function atualizarNoticia(indice) {
    estado.noticiaAtual =
      (indice + NOTICIAS_HOT_NEWS.length) % NOTICIAS_HOT_NEWS.length;
    els.newsTickerText.textContent = NOTICIAS_HOT_NEWS[estado.noticiaAtual];
  }

  // =========================================================================
  // 9. Registro de Eventos
  // =========================================================================

  function registrarEventos() {
    // Alternador de visual do Hero
    els.heroViewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        els.heroViewButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        els.heroMainImg.style.opacity = "0.35";
        setTimeout(() => {
          els.heroMainImg.src = btn.dataset.heroSrc;
          els.heroMainImg.alt = btn.dataset.heroAlt;
          els.heroMainImg.style.opacity = "1";
        }, 120);
      });
    });

    // Links do Hero e Footer para Modais
    document.getElementById("btn-hero-keynote").addEventListener("click", (e) => {
      e.preventDefault();
      abrirModalKeynote();
    });
    document.getElementById("btn-hero-specs").addEventListener("click", (e) => {
      e.preventDefault();
      abrirModalSpecs("pearphone-xt");
    });
    document.getElementById("footer-specs-link").addEventListener("click", (e) => {
      e.preventDefault();
      abrirModalSpecs("pearphone-xt");
    });
    document.getElementById("footer-apps-link").addEventListener("click", (e) => {
      e.preventDefault();
      abrirModalAppPear();
    });
    document.getElementById("footer-support-link").addEventListener("click", (e) => {
      e.preventDefault();
      abrirModalSuporte();
    });

    // Barra de Navegação Global 2011
    document.querySelectorAll("#globalnav a").forEach((link) => {
      link.addEventListener("click", (e) => {
        const modalTipo = link.dataset.modal;
        const filtro = link.dataset.filter;
        const scrollAlvo = link.dataset.scroll;

        document.querySelectorAll("#globalnav .gn-item").forEach((li) => {
          li.classList.remove("is-active");
        });
        link.closest(".gn-item").classList.add("is-active");

        if (modalTipo === "apppear") {
          e.preventDefault();
          abrirModalAppPear();
          return;
        }
        if (modalTipo === "suporte") {
          e.preventDefault();
          abrirModalSuporte();
          return;
        }
        if (filtro) {
          selecionarCategoria(filtro);
        }
        if (scrollAlvo) {
          e.preventDefault();
          const alvo = document.querySelector(scrollAlvo);
          if (alvo) alvo.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Cards Promo 2011
    document.querySelectorAll(".promo-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (link.dataset.modal === "apppear") {
          e.preventDefault();
          abrirModalAppPear();
          return;
        }
        if (link.dataset.filter) {
          e.preventDefault();
          const storeEl = document.getElementById("pearstore");
          if (storeEl) storeEl.scrollIntoView({ behavior: "smooth" });
          selecionarCategoria(link.dataset.filter, link.dataset.focusProduct);
        }
      });
    });

    // Busca Global Spotlight
    els.globalSearch.addEventListener("input", (e) => {
      estado.termoBusca = e.target.value;
      atualizarSugestoesBusca(e.target.value);
      renderizarCatalogo();
    });

    els.globalSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        els.searchSuggestions.hidden = true;
        document.getElementById("pearstore").scrollIntoView({ behavior: "smooth" });
      }
    });

    els.searchSuggestions.addEventListener("click", (e) => {
      const btn = e.target.closest(".search-suggest-item");
      if (!btn) return;
      const id = btn.dataset.suggestId;
      els.searchSuggestions.hidden = true;
      estado.termoBusca = "";
      els.globalSearch.value = "";
      selecionarCategoria("todos", id);
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".gn-search")) {
        els.searchSuggestions.hidden = true;
      }
    });

    // Hot News Ticker
    els.newsPrev.addEventListener("click", () => atualizarNoticia(estado.noticiaAtual - 1));
    els.newsNext.addEventListener("click", () => atualizarNoticia(estado.noticiaAtual + 1));
    setInterval(() => atualizarNoticia(estado.noticiaAtual + 1), 5000);

    // Abas da PearStore
    els.storeTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        selecionarCategoria(tab.dataset.category);
      });
    });
    els.btnClearFilter.addEventListener("click", limparFiltros);

    // Configurador PearPhone XT (Cor e Capacidade)
    els.xtColorSwatches.addEventListener("click", (e) => {
      const btn = e.target.closest(".swatch");
      if (!btn) return;
      els.xtColorSwatches.querySelectorAll(".swatch").forEach((b) => {
        b.classList.remove("is-selected");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("is-selected");
      btn.setAttribute("aria-checked", "true");
      estado.xtCor = btn.dataset.color;

      renderizarCatalogo();
      renderizarResumoItens();
    });

    els.xtStorageOptions.addEventListener("click", (e) => {
      const btn = e.target.closest(".storage-btn");
      if (!btn) return;
      els.xtStorageOptions.querySelectorAll(".storage-btn").forEach((b) => {
        b.classList.remove("is-selected");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("is-selected");
      btn.setAttribute("aria-checked", "true");

      estado.xtCapacidade = btn.dataset.storage;
      estado.xtPreco = Number(btn.dataset.price);
      els.configUnitPrice.textContent = formatarMoeda(estado.xtPreco);

      if (estado.calculoRealizado && (estado.quantidades["pearphone-xt"] || 0) > 0) {
        estado.calculoDesatualizado = true;
        els.staleWarning.hidden = false;
      }

      renderizarCatalogo();
      renderizarResumoItens();
    });

    // Eventos delegados na Grade de Produtos (+, -, input e Specs)
    els.productGrid.addEventListener("click", (e) => {
      const specsBtn = e.target.closest("[data-specs-id]");
      if (specsBtn) {
        abrirModalSpecs(specsBtn.dataset.specsId);
        return;
      }

      const qtyBtn = e.target.closest(".qty-btn");
      if (!qtyBtn) return;
      const id = qtyBtn.dataset.id;
      const atual = estado.quantidades[id] || 0;
      const delta = qtyBtn.dataset.action === "inc" ? 1 : -1;
      atualizarQuantidade(id, atual + delta);
    });

    els.productGrid.addEventListener("change", (e) => {
      if (e.target.classList.contains("qty-input")) {
        atualizarQuantidade(e.target.dataset.id, e.target.value);
      }
    });

    // Remover item diretamente do Resumo
    els.selectedItemsList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove-id]");
      if (!btn) return;
      atualizarQuantidade(btn.dataset.removeId, 0);
    });

    // Botão Calcular Valor da Compra (Projeto.pdf)
    els.btnCalcular.addEventListener("click", calcularCompraAoClicar);
    els.btnLimparPedido.addEventListener("click", zerarPedido);

    // Escolha de Forma de Pagamento (PIX 5% ou Cartão até 10x)
    els.payPixRadio.addEventListener("change", () => {
      if (els.payPixRadio.checked) {
        estado.formaPagamento = "pix";
        atualizarPainelPagamento();
      }
    });

    els.payCartaoRadio.addEventListener("change", () => {
      if (els.payCartaoRadio.checked) {
        estado.formaPagamento = "cartao";
        atualizarPainelPagamento();
      }
    });

    els.selectParcelas.addEventListener("change", (e) => {
      estado.parcelas = Number(e.target.value) || 1;
      atualizarPainelPagamento();
    });

    // Emitir comprovante
    els.btnFinalizar.addEventListener("click", abrirComprovantePedido);

    // Fechar modal
    els.modalCloseBtn.addEventListener("click", fecharModal);
    els.modalCloseDot.addEventListener("click", fecharModal);
    els.modalBackdrop.addEventListener("click", (e) => {
      if (e.target === els.modalBackdrop) fecharModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !els.modalBackdrop.hidden) fecharModal();
    });
  }

  // Inicialização
  renderizarCatalogo();
  renderizarResumoItens();
  registrarEventos();
})();
