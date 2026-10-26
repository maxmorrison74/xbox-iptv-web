// CORS Proxy per Vercel - Funziona con API Xtream
async function fetchWithProxy(url) {
  // Usa un proxy pubblico per evitare blocchi CORS
  const corsProxy = 'https://cors-anywhere.herokuapp.com/';
  
  try {
    // Prova prima senza proxy (CORS normale)
    const response = await fetch(url);
    if (response.ok) return response;
  } catch(e) {
    console.log('CORS bloccato, uso proxy...', e.message);
  }
  
  // Usa proxy come fallback
  try {
    const proxyUrl = corsProxy + url;
    console.log('Proxy URL:', proxyUrl);
    const response = await fetch(proxyUrl);
    return response;
  } catch(e) {
    console.error('Proxy fallito:', e);
    throw new Error('Server non raggiungibile: verifica connessione Xbox');
  }
}
