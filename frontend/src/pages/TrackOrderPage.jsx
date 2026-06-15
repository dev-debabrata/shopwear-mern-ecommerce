import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Container from "../layout/Container";
import Loading from "../components/Loading";
import { getMyOrders } from "../services/orderService";
import tick from "../assets/tick.jpg";

const TrackOrderPage = () => {
  const { _id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["track-order", _id],
    queryFn: async () => {
      const data = await getMyOrders();
      return data.orders?.find((item) => item._id === _id) || null;
    },
    refetchInterval: 2000,
    refetchOnWindowFocus: true,
    enabled: !!_id,
  });

  const order = data;

  const statusSteps = [
    "Order Placed",
    "Ready for Shipping",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const currentStatus = order?.orderStatus || "Order Placed";
  const lowerStatus = currentStatus.toLowerCase();

  const isCancelled = lowerStatus === "cancelled";
  const isDelivered = lowerStatus === "delivered";

  const statusColor = isCancelled
    ? "text-red-600"
    : isDelivered
      ? "text-green-600"
      : "text-black";

  const progressColor = isCancelled ? "bg-red-600" : "bg-green-600";

  const currentStepIndex = isCancelled
    ? statusSteps.length - 1
    : Math.max(
        statusSteps.findIndex((step) => step.toLowerCase() === lowerStatus),
        0,
      );

  const progressWidth =
    statusSteps.length === 1
      ? 100
      : (currentStepIndex / (statusSteps.length - 1)) * 100;

  const { shippingDate, formattedDeliveryDate } = useMemo(() => {
    const deliveryDate = new Date(order?.createdAt || new Date());
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    return {
      formattedDeliveryDate: deliveryDate
        .toLocaleString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
        .toUpperCase(),

      shippingDate: deliveryDate
        .toLocaleString("en-GB", {
          month: "long",
          weekday: "long",
          day: "numeric",
        })
        .toUpperCase(),
    };
  }, [order]);

  if (isLoading) return <Loading text="Loading order..." />;

  if (error) {
    return (
      <Container>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-red-500">Failed to load order.</p>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-500">Order not found.</p>
        </div>
      </Container>
    );
  }

  const items = order.items || [];

  const getProductId = (item) => {
    if (typeof item.productId === "object") {
      return item.productId?._id;
    }

    return item.productId || item._id;
  };

  return (
    <Container>
      <div className="mt-8">
        <h1
          className={`mb-8 text-[2.4rem] font-extralight uppercase ${statusColor}`}
        >
          {currentStatus}
        </h1>

        {isCancelled && (
          <div className="mb-4 inline-block rounded-full bg-red-100 px-4 py-2 font-medium text-red-600">
            Order Cancelled
          </div>
        )}

        {isDelivered && (
          <div className="mb-4 inline-block rounded-full bg-green-100 px-4 py-2 font-medium text-green-600">
            Order Delivered
          </div>
        )}

        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm sm:text-base">
            <span className="font-semibold">Order ID:</span> {order._id}
          </p>

          <p className="mt-2 text-sm sm:text-base">
            <span className="font-semibold">Placed On:</span>{" "}
            {new Date(order.createdAt).toLocaleString("en-IN", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>

          <p className="mt-2 text-sm sm:text-base">
            <span className="font-semibold">Total:</span> ₹{" "}
            {Number(order.totalAmount || 0).toFixed(2)}
          </p>
        </div>

        <div className="border border-gray-400 p-4 sm:px-20 sm:py-8">
          <div className="mb-6 flex flex-col gap-4">
            <span className="text-xs text-[#474747]">
              Expected Delivery Date
            </span>

            <span
              className={`text-[2.2rem] font-light uppercase ${statusColor}`}
            >
              {formattedDeliveryDate}
            </span>
          </div>

          <div className="relative w-full sm:w-[70%]">
            <div className="absolute left-0 top-[10px] h-[8px] w-full rounded-full bg-gray-300" />

            <div
              className={`absolute left-0 top-[10px] h-[8px] rounded-full transition-all duration-700 ${progressColor}`}
              style={{ width: `${progressWidth}%` }}
            />

            <div className="relative flex justify-between">
              {statusSteps.map((status, index) => {
                const completed = index <= currentStepIndex;

                return (
                  <div
                    key={status}
                    className="flex flex-col items-center gap-3"
                  >
                    <div
                      className={`z-10 flex h-7 w-7 items-center justify-center rounded-full ${
                        completed
                          ? isCancelled
                            ? "bg-red-600"
                            : "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    >
                      {completed && (
                        <img src={tick} alt="done" className="h-4 w-4" />
                      )}
                    </div>

                    <p
                      className={`text-center text-[10px] sm:text-xs ${
                        completed
                          ? isCancelled
                            ? "font-medium text-red-600"
                            : "font-medium text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 border border-gray-400">
          <div className="p-4 sm:px-16 sm:py-8">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-[#474747]">
                SHIPPING HISTORY
              </span>

              <span>
                {shippingDate} AT{" "}
                {new Date(order.createdAt)
                  .toLocaleTimeString("en-GB", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .toUpperCase()}
              </span>

              <span className={`font-medium ${statusColor}`}>
                {currentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 border border-gray-400">
          <h2 className="my-4 ml-4 text-2xl font-light uppercase sm:ml-16">
            Order Details
            <span className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-base">
              {items.length}
            </span>
          </h2>

          <div className="flex flex-col gap-6 p-4 sm:px-16 sm:py-8">
            {items.map((item, index) => {
              const productId = getProductId(item);

              return (
                <Link
                  to={`/products/${productId}`}
                  key={`${order._id}-${productId}-${index}`}
                  className="flex gap-4 rounded-md transition hover:bg-gray-50"
                >
                  <img
                    src={item.image || "/images/placeholder.png"}
                    alt={item.name}
                    className="h-40 w-32 object-cover sm:h-48 sm:w-40"
                  />

                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium">{item.name}</h3>

                    {item.size && (
                      <p className="text-gray-500">Size: {item.size}</p>
                    )}

                    <p className="text-gray-500">Quantity: {item.quantity}</p>

                    <p className="font-medium">
                      ₹ {Number(item.price || 0).toFixed(2)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TrackOrderPage;

// import { useEffect, useMemo, useState } from "react";
// import { Link, useParams } from "react-router-dom";

// import Container from "../layout/Container";
// import Loading from "../components/Loading";
// import { getMyOrders } from "../services/orderService";
// import tick from "../assets/tick.jpg";

// const TrackOrderPage = () => {
//   const { _id } = useParams();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchOrder = async (showLoader = false) => {
//     try {
//       if (showLoader) setLoading(true);

//       const data = await getMyOrders();
//       const foundOrder = data.orders?.find((item) => item._id === _id);

//       setOrder(foundOrder || null);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       if (showLoader) setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrder(true);

//     const interval = setInterval(() => {
//       fetchOrder(false);
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [_id]);

//   const statusSteps = [
//     "Order Placed",
//     "Ready for Shipping",
//     "Shipped",
//     "Out for Delivery",
//     "Delivered",
//   ];

//   const currentStatus = order?.orderStatus || "Order Placed";
//   const lowerStatus = currentStatus.toLowerCase();

//   const isCancelled = lowerStatus === "cancelled";
//   const isDelivered = lowerStatus === "delivered";

//   const statusColor = isCancelled
//     ? "text-red-600"
//     : isDelivered
//       ? "text-green-600"
//       : "text-black";

//   const progressColor = isCancelled ? "bg-red-600" : "bg-green-600";

//   const currentStepIndex = isCancelled
//     ? statusSteps.length - 1
//     : Math.max(
//         statusSteps.findIndex((step) => step.toLowerCase() === lowerStatus),
//         0,
//       );

//   const progressWidth =
//     statusSteps.length === 1
//       ? 100
//       : (currentStepIndex / (statusSteps.length - 1)) * 100;

//   const { shippingDate, formattedDeliveryDate } = useMemo(() => {
//     const deliveryDate = new Date(order?.createdAt || new Date());
//     deliveryDate.setDate(deliveryDate.getDate() + 3);

//     return {
//       formattedDeliveryDate: deliveryDate
//         .toLocaleString("en-GB", {
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//         })
//         .toUpperCase(),

//       shippingDate: deliveryDate
//         .toLocaleString("en-GB", {
//           month: "long",
//           weekday: "long",
//           day: "numeric",
//         })
//         .toUpperCase(),
//     };
//   }, [order]);

//   if (loading) return <Loading text="Loading order..." />;

//   if (!order) {
//     return (
//       <Container>
//         <div className="flex min-h-[50vh] items-center justify-center">
//           <p className="text-gray-500">Order not found.</p>
//         </div>
//       </Container>
//     );
//   }

//   const items = order.items || [];

//   const getProductId = (item) => {
//     if (typeof item.productId === "object") {
//       return item.productId?._id;
//     }

//     return item.productId || item._id;
//   };

//   return (
//     <Container>
//       <div className="mt-8">
//         <h1
//           className={`mb-8 text-[2.4rem] font-extralight uppercase ${statusColor}`}
//         >
//           {currentStatus}
//         </h1>

//         {isCancelled && (
//           <div className="mb-4 inline-block rounded-full bg-red-100 px-4 py-2 font-medium text-red-600">
//             Order Cancelled
//           </div>
//         )}

//         {isDelivered && (
//           <div className="mb-4 inline-block rounded-full bg-green-100 px-4 py-2 font-medium text-green-600">
//             Order Delivered
//           </div>
//         )}

//         <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
//           <p className="text-sm sm:text-base">
//             <span className="font-semibold">Order ID:</span> {order._id}
//           </p>

//           <p className="mt-2 text-sm sm:text-base">
//             <span className="font-semibold">Placed On:</span>{" "}
//             {new Date(order.createdAt).toLocaleString("en-IN", {
//               year: "numeric",
//               month: "short",
//               day: "2-digit",
//               hour: "numeric",
//               minute: "2-digit",
//               second: "2-digit",
//               hour12: true,
//             })}
//           </p>

//           <p className="mt-2 text-sm sm:text-base">
//             <span className="font-semibold">Total:</span> ₹{" "}
//             {Number(order.totalAmount || 0).toFixed(2)}
//           </p>
//         </div>

//         <div className="border border-gray-400 p-4 sm:px-20 sm:py-8">
//           <div className="mb-6 flex flex-col gap-4">
//             <span className="text-xs text-[#474747]">
//               Expected Delivery Date
//             </span>

//             <span
//               className={`text-[2.2rem] font-light uppercase ${statusColor}`}
//             >
//               {formattedDeliveryDate}
//             </span>
//           </div>

//           <div className="relative w-full sm:w-[70%]">
//             <div className="absolute left-0 top-[10px] h-[8px] w-full rounded-full bg-gray-300" />

//             <div
//               className={`absolute left-0 top-[10px] h-[8px] rounded-full transition-all duration-700 ${progressColor}`}
//               style={{ width: `${progressWidth}%` }}
//             />

//             <div className="relative flex justify-between">
//               {statusSteps.map((status, index) => {
//                 const completed = index <= currentStepIndex;

//                 return (
//                   <div
//                     key={status}
//                     className="flex flex-col items-center gap-3"
//                   >
//                     <div
//                       className={`z-10 flex h-7 w-7 items-center justify-center rounded-full ${
//                         completed
//                           ? isCancelled
//                             ? "bg-red-600"
//                             : "bg-green-600"
//                           : "bg-gray-300"
//                       }`}
//                     >
//                       {completed && (
//                         <img src={tick} alt="done" className="h-4 w-4" />
//                       )}
//                     </div>

//                     <p
//                       className={`text-center text-[10px] sm:text-xs ${
//                         completed
//                           ? isCancelled
//                             ? "font-medium text-red-600"
//                             : "font-medium text-green-600"
//                           : "text-gray-400"
//                       }`}
//                     >
//                       {status}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 border border-gray-400">
//           <div className="p-4 sm:px-16 sm:py-8">
//             <div className="flex flex-col gap-4">
//               <span className="text-xs font-medium text-[#474747]">
//                 SHIPPING HISTORY
//               </span>

//               <span>
//                 {shippingDate} AT{" "}
//                 {new Date(order.createdAt)
//                   .toLocaleTimeString("en-GB", {
//                     hour: "numeric",
//                     minute: "2-digit",
//                     hour12: true,
//                   })
//                   .toUpperCase()}
//               </span>

//               <span className={`font-medium ${statusColor}`}>
//                 {currentStatus}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 border border-gray-400">
//           <h2 className="my-4 ml-4 text-2xl font-light uppercase sm:ml-16">
//             Order Details
//             <span className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-base">
//               {items.length}
//             </span>
//           </h2>

//           <div className="flex flex-col gap-6 p-4 sm:px-16 sm:py-8">
//             {items.map((item, index) => {
//               const productId = getProductId(item);

//               return (
//                 <Link
//                   to={`/products/${productId}`}
//                   key={`${order._id}-${productId}-${index}`}
//                   className="flex gap-4 rounded-md transition hover:bg-gray-50"
//                 >
//                   <img
//                     src={item.image || "/images/placeholder.png"}
//                     alt={item.name}
//                     className="h-40 w-32 object-cover sm:h-48 sm:w-40"
//                   />

//                   <div className="flex flex-col gap-2">
//                     <h3 className="text-lg font-medium">{item.name}</h3>
//                     <p className="text-gray-500">Size: {item.size}</p>
//                     <p className="text-gray-500">Quantity: {item.quantity}</p>
//                     <p className="font-medium">
//                       ₹ {Number(item.price).toFixed(2)}
//                     </p>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>

//           {/* <div className="flex flex-col gap-6 p-4 sm:px-16 sm:py-8">
//             {items.map((item, index) => (
//               <div key={index} className="flex gap-4">
//                 <img
//                   src={item.image || "/images/placeholder.png"}
//                   alt={item.name}
//                   className="h-40 w-32 object-cover sm:h-48 sm:w-40"
//                 />

//                 <div className="flex flex-col gap-2">
//                   <h3 className="text-lg font-medium">{item.name}</h3>
//                   <p className="text-gray-500">Size: {item.size}</p>
//                   <p className="text-gray-500">Quantity: {item.quantity}</p>
//                   <p className="font-medium">
//                     ₹ {Number(item.price).toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div> */}
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default TrackOrderPage;

// // import { useEffect, useMemo, useState } from "react";
// // import { useParams } from "react-router-dom";

// // import Container from "../layout/Container";
// // import Loading from "../components/Loading";
// // import { getMyOrders } from "../services/orderService";
// // import tick from "../assets/tick.jpg";

// // const TrackOrderPage = () => {
// //   const { _id } = useParams();

// //   const [order, setOrder] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   const fetchOrder = async (showLoader = false) => {
// //     try {
// //       if (showLoader) setLoading(true);

// //       const data = await getMyOrders();
// //       const foundOrder = data.orders?.find((item) => item._id === _id);

// //       setOrder(foundOrder || null);
// //     } catch (error) {
// //       console.log(error);
// //     } finally {
// //       if (showLoader) setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchOrder(true);

// //     const interval = setInterval(() => {
// //       fetchOrder(false);
// //     }, 2000);

// //     return () => clearInterval(interval);
// //   }, [_id]);

// //   const statusSteps = [
// //     "Order Placed",
// //     "Ready for Shipping",
// //     "Shipped",
// //     "Out for Delivery",
// //     "Delivered",
// //   ];

// //   const currentStatus = order?.orderStatus || "Order Placed";

// //   const currentStepIndex = Math.max(
// //     statusSteps.findIndex(
// //       (step) => step.toLowerCase() === currentStatus.toLowerCase(),
// //     ),
// //     0,
// //   );

// //   const progressWidth =
// //     statusSteps.length === 1
// //       ? 100
// //       : (currentStepIndex / (statusSteps.length - 1)) * 100;

// //   const { shippingDate, formattedDeliveryDate } = useMemo(() => {
// //     const deliveryDate = new Date(order?.createdAt || new Date());
// //     deliveryDate.setDate(deliveryDate.getDate() + 3);

// //     return {
// //       formattedDeliveryDate: deliveryDate
// //         .toLocaleString("en-GB", {
// //           year: "numeric",
// //           month: "short",
// //           day: "numeric",
// //         })
// //         .toUpperCase(),

// //       shippingDate: deliveryDate
// //         .toLocaleString("en-GB", {
// //           month: "long",
// //           weekday: "long",
// //           day: "numeric",
// //         })
// //         .toUpperCase(),
// //     };
// //   }, [order]);

// //   if (loading) return <Loading text="Loading order..." />;

// //   if (!order) {
// //     return (
// //       <Container>
// //         <div className="flex min-h-[50vh] items-center justify-center">
// //           <p className="text-gray-500">Order not found.</p>
// //         </div>
// //       </Container>
// //     );
// //   }

// //   const items = order.items || [];

// //   return (
// //     <Container>
// //       <div className="mt-8">
// //         {/* <h1 className="uppercase mb-8 text-[#1f1f1f] text-[2.4rem] font-extralight">
// //           Track Order
// //         </h1> */}

// //         <h1 className="mb-8 text-[2.4rem] font-extralight uppercase">
// //           {currentStatus}
// //         </h1>

// //         <div className="border border-gray-400 p-4 sm:px-20 sm:py-8">
// //           <div className="mb-6 flex flex-col gap-4">
// //             <span className="text-xs text-[#474747]">
// //               Expected Delivery Date
// //             </span>

// //             <span className="text-[2.2rem] font-light uppercase">
// //               {formattedDeliveryDate}
// //             </span>
// //           </div>

// //           <div className="relative w-full sm:w-[70%]">
// //             <div className="absolute left-0 top-[10px] h-[8px] w-full rounded-full bg-gray-300" />

// //             <div
// //               className="absolute left-0 top-[10px] h-[8px] rounded-full bg-green-600 transition-all duration-700"
// //               style={{ width: `${progressWidth}%` }}
// //             />

// //             <div className="relative flex justify-between">
// //               {statusSteps.map((status, index) => {
// //                 const completed = index <= currentStepIndex;

// //                 return (
// //                   <div
// //                     key={status}
// //                     className="flex flex-col items-center gap-3"
// //                   >
// //                     <div
// //                       className={`z-10 flex h-7 w-7 items-center justify-center rounded-full ${
// //                         completed ? "bg-green-600" : "bg-gray-300"
// //                       }`}
// //                     >
// //                       {completed && (
// //                         <img src={tick} alt="done" className="h-4 w-4" />
// //                       )}
// //                     </div>

// //                     <p
// //                       className={`text-center text-[10px] sm:text-xs ${
// //                         completed ? "font-medium text-black" : "text-gray-400"
// //                       }`}
// //                     >
// //                       {status}
// //                     </p>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </div>

// //         <div className="mt-6 border border-gray-400">
// //           <div className="p-4 sm:px-16 sm:py-8">
// //             <div className="flex flex-col gap-4">
// //               <span className="text-xs font-medium text-[#474747]">
// //                 SHIPPING HISTORY
// //               </span>

// //               <span>
// //                 {shippingDate} AT{" "}
// //                 {new Date(order.createdAt)
// //                   .toLocaleTimeString("en-GB", {
// //                     hour: "numeric",
// //                     minute: "2-digit",
// //                     hour12: true,
// //                   })
// //                   .toUpperCase()}
// //               </span>

// //               <span>{currentStatus}</span>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="mt-6 border border-gray-400">
// //           <h2 className="my-4 ml-4 text-2xl font-light uppercase sm:ml-16">
// //             Order Details
// //             <span className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-base">
// //               {items.length}
// //             </span>
// //           </h2>

// //           <div className="flex flex-col gap-6 p-4 sm:px-16 sm:py-8">
// //             {items.map((item, index) => (
// //               <div key={index} className="flex gap-4">
// //                 <img
// //                   src={item.image || "/images/placeholder.png"}
// //                   alt={item.name}
// //                   className="h-40 w-32 object-cover sm:h-48 sm:w-40"
// //                 />

// //                 <div className="flex flex-col gap-2">
// //                   <h3 className="text-lg font-medium">{item.name}</h3>
// //                   <p className="text-gray-500">Size: {item.size}</p>
// //                   <p className="text-gray-500">Quantity: {item.quantity}</p>
// //                   <p className="font-medium">
// //                     ₹ {Number(item.price).toFixed(2)}
// //                   </p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </Container>
// //   );
// // };

// // export default TrackOrderPage;

// // import { useEffect, useMemo, useState } from "react";
// // import { useParams } from "react-router-dom";

// // import Container from "../layout/Container";
// // import Loading from "../components/Loading";
// // import { getMyOrders } from "../services/orderService";

// // import tick from "../assets/tick.jpg";

// // const TrackOrderPage = () => {
// //   const { _id } = useParams();

// //   const [order, setOrder] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchOrder = async () => {
// //       try {
// //         const data = await getMyOrders();

// //         const foundOrder = data.orders?.find(
// //           (item) => item._id === _id
// //         );

// //         setOrder(foundOrder || null);
// //       } catch (error) {
// //         console.log(error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOrder();

// //     const interval = setInterval(fetchOrder, 5000);

// //     return () => clearInterval(interval);
// //   }, [_id]);

// //   const statusSteps = [
// //     "Order Created",
// //     "Order Received",
// //     "Order Arranged",
// //     "Despatched",
// //     "Delivered",
// //   ];

// //   const currentStatus = order?.status || "Order Created";

// //   const currentStepIndex = statusSteps.findIndex(
// //     (step) => step.toLowerCase() === currentStatus.toLowerCase()
// //   );

// //   const progressWidth =
// //     ((currentStepIndex + 1) / statusSteps.length) * 100;

// //   const { shippingDate, formattedDeliveryDate } = useMemo(() => {
// //     const deliveryDate = new Date(order?.createdAt || new Date());

// //     deliveryDate.setDate(deliveryDate.getDate() + 3);

// //     return {
// //       formattedDeliveryDate: deliveryDate
// //         .toLocaleString("en-GB", {
// //           year: "numeric",
// //           month: "short",
// //           day: "numeric",
// //         })
// //         .toUpperCase(),

// //       shippingDate: deliveryDate
// //         .toLocaleString("en-GB", {
// //           month: "long",
// //           weekday: "long",
// //           day: "numeric",
// //         })
// //         .toUpperCase(),
// //     };
// //   }, [order]);

// //   if (loading) return <Loading />;

// //   if (!order) {
// //     return (
// //       <Container>
// //         <div className="flex min-h-[50vh] items-center justify-center">
// //           <p className="text-gray-500">Order not found.</p>
// //         </div>
// //       </Container>
// //     );
// //   }

// //   const items = order.items || [];

// //   return (
// //     <Container>
// //       <div className="mt-8">
// //         <h1 className="mb-8 text-[2.4rem] font-extralight uppercase">
// //           {currentStatus}
// //         </h1>

// //         {/* TRACK SECTION */}
// //         <div className="border border-gray-400 p-4 sm:px-20 sm:py-8">
// //           <div className="mb-6 flex flex-col gap-4">
// //             <span className="text-xs text-[#474747]">
// //               Expected Delivery Date
// //             </span>

// //             <span className="text-[2.2rem] font-light uppercase">
// //               {formattedDeliveryDate}
// //             </span>
// //           </div>

// //           <div className="relative w-full sm:w-[70%]">
// //             <div className="h-[10px] w-full rounded-full bg-gray-300" />

// //             <div
// //               className="absolute top-0 left-0 h-[10px] rounded-full bg-green-600 transition-all duration-700"
// //               style={{
// //                 width: `${progressWidth}%`,
// //               }}
// //             />

// //             <div className="mt-6 flex justify-between">
// //               {statusSteps.map((status, index) => {
// //                 const completed = index <= currentStepIndex;

// //                 return (
// //                   <div
// //                     key={status}
// //                     className="flex flex-col items-center gap-2"
// //                   >
// //                     {completed ? (
// //                       <img
// //                         src={tick}
// //                         alt="completed"
// //                         className="h-5 w-5"
// //                       />
// //                     ) : (
// //                       <div className="h-5 w-5 rounded-full border-2 border-gray-400" />
// //                     )}

// //                     <p
// //                       className={`text-center text-[10px] sm:text-xs ${completed
// //                         ? "font-medium text-black"
// //                         : "text-gray-400"
// //                         }`}
// //                     >
// //                       {status}
// //                     </p>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </div>

// //         {/* SHIPPING HISTORY */}
// //         <div className="mt-6 border border-gray-400">
// //           <div className="p-4 sm:px-16 sm:py-8">
// //             <div className="flex flex-col gap-4">
// //               <span className="text-xs font-medium text-[#474747]">
// //                 SHIPPING HISTORY
// //               </span>

// //               <span>
// //                 {shippingDate} AT{" "}
// //                 {new Date(order.createdAt)
// //                   .toLocaleTimeString("en-GB", {
// //                     hour: "numeric",
// //                     minute: "2-digit",
// //                     hour12: true,
// //                   })
// //                   .toUpperCase()}
// //               </span>

// //               <span>{currentStatus}</span>

// //               <button className="cursor-pointer text-left underline underline-offset-4">
// //                 Show Full History
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* ORDER DETAILS */}
// //         <div className="mt-6 border border-gray-400">
// //           <h2 className="ml-4 my-4 text-2xl font-light uppercase sm:ml-16">
// //             Order Details

// //             <span className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-base">
// //               {items.length}
// //             </span>
// //           </h2>

// //           <div className="flex flex-col gap-6 p-4 sm:px-16 sm:py-8">
// //             {items.map((item, index) => (
// //               <div
// //                 key={index}
// //                 className="flex flex-col gap-4 sm:flex-row"
// //               >
// //                 <img
// //                   src={item.image}
// //                   alt={item.name}
// //                   className="h-48 w-40 object-cover"
// //                 />

// //                 <div className="flex flex-col gap-2">
// //                   <h3 className="text-lg font-medium">
// //                     {item.name}
// //                   </h3>

// //                   <p className="text-gray-500">
// //                     Size: {item.size}
// //                   </p>

// //                   <p className="text-gray-500">
// //                     Quantity: {item.quantity}
// //                   </p>

// //                   <p className="font-medium">
// //                     ₹ {Number(item.price).toFixed(2)}
// //                   </p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </Container>
// //   );
// // };

// // export default TrackOrderPage;

// // import { useEffect, useMemo, useState } from "react";
// // import { useParams } from "react-router-dom";

// // import Container from "../layout/Container";
// // import Loading from "../components/Loading";
// // import { getMyOrders } from "../services/orderService";
// // import tick from "../assets/tick.jpg";

// // const TrackOrderPage = () => {
// //   const { _id } = useParams();

// //   const [order, setOrder] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchOrder = async () => {
// //       try {
// //         const data = await getMyOrders();

// //         const foundOrder = data.orders?.find((item) => item._id === _id);
// //         setOrder(foundOrder || null);
// //       } catch (error) {
// //         console.log(error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOrder();
// //   }, [_id]);

// //   const { shippingDate, formattedDeliveryDate } = useMemo(() => {
// //     const deliveryDate = new Date(order?.createdAt || new Date());
// //     deliveryDate.setDate(deliveryDate.getDate() + 3);

// //     return {
// //       formattedDeliveryDate: deliveryDate
// //         .toLocaleString("en-GB", {
// //           year: "numeric",
// //           month: "short",
// //           day: "numeric",
// //         })
// //         .toUpperCase(),

// //       shippingDate: deliveryDate
// //         .toLocaleString("en-GB", {
// //           month: "long",
// //           weekday: "long",
// //           day: "numeric",
// //         })
// //         .toUpperCase(),
// //     };
// //   }, [order]);

// //   if (loading) return <Loading />;

// //   if (!order) {
// //     return (
// //       <Container>
// //         <div className="min-h-[50vh] flex items-center justify-center">
// //           <p className="text-gray-500">Order not found.</p>
// //         </div>
// //       </Container>
// //     );
// //   }

// //   const items = order.items || [];

// //   return (
// //     <Container>
// //       <div className="mt-8">
// //         <h1 className="uppercase mb-8 text-[#1f1f1f] text-[2.4rem] font-extralight">
// //           Track Order
// //         </h1>

// //         <div className="flex flex-col gap-4 border border-gray-400 p-4 sm:py-8 sm:px-20">
// //           <div className="flex flex-col gap-4">
// //             <span className="text-xs text-[#474747]">Delivery date</span>
// //             <span className="uppercase text-[2.2rem] font-light text-[#1f1f1f]">
// //               {formattedDeliveryDate}
// //             </span>
// //           </div>

// //           <div className="bg-[#474747] h-[0.6rem] w-full sm:w-[60%] rounded-[0.5rem] mb-[0.6rem]" />

// //           <div className="flex justify-between mb-4 w-full sm:w-[60%]">
// //             {[
// //               "Order Created",
// //               "Order Received",
// //               "Order Arranged",
// //               "Despatched",
// //               "Delivered",
// //             ].map((status) => (
// //               <span
// //                 key={status}
// //                 className="flex flex-col-reverse sm:flex-row sm:items-center gap-1 text-[0.6rem] sm:text-[0.7rem]"
// //               >
// //                 <img src={tick} className="w-4" alt="tick" />
// //                 <p>{status}</p>
// //               </span>
// //             ))}
// //           </div>
// //         </div>

// //         <div className="mt-6 border border-gray-400">
// //           <div className="flex gap-4 p-4 sm:py-8 sm:px-16">
// //             <div className="flex flex-col justify-between gap-4 sm:ml-4 w-full">
// //               <span className="font-medium text-xs text-[#474747]">
// //                 SHIPPING HISTORY
// //               </span>

// //               <span>
// //                 {shippingDate} AT{" "}
// //                 {new Date(order.createdAt)
// //                   .toLocaleTimeString("en-GB", {
// //                     hour: "numeric",
// //                     minute: "2-digit",
// //                     hour12: true,
// //                   })
// //                   .toUpperCase()}
// //               </span>

// //               <span>Order created</span>

// //               <button className="cursor-pointer text-left underline underline-offset-4">
// //                 Show Full History
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="mt-6 border border-gray-400">
// //           <h2 className="ml-4 sm:ml-16 my-3 font-light text-2xl uppercase">
// //             Order Details
// //             <span className="text-[1.2rem] bg-[#efefef] inline-flex justify-center items-center rounded-full h-12 w-12 ml-2">
// //               {items.length}
// //             </span>
// //           </h2>

// //           <div className="p-4 sm:py-8 sm:px-16 flex flex-col gap-6">
// //             {items.map((item) => (
// //               <div key={`${item.productId}-${item.size}`} className="flex gap-4">
// //                 <img
// //                   src={item.image}
// //                   alt={item.name}
// //                   className="w-32 h-40 sm:w-40 sm:h-48 object-cover"
// //                 />

// //                 <div className="flex flex-col gap-2">
// //                   <p className="uppercase font-light text-sm sm:text-[1.2rem]">
// //                     {item.name}
// //                   </p>

// //                   <p className="text-gray-500 text-sm">Size: {item.size}</p>
// //                   <p className="text-gray-500 text-sm">
// //                     Quantity: {item.quantity}
// //                   </p>

// //                   <p className="font-medium">₹ {Number(item.price).toFixed(2)}</p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </Container>
// //   );
// // };

// // export default TrackOrderPage;

// // import { useMemo, } from "react";
// // import { useParams } from "react-router-dom";
// // import { useAppContext } from "../context/AppContext";

// // import Container from "../layout/Container";
// // import tick from "../assets/tick.jpg";

// // const TrackOrderPage = () => {
// //   const { cartItems } = useAppContext();
// //   const { _id: productId } = useParams();

// //   const order = cartItems.find((item) => item._id === productId);

// //   // const [order, setOrder] = useState(null);

// //   // useEffect(() => {
// //   //   const product = cartItems.find((item) => item._id === productId);

// //   //   if (product) {
// //   //     setOrder(product);
// //   //   }
// //   // }, [productId, cartItems]);

// //   const { shippingDate, formattedDeliveryDate } = useMemo(() => {
// //     const deliveryDate = new Date();
// //     deliveryDate.setDate(deliveryDate.getDate() + 3);

// //     const formattedDeliveryDate = deliveryDate
// //       .toLocaleString("en-GB", {
// //         year: "numeric",
// //         month: "short",
// //         day: "numeric",
// //       })
// //       .toUpperCase();

// //     const shippingDate = deliveryDate
// //       .toLocaleString("en-GB", {
// //         month: "long",
// //         weekday: "long",
// //         day: "numeric",
// //       })
// //       .toUpperCase();

// //     return { shippingDate, formattedDeliveryDate };
// //   }, []);

// //   return (
// //     <Container>
// //       <div className="mt-8">
// //         <h1 className="uppercase mb-8 text-[#1f1f1f] text-[2.4rem] m-0.5 font-extralight">
// //           Delivered
// //         </h1>

// //         {order && (
// //           <div>
// //             <div className="flex flex-col gap-4 border-[0.063rem] border-[#9ca3af] p-4 sm:py-8 sm:px-20">
// //               <div className="flex flex-col gap-4">
// //                 <span className="text-xs text-[#474747]">Delivery date</span>
// //                 <span className="uppercase text-[2.2rem] font-light text[#1f1f1f]">
// //                   {formattedDeliveryDate}
// //                 </span>
// //               </div>
// //               <div className="bg-[#474747] h-[0.6rem] w-full sm:w-[60%] rounded-[0.5rem] mb-[0.6rem]"></div>
// //               <div className="flex justify-between mb-4 w-full sm:w-[60%]">
// //                 <span className="flex flex-col-reverse sm:flex-row justify-between sm:items-center gap-0.5 text-[0.6rem] sm:text-[0.7rem]">
// //                   <img src={tick} className="w-4" alt="tick" />
// //                   <p>Order Created</p>
// //                 </span>
// //                 <span className="flex flex-col-reverse sm:flex-row justify-between sm:items-center gap-[0.4rem] text-[0.6rem] sm:text-[0.7rem]">
// //                   <img src={tick} className="w-4" alt="tick" />
// //                   <p>Order Received</p>
// //                 </span>
// //                 <span className="flex flex-col-reverse sm:flex-row justify-between sm:items-center gap-[0.4rem] text-[0.6rem] sm:text-[0.7rem]">
// //                   <img src={tick} className="w-4" alt="tick" />
// //                   <p>Order Arranged</p>
// //                 </span>
// //                 <span className="flex flex-col-reverse sm:flex-row justify-between sm:items-center gap-[0.4rem] text-[0.6rem] sm:text-[0.7rem]">
// //                   <img src={tick} className="w-4" alt="tick" />
// //                   <p>Despatched</p>
// //                 </span>
// //                 <span className="flex flex-col-reverse sm:flex-row justify-between sm:items-center gap-[0.4rem] text-[0.6rem] sm:text-[0.7rem]">
// //                   <img src={tick} className="w-4" alt="tick" />
// //                   <p>Delivered</p>
// //                 </span>
// //               </div>
// //             </div>
// //             <div className="mt-6 border-[0.063rem] border-[#9ca3af]">
// //               <div className="flex gap-4 p-4 sm:py-8 sm:px-16">
// //                 <div className="flex flex-col justify-between gap-4 sm:ml-4 w-full">
// //                   <span className="font-medium text-xs text-[#474747]">
// //                     SHIPPING HISTORY
// //                   </span>

// //                   <span>
// //                     {shippingDate} AT{" "}
// //                     {new Date(order.createdAt)
// //                       .toLocaleTimeString("en-GB", {
// //                         hour: "numeric",
// //                         minute: "2-digit",
// //                         hour12: true,
// //                       })
// //                       .toUpperCase()}
// //                   </span>

// //                   <span>Order created</span>
// //                   <button className="cursor-pointer text-left underline underline-offset-[0.2rem]">
// //                     Show Full History
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="mt-6 border-[0.063rem] border-[#9ca3af]">
// //               <h2 className="w-full ml-4 sm:ml-16 mt-2 mb-2 font-light text-2xl uppercase">
// //                 Order Details
// //                 <span className="text-[1.2rem] bg-[#efefef] inline-flex justify-center items-center rounded-full h-12 w-12 ml-2">
// //                   {order.quantity}
// //                 </span>
// //               </h2>
// //               <div className="p-4 sm:py-8 sm:px-16 gap-4 flex">
// //                 <div className="sm:w-[47%] flex gap-0.5">
// //                   <img src={order.images[0]} alt="order" className="mr-4 w-40 h-48 object-cover" />
// //                   <div className="flex flex-col justify-between gap-2">
// //                     <p className="uppercase font-light text-sm sm:text-[1.2rem]">{order.name} ({order.price})</p>
// //                     <p className="opacity-[.6] text-[#474747] font-light text-[0.9rem]">{order.name} ({order.price})</p>
// //                     <p className="mb-4 ">{order.price}</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </Container>
// //   );
// // };

// // export default TrackOrderPage;
