import { rest } from 'msw'

export const handlers = [
  rest.get('/test', (req, res, ctx) => {
    let text = 'no text', delay = 50;

    req.url.search.substring(1).split('&').forEach(param => {
      const [key, val] = param.split("=");
      if (key === 'text') {
        text = val;
      } else if (key === 'delay') {
        delay = +val;
      }
    });

    return res(
      ctx.delay(delay),
      ctx.status(200),
      ctx.json({
        text,
      })
    )
  }),
]
