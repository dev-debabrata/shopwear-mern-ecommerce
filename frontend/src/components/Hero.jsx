import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { assets } from "../assets/assets";

const slides = [
  {
    tag: "new season collection",
    title: "Latest Arrivals",
    button: "Shop Now",
    image: assets.hero_img,
  },
  {
    tag: "trending fashion",
    title: "Fresh Styles",
    button: "Explore Now",
    image: assets.hero2_img,
  },
  {
    tag: "fashion for everyone",
    title: "Modern Outfits",
    button: "Discover",
    image: assets.hero3_img,
  },
  {
    tag: "exclusive collection",
    title: "Premium Wear",
    button: "View Collection",
    image: assets.hero4_img,
  },
  {
    tag: "summer essentials",
    title: "Stay Stylish",
    button: "Shop Summer",
    image: assets.hero5_img,
  },
  {
    tag: "new fashion trends",
    title: "Fashion Forward",
    button: "Browse Now",
    image: assets.hero6_img,
  },
];

slides.forEach((slide) => {
  const img = new Image();
  img.src = slide.image;
});

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden border border-gray-300">
      <div className="flex flex-col sm:flex-row min-h-75 md:min-h-125">
        <div className="flex flex-col items-center justify-center w-full py-10 sm:w-1/2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-10 h-[2px] bg-black"></span>

              <p className="text-sm font-medium uppercase">{slide.tag}</p>
            </div>

            <h1 className="mt-3 text-4xl lg:text-6xl prata-regular">
              {slide.title}
            </h1>

            <div className="flex items-center gap-2 mt-4">
              <p className="text-sm font-semibold uppercase">{slide.button}</p>

              <span className="w-10 h-[1px] bg-black"></span>
            </div>
          </div>
        </div>

        <img
          src={slide.image}
          alt={slide.title}
          loading="eager"
          className="object-cover w-full sm:w-1/2 h-75 sm:h-125"
        />
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute p-2 bg-white rounded-full shadow-md left-4 top-1/2 -translate-y-1/2"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute p-2 bg-white rounded-full shadow-md right-4 top-1/2 -translate-y-1/2"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute flex gap-2 bottom-4 left-1/2 -translate-x-1/2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full ${currentSlide === index ? "bg-black" : "bg-gray-300"
              }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute px-3 py-1 text-sm bg-white rounded-full shadow-md top-4 right-4">
        {currentSlide + 1}/{slides.length}
      </div>
    </section>
  );
};

export default Hero;
