import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY belum di-set di file .env');
  process.exit(1);
}

// 🔹 Endpoint utama untuk Tampermonkey
app.post('/openai-chat', async (req, res) => {
  try {
    const { prompt, page } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt kosong' });

    const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Kamu asisten ChatGPT untuk siswa SMP Paramarta Unggulan. Jawab dengan bahasa sopan, jelas, dan sesuai konteks pelajaran sekolah.' },
          { role: 'user', content: `Halaman: ${page}\n\nPertanyaan: ${prompt}` }
        ],
        temperature: 0.6,
        max_tokens: 500
      })
    });

    const data = await openaiResp.json();
    const reply = data.choices?.[0]?.message?.content || '(tidak ada balasan)';
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// 🔹 Tambahan: route GET / supaya tidak muncul “Cannot GET /”
app.get('/', (req, res) => {
  res.send('✅ Server Paramarta Chat sudah aktif!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server proxy berjalan di port ${PORT}`));
