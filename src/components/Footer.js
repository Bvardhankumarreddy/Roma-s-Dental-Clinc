import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm sm:text-base text-gray-300">
            © {currentYear} All Rights Reserved. Designed & Developed by <a href="https://www.corevibetechnology.com/" target="_blank" rel="noopener noreferrer" className="underline"><span className="font-semibold text-cyan-400">Corevibe Technology Pvt. Ltd.</span></a>
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Shop no. 7, SHUBH SHAGUN, Old Mundhwa Rd, Kharadi, Pune 411014
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
