import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackUrl = searchParams.get('url') || 'https://soundcloud.com/kim-thomas-620577821/britney-spears-gimme-more-kim-thomas-remix';

  try {
    const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(trackUrl)}`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return NextResponse.json({ error: 'SoundCloud verisi alınamadı.' }, { status: 500 });
    }

    const data = await response.json();

    return NextResponse.json({
      title: data.title,
      author_name: data.author_name,
      thumbnail_url: data.thumbnail_url,
      html: data.html,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
