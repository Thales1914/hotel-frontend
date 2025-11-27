const BASE_URL = 'https://americoav3-production.up.railway.app/';

const form = document.getElementById('main-form');
const deleteForm = document.getElementById('delete-form');
const updateFormEl = document.getElementById('update-form');
const statusMessage = document.getElementById('status-message');
const resultsList = document.getElementById('results-list');

function showStatus(message, isError) {
    statusMessage.textContent = message;
    statusMessage.className = isError ? 'status-message error' : 'status-message success';
    statusMessage.style.display = 'block';

    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 4000);
}

function updateForm() {
    const entity = document.getElementById('entity-select').value;

    const rgField = document.getElementById('rg');
    const fidelidadeToggle = document.querySelector('#main-form .toggle');
    const funcaoFields = document.getElementById('funcionario-fields');

    if (entity === 'hospedes') {
        rgField.style.display = 'block';
        fidelidadeToggle.style.display = 'flex';
        funcaoFields.style.display = 'none';
    } else {
        rgField.style.display = 'none';
        fidelidadeToggle.style.display = 'none';
        funcaoFields.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', updateForm);

async function handleResponse(response) {
    const data = await response.json();
    showStatus(data.message, !response.ok);
}

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const entity = document.getElementById('entity-select').value;
    const url = `${BASE_URL}/${entity}`;

    const data = {
        cpf: document.getElementById('cpf').value,
        nome: document.getElementById('nome').value,
        idade: parseInt(document.getElementById('idade').value)
    };

    if (entity === 'hospedes') {
        data.rg = document.getElementById('rg').value;
        data.fidelidade = document.getElementById('fidelidade').checked; // CORRIGIDO
    } else {
        data.funcao = document.getElementById('funcao').value; // CORRIGIDO
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    await handleResponse(response);
    listar(entity);
});

async function listar(entity) {
    const url = `${BASE_URL}/${entity}`;
    resultsList.innerHTML = `<li>Carregando ${entity}...</li>`;

    const response = await fetch(url);

    if (!response.ok) {
        resultsList.innerHTML = `<li>Erro ao carregar lista.</li>`;
        return;
    }

    const data = await response.json();
    resultsList.innerHTML = '';

    if (data.length === 0) {
        resultsList.innerHTML = `<li>Nenhum registro encontrado.</li>`;
        return;
    }

    data.forEach(item => {
        const li = document.createElement('li');

        if (entity === 'hospedes') {
            li.innerHTML = `
                <strong>HÓSPEDE</strong><br>
                CPF: ${item.cpf}<br>
                Nome: ${item.nome}<br>
                Idade: ${item.idade}<br>
                RG: ${item.rg}<br>
                Fidelidade: ${item.fidelidade ? 'Sim' : 'Não'}
            `;
        } else {
            li.innerHTML = `
                <strong>FUNCIONÁRIO</strong><br>
                CPF: ${item.cpf}<br>
                Nome: ${item.nome}<br>
                Função: ${item.funcao}
            `;
        }

        resultsList.appendChild(li);
    });
}

deleteForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const entity = document.getElementById('delete-entity-select').value;
    const cpf = document.getElementById('delete-cpf').value;

    const response = await fetch(`${BASE_URL}/${entity}/${cpf}`, {
        method: 'DELETE'
    });

    await handleResponse(response);
    listar(entity);
});

updateFormEl.addEventListener('submit', async function(event) {
    event.preventDefault();

    const entity = document.getElementById('update-entity-select').value;
    const cpf = document.getElementById('update-cpf').value;

    const data = {
        nome: document.getElementById('update-nome').value,
        idade: parseInt(document.getElementById('update-idade').value)
    };

    if (entity === 'hospedes') {
        data.rg = document.getElementById('update-rg').value;
        data.fidelidade = document.getElementById('update-fidelidade').checked; // CORRIGIDO
    } else {
        data.funcao = document.getElementById('update-funcao').value; // CORRIGIDO
    }

    const response = await fetch(`${BASE_URL}/${entity}/${cpf}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    await handleResponse(response);
    listar(entity);
});
