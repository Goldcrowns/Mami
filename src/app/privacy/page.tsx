import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 p-6 font-mono max-w-md mx-auto flex flex-col gap-6">
      <Link href="/" className="text-xs text-blue-400 hover:underline">
        ← Ana Sayfaya Dön
      </Link>

      <h1 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
        Gizlilik Politikası
      </h1>

      <div className="space-y-4 text-xs leading-relaxed text-slate-400">
        <p>
          Bu uygulama yapay zekâ destekli bir sohbet arayüzüdür.
        </p>
        <p>
          Sohbet kutusuna yazılan mesajlar yanıt oluşturulabilmesi adına yapay zekâ modeline (Gemini API) iletilir.
        </p>
        <p>
          Lütfen kişisel veya hassas verilerinizi (şifre, kimlik numarası vb.) platform üzerinden paylaşmayınız.
        </p>
      </div>
    </main>
  );
}

