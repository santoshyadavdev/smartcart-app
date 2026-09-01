import { createRequestHandler, AngularAppEngine } from '@angular/ssr';


interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}


function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const angularApp = new AngularAppEngine();

export const reqHandler = createRequestHandler(async (request: Request) => {
  const url = new URL(request.url);

  if (url.pathname === '/api/data') {
    return json({
      message: 'This is the root endpoint. You can define your API endpoints here.',
    });
  }

  const angularResponse: Response | null = await angularApp.handle(request);

  if (angularResponse) {
    return angularResponse;
  }

  return new Response('Not Found', { status: 404 });
});


// Default export for Cloudflare Workers
export default {
  async fetch(request: Request, env: Env): Promise<Response| null> {
    return reqHandler(request) ?? env.ASSETS.fetch(request);
  },
};
