import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { McpDocsServer, type ProcessedDoc } from 'docusaurus-plugin-mcp-server';
import docs from '../build/mcp/docs.json';
import searchIndex from '../build/mcp/search-index.json';
import { HelpSearchProvider } from './search-provider.ts';

const NAME = 'hexlet-help';
const VERSION = '1.0.0';
const BASE_URL = 'https://help.hexlet.io';

let server: McpDocsServer | null = null;
const getServer = (): McpDocsServer =>
  (server ??= new McpDocsServer({
    docs: docs as Record<string, ProcessedDoc>,
    searchIndexData: searchIndex,
    name: NAME,
    version: VERSION,
    baseUrl: BASE_URL,
    // Reads the index built with flexsearch.config.ts, but ranks articles
    // that match only some of the query words instead of dropping them.
    search: new HelpSearchProvider(),
  }));

const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Mcp-Session-Id'],
  }),
);

// The Cloudflare route is `help.hexlet.io/mcp*`, so the Worker receives
// requests with pathname `/mcp` (or `/mcp/...`). Match all paths under
// the mount point so we don't depend on a trailing slash.
const mcp = app.basePath('/mcp');
mcp.get('/', async (c) => c.json(await getServer().getStatus()));
mcp.post('/', async (c) => getServer().handleWebRequest(c.req.raw));

app.onError((err, c) => {
  console.error('MCP Server Error:', err);
  return c.json(
    { jsonrpc: '2.0', id: null, error: { code: -32603, message: 'Internal server error' } },
    500,
  );
});

export default app;
