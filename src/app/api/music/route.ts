import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Örnek: Harici ses akışı / doğrudan mp3 URL'si
    // Kendi MP3 bağlantını veya güvenli akış adresini buraya koyabilirsin
    const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

    const response = await fetch(audioUrl);

    if (!response.ok) {
      return new NextResponse('Müzik dosyası yüklenemedi', { status: 500 });
    }

    // Ses dosyasını Stream olarak istemciye aktar
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new NextResponse('Sunucu hatası', { status: 500 });
  }
}

