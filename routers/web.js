import Router from '@koa/router';

const router = new Router();

router
  .get('/', async (ctx, next) => {
      await ctx.render('index.ejs', {
      nonce: ctx.res.nonce,
      });
      await next();
  })

  .get('/entry', async (ctx, next) => {
    await ctx.render('entry.ejs', {
      nonce: ctx.res.nonce,
    });
    await next();
  })

  .get('/quote', async (ctx, next) => {
    await ctx.render('quote.ejs', {
      nonce: ctx.res.nonce,
    });
    await next();
  });

export default router;
