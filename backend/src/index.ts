import { app } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

async function bootstrap() {
  try {
    await connectDB();
    app.listen(Number(env.PORT), () => {
      console.log(`[api] running on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error('[api] failed to start:', err);
    process.exit(1);
  }
}
bootstrap();
