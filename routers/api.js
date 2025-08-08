import Router from '@koa/router';
import { default as ollama } from 'ollama';

const router = new Router({
  prefix: '/api',
});

router
  .post('/entry', async (ctx, next) => {
    const { mood } = ctx.request.body;
    if (!mood) {
      ctx.body = {
        message: 'Mood is required',
        success: false,
      };
      await next();
      return;
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
      success: true,
    };
    await next();
  })

export default router;
