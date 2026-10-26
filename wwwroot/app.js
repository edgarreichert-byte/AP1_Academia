(function () {
  'use strict';

  // --- CONFIGURAÇÃO DA API ---
  const API_URL = (window.location.origin.startsWith('http') && window.location.port === '5098')
    ? '/api/personal'
    : 'http://localhost:5098/api/personal';

  // Estado em memória (espelho sincronizado com a API)
  let personaisCache = [];
  let modoAtual = 'create'; // 'create' | 'edit'
  let personalSendoEditadoId = null;
  let personalParaDeletar = null;

  // --- REFERÊNCIAS DO DOM ---
  const form = document.getElementById('personal-form');
  const inputIdHidden = document.getElementById('personal-id');
  const inputIdDisplay = document.getElementById('personal-id-display');
  const inputNome = document.getElementById('personal-nome');
  const inputTipo = document.getElementById('personal-tipo');
  const btnSubmit = document.getElementById('btn-submit');
  const btnSubmitText = document.getElementById('btn-submit-text');
  const btnSubmitIcon = document.getElementById('btn-submit-icon');
  const btnReset = document.getElementById('btn-reset');
  const btnNovo = document.getElementById('btn-novo');
  const formHeading = document.getElementById('form-heading');
  const formModeBadge = document.getElementById('form-mode-badge');
  const nomeError = document.getElementById('nome-error');
  const tipoError = document.getElementById('tipo-error');

  const searchInput = document.getElementById('search-input');
  const filterTipo = document.getElementById('filter-tipo');
  const personaisTable = document.getElementById('personais-table');
  const tbody = document.getElementById('personais-tbody');
  const recordCount = document.getElementById('record-count');
  const loadingState = document.getElementById('loading-state');
  const emptyState = document.getElementById('empty-state');
  const emptyDesc = document.getElementById('empty-desc');
  const toast = document.getElementById('toast-message');

  // Modal de Exclusão
  const deleteDialog = document.getElementById('delete-dialog');
  const deleteTargetName = document.getElementById('delete-target-name');
  const btnConfirmDelete = document.getElementById('btn-confirm-delete');
  const btnCancelDelete = document.getElementById('btn-cancel-delete');

  let toastTimeoutId = null;

  // --- FEEDBACK E MENSAGENS (TOAST) ---
  function exibirMensagem(texto, tipo = 'success') {
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }

    toast.className = `toast toast-${tipo}`;
    toast.textContent = texto;
    toast.hidden = false;

    toastTimeoutId = setTimeout(() => {
      toast.hidden = true;
    }, 4500);
  }

  function limparErros() {
    nomeError.hidden = true;
    nomeError.textContent = '';
    inputNome.removeAttribute('aria-invalid');

    if (tipoError) {
      tipoError.hidden = true;
      tipoError.textContent = '';
      inputTipo.removeAttribute('aria-invalid');
    }
  }

  function mostrarErroValidacao(campo, elementoErro, mensagem) {
    elementoErro.textContent = mensagem;
    elementoErro.hidden = false;
    campo.setAttribute('aria-invalid', 'true');
    campo.focus();
  }

  // Controle de estado visual de carregamento
  function definirCarregando(carregando, mensagem = 'Carregando dados da API...') {
    if (carregando) {
      loadingState.hidden = false;
      const loadingText = loadingState.querySelector('.loading-text');
      if (loadingText) loadingText.textContent = mensagem;
      personaisTable.hidden = true;
      emptyState.hidden = true;
    } else {
      loadingState.hidden = true;
    }
  }

  // Desabilitar botões durante requisições de gravação
  function definirBloqueioFormulario(bloqueado) {
    btnSubmit.disabled = bloqueado;
    btnReset.disabled = bloqueado;
    btnNovo.disabled = bloqueado;
  }

  // --- POPULAR OPÇÕES DO FILTRO DINAMICAMENTE ---
  function atualizarOpcoesFiltroTipo() {
    const tipos = Array.from(new Set(personaisCache.map(p => (p.tipo || '').trim()).filter(Boolean)));
    const valorAtual = filterTipo.value;

    filterTipo.innerHTML = '';
    const optTodos = document.createElement('option');
    optTodos.value = 'all';
    optTodos.textContent = 'Todos os tipos';
    filterTipo.appendChild(optTodos);

    tipos.forEach(tipo => {
      const opt = document.createElement('option');
      opt.value = tipo.toLowerCase();
      opt.textContent = tipo;
      filterTipo.appendChild(opt);
    });

    if (Array.from(filterTipo.options).some(o => o.value === valorAtual)) {
      filterTipo.value = valorAtual;
    } else {
      filterTipo.value = 'all';
    }
  }

  // --- RENDERIZAÇÃO DA TABELA (XSS-SAFE VIA textContent) ---
  function renderizarTabela() {
    const termoBusca = (searchInput.value || '').trim().toLowerCase();
    const filtroTipoSelecionado = filterTipo.value.toLowerCase();

    const filtrados = personaisCache.filter(item => {
      const nomeStr = (item.nome || '').toLowerCase();
      const tipoStr = (item.tipo || '').toLowerCase();
      const bateTermo = !termoBusca || nomeStr.includes(termoBusca) || tipoStr.includes(termoBusca);
      const bateTipo = filtroTipoSelecionado === 'all' || tipoStr === filtroTipoSelecionado;
      return bateTermo && bateTipo;
    });

    tbody.innerHTML = '';

    if (personaisCache.length === 0) {
      personaisTable.hidden = true;
      emptyState.hidden = false;
      emptyDesc.textContent = 'Nenhum personal cadastrado na API. Use o formulário para adicionar o primeiro.';
      recordCount.textContent = 'Nenhum registro encontrado';
      return;
    }

    if (filtrados.length === 0) {
      personaisTable.hidden = true;
      emptyState.hidden = false;
      emptyDesc.textContent = 'Nenhum personal corresponde aos filtros aplicados. Tente limpar a busca.';
      recordCount.textContent = `0 de ${personaisCache.length} personais`;
      return;
    }

    emptyState.hidden = true;
    personaisTable.hidden = false;

    filtrados.forEach(personal => {
      const tr = document.createElement('tr');
      if (personalSendoEditadoId === personal.id) {
        tr.style.backgroundColor = 'var(--color-accent-light)';
      }

      // ID (com textContent)
      const tdId = document.createElement('td');
      tdId.className = 'col-id';
      tdId.textContent = `#${personal.id}`;

      // Nome (com textContent para proteger contra XSS)
      const tdNome = document.createElement('td');
      tdNome.className = 'col-nome';
      tdNome.textContent = personal.nome || '(Sem nome)';

      // Tipo / Especialidade (com textContent)
      const tdTipo = document.createElement('td');
      tdTipo.className = 'col-tipo';
      const badgeTipo = document.createElement('span');
      badgeTipo.className = 'badge-tipo';
      badgeTipo.textContent = personal.tipo || 'Geral';
      tdTipo.appendChild(badgeTipo);

      // Coluna de Ações
      const tdAcoes = document.createElement('td');
      tdAcoes.className = 'col-actions';
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'actions-wrapper';

      // Botão Editar
      const btnEditar = document.createElement('button');
      btnEditar.type = 'button';
      btnEditar.className = 'btn btn-outline btn-sm';
      btnEditar.setAttribute('aria-label', `Editar dados de ${personal.nome}`);
      btnEditar.textContent = 'Editar';
      btnEditar.addEventListener('click', () => carregarParaEdicao(personal));

      // Botão Excluir
      const btnDeletar = document.createElement('button');
      btnDeletar.type = 'button';
      btnDeletar.className = 'btn btn-danger btn-sm';
      btnDeletar.setAttribute('aria-label', `Excluir ${personal.nome} da API`);
      btnDeletar.textContent = 'Excluir';
      btnDeletar.addEventListener('click', () => abrirConfirmacaoExclusao(personal));

      actionsDiv.appendChild(btnEditar);
      actionsDiv.appendChild(btnDeletar);
      tdAcoes.appendChild(actionsDiv);

      tr.appendChild(tdId);
      tr.appendChild(tdNome);
      tr.appendChild(tdTipo);
      tr.appendChild(tdAcoes);

      tbody.appendChild(tr);
    });

    recordCount.textContent = `Exibindo ${filtrados.length} de ${personaisCache.length} personais cadastrados`;
  }

  // --- REQUISIÇÃO: LISTAR PERSONAIS (GET /api/personal) ---
  async function carregarPersonais() {
    definirCarregando(true, 'Carregando personais da API...');
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Falha ao obter lista de personais. Status HTTP: ${response.status} (${response.statusText})`);
      }

      const dados = await response.json();
      personaisCache = Array.isArray(dados) ? dados : [];
      atualizarOpcoesFiltroTipo();
      definirCarregando(false);
      renderizarTabela();
    } catch (erro) {
      definirCarregando(false);
      personaisTable.hidden = true;
      emptyState.hidden = false;
      emptyDesc.textContent = `Erro ao carregar dados: ${erro.message}. Verifique se a API está em execução em ${API_URL}.`;
      exibirMensagem(`Erro na comunicação com a API: ${erro.message}`, 'danger');
    }
  }

  // --- GERENCIAMENTO DO MODO DO FORMULÁRIO ---
  function alternarModoCriacao() {
    modoAtual = 'create';
    personalSendoEditadoId = null;

    form.reset();
    limparErros();

    inputIdHidden.value = '';
    inputIdDisplay.value = 'Gerado automaticamente pela API';

    formHeading.textContent = 'Novo Personal';
    formModeBadge.textContent = 'Modo: Cadastro';
    formModeBadge.className = 'mode-badge mode-create';

    btnSubmitText.textContent = 'Adicionar Personal';
    btnSubmitIcon.textContent = '➕';
    btnSubmit.className = 'btn btn-primary';

    renderizarTabela();
  }

  function carregarParaEdicao(personal) {
    modoAtual = 'edit';
    personalSendoEditadoId = personal.id;
    limparErros();

    inputIdHidden.value = personal.id;
    inputIdDisplay.value = `#${personal.id} (Em edição)`;
    inputNome.value = personal.nome || '';
    inputTipo.value = personal.tipo || '';

    formHeading.textContent = `Editando Personal #${personal.id}`;
    formModeBadge.textContent = 'Modo: Edição';
    formModeBadge.className = 'mode-badge mode-edit';

    btnSubmitText.textContent = 'Salvar Alterações';
    btnSubmitIcon.textContent = '💾';
    btnSubmit.className = 'btn btn-primary';

    inputNome.focus();
    renderizarTabela();
    exibirMensagem(`Dados do personal #${personal.id} carregados para edição.`, 'info');
  }

  // --- SUBMISSÃO DO FORMULÁRIO (CRIAR / ATUALIZAR) ---
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    limparErros();

    const nome = inputNome.value.trim();
    const tipo = inputTipo.value.trim();

    // Validação de entrada
    if (!nome) {
      mostrarErroValidacao(inputNome, nomeError, 'Por favor, informe o nome do personal.');
      return;
    }
    if (!tipo) {
      mostrarErroValidacao(inputTipo, tipoError, 'Por favor, informe o tipo ou especialidade.');
      return;
    }

    definirBloqueioFormulario(true);

    try {
      if (modoAtual === 'create') {
        // --- POST /api/personal ---
        const payload = { nome, tipo };
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Falha ao cadastrar personal. Status HTTP: ${response.status} (${response.statusText})`);
        }

        const criado = await response.json();
        exibirMensagem(`Personal "${criado.nome || nome}" cadastrado com sucesso (ID #${criado.id})!`, 'success');
        alternarModoCriacao();
        // Recarregar os dados após gravação
        await carregarPersonais();

      } else if (modoAtual === 'edit') {
        // --- PUT /api/personal/{id} ---
        const payload = { nome, tipo };
        const urlEdicao = `${API_URL}/${personalSendoEditadoId}`;
        const response = await fetch(urlEdicao, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Falha ao atualizar personal #${personalSendoEditadoId}. Status HTTP: ${response.status} (${response.statusText})`);
        }

        exibirMensagem(`Personal #${personalSendoEditadoId} atualizado com sucesso no banco de dados!`, 'success');
        alternarModoCriacao();
        // Recarregar os dados após gravação
        await carregarPersonais();
      }
    } catch (erro) {
      exibirMensagem(`Erro na gravação: ${erro.message}`, 'danger');
    } finally {
      definirBloqueioFormulario(false);
    }
  });

  // --- BOTÕES DE RESET / CANCELAR ---
  btnReset.addEventListener('click', () => {
    alternarModoCriacao();
    exibirMensagem('Formulário redefinido para modo de cadastro.', 'info');
  });

  btnNovo.addEventListener('click', () => {
    alternarModoCriacao();
    inputNome.focus();
  });

  // --- EXCLUSÃO (DELETE /api/personal/{id}) ---
  function abrirConfirmacaoExclusao(personal) {
    personalParaDeletar = personal;
    deleteTargetName.textContent = `"${personal.nome}" (ID #${personal.id})`;

    if (typeof deleteDialog.showModal === 'function') {
      deleteDialog.showModal();
    } else {
      if (confirm(`Deseja realmente remover o personal "${personal.nome}" (ID #${personal.id}) da API?`)) {
        confirmarExclusao();
      }
    }
  }

  function fecharConfirmacaoExclusao() {
    personalParaDeletar = null;
    if (deleteDialog.open) {
      deleteDialog.close();
    }
  }

  async function confirmarExclusao() {
    if (!personalParaDeletar) return;

    const idRemover = personalParaDeletar.id;
    const nomeRemover = personalParaDeletar.nome;

    btnConfirmDelete.disabled = true;
    btnCancelDelete.disabled = true;

    try {
      const urlDelete = `${API_URL}/${idRemover}`;
      const response = await fetch(urlDelete, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Falha ao excluir personal #${idRemover}. Status HTTP: ${response.status} (${response.statusText})`);
      }

      // Se estava em edição do mesmo item excluído, reseta o form
      if (personalSendoEditadoId === idRemover) {
        alternarModoCriacao();
      }

      fecharConfirmacaoExclusao();
      exibirMensagem(`Personal "${nomeRemover}" (ID #${idRemover}) removido com sucesso da API!`, 'success');

      // Recarregar os dados após exclusão
      await carregarPersonais();
    } catch (erro) {
      fecharConfirmacaoExclusao();
      exibirMensagem(`Erro ao excluir: ${erro.message}`, 'danger');
    } finally {
      btnConfirmDelete.disabled = false;
      btnCancelDelete.disabled = false;
    }
  }

  btnConfirmDelete.addEventListener('click', confirmarExclusao);
  btnCancelDelete.addEventListener('click', fecharConfirmacaoExclusao);

  deleteDialog.addEventListener('cancel', () => {
    personalParaDeletar = null;
  });

  // --- EVENTOS DE FILTRO E BUSCA ---
  searchInput.addEventListener('input', renderizarTabela);
  filterTipo.addEventListener('change', renderizarTabela);

  // --- INICIALIZAÇÃO: CARREGAR DADOS REAIS DA API ---
  alternarModoCriacao();
  carregarPersonais();
})();
