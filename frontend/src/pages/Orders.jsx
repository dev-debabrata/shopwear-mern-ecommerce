import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Container from "../layout/Container";
import Title from "../components/Title";
import Button from "../components/Button";
import { getMyOrders } from "../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.orders || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container>
      <div className="pt-14 border-t-[0.063rem] border-t-gray-200">
        <div className="mb-3 text-2xl">
          <Title text1="YOUR" text2="ORDERS" />
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          orders.map((order) =>
            order.items.map((item) => (
              <div
                key={`${order._id}-${item.productId}`}
                className="flex flex-col gap-4 py-4 text-gray-700 border-t border-b border-gray-200 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start text-sm gap-6">
                  <img
                    src={item.image || "/images/placeholder.png"}
                    className="w-6 sm:w-20"
                    alt={item.name}
                  />

                  <div>
                    <p className="font-medium sm:text-base">{item.name}</p>

                    <div className="flex items-center mt-2 gap-3 text-base text-gray-700">
                      <p className="text-lg">₹ {Number(item.price).toFixed(2)}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Size:&nbsp; {item.size}</p>
                    </div>

                    <p className="mt-2">
                      Date:&nbsp;
                      <span className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between md:w-1/2">
                  <div className="flex items-center gap-2">
                    <p className="h-2 bg-green-500 rounded-full min-w-2"></p>
                    <p className="text-sm md:text-base">
                      {order.orderStatus || "Ready for Shipping"}
                    </p>
                  </div>

                  <Link to={`/trackorder/${order._id}`}>
                    <Button
                      type="transparent"
                      className="bg-transparent px-2"
                      size="small"
                    >
                      TRACK ORDER
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </Container>
  );
};

export default Orders;