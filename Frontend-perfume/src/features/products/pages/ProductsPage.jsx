import ProductCard from '../components/ProductCard';

const perfumes = [
    {
        id: 1,
        name: 'Dior Sauvage',
        brand: 'Dior',
        price: 950,
        image: '/perfumes/dior-sauvage.jpg',
        description: 'Una fragancia fresca y elegante para cualquier ocasión.',
    },
    {
        id: 2,
        name: 'Bleu de Chanel',
        brand: 'Chanel',
        price: 1050,
        image: '/perfumes/bleu-chanel.jpg',
        description: 'Una fragancia elegante con notas frescas y amaderadas.',
    },
    {
        id: 3,
        name: 'One Million',
        brand: 'Paco Rabanne',
        price: 850,
        image: '/perfumes/one-million.jpg',
        description: 'Una fragancia intensa y sofisticada.',
    },
];

export default function ProductsPage() {
    return (
        <main className="products-page">
            <section className="products-header">
                <span>PERFUME SHOP</span>

                <h1>Encuentra tu fragancia ideal</h1>

                <p>
                    Descubre nuestra selección de perfumes y encuentra
                    el aroma perfecto para ti.
                </p>
            </section>

            <section className="products-section">
                <div className="products-title">
                    <h2>Nuestros perfumes</h2>
                    <p>Conoce nuestra colección</p>
                </div>

                <div className="products-grid">
                    {perfumes.map((perfume) => (
                        <ProductCard
                            key={perfume.id}
                            perfume={perfume}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}