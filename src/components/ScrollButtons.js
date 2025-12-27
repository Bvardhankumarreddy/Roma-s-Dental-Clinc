import React, { useState, useEffect } from 'react';

const ScrollButtons = () => {
  const [showButtons, setShowButtons] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show buttons after scrolling 300px
      setShowButtons(scrolled > 300);
      
      // Check if near bottom (within 100px)
      setIsAtBottom(scrolled + windowHeight >= documentHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {showButtons && (
        <div className="fixed right-10 sm:right-4 md:right-6 bottom-28 sm:bottom-32 md:bottom-36 z-40 flex flex-col gap-2 sm:gap-3">
          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M5 10l7-7m0 0l7 7m-7-7v18" 
              />
            </svg>
          </button>

          {/* Scroll to Bottom Button - Only show if not at bottom */}
          {!isAtBottom && (
            <button
              onClick={scrollToBottom}
              className="group bg-gradient-to-r from-cyan-600 to-blue-600 text-white w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
              aria-label="Scroll to bottom"
            >
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ScrollButtons;
