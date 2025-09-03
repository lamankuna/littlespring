import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ ok: true, service: 'Little Spring Medusa stub' });
});

app.get('/', (_, res) => {
  res.json({ message: 'Medusa-compatible stub; enable DB + Redis to go live.' });
});

import cjWebhook from './api/cj/webhook/route';
app.use('/cj/webhook', cjWebhook);

const port = Number(process.env.PORT || 9000);
app.listen(port, () => {
  console.log(`[medusa] listening on http://localhost:${port}`);
});
