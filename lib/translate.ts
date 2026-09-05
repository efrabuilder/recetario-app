const MAX_CHUNK_LENGTH = 450; // MyMemory limita el largo por consulta en el plan gratuito

function splitIntoChunks(text: string, maxLength: number): string[] {
  const sentences = text.split(/(?<=[.!?\n])\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > maxLength && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);

  return chunks;
}

async function translateChunk(chunk: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    chunk
  )}&langpair=en|es`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`El servicio de traducción respondió ${res.status}`);
  }

  const data = (await res.json()) as {
    responseData?: { translatedText?: string };
    responseStatus?: number;
  };

  const translated = data.responseData?.translatedText;
  if (!translated) {
    throw new Error('El servicio de traducción no devolvió texto');
  }

  return translated;
}

export async function translateToSpanish(text: string): Promise<string> {
  const chunks = splitIntoChunks(text, MAX_CHUNK_LENGTH);
  const translatedChunks: string[] = [];

  for (const chunk of chunks) {
    translatedChunks.push(await translateChunk(chunk));
  }

  return translatedChunks.join(' ');
}
