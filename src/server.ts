import { createRequestHandler, AngularAppEngine } from '@angular/ssr';

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
