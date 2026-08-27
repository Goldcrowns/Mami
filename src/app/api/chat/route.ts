import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API anahtarı bulunamadı.' },
        { status: 500 }
      );
    }

    const systemInstruction = `Sen "mamicikle" adında; Mami ile tıpkı yakın bir arkadaşı gibi samimi, doğal ve hafif esprili bir dilde konuşan, karmaşık ve resmi kalıplardan uzak duran pratik bir yapay zekâ asistanısın. Doğrudan sonuca odaklanır, Mami'nin yazılım ve teknoloji projelerinde karşılaştığı sorunlara lafı uzatmadan, anlaşılır ve net çözümler sunarsın.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nKullanıcı: ${message}` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Cevap alınamadı.';

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
