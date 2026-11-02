# 📦 CONTROLE DE ESTOQUE

> Sistema Web Full-Stack profissional para controle físico de mercadorias, doces, pães, biscoitos, chocolates, balas, descartáveis e insumos.

---

## 🚫 Regra Absoluta de Negócio

* **Zero Informações Financeiras**: Não contém campos de preços, custos, faturamento, dinheiro ou relatórios monetários.
* **Gestão Físico-Quantitativa Estrita**: Controle centrado em unidades, pacotes, caixas, fardos, quilogramas e litros.

---

## ✨ Principais Funcionalidades

1. **Painel Inicial (Dashboard em Tempo Real)**
   * Métricas de estoque total, produtos cadastrados e saldo por unidade de medida.
   * Alertas automáticos de produtos em estoque baixo (abaixo da margem mínima).
   * Alertas visuais de produtos vencidos e com vencimento próximo (7, 15 e 30 dias).
   * Painel de trocas pendentes, aguardando reposição e concluídas.
   * Gráficos comparativos de entradas, saídas, avarias e reposições.

2. **Cadastro & Catálogo de Produtos**
   * Código único (SKU), código de barras EAN opcional, marca, categoria e fornecedor.
   * Controle de lotes, datas de fabricação e validade.
   * Fotos de produtos com armazenamento persistente em nuvem.
   * **Integridade de Saldo**: O saldo não pode ser alterado por edição comum; correções de inventário exigem justificativa formal no módulo de ajuste auditável.

3. **Entrada de Mercadorias (Recebimento & NF)**
   * Recebimento de notas fiscais com múltiplos produtos por entrada.
   * Anexação persistente e visualização da foto do documento fiscal.
   * Atualização atômica do saldo físico e criação de registros de lotes e movimentações.

4. **Saída de Mercadorias (Baixas Operacionais)**
   * Baixas por venda/operação, consumo interno, perda ou avaria.
   * Validação em tempo real: **impede saídas superiores à quantidade física disponível** (bloqueio de saldo negativo).
   * Recomendação inteligente **FEFO** (*First Expired, First Out*).

5. **Módulo de Trocas e Avarias (Mofo, Quebras e Defeitos)**
   * Registro detalhado de mofo e defeitos com foto da avaria e comprovante da NF.
   * Baixa imediata do estoque comercializável (sem desconto duplicado).
   * Pipeline de status: *Registrada* ➔ *Enviada* ➔ *Em Análise* ➔ *Troca Autorizada* ➔ *Aguardando Reposição* ➔ *Parcialmente Reposta* ➔ *Concluída*.

6. **Controle de Reposições de Troca**
   * Vínculo permanente à ocorrência original de avaria.
   * Suporte a reposições parciais ou integrais com registro de canhoto/NF de troca.
   * Recomposição do saldo físico exclusivamente das unidades efetivamente recebidas (sem duplicar compras).

7. **Lotes & Validades (FEFO)**
   * Filtros dinâmicos por prazos: Vencidos, ≤7 dias, ≤15 dias, ≤30 dias e vigentes.
   * Prioridade de saída destacada para o lote mais antigo.

8. **Fornecedores & Arquivo de Notas Fiscais**
   * Gestão de contatos e histórico de trocas e mercadorias por fornecedor.
   * Arquivo de fotos de notas fiscais com busca e ampliação em tela cheia.

9. **Relatórios Físicos & Auditoria**
   * Relatórios de posição, histórico do livro-razão, perdas por motivo e trocas.
   * Exportação para **CSV** e impressão formatada.
   * Trilha de auditoria permanente (`auditLogs`).

---

## 🛠️ Tecnologias Utilizadas

* **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
* **Backend**: Node.js, Express (`server.ts`)
* **Banco de Dados Persistente**: Firebase Cloud Firestore
* **Autenticação**: Firebase Authentication
* **Armazenamento de Imagens**: Firestore Persistent Storage com compressão client-side
* **Infraestrutura**: Google Cloud Run / Docker

---

## 🚀 Como Executar Localmente

### 1. Clonar o Repositório
```bash
git clone https://github.com/SEU-USUARIO/controle-de-estoque.git
cd controle-de-estoque
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar o Firebase
Certifique-se de que o arquivo `firebase-applet-config.json` contenha as credenciais do seu projeto Firebase:
```json
{
  "projectId": "seu-projeto-firebase",
  "appId": "seu-app-id",
  "apiKey": "sua-api-key",
  "authDomain": "seu-projeto.firebaseapp.com",
  "firestoreDatabaseId": "seu-database-id"
}
```

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse no navegador: `http://localhost:3000`

### 5. Compilar para Produção
```bash
npm run build
npm start
```

---

## 🔥 Deploy no Firebase (Hosting & Regras de Segurança)

O banco de dados Firestore (`ai-studio-9e667570-20aa-4fd8-8443-9648aed6c898`) e as regras de segurança (`firestore.rules`) já foram provisionados e implantados no projeto **`project-9445a66b-ca80-48e1-bae`**.

Para implantar o frontend no **Firebase Hosting**:

1. Instale o Firebase CLI (caso ainda não possua):
```bash
npm install -g firebase-tools
```

2. Faça login com sua conta Google (`thiagorobady84@gmail.com`):
```bash
firebase login
```

3. Compile a aplicação:
```bash
npm run build
```

4. Execute o deploy:
```bash
firebase deploy
```
*O arquivo `firebase.json` já está configurado para direcionar a pasta `dist` com suporte a SPA e as regras do Firestore.*

---

## 🐙 Repositório no GitHub

O repositório já está publicado e ativo no GitHub:
🔗 **https://github.com/thiagorobady84-dotcom/controle-de-estoque**

### Clonar o projeto em qualquer máquina:
```bash
git clone https://github.com/thiagorobady84-dotcom/controle-de-estoque.git
cd controle-de-estoque
npm install
npm run dev
```

### Deploy Contínuo (CI/CD com GitHub Actions):
O fluxo de automação do Firebase Hosting está disponível em `deploy/firebase-hosting-merge.yml`. Para ativá-lo no GitHub:
1. No repositório no GitHub, mova o arquivo para a pasta `.github/workflows/firebase-hosting-merge.yml`.
2. Adicione os segredos do Firebase nas configurações do repositório (**Settings** > **Secrets and variables** > **Actions**).

---

## ☁️ Hospedagem na Nuvem (Outras Opções)

* **Google Cloud Run**: O `Dockerfile` multi-stage já está pronto para deploy em contêiner na porta 3000.
* **Vercel / Netlify**: Conecte o repositório do GitHub e faça o deploy estático com 1 clique (`npm run build`, pasta `dist`).
