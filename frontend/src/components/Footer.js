import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
function Footer() {
  return (
    <footer className="site-footer text-center py-4 mt-4">
      <div className="mb-3">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-icon mx-3 fs-4" aria-label="Facebook">
          <FaFacebook />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="footer-icon mx-3 fs-4" aria-label="Instagram">
          <FaInstagram />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="footer-icon mx-3 fs-4" aria-label="Twitter">
          <FaTwitter />
        </a>
      </div>
      <div>
        <p className="mb-1">© 2025 Eventify. All rights reserved.</p>
        <p className="mb-0">Email: support@eventify.local | Phone: +961 70 000 000</p>
      </div>
    </footer>
  );
}
export default Footer;