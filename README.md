# Expo PWA — CRUD com React, Expo e Firebase

Projeto didático para construção de uma aplicação **CRUD (Create, Read, Update e Delete)** utilizando **React, Expo, TypeScript e Firebase Cloud Firestore**, com prioridade para execução Web e evolução para uma **Progressive Web App (PWA)** instalável.

O desenvolvimento é incremental, dividido em checkpoints. Cada etapa é implementada, publicada e testada antes do avanço.

## 🎯 Objetivo

Construir uma aplicação simples de cadastro de pessoas com **nome** e **e-mail**, armazenados no Firebase Cloud Firestore.

Ao final, a aplicação permitirá cadastrar, listar, editar e excluir pessoas, validar dados, exibir feedback de sucesso/erro, persistir informações no Firestore, funcionar responsivamente e ser instalada como PWA.

## 🛠️ Tecnologias

- React 19
- React Native
- Expo SDK 58
- Expo Router
- TypeScript
- React Native Web
- Firebase JavaScript SDK
- Cloud Firestore
- Git/GitHub
- Vercel

O Firebase será incorporado após a validação da estrutura Web inicial.

## 🌐 Estratégia Web

```text
Expo → React Native → React Native Web → Expo Router → Exportação Web → Vercel
```

A configuração utiliza exportação estática:

```json
{
  "web": {
    "bundler": "metro",
    "output": "static"
  }
}
```

Build:

```bash
npm run build
```

que executa `expo export --platform web` e gera o diretório `dist/`.

## 🚀 Deploy

Fluxo remoto:

```text
GitHub → Vercel → Build automático → Aplicação Web
```

Não é necessário executar o projeto localmente para acompanhar os checkpoints. Cada alteração no repositório pode gerar um novo deployment no Vercel para validação no navegador.

## 📱 PWA

O projeto será preparado como Progressive Web App com manifesto, nome e nome curto, ícones, cores, `display: standalone`, Service Worker, estratégia de cache, HTTPS, responsividade e testes de instalação.

> Executar Expo no navegador não torna automaticamente a aplicação uma PWA completa. Manifesto, Service Worker e critérios de instalação serão configurados e testados explicitamente.

## 🔥 Firebase

Coleção prevista:

```text
usuarios
```

Documento:

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com"
}
```

Operações:

```text
CREATE → addDoc()
READ   → getDocs() / onSnapshot()
UPDATE → updateDoc()
DELETE → deleteDoc()
```

Estrutura planejada:

```text
src/
├── app/
├── components/
├── config/
│   └── firebase.ts
├── services/
│   └── usuarios.ts
└── types/
```

## 🖥️ Telas

### Cadastro
Nome, e-mail, validação, cadastro e feedback. A mesma tela será reutilizada para edição.

### Listagem
Exibição dos usuários, edição, exclusão, carregamento, lista vazia e atualização dos dados após operações CRUD.

Não haverá uma terceira tela exclusiva para edição.

## 📚 Checkpoints

```text
01 — Planejamento e preparação
02 — Expo + Web/PWA
03 — Interface e navegação
04 — Configuração do Firebase
05 — CREATE
06 — READ
07 — UPDATE
08 — DELETE
09 — Testes completos
10 — PWA e publicação
11 — Segurança e conclusão
```

> Um checkpoint deve funcionar antes do próximo começar.

## 🔐 Segurança

A configuração Web do Firebase, inclusive `apiKey`, não é uma credencial administrativa. Service Account, Private Key, credenciais do Admin SDK e segredos de servidor não devem ser incorporados ao frontend.

Antes do uso com dados reais serão necessários Firebase Authentication, Firestore Security Rules, autorização e validação adequada dos dados. Regras abertas serão, no máximo, temporárias e controladas durante testes.

## 📦 Scripts

```bash
npm install
npm start
npm run web
npm run build
```

O build Web de produção é gerado em `dist/`.

## 📂 Estrutura atual

```text
expo-pwa/
├── src/
│   └── app/
│       ├── _layout.tsx
│       └── index.tsx
├── app.json
├── expo-env.d.ts
├── package.json
├── tsconfig.json
├── vercel.json
├── .gitignore
└── README.md
```

## 🧪 Status atual

- ✅ React
- ✅ Expo SDK 58
- ✅ TypeScript
- ✅ Expo Router
- ✅ React Native Web
- ✅ Estrutura `src/app`
- ✅ Exportação Web estática
- ✅ Configuração para Vercel
- ⏳ Interface CRUD
- ⏳ Firebase / Firestore
- ⏳ CREATE / READ / UPDATE / DELETE
- ⏳ Manifest PWA
- ⏳ Service Worker
- ⏳ Testes de instalação
- ⏳ Segurança de produção

## 👨‍💻 Finalidade

Projeto educacional para compreender cada camada da aplicação:

**React → Expo → Web → PWA → Firebase → Firestore → CRUD → Deploy.**
