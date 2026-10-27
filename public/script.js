const API_URL = "/livros";
let livrosCadastrados = [];

function exibirMensagemVazia(mensagem) {
    document.getElementById("lista").innerHTML = `<p class="vazio">${mensagem}</p>`;
}

function aplicarFiltro(livros) {
    const termoBusca = document.getElementById("busca").value.trim().toLowerCase();

    if (!termoBusca) {
        return livros;
    }

    return livros.filter(livro =>
        livro.titulo.toLowerCase().includes(termoBusca)
    );
}

function renderizarLivros(livros) {
    const lista = document.getElementById("lista");

    if (!livros.length) {
        exibirMensagemVazia("Nenhum livro encontrado.");
        return;
    }

    lista.innerHTML = livros.map((livro) => `
        <div class="livro-item">
            <div class="livro-info">
                <strong>${livro.titulo}</strong>
                <span>${livro.autor} • ${livro.ano}</span>
            </div>

            <div class="acoes">
                <button class="editar-btn" onclick="abrirModalEdicao(${livro.id})">Editar</button>
                <button class="excluir-btn" onclick="excluirLivro(${livro.id})">Excluir</button>
            </div>
        </div>
    `).join("");
}

async function carregarLivros() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar os livros");
        }

        livrosCadastrados = await resposta.json();
        renderizarLivros(aplicarFiltro(livrosCadastrados));
    } catch (erro) {
        exibirMensagemVazia("Não foi possível carregar os livros.");
        console.error(erro);
    }
}

async function cadastrarLivro(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const ano = Number(document.getElementById("ano").value);

    if (!titulo || !autor || !ano) {
        alert("Preencha título, autor e ano antes de cadastrar.");
        return;
    }

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ titulo, autor, ano })
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar livro");
        }

        document.getElementById("formLivro").reset();
        await carregarLivros();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar livro.");
    }
}

async function excluirLivro(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir livro");
        }

        await carregarLivros();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao excluir livro.");
    }
}

function abrirModalEdicao(id) {
    const livro = livrosCadastrados.find(item => item.id === id);

    if (!livro) {
        return;
    }

    document.getElementById("editId").value = livro.id;
    document.getElementById("editTitulo").value = livro.titulo;
    document.getElementById("editAutor").value = livro.autor;
    document.getElementById("editAno").value = livro.ano;

    document.getElementById("modalEdicao").classList.remove("hidden");
    document.getElementById("modalEdicao").setAttribute("aria-hidden", "false");
}

function fecharModalEdicao() {
    document.getElementById("modalEdicao").classList.add("hidden");
    document.getElementById("modalEdicao").setAttribute("aria-hidden", "true");
    document.getElementById("formEdicao").reset();
}

async function salvarEdicao(event) {
    event.preventDefault();

    const id = Number(document.getElementById("editId").value);
    const titulo = document.getElementById("editTitulo").value.trim();
    const autor = document.getElementById("editAutor").value.trim();
    const ano = Number(document.getElementById("editAno").value);

    if (!titulo || !autor || !ano) {
        alert("Preencha título, autor e ano para salvar a edição.");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ titulo, autor, ano })
        });

        if (!resposta.ok) {
            throw new Error("Erro ao editar livro");
        }

        fecharModalEdicao();
        await carregarLivros();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao editar livro.");
    }
}

window.abrirModalEdicao = abrirModalEdicao;
window.excluirLivro = excluirLivro;

document.getElementById("formLivro").addEventListener("submit", cadastrarLivro);
document.getElementById("formEdicao").addEventListener("submit", salvarEdicao);
document.getElementById("fecharModal").addEventListener("click", fecharModalEdicao);
document.getElementById("overlayModal").addEventListener("click", fecharModalEdicao);
document.getElementById("busca").addEventListener("input", () => {
    renderizarLivros(aplicarFiltro(livrosCadastrados));
});

document.addEventListener("DOMContentLoaded", carregarLivros);