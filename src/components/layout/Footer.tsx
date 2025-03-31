
export default function Footer() {
  return (
    <footer className="bg-insurance-black text-white py-6 mt-auto">
      <div className="insurance-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-3">FlexiQuote</h3>
            <p className="text-sm text-gray-300">
              Your comprehensive insurance broker portal for managing Domestic Fire & Burglary Policy quotes.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-insurance-yellow">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-insurance-yellow">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-insurance-yellow">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-insurance-yellow">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Contact</h3>
            <address className="text-sm text-gray-300 not-italic">
              <div className="mb-1">123 Insurance Street</div>
              <div className="mb-1">New York, NY 10001</div>
              <div className="mb-1">United States</div>
              <div className="mb-1"><a href="mailto:support@flexiquote.com" className="hover:text-insurance-yellow">support@flexiquote.com</a></div>
              <div><a href="tel:+12345678900" className="hover:text-insurance-yellow">+1 (234) 567-8900</a></div>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} FlexiQuote Insurance Broker Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
