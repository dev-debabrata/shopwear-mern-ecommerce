import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";
import Title from "../components/Title";
import binIcon from "../assets/bin_icon.png";
import CartTotal from "../components/CartTotal";
import Input from "../components/Input";
import Loading from "../components/Loading";

const CartPage = () => {
  const {
    cartItems,
    products,
    removeFromCart,
    updateCartQuantity,
    userDataLoading,
  } = useAppContext();

  const updateQuantity = async (productId, size, value) => {
    const quantity = Number(value);

    if (!quantity || quantity < 1) return;

    await updateCartQuantity(productId, size, quantity);
  };

  const deleteItemFromCart = async (productId, size) => {
    await removeFromCart(productId, size);
  };

  return (
    <Container>
      <div className="pt-14 border-t border-t-gray-200">
        <div className="mb-3 text-2xl">
          <Title text1="YOUR" text2="CART" />
        </div>

        {userDataLoading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <Loading text="Loading cart..." />
          </div>
        ) : cartItems.length === 0 ? (
          <p className="py-10 text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => {
              const latestProduct = products.find(
                (product) => product._id === item._id,
              );

              const currentPrice = latestProduct?.price || item.price || 0;
              const currentName = latestProduct?.name || item.name || "Product";

              const imageUrl =
                latestProduct?.image?.[0] ||
                item?.image?.[0] ||
                "/images/placeholder.png";

              return (
                <div
                  key={`${item._id}-${item.size}`}
                  className="border-t border-b border-gray-200 py-4 text-gray-700 grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] gap-4 items-center"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-20 sm:w-20 sm:h-24 bg-gray-100 flex items-center justify-center rounded">
                      <img
                        src={imageUrl}
                        className="max-w-full max-h-full object-contain"
                        alt={currentName}
                      />
                    </div>
                    {/* <img
                      src={imageUrl}
                      className="w-16 h-20 object-cover sm:w-20"
                      alt={currentName}
                    /> */}

                    <div>
                      <p className="text-sm font-medium sm:text-lg">
                        {currentName}
                      </p>

                      <div className="flex items-center mt-2 gap-5">
                        <p>₹{Number(currentPrice).toFixed(2)}</p>

                        <p className="bg-slate-50 border border-gray-200 px-2 sm:px-3 sm:py-1">
                          {item.size}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Input
                    htmlType="number"
                    size="small"
                    min="1"
                    value={item.quantity || 1}
                    onChange={(e) =>
                      updateQuantity(item._id, item.size, e.target.value)
                    }
                  />

                  <img
                    src={binIcon}
                    className="cursor-pointer w-4 mr-4 sm:w-5"
                    alt="bin icon"
                    onClick={() => deleteItemFromCart(item._id, item.size)}
                  />
                </div>
              );
            })}

            <CartTotal />
          </>
        )}
      </div>
    </Container>
  );
};

export default CartPage;
