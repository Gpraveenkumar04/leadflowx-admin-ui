import { rest } from 'msw';

const base = 'http://localhost:8080';

export const handlers = [
  rest.get(`${base}/api/leads`, (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page') || '1');
    const pageSize = Number(req.url.searchParams.get('pageSize') || '25');
    const total = 60;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = Array.from({ length: pageSize }).map((_, i) => ({
      id: start + i + 1,
      correlationId: `c-${start + i + 1}`,
      email: `lead${start + i + 1}@ex.com`,
      name: `Lead ${start + i + 1}`,
      company: `Company ${start + i + 1}`,
      website: 'https://example.com',
      phone: '1234567890',
      createdAt: new Date().toISOString(),
      source: 'google_maps'
    }));
    return res(ctx.status(200), ctx.json({
      success: true,
      data,
      pagination: { page, pageSize, total, totalPages }
    }));
  }),
  rest.get(`${base}/api/tags`, (_req, res, ctx) => res(ctx.json({ success: true, data: [] }))),
  rest.get(`${base}/api/saved-views`, (_req, res, ctx) => res(ctx.json({ success: true, data: [] }))),
  rest.post(`${base}/api/tags`, async (req, res, ctx) => {
    const body = await req.json();
    const tag = { id: `${Date.now()}`, name: body.name || 'New', color: body.color || '#fff' };
    return res(ctx.status(201), ctx.json({ success: true, data: tag }));
  }),
  rest.post(`${base}/api/saved-views`, async (req, res, ctx) => {
    const body = await req.json();
    const view = { id: `${Date.now()}`, name: body.name || 'View', filters: body.filters || {}, sort: body.sort || { field: 'createdAt', direction: 'desc' } };
    return res(ctx.status(201), ctx.json({ success: true, data: view }));
  })
];
