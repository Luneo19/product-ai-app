// app/shop/[slug]/page.tsx
import { shopifyClient } from "@/lib/shopify";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await shopifyClient.product.fetchByHandle(slug);

  if (!product) {
    return {
      title: "Produit introuvable",
      description: "Le produit demandé est introuvable.",
      openGraph: {
        title: "Produit introuvable",
        description: "Le produit demandé est introuvable.",
        images: [],
      },
    };
  }

  return {
    title: `${product.title} | Personnalisation IA`,
    description: product.description || "Produit personnalisé avec IA",
    openGraph: {
      title: product.title,
      description: product.description || "Produit personnalisé avec IA",
      images: product.images?.[0]?.src ? [{ url: product.images[0].src }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await shopifyClient.product.fetchByHandle(slug);

  if (!product) return notFound();

  const firstVariant = product.variants?.[0] ?? null;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Image produit */}
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden border shadow-md bg-gray-50">
          <Image
            src={product.images?.[0]?.src || "/placeholder.png"}
            alt={product.title}
            fill
            style={{ objectFit: "contain" }}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Infos produit */}
        <section>
          <h1 className="text-4xl font-extrabold mb-6 leading-tight">{product.title}</h1>

          <p className="text-gray-700 mb-8 whitespace-pre-line leading-relaxed">
            {product.description || "Description non disponible."}
          </p>

          {firstVariant ? (
            <div className="text-2xl font-semibold mb-8">
              {firstVariant.price.amount} {firstVariant.price.currencyCode}
            </div>
          ) : (
            <div className="text-xl text-red-600 mb-8">Prix indisponible</div>
          )}

          <button
            type="button"
            className="inline-block bg-black text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-gray-800 transition focus:outline-none focus:ring-4 focus:ring-gray-900"
            onClick={() => alert("Fonction panier à venir")}
            aria-label={`Ajouter ${product.title} au panier`}
          >
            Ajouter au panier
          </button>
        </section>
      </div>
    </main>
  );
}
