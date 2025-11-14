# Missale Romanum - Aplicação Web Moderna

Aplicação web moderna do Missal Romano com suporte a 6 idiomas (Português, Español, Latina, English, Deutsch, Italiano), construída com Next.js 14, TypeScript, shadcn/ui e PostgreSQL.

## 🌟 Características

- **6 Idiomas Completos**: Português, Espanhol, Latim, Inglês, Alemão e Italiano
- **1.042+ Celebrações Litúrgicas**:
  - Ordinário da Missa
  - Tempos Litúrgicos (Advento, Natal, Quaresma, Páscoa, Tempo Comum)
  - Santos (12 meses + celebrações africanas)
  - Comuns e Votivas
  - Missas de Defuntos
  - Lecionário
  - Prefácios
  - Orações Eucarísticas

- **Calendário Litúrgico Inteligente**:
  - Cálculo automático da Páscoa e festas móveis
  - Sistema de precedência (solenidades, festas, memórias)
  - Auto-detecção do dia litúrgico atual

- **Interface Moderna**:
  - Design responsivo (mobile-first)
  - Dark mode / Light mode
  - Cores litúrgicas automáticas
  - Componentes shadcn/ui
  - Animações suaves

- **Personalização Completa**:
  - Escolha de idioma primário e secundário
  - Tamanho de fonte ajustável
  - Apresentação de textos (lado a lado, alternado, único)
  - Exibição de rubricas (instruções litúrgicas)

- **PWA (Progressive Web App)**:
  - Funciona offline
  - Instalável no celular/desktop
  - Cache inteligente

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
cd /home/pedro/Missale/missale-romanum-app
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/missale_romanum?schema=public"
```

4. **Execute as migrações do Prisma**
```bash
npm run prisma:migrate
```

5. **Gere o Prisma Client**
```bash
npm run prisma:generate
```

6. **Migre os dados JSON para o banco**
```bash
npm run migrate
```

7. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📁 Estrutura do Projeto

```
missale-romanum-app/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Página inicial (menu principal)
│   ├── calendario/          # Calendário litúrgico
│   ├── ordinario/           # Ordinário da Missa
│   ├── preferencias/        # Configurações
│   └── layout.tsx           # Layout raiz
│
├── components/
│   ├── liturgical/          # Componentes litúrgicos
│   │   ├── MassViewer.tsx   # Visualizador de missa
│   │   ├── MultiLangText.tsx # Texto multi-idioma
│   │   └── LiturgicalColorBadge.tsx
│   └── ui/                  # Componentes shadcn/ui
│
├── lib/
│   ├── prisma.ts            # Cliente Prisma
│   ├── types.ts             # Tipos TypeScript
│   └── liturgical-calendar.ts # Cálculos litúrgicos
│
├── prisma/
│   └── schema.prisma        # Schema do banco de dados
│
├── scripts/
│   └── migrate-data.ts      # Script de migração de dados
│
└── public/                  # Assets estáticos
```

## 🎨 Stack Tecnológica

- **Frontend**:
  - Next.js 14 (App Router, Server Components)
  - React 19
  - TypeScript
  - TailwindCSS
  - shadcn/ui

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL

- **UI/UX**:
  - Crimson Text (fonte serif para textos litúrgicos)
  - Inter (fonte sans-serif para interface)
  - Lucide Icons
  - Cores litúrgicas (verde, roxo, branco, vermelho, rosa, preto, dourado)

## 📖 Como Usar

### Menu Principal

A página inicial apresenta 5 opções principais:

1. **MISSALE** - Ordinário da Missa (idioma primário)
2. **MISSALE II** - Ordinário da Missa (idioma secundário)
3. **CALENDARIUM** - Calendário litúrgico e missas do dia
4. **AUXILIUM** - Ajuda e documentação
5. **DILECTUS** - Preferências e configurações

### Navegação por Tabs

Dentro do aplicativo, navegue entre 7 seções:

- **Ord** - Ordinário da Missa
- **Tmp** - Tempos Litúrgicos
- **Snt** - Santos
- **Com** - Comuns e Votivas
- **Lct** - Lecionário (Leituras)
- **Pf** - Prefácios
- **PE** - Orações Eucarísticas

### Trocar Idioma

Clique em qualquer texto litúrgico para alternar entre os 6 idiomas disponíveis.

### Preferências

Acesse **DILECTUS** para personalizar:
- Idioma primário e secundário
- Tamanho da fonte
- Modo de apresentação dos textos
- Exibição de rubricas
- Dark mode

## 🗄️ Banco de Dados

### Schema Principal

- **Mass** - Celebrações da Missa (1.042+ registros)
- **MultiLangText** - Textos em 6 idiomas
- **Reading** - Leituras do Lecionário
- **Preface** - Prefácios
- **EucharisticPrayer** - Orações Eucarísticas
- **UserPreference** - Preferências do usuário
- **Bookmark** - Favoritos

### Enums

- **LiturgicalColor** - Verde, Roxo, Branco, Vermelho, Rosa, Preto, Dourado
- **LiturgicalRank** - Solenidade, Festa, Memória, Memória Opcional, Feria
- **LiturgicalSeason** - Advento, Natal, Tempo Comum, Quaresma, Semana Santa, Páscoa
- **MassCategory** - Ordinário, Temporal, Santos, Comuns, Votivas, Defuntos, Várias

## 🔄 Migração de Dados

O script `scripts/migrate-data.ts` migra dados dos JSONs para PostgreSQL:

```bash
npm run migrate
```

### Funcionalidades do Script:

- Limpeza de HTML dos textos
- Normalização de dados
- Criação de registros relacionais
- Geração de texto de busca
- Validação de integridade

### Expandindo a Migração:

Para adicionar mais categorias, edite `scripts/migrate-data.ts` e adicione funções como:

```typescript
async function migrateTiempos() { /* ... */ }
async function migrateComunes() { /* ... */ }
async function migrateReadings() { /* ... */ }
```

## 🎯 Calendário Litúrgico

O módulo `lib/liturgical-calendar.ts` implementa:

### Algoritmos:

1. **Cálculo da Páscoa** (Algoritmo Meeus/Jones/Butcher)
   - Válido para anos 1583-4099
   - Precisão de 100%

2. **Determinação do Tempo Litúrgico**
   - Advento (4 domingos antes do Natal)
   - Natal (25 dez - Batismo do Senhor)
   - Quaresma (Quarta-feira de Cinzas - Domingo de Ramos)
   - Semana Santa (Domingo de Ramos - Sábado Santo)
   - Páscoa (Domingo de Páscoa - Pentecostes)
   - Tempo Comum (restante do ano)

3. **Datas Importantes**
   - Cinzas, Ramos, Quinta-feira Santa
   - Sexta-feira Santa, Páscoa
   - Ascensão, Pentecostes
   - Todos os Santos, Finados

## 🌐 PWA (Próxima Etapa)

Funcionalidades planejadas:

- Service Worker para cache offline
- Manifest.json para instalação
- Sincronização em background
- Notificações de festas importantes

## 🧪 Testes

```bash
# Em desenvolvimento
npm run test
```

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🚢 Deploy

### Opções Recomendadas:

1. **Vercel** (Next.js) + **Supabase** (PostgreSQL)
   - Deploy automático via Git
   - Banco PostgreSQL gerenciado
   - SSL grátis

2. **Vercel** + **Neon** (PostgreSQL)
   - Serverless PostgreSQL
   - Escala automática

3. **Self-hosted**
   - Docker + Docker Compose
   - Nginx reverse proxy

### Variáveis de Ambiente para Produção:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://seu-dominio.com"
```

## 🤝 Contribuindo

Este projeto foi migrado do aplicativo Android original "Missale Romanum" para uma aplicação web moderna.

## 📄 Licença

Conteúdo litúrgico: Domínio público (textos litúrgicos oficiais da Igreja Católica)

## 🙏 Créditos

- Aplicativo original: Missale Romanum Android (rcr.missale.romanum)
- Redesenvolvimento: Pedro
- UI Design: shadcn/ui
- Framework: Next.js

## 📞 Suporte

Para questões litúrgicas ou técnicas, consulte a seção **AUXILIUM** no aplicativo.

---

**Ad maiorem Dei gloriam** ✝️
