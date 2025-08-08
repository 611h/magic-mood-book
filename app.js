import Koa from 'koa';
import crypto from 'crypto';
import helmet from 'koa-helmet';
import { koaBody } from 'koa-body';
import logger from 'koa-logger';
import views from '@ladjs/koa-views';

import web_router from './routers/web.js';

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

app.use(web_router.routes()).use(web_router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
