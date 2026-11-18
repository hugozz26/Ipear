// Lógica da PearStore Online - Programação Web 1 (IFB)

let totalCalculado = 0;

function formatarReal(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const xtCor = document.getElementById("xt-cor");
const xtCapacidade = document.getElementById("xt-capacidade");
const xtPreco = document.getElementById("xt-preco");
const qtdXt = document.getElementById("qtd-xt");

const inputsQtd = document.querySelectorAll(".qtd-input");
const itensResumo = document.getElementById("itens-resumo");
const avisoErro = document.getElementById("aviso-erro");
const areaCalculo = document.getElementById("area-calculo");
const valorTotalEl = document.getElementById("valor-total");
const avisoAlterado = document.getElementById("aviso-alterado");

const boxPix = document.getElementById("box-pix");
const boxCartao = document.getElementById("box-cartao");
const selectParcelas = document.getElementById("select-parcelas");
const btnConfirmar = document.getElementById("btn-confirmar");
const msgFinalizado = document.getElementById("msg-finalizado");

function atualizarPearPhoneXT() {
  const opcao = xtCapacidade.options[xtCapacidade.selectedIndex];
  const preco = Number(xtCapacidade.value);

  xtPreco.textContent = formatarReal(preco);
  qtdXt.dataset.preco = String(preco);
  qtdXt.dataset.nome = "PearPhone XT (" + opcao.dataset.gb + " - " + xtCor.value + ")";

  atualizarResumo();
  marcarAlterado();
}

function lerQuantidade(input) {
  const n = parseInt(input.value, 10);
  if (isNaN(n) || n < 0) return 0;
  return Math.min(50, n);
}

function atualizarResumo() {
  itensResumo.innerHTML = "";
  let totalUnidades = 0;

  inputsQtd.forEach(function (input) {
    const qtd = lerQuantidade(input);
    if (qtd > 0) {
      totalUnidades += qtd;
      const linha = document.createElement("div");
      linha.className = "item-linha";

      const nome = document.createElement("span");
      nome.textContent = qtd + "x " + input.dataset.nome;

      const subtotal = document.createElement("strong");
      subtotal.textContent = formatarReal(qtd * Number(input.dataset.preco));

      linha.appendChild(nome);
      linha.appendChild(subtotal);
      itensResumo.appendChild(linha);
    }
  });

  if (totalUnidades === 0) {
    const vazio = document.createElement("p");
    vazio.className = "vazio";
    vazio.textContent = "Nenhum item selecionado ainda.";
    itensResumo.appendChild(vazio);
  }
}

function marcarAlterado() {
  if (!areaCalculo.hidden) {
    avisoAlterado.hidden = false;
    msgFinalizado.hidden = true;
  }
}

function calcularCompra() {
  let soma = 0;
  let unidades = 0;

  inputsQtd.forEach(function (input) {
    const qtd = lerQuantidade(input);
    input.value = String(qtd);
    soma += qtd * Number(input.dataset.preco);
    unidades += qtd;
  });

  if (unidades === 0) {
    avisoErro.textContent = "Selecione pelo menos 1 produto antes de calcular.";
    avisoErro.hidden = false;
    areaCalculo.hidden = true;
    totalCalculado = 0;
    return;
  }

  avisoErro.hidden = true;
  avisoAlterado.hidden = true;
  msgFinalizado.hidden = true;

  totalCalculado = soma;
  valorTotalEl.textContent = formatarReal(totalCalculado);
  areaCalculo.hidden = false;

  atualizarPagamento();
}

function atualizarPagamento() {
  const radio = document.querySelector('input[name="pagamento"]:checked');
  msgFinalizado.hidden = true;
  avisoErro.hidden = true;

  if (!radio) {
    boxPix.hidden = true;
    boxCartao.hidden = true;
    btnConfirmar.hidden = true;
    return;
  }

  if (radio.value === "pix") {
    const desconto = Math.round(totalCalculado * 0.05 * 100) / 100;
    const totalFinal = totalCalculado - desconto;

    document.getElementById("pix-bruto").textContent = formatarReal(totalCalculado);
    document.getElementById("pix-desconto").textContent = "- " + formatarReal(desconto);
    document.getElementById("pix-final").textContent = formatarReal(totalFinal);

    boxPix.hidden = false;
    boxCartao.hidden = true;
  } else {
    const parcelas = Number(selectParcelas.value);
    const valorParcela = totalCalculado / parcelas;

    document.getElementById("cartao-parcela").textContent = parcelas + "x de " + formatarReal(valorParcela);
    document.getElementById("cartao-total").textContent = formatarReal(totalCalculado);

    boxCartao.hidden = false;
    boxPix.hidden = true;
  }
  btnConfirmar.hidden = false;
}

function finalizarPedido() {
  if (!avisoAlterado.hidden) {
    avisoErro.textContent = "As quantidades mudaram. Clique em Calcular Valor da Compra primeiro.";
    avisoErro.hidden = false;
    return;
  }

  const radio = document.querySelector('input[name="pagamento"]:checked');
  if (!radio) return;

  if (radio.value === "pix") {
    const desconto = Math.round(totalCalculado * 0.05 * 100) / 100;
    msgFinalizado.textContent = "Pedido confirmado! Pagamento em Dinheiro/PIX com 5% de desconto: " + formatarReal(totalCalculado - desconto) + ".";
  } else {
    const parcelas = Number(selectParcelas.value);
    msgFinalizado.textContent = "Pedido confirmado! Pagamento no Cartão em " + parcelas + "x de " + formatarReal(totalCalculado / parcelas) + ".";
  }
  msgFinalizado.hidden = false;
}

function zerarPedido() {
  inputsQtd.forEach(function (input) { input.value = "0"; });
  document.querySelectorAll('input[name="pagamento"]').forEach(function (r) { r.checked = false; });
  totalCalculado = 0;
  avisoErro.hidden = true;
  avisoAlterado.hidden = true;
  areaCalculo.hidden = true;
  boxPix.hidden = true;
  boxCartao.hidden = true;
  btnConfirmar.hidden = true;
  msgFinalizado.hidden = true;
  atualizarResumo();
}

function filtrarProdutos(categoria, texto) {
  const termo = (texto || "").trim().toLowerCase();
  let visiveis = 0;

  document.querySelectorAll(".filtro-btn").forEach(function (btn) {
    btn.classList.toggle("ativo", btn.dataset.categoria === categoria);
  });

  document.querySelectorAll(".produto-card").forEach(function (card) {
    const bateCategoria = categoria === "todos" || card.dataset.categoria === categoria;
    const textoCard = (card.textContent + " " + card.dataset.busca).toLowerCase();
    const mostrar = bateCategoria && (termo === "" || textoCard.includes(termo));
    card.hidden = !mostrar;
    if (mostrar) visiveis++;
  });

  document.getElementById("sem-resultados").hidden = visiveis > 0;
}

// Eventos
xtCor.addEventListener("change", atualizarPearPhoneXT);
xtCapacidade.addEventListener("change", atualizarPearPhoneXT);

document.querySelectorAll(".btn-qtd").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const input = btn.parentElement.querySelector(".qtd-input");
    input.value = String(Math.min(50, Math.max(0, lerQuantidade(input) + Number(btn.dataset.delta))));
    avisoErro.hidden = true;
    atualizarResumo();
    marcarAlterado();
  });
});

inputsQtd.forEach(function (input) {
  input.addEventListener("input", function () {
    avisoErro.hidden = true;
    atualizarResumo();
    marcarAlterado();
  });
  input.addEventListener("blur", function () {
    input.value = String(lerQuantidade(input));
  });
});

document.getElementById("btn-calcular").addEventListener("click", calcularCompra);
document.getElementById("btn-limpar").addEventListener("click", zerarPedido);
document.getElementById("btn-confirmar").addEventListener("click", finalizarPedido);
selectParcelas.addEventListener("change", atualizarPagamento);

document.querySelectorAll('input[name="pagamento"]').forEach(function (radio) {
  radio.addEventListener("change", atualizarPagamento);
});

document.querySelectorAll(".filtro-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    filtrarProdutos(btn.dataset.categoria, document.getElementById("campo-busca").value);
  });
});

document.querySelectorAll("[data-filtro]").forEach(function (link) {
  link.addEventListener("click", function () {
    filtrarProdutos(link.dataset.filtro, "");
    document.getElementById("campo-busca").value = "";
  });
});

document.getElementById("campo-busca").addEventListener("input", function (e) {
  filtrarProdutos("todos", e.target.value);
});

document.getElementById("campo-busca").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("pearstore").scrollIntoView({ behavior: "smooth" });
  }
});

document.getElementById("btn-specs").addEventListener("click", function (e) {
  e.preventDefault();
  const box = document.getElementById("specs-box");
  box.hidden = !box.hidden;
});
