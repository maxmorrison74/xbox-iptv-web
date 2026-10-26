# IPTV Smarters per Xbox - Web PWA

Applicazione web PWA per IPTV Xtream Codes che gira sul browser Microsoft Edge della Xbox Series X|S.

## 🚀 Installazione rapida

### 1. Deploy automatico (GitHub Pages) - **CONSIGLIATO**

1. Apri: https://github.com/maxmorrison74/xbox-iptv-web/actions
2. Attendi la build (2-3 minuti)
3. Scarica `xbox-iptv-web.zip` dall'artefatto
4. Estrai il ZIP

### 2. Opzioni alternative

#### A. GitHub Pages (più semplice)
1. Vai su Repository → Settings → Pages
2. Source: GitHub Actions
3. La pagina sarà disponibile su:
   ```
   https://maxmorrison74.github.io/xbox-iptv-web/
   ```

#### B. Hosting statico (Netlify/Vercel)
```bash
npm install -g netlify-cli
netlify deploy --prod dist/
```

#### C. Localhost (per test)
```bash
npm run dev
# Apri http://localhost:5173 nella Xbox
```

### 3. Installa sull'Xbox

#### Metodo A: Direct URL (consigliato)
1. Su Xbox: apri **Microsoft Edge**
2. Vai all'URL della tua app (GitHub Pages o altro hosting)
3. Premi **Menu (≡)** → **Install App**
4. Dai nome app e installa!

#### Metodo B: File locale
1. Carica la cartella `dist/` su una chiavetta USB
2. Inserisci USB nella Xbox
3. Usa File Explorer per aprire `index.html`

---

## 🎮 Navigazione

### Controlli Xbox:
- **A** = Seleziona / Apri canale
- **B** = Indietro
- **D-Pad** = Navigazione
- **Menu** = Menu contestuale

### Player video:
- **A doppio** apri in tab esterna (HLS nativo)
- **Menu** per controlli video

---

## ⭐ Funzionalità

- ✅ **Login Xtream Codes** (salva credenziali localmente)
- ✅ **Canali Live** con filtri per categoria
- ✅ **VOD (Film)** con ricerca per genere
- ✅ **Serie TV** con navigazione stagioni/episodi
- ✅ **EPG integrato**
- ✅ **Player HLS.js** per streaming
- ✅ **Credenziali preconfigurate** (M99SVERR @ xxczsmart.com)
- ✅ **UI ottimizzata per Xbox**

---

## 🔧 Sviluppo locale

```bash
# Installa dipendenze
npm install

# Avvia dev server
npm run dev

# Build per produzione
npm run build

# Anteprima locale
npm run preview
```

---

## 📄 Requisiti

- Xbox Series X|S con **Dev Mode attivata**
- Microsoft Edge browser
- Connessione internet
- Credenziali Xtream Codes valide

---

## 🆚 Differenze versione nativa vs Web

| Feature | Native UWP | Web PWA |
|---------|-----------|---------|
| **Build** | ❌ 30+ min (errori su GitHub Actions) | ✅ 2-3 min |
| **Performance** | 100% nativo | 95% (HLS.js) |
| **UI** | 100% Xbox nativa | 90% simile (Web) |
| **Player** | MediaPlayer Windows | HLS.js / browser nativo |
| **Installazione** | .appx | HTTP URL / File |

**Consiglio:** La versione Web è più veloce da deployare e quasi identica nell'uso!

---

**Versione:** 1.0.0  
**Ultimo aggiornamento:** 2026-10-26  
**Compatibilità:** Xbox Series X|S Dev Mode
