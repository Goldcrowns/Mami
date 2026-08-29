import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackUrl = searchParams.get('url');

  if (!trackUrl) {
    return NextResponse.json({ error: 'URL parametresi gerekli.' }, { status: 400 });
  }

  try {
    // SoundCloud oEmbed servisine istek atıyoruz
    const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(trackUrl)}`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return NextResponse.json({ error: 'SoundCloud verisi alınamadı.' }, { status: 500 });
    }

    const data = await response.json();

    // İstediğimiz temiz veriyi döndürüyoruz
    return NextResponse.json({
      title: data.title,
      author_name: data.author_name,
      author_url: data.author_url,
      thumbnail_url: data.thumbnail_url,
      html: data.html, // Gömülü player HTML'i
    });
  } catch (error) {
    return NextResponse.json({ error: 'Bir sunucu hatası oluştu.' }, { status: 500 });
  }
}
