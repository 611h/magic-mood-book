import Koa from 'koa';
import crypto from 'crypto';
import helmet from 'koa-helmet';
import { koaBody } from 'koa-body';
import logger from 'koa-logger';
import { default as ollama } from 'ollama';
import Router from '@koa/router';
import views from '@ladjs/koa-views';

const PORT = process.env.PORT || 3000;

const app = new Koa();

// Use koa-body for parsing request bodies
app.use(koaBody());

// Use nonce for Content Security Policy
app.use(async (ctx, next) => {
  ctx.res.nonce = crypto.randomBytes(32).toString("hex");
  await next();
});
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'script-src': [(req, res) => `'nonce-${res.nonce}'`],
      'script-src-attr': [(req, res) => `'nonce-${res.nonce}'`],
    }
  }
}));

// Use Logger
app.use(logger());

// Use ejs for templating
app.use(views('./views', {
  map: {
    ejs: 'ejs'
  }
}));

// Use Router
const router = new Router();

router.get('/', async (ctx, next) => {
  await ctx.render('index.ejs', {
    nonce: ctx.res.nonce,
  });
  await next();
});

router.get('/entry', async (ctx, next) => {
  await ctx.render('entry.ejs', {
    nonce: ctx.res.nonce,
  });
  await next();
}).post('/entry', async (ctx, next) => {
  const { mood } = ctx.request.body;
  if (!mood) {
    ctx.throw(400, 'Mood is required');
  }
  response = await ollama.chat({
      model: 'gemma3:1b',
      messages: [{
        role: 'user',
        content: `
          Give me some inpiring words according to my recent moods: ${mood}.
          Don't ask me anything, just give me one and only one quote.
        `,
      }]
  });
  ctx.body = {
    message: response.message.content,
  };
  await next();
});

router.get('/quote', async (ctx, next) => {
  await ctx.render('quote.ejs', {
    nonce: ctx.res.nonce,
  });
  await next();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
