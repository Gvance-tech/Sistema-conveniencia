<div align="center">

# 🏪 Sistema de Conveniência

**Organize fiados, notas, festas e o saldo atual da sua loja — tudo em um só app.**

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Knex](https://img.shields.io/badge/Knex.js-D26B38?style=for-the-badge&logo=knexdotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Insomnia](https://img.shields.io/badge/Insomnia-4000BF?style=for-the-badge&logo=insomnia&logoColor=white)
![License](https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge)

</div>

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Testando a API com Insomnia](#-testando-a-api-com-insomnia)
- [Licença](#-licença)

---

## 📖 Sobre o projeto

O **Sistema de Conveniência** tem o objetivo de organizar, em um único lugar, as informações do dia a dia de uma loja de conveniência: **listas de fiados**, **lista de notas**, **lista de festas** e o **saldo atual da loja**.

Com ele, o comerciante deixa de depender de cadernos e anotações soltas, tendo controle claro de quem deve, quanto deve, quais festas estão agendadas e como está o caixa.

## ✨ Funcionalidades

- 📒 **Fiados** — cadastro de clientes e controle de dívidas (abertas ou quitadas), com os itens de cada notinha.
- 🧾 **Notas** — registro e consulta de notas.
- 🎉 **Festas** — agenda de festas com acompanhamento de status (agendada, realizada, pendente, paga).
- 💰 **Saldo da loja** — visão do saldo atual a partir das receitas e despesas lançadas.

## 🛠 Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Linguagens | JavaScript, TypeScript (TS / TSX) |
| Frontend (mobile) | React Native + Expo |
| Backend | Node.js + Knex |
| Banco de dados | SQLite |
| Testes de API | Insomnia |

## 📂 Estrutura do projeto

```text
.
├── backend/               # API e acesso ao banco (Knex + SQLite)
└── Sistema-conveniencia/  # Aplicativo mobile (Expo / React Native)
```

## ✅ Pré-requisitos

Antes de começar, você precisará ter instalado:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/)
- [Expo Go](https://expo.dev/go) no celular **ou** um emulador Android/iOS
- [Insomnia](https://insomnia.rest/) (opcional, para testar a API)

## 🚀 Instalação

**1. Clone o repositório**

```bash
git clone <URL-DO-REPOSITORIO>
cd <NOME-DA-PASTA>
```

**2. Backend**

```bash
cd backend
npm install
```

**3. Aplicativo**

```bash
cd Sistema-conveniencia
npm install
```

## ▶️ Uso

**Iniciando o backend**

```bash
cd backend
npm run dev
```

**Iniciando o aplicativo**

```bash
cd Sistema-conveniencia
npx expo start
```

Depois de iniciar, escaneie o QR Code com o **Expo Go** ou pressione `a` (Android) / `i` (iOS) para abrir em um emulador.

## 🔌 Testando a API com Insomnia

1. Abra o Insomnia e importe a coleção de requisições do projeto.
2. Com o backend rodando (`npm run dev`), configure a URL base do ambiente.
3. Execute as requisições para testar clientes, fiados, festas e transações.

## 📄 Licença

Este projeto está sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Feito com ☕ por **Guilherme Soares**

</div>
