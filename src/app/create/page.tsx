'use client';

import { useState } from 'react';

export default function CreateProductPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generateProduct = async () => {
    setLoading(true);
    setResult('');
    const res = await fetch('/api/generate-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Créer un produit par IA</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ex: Chaussures inspirées de Naruto"
        className="w-full border border-gray-300 p-2 rounded mb-4"
      />
      <button
        onClick={generateProduct}
        disabled={loading || !prompt}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Génération...' : 'Générer le produit'}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Résultat :</h2>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </main>
  );
}
