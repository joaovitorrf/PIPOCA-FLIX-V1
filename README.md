# 🍿 PipocaFlix — Sistema de Streaming Profissional

> Plataforma de streaming moderno, rápido e altamente monetizável construído com HTML5, CSS3 e JavaScript Vanilla.

---

## 📁 Estrutura de Pastas

```
/pipocaflix
 ├── /public
 │    ├── index.html       → Homepage com hero, grids e busca
 │    ├── filme.html       → Página de filme dinâmica
 │    └── serie.html       → Página de série com temporadas/episódios
 │
 ├── /assets
 │    ├── /css
 │    │     └── style.css  → CSS cinematográfico completo
 │    ├── /js
 │    │     ├── api.js     → Integração Google Sheets via Proxy
 │    │     ├── search.js  → Fuzzy Search com debounce
 │    │     ├── security.js→ Proteção front-end
 │    │     └── player.js  → Lógica compartilhada do player
 │    └── /img             → Imagens locais (opcional)
 │
 ├── README.md
 └── vercel.json           → Configuração de deploy
```

---

## ⚡ Setup Local

1. Clone ou baixe o projeto
2. Abra um servidor local (obrigatório para requisições fetch):

```bash
# Python
python3 -m http.server 8080

# Node.js (se tiver npx)
npx serve .

# VS Code: instale a extensão "Live Server" e clique em "Go Live"
```

3. Acesse `http://localhost:8080/public/index.html`

> ⚠️ **Não abra os arquivos diretamente** via `file://` — o fetch via proxy requer um servidor HTTP.

---

## 🚀 Deploy no Vercel

### Método 1 — Vercel CLI
```bash
npm install -g vercel
cd pipocaflix
vercel
```

### Método 2 — GitHub + Vercel (recomendado)
1. Suba o projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) → **New Project**
3. Importe o repositório
4. Clique em **Deploy** (sem configuração extra necessária)

O `vercel.json` já está configurado com rotas, headers de segurança e cache otimizado.

---

## 📡 Banco de Dados (Google Sheets)

### Configuração do Proxy
O sistema **NUNCA** acessa o Google Sheets diretamente. Toda requisição passa pelo proxy Worker configurado em `api.js`:

```js
const PROXY = "https://autumn-pine-50da.slacarambafdsosobrenome.workers.dev/?url=";
```

Para trocar o proxy, edite apenas essa variável em `assets/js/api.js`.

### Planilha Principal
- **URL Base**: Configurada em `api.js` → variável `SHEETS_BASE`
- **Aba Filmes** → GID `300449936`
- **Aba Séries** → GID `413183487`
- **Aba Episódios** → GID `1394045118`

### Estrutura das Colunas

**Filmes / Séries** (colunas A–M, N para séries):
| Col | Campo |
|-----|-------|
| A | Nome |
| B | Link MP4 |
| C | Sinopse |
| D | Capa (URL) |
| E | Categoria |
| F | Ano |
| G | Duração |
| H | Trailer (URL YouTube) |
| I | Nomes do Elenco (separados por `\|`) |
| J | Fotos do Elenco (separadas por `\|`) |
| L | Tipo (filme/serie) |
| M | Áudio |
| N | Total de Temporadas *(só séries)* |

**Episódios**:
| Col | Campo |
|-----|-------|
| A | Nome da Série (exato) |
| B | Link MP4 |
| C | Temporada |
| D | Número do Episódio |

---

## 💰 Monetização

O sistema inclui dois formatos:

| Tipo | Código | Posições |
|------|--------|---------|
| **Native Banner** | `invoke.js` | Header, antes do player, footer |
| **Social Bar** | Social Bar script | Global (carrega automaticamente) |

O **Smartlink** é ativado **antes** de cada play (3 cliques para desbloquear no filme; automaticamente antes de cada episódio na série).

---

## 🔒 Segurança

O arquivo `security.js` implementa:
- Bloqueio de F12, Ctrl+Shift+I/J/C, Ctrl+U
- Desativação do botão direito
- Detecção de DevTools por diferença de tamanho de janela
- Anti-debug trap com `debugger`
- Prevenção de drag em imagens
- Console com aviso dissuasivo
- Links de vídeo não são inseridos no DOM até o desbloqueio

---

## 🔄 Cache e Performance

- Cache client-side de 5 minutos para dados do Sheets (`api.js`)
- Retry automático com backoff (3 tentativas, `api.js`)
- Timeout de 12 segundos por requisição
- Lazy loading em todas as imagens
- Headers de cache otimizados via `vercel.json`
- Debounce de 280ms na busca (`search.js`)

---

## 🛠️ Manutenção

### Atualizar conteúdo
Basta editar a planilha Google Sheets. O site busca os dados dinamicamente.

### Trocar proxy Worker
Edite `PROXY` em `assets/js/api.js`.

### Trocar smartlink
Edite `SMARTLINK` em `assets/js/player.js`.

### Adicionar categoria no filtro
As categorias são geradas automaticamente a partir da coluna E da planilha.

### Trocar banner de monetização
Substitua os IDs dos scripts em cada HTML (`invoke.js` e `social bar`).

---

## 📱 Compatibilidade

| Dispositivo | Suporte |
|-------------|---------|
| Mobile (iOS/Android) | ✅ |
| Tablet | ✅ |
| Desktop | ✅ |
| Ultrawide 21:9 | ✅ |
| Fullscreen com orientação landscape | ✅ |

---

## 🐛 Troubleshooting

**Conteúdo não carrega**
- Verifique se o proxy está ativo e acessível
- Abra o console (F12) e procure erros de rede
- Confirme que a planilha está publicada como CSV

**Player não aparece**
- O botão precisa ser clicado 3 vezes (comportamento intencional)
- Verifique se o link MP4 na planilha é válido

**Episódios não aparecem**
- Confirme que o nome da série na aba Episódios é idêntico ao da aba Séries
- A comparação ignora acentos e maiúsculas/minúsculas

---

*PipocaFlix — Feito com 🍿 no Brasil*
