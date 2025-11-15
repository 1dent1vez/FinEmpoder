import { Router } from 'express';
import z from 'zod';
export const ttsRouter = Router();
const Body = z.object({ text: z.string().min(1) });

// TODO: integra tu proveedor TTS aquí (Azure, ElevenLabs, etc.)
ttsRouter.post('/', async (req, res) => {
  const { text } = Body.parse(req.body);
  // const audioBuffer = await proveedorTTS(text); // <--- implementa con tu SDK
  const audioBuffer = Buffer.from([]); // placeholder
  res.setHeader('Content-Type','audio/mpeg');
  res.send(audioBuffer);
});
