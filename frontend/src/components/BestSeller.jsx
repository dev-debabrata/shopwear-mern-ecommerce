import Title from "./Title";
import { useAppContext } from "../context/AppContext";
import Loading from "./Loading";
import ProductItem from "./ProductItem";
import { useMemo } from "react";

const BestSeller = () => {
  const { products, loading } = useAppContext();

  const bestSeller = useMemo(() => {
    return [...products]
      .filter((item) => item.bestSeller)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  }, [products]);

  // const bestSeller = products.filter((item) => item.bestSeller).slice(0, 6);

  return (
    <section className="my-10">
      <div className="py-8 text-center text-3xl">
        <Title text1="TRENDING" text2="PRODUCTS" />
        {/* <Title text1="BEST" text2="SELLERS" /> */}

        <p className="w-3/4 mx-auto text-xs text-gray-600 sm:text-sm md:text-base">
          Discover the most popular products that customers are loving right
          now.
          {/* Our best sellers are a curated selection of top-rated items that have
                    won over shoppers with their quality, style, and value. */}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <Loading text="Loading products..." />
        </div>
      ) : bestSeller.length === 0 ? (
        <div className="flex items-center justify-center min-h-[20vh]">
          <p className="text-center text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
          {bestSeller.map((product) => (
            <ProductItem key={product._id} {...product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BestSeller;
