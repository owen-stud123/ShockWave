import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-lightgray-light">
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal-dark text-white min-h-screen flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 sm:py-16">
          {/* Hero Content */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connect. Create. Collaborate.
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-10 text-lightgray max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The marketplace where graphic designers and businesses thrive together
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              to="/login" 
              className="w-full sm:w-auto bg-mint text-charcoal px-8 sm:px-10 py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-mint-light transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link 
              to="/browse" 
              className="w-full sm:w-auto border-2 border-mint text-mint px-8 sm:px-10 py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-mint hover:text-charcoal transition-all"
            >
              Browse Designers
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-4 sm:mb-6">
              Why Choose ShockWave?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-charcoal-light px-4">
              Everything you need to succeed in the design marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
            <motion.div 
              className="text-center p-6 sm:p-8 rounded-lg hover:bg-lightgray-light transition-colors border-2 border-transparent hover:border-mint"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-mint/10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-charcoal">Easy Discovery</h3>
              <p className="text-base sm:text-lg text-charcoal-light">
                Find the perfect designer or project with our advanced search and filtering system
              </p>
            </motion.div>

            <motion.div 
              className="text-center p-6 sm:p-8 rounded-lg hover:bg-lightgray-light transition-colors border-2 border-transparent hover:border-mint"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-mint/10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-charcoal">Secure Payments</h3>
              <p className="text-base sm:text-lg text-charcoal-light">
                Safe and secure payment processing with escrow protection for all transactions
              </p>
            </motion.div>

            <motion.div 
              className="text-center p-6 sm:p-8 rounded-lg hover:bg-lightgray-light transition-colors sm:col-span-2 md:col-span-1 border-2 border-transparent hover:border-mint"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-mint/10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-charcoal">Direct Communication</h3>
              <p className="text-base sm:text-lg text-charcoal-light">
                Built-in messaging system to collaborate effectively throughout the project
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-lightgray min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-4 sm:mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-charcoal-light mb-8 sm:mb-10 px-4">
            Join thousands of designers and businesses already using ShockWave
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <Link 
              to="/login" 
              className="w-full sm:w-auto bg-mint text-white px-8 sm:px-10 py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-mint-dark transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Join as Designer
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto bg-charcoal text-white px-8 sm:px-10 py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-charcoal-light transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Hire Designers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;