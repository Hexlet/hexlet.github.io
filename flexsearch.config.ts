import type { FlexSearchConfig } from 'docusaurus-plugin-mcp-server';
import { stemmer } from '@orama/stemmers/russian';
import { stopwords } from '@orama/stopwords/russian';

const STOPWORDS = new Set(stopwords);

// FlexSearch tuned for Russian content. The plugin's defaults are tuned for
// English (forward tokenize + bidirectional context + English stemmer) and
// produce an 80+ MB index on our docs.
//
// - tokenize: 'strict' indexes whole words only (no prefix explosion).
// - context: false drops the bidirectional context that bloats the index.
// - resolution: 3 is enough for relevance ranking on ~100 docs.
// - encode: lowercase split on Russian punctuation, drop Russian stopwords,
//   then the Snowball Russian stemmer: «подписка», «подписки» and «подписку»
//   become one stem. A stem is never longer than its word, so the index
//   doesn't grow. Stopwords matter because a query matches on any of its
//   words (worker/search-provider.ts): «как», «где», «мне» would match
//   every article and drown the ranking.
//
// This config MUST be identical at build time (docusaurus.config.ts) and at
// runtime (worker/index.ts) — otherwise the runtime provider deserializes the
// index with the wrong shape and returns no results.
const flexsearchConfig = {
  tokenize: 'strict',
  resolution: 3,
  context: false,
  cache: 100,
  encode: (str: string) =>
    String(str)
      .toLowerCase()
      .split(/[\s\-_.,;:!?'"()[\]{}«»—–]+/)
      .filter((word) => word && !STOPWORDS.has(word))
      .map(stemmer),
} satisfies FlexSearchConfig;

export default flexsearchConfig;
