// ==========================================
// 1. DECLARAÇÃO DE VARIÁVEIS E DOM
// ==========================================
const btnCriarPost = document.getElementById("criarPost"); // Botão "+" para abrir formulário
const modal = document.getElementById("modal"); // Container do modal
const btnCancelar = document.getElementById("cancelar"); // Botão de cancelar do modal
const btnPublicar = document.getElementById("publicar"); // Botão de publicar/salvar
const containerPosts = document.getElementById("post"); // Div onde os posts salvos vão aparecer
const selectFiltro = document.getElementById("viewPost"); // Select de filtro por categoria/tipo

const inputTipo = document.getElementById("tipoPost");
const inputTitulo = document.getElementById("titulo");
const inputTexto = document.getElementById("txt");
const inputFile = document.getElementById("file");
const inputHumor = document.getElementById("humor");
const btnExcluir = document.getElementById("btnExcluir");
let idPostEmEdicao = null;

// Rota base do nosso servidor Node.js (API MVC)
const API_URL = `https://meudiario.onrender.com`;

// ==========================================
// 2. FUNÇÕES AUXILIARES E UPLOAD
// ==========================================
function limparFormulario() {
  inputTipo.selectedIndex = 0;
  inputTitulo.value = "";
  inputTexto.value = "";
  inputFile.value = "";
  inputHumor.selectedIndex = 0;
  idPostEmEdicao = null;
}
async function apagarImagem() {}
async function enviarImagem() {
  const arquivo = inputFile.files[0];

  // Se não escolheu imagem
  if (!arquivo) {
    return "";
  }

  const formData = new FormData();

  formData.append("file", arquivo);
  formData.append("upload_preset", "MeuDiario");

  const resposta = await fetch(
    "https://api.cloudinary.com/v1_1/franfds/image/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const resultado = await resposta.json();

  console.log("Cloudinary:", resultado);

  return resultado.secure_url;
}

// ==========================================
// 3. CARREGAMENTO DE POSTS
// ==========================================
async function carregarPosts() {
    containerPosts.innerHTML = `
   <div class="loading">
  <div class="loading-text">
    <span class="loading-text-words">L</span>
    <span class="loading-text-words">O</span>
    <span class="loading-text-words">A</span>
    <span class="loading-text-words">D</span>
    <span class="loading-text-words">I</span>
    <span class="loading-text-words">N</span>
    <span class="loading-text-words">G</span>
  </div>
</div>
  `;
  
  try {
    const res = await fetch(`${API_URL}/posts`);
    const post = await res.json();
    containerPosts.innerHTML = "";
    post.forEach((post) => {
      containerPosts.innerHTML += `
  <article class="post ${post.tipo_post}">
<div class="hora">${post.criado_em}</div>
    <h2>${post.titulo}</h2>

    

    ${post.humor ? `<span>Humor: ${post.humor}</span>` : ""}
      <p>${post.texto}</p>
    ${post.url ? ` <img class="" src="${post.url}" alt="Imagem do post"> ` : ""}

    <button class="editar" data-id="${post.id}">✏️</button>

    <button class="excluir" data-id="${post.id}">🗑️</button>

  </article>
`;
    });
  } catch (erro) {
    containerPosts.innerHTML = `
      <h1>Erro em carregar post:</h1>
      <p>${erro}</p>`;
  }
}

// ==========================================
// 4. EVENTOS DE INTERFACE E MODAL
// ==========================================
btnCriarPost.addEventListener("click", () => {
  limparFormulario();
  modal.style.display = "flex";
});

btnCancelar.addEventListener("click", () => {
  limparFormulario();
  modal.style.display = "none";
});

btnPublicar.addEventListener("click", async () => {
  try {
    // 1. Envia a imagem para o Cloudinary
    const urlImagem = await enviarImagem();

    console.log("URL da imagem:", urlImagem);

    // 2. Monta os dados do post
    const dados = {
      TipoPost: inputTipo.value,
      TipoHumor: inputHumor.value,
      Titulo: inputTitulo.value,
      Texto: inputTexto.value,
      Url: urlImagem,
    };

    // 3. Envia os dados para o Node
    const resposta = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    }).then(await carregarPosts(), window.location.reload());

    // 4. Fecha o modal
  } catch (erro) {
    console.error("Erro ao publicar:", erro);
  }
});

// EXCLUIR POSTS
containerPosts.addEventListener("click", async (event) => {
  if (event.target.classList.contains("excluir")) {
    if (
      confirm(
        "Você sabe que está excluindo um momento da sua vida né, \n" +
          "deseja prosseguir? ESSA AÇÃO NÃO PODERA SER DESFEITA",
      ) == true
    ) {
      if (confirm("CERTEZA?")) {
        try {
          const id = event.target.dataset.id;
          const resposta = await fetch(`${API_URL}/posts/${id}`, {
            method: "DELETE",
          }).then(await carregarPosts(), window.location.reload());
        } catch (erro) {
          console.error("Erro ao apagar: ", erro);
        }
      }
    } else {
      console.log("");
    }
    carregarPosts();
  }
});

// ==========================================
// 5. INICIALIZAÇÃO
// ==========================================
carregarPosts();