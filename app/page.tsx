export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">GlamStudio</h1>
        <p className="text-gray-500 mt-2">Peluquería & Estilismo</p>
        <a href="/admin" className="mt-6 inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          Ir al panel
        </a>
      </div>
    </div>
  );
}
