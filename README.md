# Página da lista de espera do Forjadev
Essa página está conecta a uma planilha no google sheets que é privada, permitindo apenas inserções ao preencher o formulário.

___
Vou mostrar a integração com Google Sheets via Apps Script. A ideia é: o formulário envia os dados para um Apps Script que atua como webhook e grava direto numa planilha sua.

## **Passo 1 — Crie a planilha**

Acesse [sheets.new](https://sheets.new) e crie uma planilha nova. Dê um nome tipo "ForjaDev · Pesquisa de Leads".

## **Passo 2 — Abra o Apps Script**

Na planilha, vá em **Extensões → Apps Script**. Apague o código que aparecer e cole este:Agora vou atualizar o HTML do formulário para enviar para o webhook:Pronto! Dois arquivos — o formulário atualizado e o script do Apps Script. Agora o passo a passo para ativar:

**No Apps Script:**
1. Cole o código do `forjadev-appscript.js`
2. Salva (Ctrl+S)
3. Clica em **Implantar → Nova implantação**
4. Tipo: **Aplicativo da Web**
5. Executar como: **Eu (sua conta Google)**
6. Quem tem acesso: **Qualquer pessoa**
7. Clica em **Implantar** e autoriza as permissões
8. Copia a **URL do aplicativo da Web** que aparecer

**No HTML do formulário:**
- Abre o arquivo, procura a linha `const WEBHOOK_URL = 'SUA_URL_AQUI'`
- Substitui `SUA_URL_AQUI` pela URL copiada

## **O que acontece quando alguém envia:**
- Uma aba chamada "Leads" é criada automaticamente com cabeçalho laranja no estilo ForjaDev
- Cada envio vira uma nova linha já formatada com data/hora em horário de Brasília
- Todos os campos chegam legíveis — "Transição de carreira", "1-on-1", "R$350–600" etc., não os valores internos

> Uma observação técnica: o Apps Script tem uma limitação de CORS que faz o navegador não conseguir ler a resposta do servidor, mas os dados chegam normalmente na planilha. Por isso o formulário vai direto para a tela de agradecimento sem esperar confirmação — comportamento normal e esperado.
