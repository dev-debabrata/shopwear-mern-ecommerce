import { useMemo } from "react";
import Title from "./Title";

import { useAppContext } from "../context/AppContext";
import Loading from "./Loading";
import ProductItem from "./ProductItem";

const LatestCollections = () => {
  const { products, loading } = useAppContext();

  const latestProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
  }, [products]);

  // const latestProducts = useMemo(() => {
  //   return products.slice(0, 10);
  // }, [products]);

  return (
    <section className="my-10">
      <div className="py-8 text-center text-3xl">
        <Title text1="NEW" text2="ARRIVALS" />
        {/* <Title text1="LATEST" text2="COLLECTIONS" /> */}

        <p className="w-3/4 mx-auto mt-2 text-xs text-gray-600 sm:text-sm md:text-base">
          ShopWear offers the latest trendy and high-quality fashion
          collections, keeping you stylish for every occasion.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <Loading text="Loading products..." />
        </div>
      ) : latestProducts.length === 0 ? (
        <div className="flex items-center justify-center min-h-[20vh]">
          <p className="text-center text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {latestProducts.map((product) => (
            <ProductItem key={product._id} {...product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestCollections;
