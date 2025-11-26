import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white mt-auto">
      <div className="max-w-7xl mx-auto py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-mint">ShockWave</h3>
            <p className="text-sm sm:text-base text-lightgray mb-4 max-w-md">
              Connecting talented graphic designers with businesses worldwide. 
              Create, collaborate, and grow your design career.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-white">For Designers</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-lightgray">
              <li>
                <Link to="/browse" className="hover:text-mint transition-colors inline-block">
                  Find Work
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-mint transition-colors inline-block">
                  Build Portfolio
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-mint transition-colors inline-block">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-mint transition-colors inline-block">
                  Resources
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-white">For Businesses</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-lightgray">
              <li>
                <a href="#" className="hover:text-mint transition-colors inline-block">
                  Post a Job
                </a>
              </li>
              <li>
                <Link to="/browse" className="hover:text-mint transition-colors inline-block">
                  Browse Designers
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-mint transition-colors inline-block">
                  Enterprise
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-mint transition-colors inline-block">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-charcoal-light">
          <div className="flex justify-center items-center">
            <p className="text-xs sm:text-sm text-lightgray-dark text-center">
              &copy; 2025 ShockWave. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;