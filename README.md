# 🍿 PipocaFlix

Um sistema completo de streaming profissional, moderno e responsivo.
Estilo cinematográfico com design Netflix-like: Preto + Vermelho + Neon.

---

## 📁 Estrutura de Pastas

```
/pipocaflix
 ├── /public
 │    ├── index.html        → Home / Busca principal
 │    ├── filme.html        → Página de filme individual
 │    └── serie.html        → Página de série com episódios
 │
 ├── /assets
 │    ├── /css
 │    │     └── style.css   → CSS completo (variáveis, animações, responsivo)
 │    ├── /js
 │    │     ├── api.js      → Integração Baserow API
 │    │     ├── search.js   → Fuzzy search + normalização
 │    │     ├── security.js → Anti-inspect / Anti-devtools
 │    │     └── player.js   → Lógica do player de vídeo
 │    └── /img              → Imagens locais (se necessário)
 │
 ├── README.md
 └── vercel.json            → Config de deploy no Vercel
```

---

## 🚀 Como Rodar Localmente

### Opção 1 — Live Server (VS Code)

1. Instale a extensão **Live Server** no VS Code
2. Abra a pasta `pipocaflix/`
3. Clique com o botão direito em `public/index.html`
4. Selecione **"Open with Live Server"**
5. Acesse: `http://127.0.0.1:5500/public/index.html`

### Opção 2 — Python HTTP Server

```bash
cd pipocaflix
python3 -m http.server 8080
# Acesse: http://localhost:8080/public/index.html
```

### Opção 3 — Node.js serve

```bash
npm install -g serve
cd pipocaflix
serve .
# Acesse: http://localhost:3000/public/index.html
```

---

## 📦 Como Subir no GitHub

```bash
# 1. Inicializar repositório
git init
git add .
git commit -m "🍿 PipocaFlix - Initial commit"

# 2. Criar repositório no GitHub (via github.com)
#    Nome sugerido: pipocaflix

# 3. Conectar e enviar
git remote add origin https://github.com/SEU_USUARIO/pipocaflix.git
git branch -M main
git push -u origin main
```

---

## ☁️ Como Subir no Vercel

### Via Dashboard (mais fácil):

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Importe o repositório do GitHub
4. Em **"Root Directory"**, deixe como `/` (raiz)
5. Clique em **"Deploy"**
6. Aguarde — em ~1 minuto seu site está no ar!

### Via CLI:

```bash
npm install -g vercel
cd pipocaflix
vercel login
vercel --prod
```

---

## 🔧 Configurações e Variáveis

As configurações da API estão em `assets/js/api.js`:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `BASE_URL` | `http://213.199.56.115` | Servidor Baserow |
| `TOKEN` | `1rq7OOnCoVCuSDKXzv8k7JbGh9wO9MsH` | Token de autenticação |
| `TABLE_ID` | `4400` | Tabela "Site Conteudos" |
| `TABLE_EP` | `5351` | Tabela "Site Episodios" |

**Smartlink (monetização)** está em `assets/js/player.js`:
```js
const SMARTLINK = 'https://www.effectivegatecpm.com/eacwhk55f?key=87f8fc919fb5d70a825293b5490713dd';
```

---

## 📡 API Baserow — Campos

### Tabela: Site Conteudos (4400)

| Campo | ID | Tipo |
|-------|-----|------|
| Nome | 29998 | Texto |
| Link | 29999 | URL do vídeo |
| Sinopse | 30000 | Texto longo |
| Capa | 34665 | URL imagem |
| Categoria | 34666 | Texto |
| Ano | 34667 | Número |
| Duração | 34668 | Texto |
| Trailer | 34669 | URL YouTube |
| Fotos Elenco | 34670 | URLs separadas por vírgula |
| Nome Elenco | 34671 | Nomes separados por vírgula |
| Tipo | 34672 | "Filme" ou "Serie" |
| Audio | 34673 | Texto (ex: "Dublado") |

### Tabela: Site Episodios (5351)

| Campo | ID | Tipo |
|-------|-----|------|
| Nome | 35682 | Nome da série |
| Link | 35683 | URL do vídeo |
| Temporada | 35684 | Número |
| Episódio | 35685 | Número |

---

## 🎨 Identidade Visual

- **Cores:** Preto profundo `#0A0A0A` + Vermelho `#E50914` + Branco `#F5F5F5`
- **Fontes:** Bebas Neue (títulos) + Rajdhani (UI) + Exo 2 (corpo)
- **Efeitos:** Glow neon, backdrop-filter, gradientes dinâmicos, animações fluidas
- **Cards:** Efeito 3D com hover, lazy load, skeleton loading

---

## 💰 Monetização

Os seguintes scripts de ads estão integrados:

**Social Bar** (carrega automaticamente em todas as páginas):
```html
<script src="https://pl28456424.effectivegatecpm.com/af/b2/ae/afb2aeef36a1a40f4d3634823ebf0f59.js"></script>
```

**Native Banner** (inserido estrategicamente entre seções):
```html
<script async src="https://pl28456427.effectivegatecpm.com/cccc7245f0c46289c4b3a2911da39bca/invoke.js"></script>
<div id="container-cccc7245f0c46289c4b3a2911da39bca"></div>
```

**Smartlink** (abre ao clicar para desbloquear player):
- Filmes: clique 3x no botão de desbloqueio
- Séries: clique em qualquer episódio

---

## 🔐 Segurança

O arquivo `security.js` bloqueia:
- `F12` — DevTools
- `Ctrl+U` — View Source
- `Ctrl+Shift+I/J` — Inspect/Console
- `Ctrl+S` — Salvar página
- `Ctrl+P` — Imprimir
- `Botão direito` — Menu de contexto
- `Seleção de texto`
- Detecção de DevTools abertas → redireciona para Google

---

## 📱 Responsividade

| Breakpoint | Layout |
|-----------|--------|
| < 480px | 2 colunas de cards |
| 480–767px | 2-3 colunas |
| 768–1023px | 3 colunas |
| 1024–1199px | 4 colunas |
| 1200–1919px | 5+ colunas (auto-fill 220px) |
| > 1920px | 8 colunas (ultrawide) |

---

## ⚡ Performance

- **Lazy Load** nativo com `loading="lazy"` em todas as imagens
- **Cache** de API em memória com TTL de 5 minutos
- **Debounce** de 350ms na busca
- **IntersectionObserver** para imagens
- **CSS Variables** para consistência sem duplicação
- Imagens com fallback SVG inline

---

## 🐛 Troubleshooting

**Player não carrega?**
- Verifique se o link do vídeo está correto na tabela Baserow
- CORS pode bloquear: use um proxy ou worker Cloudflare

**Busca não funciona?**
- Requer pelo menos 2 caracteres
- Aceita erros de digitação graças ao Fuzzy Search

**Episódios não aparecem?**
- Verifique se o campo "Nome" na tabela Episodios corresponde ao nome da série

---

*PipocaFlix © 2025 — Feito com ❤️ e 🍿*
