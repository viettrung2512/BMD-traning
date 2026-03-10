import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const banner = [
  {
    img: "/images/banner2.png",
  },
  {
    img: "/images/banner3.png",
  },
  {
    img: "/images/banner5.png",
  }
];

const Landing = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banner.length - 1 ? 0 : prevIndex + 1
      );
    }, 3500); 

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banner.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banner.length - 1 : prevIndex - 1
    );
  };


  // Mouse handlers for auto-play, ì over do not chage slide
  const handleMouseEnter = () => {
    setIsAutoPlay(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlay(true);
  };

  return (
    <div 
      className="w-full h-100 sm:h-125 md:h-150 lg:h-175 overflow-hidden relative z-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banner.map((book) => (
          <div key={book.img} className="w-full h-full shrink-0 relative">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${book.img})` }}
            >
              <div className="absolute bg-black  sm:bg-white sm:opacity-50"></div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prevSlide}
        title="Previous slide"
        aria-label="Previous slide"
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 hover:bg-opacity-75 text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-20"
      >
        <FaChevronLeft size={16} className="sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        title="Next slide"
        aria-label="Next slide"
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 hover:bg-opacity-75 text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-20"
      >
        <FaChevronRight size={16} className="sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};
export default Landing;
