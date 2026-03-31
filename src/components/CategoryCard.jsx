import { Link } from 'react-router-dom';
import './CategoryCard.css';

export default function CategoryCard({ title, imagePath, linkTo }) {
    return (
        <Link to={linkTo} className="category-card">
            <div className="category-bg" style={{ backgroundImage: `url(${imagePath})` }}></div>
            <div className="category-overlay"></div>
            <h3 className="category-title">{title}</h3>
        </Link>
    );
}
