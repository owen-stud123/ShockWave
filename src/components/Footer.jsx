const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">ShockWave</h3>
            <p className="text-gray-300 mb-4">
              Connecting talented graphic designers with businesses worldwide. 
              Create, collaborate, and grow your design career.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">For Designers</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Find Work</a></li>
              <li><a href="#" className="hover:text-white">Build Portfolio</a></li>
              <li><a href="#" className="hover:text-white">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">For Businesses</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Post a Job</a></li>
              <li><a href="#" className="hover:text-white">Browse Designers</a></li>
              <li><a href="#" className="hover:text-white">Enterprise</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
          <p>&copy; 2025 ShockWave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;