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
        setCurrentSlide((prev) =>
            prev === slides.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
        );
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

                            <p className="text-sm font-medium uppercase">
                                {slide.tag}
                            </p>
                        </div>

                        <h1 className="mt-3 text-4xl lg:text-6xl prata-regular">
                            {slide.title}
                        </h1>

                        <div className="flex items-center gap-2 mt-4">
                            <p className="text-sm font-semibold uppercase">
                                {slide.button}
                            </p>

                            <span className="w-10 h-[1px] bg-black"></span>
                        </div>
                    </div>
                </div>

                <img
                    src={slide.image}
                    alt={slide.title}
                    loading="eager"
                    className="object-cover w-full sm:w-1/2 h-75 md:h-125"
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


// import { useEffect, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { assets } from "../assets/assets";

// const slides = [
//     {
//         tag: "new season collection",
//         title: "Latest Arrivals",
//         button: "Shop Now",
//         image: assets.hero_img,
//     },
//     {
//         tag: "trending fashion",
//         title: "Fresh Styles",
//         button: "Explore Now",
//         image: assets.hero2_img,
//     },
//     {
//         tag: "fashion for everyone",
//         title: "Modern Outfits",
//         button: "Discover",
//         image: assets.hero3_img,
//     },
//     {
//         tag: "exclusive collection",
//         title: "Premium Wear",
//         button: "View Collection",
//         image: assets.hero4_img,
//     },
//     {
//         tag: "summer essentials",
//         title: "Stay Stylish",
//         button: "Shop Summer",
//         image: assets.hero5_img,
//     },
//     {
//         tag: "new fashion trends",
//         title: "Fashion Forward",
//         button: "Browse Now",
//         image: assets.hero6_img,
//     },
// ];

// // const Hero = () => {
// //     const [currentSlide, setCurrentSlide] = useState(0);

// //     const nextSlide = () => {
// //         setCurrentSlide((prev) =>
// //             prev === slides.length - 1 ? 0 : prev + 1
// //         );
// //     };

// //     const prevSlide = () => {
// //         setCurrentSlide((prev) =>
// //             prev === 0 ? slides.length - 1 : prev - 1
// //         );
// //     };

// //     useEffect(() => {
// //         const interval = setInterval(nextSlide, 3000);

// //         return () => clearInterval(interval);
// //     }, []);


// const Hero = () => {
//     const [currentSlide, setCurrentSlide] = useState(0);

//     useEffect(() => {
//         slides.forEach((slide) => {
//             const img = new Image();
//             img.src = slide.image;
//         });
//     }, []);

//     const nextSlide = () => {
//         setCurrentSlide((prev) =>
//             prev === slides.length - 1 ? 0 : prev + 1
//         );
//     };

//     const prevSlide = () => {
//         setCurrentSlide((prev) =>
//             prev === 0 ? slides.length - 1 : prev - 1
//         );
//     };

//     useEffect(() => {
//         const interval = setInterval(nextSlide, 3000);
//         return () => clearInterval(interval);
//     }, []);

//     const slide = slides[currentSlide];

//     return (
//         <section className="relative overflow-hidden border border-gray-300">
//             <div className="flex flex-col sm:flex-row min-h-75 md:min-h-125">
//                 <div className="flex flex-col items-center justify-center w-full py-10 sm:w-1/2">
//                     <div>
//                         <div className="flex items-center gap-2">
//                             <span className="w-10 h-[2px] bg-black"></span>

//                             <p className="text-sm font-medium uppercase">
//                                 {slide.tag}
//                             </p>
//                         </div>

//                         <h1 className="mt-3 text-4xl lg:text-6xl prata-regular">
//                             {slide.title}
//                         </h1>

//                         <div className="flex items-center gap-2 mt-4">
//                             <p className="text-sm font-semibold uppercase">
//                                 {slide.button}
//                             </p>

//                             <span className="w-10 h-[1px] bg-black"></span>
//                         </div>
//                     </div>
//                 </div>

//                 <img
//                     src={slide.image}
//                     alt={slide.title}
//                     loading="eager"
//                     className="object-cover w-full sm:w-1/2 h-75 md:h-125"
//                 />

//                 {/* <img
//                     src={slide.image}
//                     alt={slide.title}
//                     className="object-cover w-full sm:w-1/2 h-[300px] md:h-[500px]"
//                 /> */}
//             </div>

//             {/* Left Arrow */}
//             <button
//                 onClick={prevSlide}
//                 className="absolute p-2 bg-white rounded-full shadow-md left-4 top-1/2 -translate-y-1/2"
//             >
//                 <ChevronLeft size={22} />
//             </button>

//             {/* Right Arrow */}
//             <button
//                 onClick={nextSlide}
//                 className="absolute p-2 bg-white rounded-full shadow-md right-4 top-1/2 -translate-y-1/2"
//             >
//                 <ChevronRight size={22} />
//             </button>

//             {/* Dots */}
//             <div className="absolute flex gap-2 bottom-4 left-1/2 -translate-x-1/2">
//                 {slides.map((_, index) => (
//                     <button
//                         key={index}
//                         onClick={() => setCurrentSlide(index)}
//                         className={`h-3 w-3 rounded-full ${currentSlide === index
//                             ? "bg-black"
//                             : "bg-gray-300"
//                             }`}
//                     />
//                 ))}
//             </div>

//             {/* Counter */}
//             <div className="absolute px-3 py-1 text-sm bg-white rounded-full shadow-md top-4 right-4">
//                 {currentSlide + 1}/{slides.length}
//             </div>
//         </section>
//     );
// };

// export default Hero;


// import { useEffect, useState } from "react";
// import { assets } from "../assets/assets";

// const slides = [
//     {
//         tag: "new season collection",
//         title: "Latest Arrivals",
//         button: "Shop Now",
//         image: assets.hero_img,
//     },
//     {
//         tag: "trending fashion",
//         title: "Fresh Styles",
//         button: "Explore Now",
//         image: assets.hero2_img,
//     },
//     {
//         tag: "fashion for everyone",
//         title: "Modern Outfits",
//         button: "Discover",
//         image: assets.hero3_img,
//     },


//     {
//         tag: "new season collection",
//         title: "Latest Arrivals",
//         button: "Shop Now",
//         image: assets.hero4_img,
//     },
//     {
//         tag: "trending fashion",
//         title: "Fresh Styles",
//         button: "Explore Now",
//         image: assets.hero5_img,
//     },
//     {
//         tag: "fashion for everyone",
//         title: "Modern Outfits",
//         button: "Discover",
//         image: assets.hero6_img,
//     },
// ];

// const Hero = () => {
//     const [currentSlide, setCurrentSlide] = useState(0);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentSlide((prev) =>
//                 prev === slides.length - 1 ? 0 : prev + 1
//             );
//         }, 2000);

//         return () => clearInterval(interval);
//     }, []);

//     const slide = slides[currentSlide];

//     return (
//         <section className="relative border border-gray-400 overflow-hidden">
//             <div className="flex flex-col sm:flex-row">
//                 <div className="py-10 sm:py-0 sm:w-1/2 flex flex-col items-center justify-center lg:text-5xl w-full">
//                     <div>
//                         <div className="flex items-center gap-2">
//                             <p className="w-8 md:w-11 h-[0.125rem] bg-[#414141]"></p>
//                             <p className="uppercase font-medium text-sm md:text-base text-[#414141]">
//                                 {slide.tag}
//                             </p>
//                         </div>

//                         <h1 className="text-3xl leading-relaxed prata-regular text-[#414141] font-normal lg:text-5xl">
//                             {slide.title}
//                         </h1>

//                         <div className="flex items-center gap-2">
//                             <p className="uppercase font-semibold text-[#414141] text-sm md:text-base">
//                                 {slide.button}
//                             </p>
//                             <p className="w-8 md:w-11 h-[0.063rem] bg-[#414141]"></p>
//                         </div>
//                     </div>
//                 </div>

//                 <img
//                     src={slide.image}
//                     alt={slide.title}
//                     className="w-full sm:w-1/2 h-75 md:h-125 object-cover transition-all duration-500"
//                 />
//             </div>

//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//                 {slides.map((_, index) => (
//                     <button
//                         key={index}
//                         type="button"
//                         onClick={() => setCurrentSlide(index)}
//                         className={`w-2.5 h-2.5 rounded-full cursor-pointer ${currentSlide === index ? "bg-black" : "bg-gray-300"
//                             }`}
//                     />
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default Hero;



// // import React from "react";
// // import { assets } from "../assets/assets";

// // const Hero = () => {
// //     return (
// //         <section className='flex flex-col sm:flex-row border border-gray-400'>
// //             <div className="py-10 sm:py-0 sm:w-1/2 flex flex-col items-center justify-center lg:text-5xl w-full">
// //                 <div>
// //                     <div className="flex items-center gap-2">
// //                         <p className="w-8 md:w-11 font-bold h-[0.125rem] bg-[#414141]"></p>
// //                         <p className="uppercase font-medium text-sm md:text-base text-[#414141]">
// //                             new season collection
// //                         </p>
// //                     </div>

// //                     <h1 className="text-3xl leading-relaxed prata-regular text-[#414141] font-normal lg:text-5xl">
// //                         Latest Arrivals
// //                     </h1>

// //                     <div className="flex items-center gap-2">
// //                         <p className="uppercase font-semibold text-[#414141] text-sm md:text-base">
// //                             Shop now
// //                         </p>
// //                         <p className="w-8 md:w-11 font-bold h-[0.063rem] bg-[#414141]"></p>
// //                     </div>
// //                 </div>
// //             </div>

// //             <img src={assets.hero_img} className="sm:w-1/2" alt="hero-img" />
// //         </section>
// //     );
// // };

// // export default Hero;