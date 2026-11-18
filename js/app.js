// Script da loja PearStore - 1o ano EMI (IFB)

var totalCompra = 0;

var produtos = [
  { id: "qtd-xt", nome: "PearPhone XT (16 GB - Azul Clássico)", preco: 1799 },
  { id: "qtd-gx", nome: "PearPhone GX (16 GB)", preco: 1399 },
  { id: "qtd-pad", nome: "PearPad 2 (32 GB)", preco: 1699 },
  { id: "qtd-book", nome: 'PearBook Pro 13"', preco: 3499 },
  { id: "qtd-pod", nome: "PearPod Touch (32 GB)", preco: 799 },
  { id: "qtd-kit", nome: "Kit Bumper & PearPods", preco: 149 }
];

function formatarValor(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

function atualizarXT() {
  var cor = document.getElementById("xt-cor").value;
  var capSelect = document.getElementById("xt-cap");
  var preco = Number(capSelect.value);
  var tamanho = capSelect.options[capSelect.selectedIndex].text.split(" ")[0] + " GB";

  produtos[0].preco = preco;
  produtos[0].nome = "PearPhone XT (" + tamanho + " - " + cor + ")";
  document.getElementById("xt-preco").innerText = formatarValor(preco);

  atualizarResumo();
}

function mudarQtd(idCampo, soma) {
  var campo = document.getElementById(idCampo);
  var qtd = Number(campo.value) + soma;

  if (isNaN(qtd) || qtd < 0) qtd = 0;
  if (qtd > 50) qtd = 50;

  campo.value = qtd;
  atualizarResumo();
}

function atualizarResumo() {
  var lista = document.getElementById("lista-resumo");
  var html = "";
  var temItem = false;

  for (var i = 0; i < produtos.length; i++) {
    var campo = document.getElementById(produtos[i].id);
    var qtd = parseInt(campo.value);
    if (isNaN(qtd) || qtd < 0) qtd = 0;

    if (qtd > 0) {
      temItem = true;
      var sub = qtd * produtos[i].preco;
      html += '<div class="item-linha"><span>' + qtd + "x " + produtos[i].nome + "</span><strong>" + formatarValor(sub) + "</strong></div>";
    }
  }

  if (!temItem) {
    html = '<p class="vazio">Nenhum item selecionado ainda.</p>';
  }
  lista.innerHTML = html;

  document.getElementById("erro").classList.add("escondido");
  if (!document.getElementById("resultado").classList.contains("escondido")) {
    document.getElementById("aviso-mudou").classList.remove("escondido");
    document.getElementById("confirmacao").classList.add("escondido");
  }
}

function calcularCompra() {
  var soma = 0;
  var qtdTotal = 0;

  for (var i = 0; i < produtos.length; i++) {
    var campo = document.getElementById(produtos[i].id);
    var qtd = parseInt(campo.value);
    if (isNaN(qtd) || qtd < 0) qtd = 0;
    if (qtd > 50) qtd = 50;
    campo.value = qtd;

    soma += qtd * produtos[i].preco;
    qtdTotal += qtd;
  }

  var erro = document.getElementById("erro");
  var resultado = document.getElementById("resultado");

  if (qtdTotal == 0) {
    erro.innerText = "Selecione pelo menos 1 produto antes de calcular.";
    erro.classList.remove("escondido");
    resultado.classList.add("escondido");
    totalCompra = 0;
    return;
  }

  erro.classList.add("escondido");
  document.getElementById("aviso-mudou").classList.add("escondido");
  document.getElementById("confirmacao").classList.add("escondido");

  totalCompra = soma;
  document.getElementById("total-bruto").innerText = formatarValor(totalCompra);
  resultado.classList.remove("escondido");

  mostrarPagamento();
}

function mostrarPagamento() {
  var opcoes = document.getElementsByName("pagamento");
  var escolhida = "";

  for (var i = 0; i < opcoes.length; i++) {
    if (opcoes[i].checked) {
      escolhida = opcoes[i].value;
    }
  }

  var boxPix = document.getElementById("box-pix");
  var boxCartao = document.getElementById("box-cartao");
  var btnFinalizar = document.getElementById("btn-finalizar");
  document.getElementById("confirmacao").classList.add("escondido");
  document.getElementById("erro").classList.add("escondido");

  if (escolhida == "") {
    boxPix.classList.add("escondido");
    boxCartao.classList.add("escondido");
    btnFinalizar.classList.add("escondido");
    return;
  }

  if (escolhida == "pix") {
    var desconto = totalCompra * 0.05;
    var finalPix = totalCompra - desconto;

    document.getElementById("pix-bruto").innerText = formatarValor(totalCompra);
    document.getElementById("pix-desconto").innerText = "- " + formatarValor(desconto);
    document.getElementById("pix-final").innerText = formatarValor(finalPix);

    boxPix.classList.remove("escondido");
    boxCartao.classList.add("escondido");
  } else {
    var parcelas = Number(document.getElementById("parcelas").value);
    var valorParcela = totalCompra / parcelas;

    document.getElementById("cartao-parcela").innerText = parcelas + "x de " + formatarValor(valorParcela);
    document.getElementById("cartao-total").innerText = formatarValor(totalCompra);

    boxCartao.classList.remove("escondido");
    boxPix.classList.add("escondido");
  }

  btnFinalizar.classList.remove("escondido");
}

function finalizarPedido() {
  var avisoMudou = document.getElementById("aviso-mudou");
  var erro = document.getElementById("erro");

  if (!avisoMudou.classList.contains("escondido")) {
    erro.innerText = "As quantidades mudaram. Clique em Calcular Valor da Compra primeiro.";
    erro.classList.remove("escondido");
    return;
  }

  var opcoes = document.getElementsByName("pagamento");
  var escolhida = "";
  for (var i = 0; i < opcoes.length; i++) {
    if (opcoes[i].checked) escolhida = opcoes[i].value;
  }
  if (escolhida == "") return;

  var msg = document.getElementById("confirmacao");
  if (escolhida == "pix") {
    msg.innerText = "Pedido confirmado! Pagamento em Dinheiro/PIX com 5% de desconto: " + formatarValor(totalCompra * 0.95) + ".";
  } else {
    var parcelas = Number(document.getElementById("parcelas").value);
    msg.innerText = "Pedido confirmado! Pagamento no Cartão em " + parcelas + "x de " + formatarValor(totalCompra / parcelas) + ".";
  }
  msg.classList.remove("escondido");
}

function zerarTudo() {
  for (var i = 0; i < produtos.length; i++) {
    document.getElementById(produtos[i].id).value = 0;
  }

  var opcoes = document.getElementsByName("pagamento");
  for (var j = 0; j < opcoes.length; j++) {
    opcoes[j].checked = false;
  }

  totalCompra = 0;
  document.getElementById("erro").classList.add("escondido");
  document.getElementById("aviso-mudou").classList.add("escondido");
  document.getElementById("resultado").classList.add("escondido");
  document.getElementById("box-pix").classList.add("escondido");
  document.getElementById("box-cartao").classList.add("escondido");
  document.getElementById("btn-finalizar").classList.add("escondido");
  document.getElementById("confirmacao").classList.add("escondido");
  atualizarResumo();
}

function filtrar(categoria) {
  document.getElementById("busca").value = "";

  var botoes = document.getElementsByClassName("btn-filtro");
  for (var i = 0; i < botoes.length; i++) {
    botoes[i].classList.remove("ativo");
  }
  var ativo = document.getElementById("f-" + categoria);
  if (ativo) ativo.classList.add("ativo");

  var cards = document.getElementsByClassName("card");
  for (var j = 0; j < cards.length; j++) {
    if (categoria == "todos" || cards[j].classList.contains("cat-" + categoria)) {
      cards[j].classList.remove("escondido");
    } else {
      cards[j].classList.add("escondido");
    }
  }
  document.getElementById("sem-busca").classList.add("escondido");
}

function buscarProduto() {
  var texto = document.getElementById("busca").value.toLowerCase().trim();
  var cards = document.getElementsByClassName("card");
  var achou = 0;

  var botoes = document.getElementsByClassName("btn-filtro");
  for (var i = 0; i < botoes.length; i++) {
    botoes[i].classList.remove("ativo");
  }
  document.getElementById("f-todos").classList.add("ativo");

  for (var j = 0; j < cards.length; j++) {
    var conteudo = cards[j].innerText.toLowerCase();
    if (texto == "" || conteudo.indexOf(texto) != -1) {
      cards[j].classList.remove("escondido");
      achou++;
    } else {
      cards[j].classList.add("escondido");
    }
  }

  var semBusca = document.getElementById("sem-busca");
  if (achou == 0) {
    semBusca.classList.remove("escondido");
  } else {
    semBusca.classList.add("escondido");
  }
}

function mostrarSpecs() {
  var specs = document.getElementById("specs");
  if (specs.classList.contains("escondido")) {
    specs.classList.remove("escondido");
  } else {
    specs.classList.add("escondido");
  }
}
