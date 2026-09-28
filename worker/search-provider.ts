import FlexSearch from 'flexsearch';
import type {
  ProcessedDoc,
  SearchOptions,
  SearchProvider,
  SearchProviderInitData,
  SearchResult,
} from 'docusaurus-plugin-mcp-server';
import flexsearchConfig, { WORD_SEPARATOR } from '../flexsearch.config.ts';

// In the order the plugin indexes the fields.
const FIELD_WEIGHTS: Record<string, number> = {
  title: 3,
  content: 1,
  headings: 2,
  description: 1.5,
};

const SNIPPET_LENGTH = 200;

const encode = flexsearchConfig.encode;

// The built-in FlexSearch provider hands the whole query to FlexSearch, which
// intersects its words: a question asked in full finds nothing unless one
// article contains every word of it. This provider reads the same index but
// ranks articles by the words they do contain. The document shape below
// mirrors the plugin's createSearchIndex, which built the index at build time,
// and the flexsearch version in package.json must be the one the plugin
// depends on (0.7): 0.8 reads a 0.7 export without an error and finds nothing,
// so initialize() checks that the index finds an article by its own title.
export class HelpSearchProvider implements SearchProvider {
  readonly name = 'help-flexsearch';

  private docs: Record<string, ProcessedDoc> | null = null;

  private index = new FlexSearch.Document({
    ...flexsearchConfig,
    document: {
      id: 'id',
      index: Object.keys(FIELD_WEIGHTS),
      store: ['title', 'description'],
    },
  });

  async initialize(_context: unknown, initData?: SearchProviderInitData): Promise<void> {
    if (!initData?.docs || !initData.indexData) {
      throw new Error('[HelpSearch] docs and indexData are required');
    }
    for (const [key, value] of Object.entries(initData.indexData)) {
      await this.index.import(key, value as string);
    }
    const [first] = Object.values(initData.docs);
    if (first && this.index.search(first.title).length === 0) {
      throw new Error('[HelpSearch] The index finds nothing: does flexsearch match the plugin?');
    }
    this.docs = initData.docs;
  }

  isReady(): boolean {
    return this.docs !== null;
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    const docs = this.getDocs();
    const limit = options?.limit ?? 16;
    const total = this.getDocCount();
    const words = wordsByStem(query);
    const terms = new Set(words.keys());

    // Every word is looked up on its own, so an article matching only part of
    // the question still counts. A word found in few articles says more about
    // the question than one found everywhere (IDF), and a word in the title
    // says more than one in the body (field weight).
    const scores = new Map<string, number>();
    for (const word of words.values()) {
      const weights = new Map<string, number>();
      for (const { field, result } of this.index.search(word, { limit: total })) {
        const weight = FIELD_WEIGHTS[field];
        for (const id of result) {
          const docId = String(id);
          weights.set(docId, Math.max(weights.get(docId) ?? 0, weight));
        }
      }
      const idf = Math.log(1 + total / weights.size);
      for (const [docId, weight] of weights) {
        scores.set(docId, (scores.get(docId) ?? 0) + idf * weight);
      }
    }

    return [...scores]
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .flatMap(([url, score]) => {
        const doc = docs[url];
        if (!doc) return [];
        return {
          url,
          route: doc.route,
          title: doc.title,
          score,
          snippet: snippet(doc.markdown, terms),
          matchingHeadings: doc.headings
            .map((heading) => heading.text)
            .filter((text) => encode(text).some((stem) => terms.has(stem)))
            .slice(0, 3),
        };
      });
  }

  async getDocument(url: string): Promise<ProcessedDoc | null> {
    return this.getDocs()[url] ?? null;
  }

  getDocCount(): number {
    return Object.keys(this.docs ?? {}).length;
  }

  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    if (!this.isReady()) {
      return { healthy: false, message: 'Help search provider not initialized' };
    }
    return { healthy: true, message: `Help search ready with ${this.getDocCount()} documents` };
  }

  private getDocs(): Record<string, ProcessedDoc> {
    if (!this.docs) {
      throw new Error('[HelpSearch] Provider not initialized');
    }
    return this.docs;
  }
}

// One word per stem: the index encodes the query itself, so it gets the word
// rather than the stem — a stem encoded again may lose another suffix.
function wordsByStem(query: string): Map<string, string> {
  const words = new Map<string, string>();
  for (const word of query.split(WORD_SEPARATOR)) {
    for (const stem of encode(word)) {
      if (!words.has(stem)) words.set(stem, word);
    }
  }
  return words;
}

// A stem is the lowercased start of its word (with «ё» read as «е»), so the
// earliest stem found in the text marks where the article answers the query.
function snippet(markdown: string, terms: Set<string>): string {
  const text = markdown.toLowerCase().replaceAll('ё', 'е');
  const positions = [...terms].map((term) => text.indexOf(term)).filter((index) => index !== -1);
  const start = positions.length > 0 ? Math.max(0, Math.min(...positions) - 50) : 0;
  const end = Math.min(markdown.length, start + SNIPPET_LENGTH);
  const body = markdown
    .slice(start, end)
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[a-z]*\n?/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return `${start > 0 ? '...' : ''}${body}${end < markdown.length ? '...' : ''}`;
}
