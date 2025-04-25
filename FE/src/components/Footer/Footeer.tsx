
import { JSX } from 'react';
import './footer.css'
const Footer :  React.FC = ()  :JSX.Element => {
    return (
      <footer>
        <div className="footer-content">
          <p>&copy; 2025 My Next.js App</p>
          <p>
            <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  