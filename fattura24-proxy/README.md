# Fattura24 Dashboard — Deploy su Vercel

## Struttura progetto

```
fattura24-proxy/
├── api/
│   └── fattura24.js     ← Serverless function proxy
├── public/
│   └── dashboard.html   ← Dashboard standalone
├── vercel.json
└── package.json
```

---

## Deploy in 5 minuti

### 1. Installa Vercel CLI (una volta sola)

```bash
npm install -g vercel
```

### 2. Fai il deploy

```bash
cd fattura24-proxy
vercel deploy --prod
```

Segui il wizard: accetta i default. Vercel ti darà un URL tipo:
`https://fattura24-proxy-xyz.vercel.app`

### 3. Configura la API key come variabile d'ambiente

Nel dashboard Vercel → **Settings → Environment Variables**:

| Nome | Valore |
|------|--------|
| `FATTURA24_API_KEY` | `Eo3ywjLoT759JToqgYwuRnXlFp5WUXwj` |

Dopo aver aggiunto la variabile, fai **Redeploy**:
```bash
vercel deploy --prod
```

### 4. Apri la dashboard

Apri il file `public/dashboard.html` nel browser (doppio click).

Al primo avvio ti chiede l'URL del proxy.
Incolla: `https://fattura24-proxy-xyz.vercel.app`

Clicca **Salva e carica dati reali** — la dashboard si popola con i tuoi dati reali da Fattura24.

---

## Come funziona

```
Browser (dashboard.html)
    ↓ POST /api/fattura24
Vercel Serverless (api/fattura24.js)
    ↓ POST con apiKey (variabile env)
Fattura24 API
    ↓ XML response
Vercel → Browser
    ↓ Parse XML → grafici
```

Il browser non tocca mai la API key — la gestisce solo Vercel server-side.

---

## Test locale

```bash
npx vercel dev
```

Poi imposta `.env.local`:
```
FATTURA24_API_KEY=Eo3ywjLoT759JToqgYwuRnXlFp5WUXwj
```

---

## Troubleshooting

**"Nessun documento trovato"** → Verifica che il tuo account Fattura24 abbia fatture emesse (docType=I).

**CORS error** → Assicurati che il proxy sia deployato correttamente e l'URL non abbia slash finale.

**502 Bad Gateway** → Fattura24 non risponde. Testa l'API key direttamente da Postman.
