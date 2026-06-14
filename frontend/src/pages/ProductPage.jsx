import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../utils/axios";
import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";
import star from "../assets/star_icon.png";
import dullStar from "../assets/star_dull_icon.png";
import Button from "../components/Button";
import { Heart, X } from "lucide-react";
import Loading from "../components/Loading";
import RelatedProducts from "../components/RelatedProducts";

const ProductPage = () => {
  const { _id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const {
    cartItems,
    setCartItems,
    user,
    addToWishlist,
    isInWishlist,
  } = useAppContext();

  const navigate = useNavigate();

  // const { cartItems, setCartItems, products } = useAppContext();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const { data } = await axiosInstance.get(`/products/${_id}`);

        const fetchedProduct = data.product || data;

        if (!fetchedProduct?._id) {
          setProduct(null);
          return;
        }

        setProduct(fetchedProduct);
        setSelectedImageIndex(0);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (_id) {
      fetchProduct();
    }
  }, [_id]);

  const productImages = Array.isArray(product?.image) ? product.image : [];

  const handleWishlist = (e, product) => {
    e.preventDefault();

    const success = addToWishlist(product);

    if (!success) {
      setTimeout(() => {
        navigate("/signup?mode=login");
      }, 500);
    }
  };

  const addToCart = (productId) => {
    if (!selectedSize) {
      toast.warning("Please Select a Size");
      return;
    }

    if (!user) {
      toast.error("Please login first");

      setTimeout(() => {
        navigate("/signup?mode=login");
      }, 500);

      return;
    }

    const alreadyInCart = cartItems.find(
      (item) => item._id === productId && item.size === selectedSize,
    );

    if (alreadyInCart) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === productId && item.size === selectedSize
            ? {
              ...item,
              quantity: item.quantity + 1,
            }
            : item,
        ),
      );

      toast.info("Product updated");
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          ...product,
          quantity: 1,
          size: selectedSize,
          createdAt: new Date().toISOString(),
        },
      ]);

      toast.success("Product added to cart");
    }
  };

  // if (loading) {
  //   return (
  //     <Container>
  //       <Loading text="Loading product..." />
  //     </Container>
  //   );
  // }

  // if (!product) {
  //   return (
  //     <Container>
  //       <div className="py-20 text-center text-gray-500">Product not found</div>
  //     </Container>
  //   );
  // }

  return (
    <Container>
      <div className="transition-opacity duration-500 ease-in border-t-2 border-gray-200 opacity-100 pt-10">
        {loading ? (
          <div className="flex-1">
            <Loading text="Loading product..." />
          </div>
        ) : !product ? (
          <div className="flex min-h-[36vh] items-center justify-center">
            <p className="col-span-full text-center text-gray-500">
              Product not found
            </p>
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-12 sm:flex-row">
              <div className="flex flex-col-reverse gap-3 sm:flex-row flex-1">
                <div className="flex sm:flex-col justify-between sm:justify-normal w-full sm:w-[18.7%]">
                  {productImages.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={product.name}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer ${selectedImageIndex === index
                        ? "border-2 border-gray-600 p-2"
                        : ""
                        }`}
                    />
                  ))}
                </div>

                <div className="relative w-full sm:w-[80%]">
                  <button
                    onClick={(e) => handleWishlist(e, product)}
                    className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-105 transition"
                  >
                    <Heart
                      size={22}
                      className={
                        isInWishlist(product._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }
                    />
                  </button>

                  <img
                    src={
                      productImages[selectedImageIndex] ||
                      productImages[0] ||
                      "/images/placeholder.png"
                    }
                    alt={product.name}
                    onClick={() => setIsImageModalOpen(true)}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-medium mt-2">{product.name}</h1>

                <div className="flex items-center mt-2 gap-1">
                  <img src={star} className="w-3" alt="star" />
                  <img src={star} className="w-3" alt="star" />
                  <img src={star} className="w-3" alt="star" />
                  <img src={star} className="w-3" alt="star" />
                  <img src={dullStar} className="w-3" alt="star" />
                  <p className="pl-2">122</p>
                </div>

                <p className="text-3xl font-medium mt-5">₹{product.price}</p>

                <div className="flex flex-col gap-4 my-8">
                  <p>Select Size</p>

                  <div className="flex gap-2">
                    {product.sizes?.map((size) => (
                      <Button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        size="tiny"
                        className={`${selectedSize === size
                          ? "border-orange-500"
                          : "border-gray-200"
                          } text-black`}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => addToCart(product._id)}
                  size="medium"
                  type="primary"
                  className="w-[28vh]"
                >
                  ADD TO CART
                </Button>

                <hr className="mt-8 sm:w-4/5 text-gray-200" />

                <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
                  <p>Guaranteed 100% Authentic - Shop with Confidence!</p>
                  <p>Enjoy Cash on Delivery - Pay at Your Doorstep!</p>
                  <p>
                    Hassle-Free Returns & Exchanges - 10 Days, No Questions
                    Asked!
                  </p>
                </div>

                {/* <div className="mt-5 text-gray-500 leading-7">
                  <p className=" text-black font-bold text-xl  py-3">
                    Description -
                  </p>

                  <ReactMarkdown>{product.description}</ReactMarkdown>
                </div> */}

                {/* <p className="mt-5 text-gray-500">{product.description}</p> */}
              </div>
            </div>

            <div className="mt-20">
              <div className="flex">
                <p className="border border-gray-200 font-bold text-sm px-5 py-3">
                  Description
                </p>

                <p className="border border-gray-200 text-sm px-5 py-3">
                  Reviews(122)
                </p>
              </div>

              <div className="flex flex-col border border-gray-200 p-6 gap-4 text-gray-500 text-sm">
                <div className=" text-gray-500 leading-7">
                  <p className=" text-black font-bold text-xl pb-3">
                    Description -
                  </p>

                  <ReactMarkdown>{product.description}</ReactMarkdown>
                </div>
                {/* <p>
                  Elevate your style with our meticulously crafted Trendify
                  quality products.
                </p>

                <p>
                  Whether you're dressing up for a special occasion or adding a
                  touch of sophistication to your everyday look.
                </p> */}
              </div>
            </div>
          </div>
        )}

        <RelatedProducts
          productId={product?._id}
          category={product?.category}
          subCategory={product?.subCategory}
        />
      </div>



      {isImageModalOpen && (
        <div
          onClick={() => setIsImageModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-8 right-90 text-white text-4xl"
          >
            <X />
          </button>

          <img
            src={
              productImages[selectedImageIndex] ||
              productImages[0] ||
              "/images/placeholder.png"
            }
            alt={product?.name}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[85vw] object-contain"
          />
        </div>
      )}

    </Container>
  );
};

export default ProductPage;

