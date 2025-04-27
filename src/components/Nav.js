import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
      padding: '15px',
      backgroundColor: '#222',
      color: 'white',
      fontWeight: 'bold',
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
        Home
      </Link>
      <Link to="/product" style={{ color: 'white', textDecoration: 'none' }}>
        Products
      </Link>
      <Link to="/category" style={{ color: 'white', textDecoration: 'none' }}>
        Categories
      </Link>
    </nav>
  );
}
