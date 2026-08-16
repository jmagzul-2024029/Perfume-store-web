import { Link, useParams } from 'react-router-dom';

export default function ProductDetailPage() {
    const { id } = useParams();

    return (
        <main className="product-detail-page">
            <Link to="/perfumes" className="back-button">
                ← Volver a perfumes
            </Link>

            <section className="product-detail">
                <div className="product-detail-image">
                    <div className="image-placeholder">
                        Perfume {id}
                    </div>
                </div>

                <div className="product-detail-info">
                    <span>Dior</span>

                    <h1>Dior Sauvage</h1>

                    <p className="detail-price">
                        Q950.00
                    </p>

                    <p>
                        Una fragancia elegante y versátil,
                        ideal para diferentes ocasiones.
                    </p>

                    <a
                        href="https://wa.me/502XXXXXXXX"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-button"
                    >
                        Pedir a WhatsApp
                    </a>
                </div>
            </section>
        </main>
    );
}