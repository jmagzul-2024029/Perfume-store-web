import { Link } from 'react-router-dom';

export default function ProductCard({ perfume }) {
    return (
        <article className="product-card">
            <div className="product-image">
                <img
                    src={perfume.image}
                    alt={perfume.name}
                />
            </div>

            <div className="product-info">
                <span className="product-brand">
                    {perfume.brand}
                </span>

                <h3>{perfume.name}</h3>

                <p className="product-description">
                    {perfume.description}
                </p>

                <div className="product-footer">
                    <span className="product-price">
                        Q{perfume.price.toFixed(2)}
                    </span>

                    <Link
                        to={`/perfumes/${perfume.id}`}
                        className="product-button"
                    >
                        Ver perfume
                    </Link>
                </div>
            </div>
        </article>
    );
}