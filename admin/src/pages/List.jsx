import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SquarePen, Trash2 } from "lucide-react";

import { backendUrl, currency } from "../App";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setList(data.products || data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getProductImage = (item) => {
    if (Array.isArray(item.image)) return item.image[0];
    if (Array.isArray(item.images)) return item.images[0];
    return item.image || item.image1 || "/placeholder.png";
  };

  const removeProduct = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`,
    );

    if (!confirmed) return;

    try {
      const { data } = await axios.delete(`${backendUrl}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message || "Product removed");
      fetchList();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove product");
    }
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <main className="w-full">
      <h2 className="mb-5 text-xl font-semibold">All Products List</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Sub Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : list.length > 0 ? (
              list.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    {" "}
                    {list.length - index}
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={getProductImage(item)}
                      alt={item.name}
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {item.category || "-"}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {item.subCategory || "-"}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {currency}
                    {Number(item.price || 0).toFixed(2)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        to={`/edit/${item._id}`}
                        className="text-blue-500 transition hover:text-blue-700"
                        title="Edit product"
                      >
                        <SquarePen size={20} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeProduct(item._id, item.name)}
                        className="text-red-500 transition hover:text-red-700"
                        title="Delete product"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default List;

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { SquarePen, Trash2 } from "lucide-react";

// import { backendUrl, currency } from "../App";
// import { useCallback } from "react";

// const List = ({ token }) => {
//   const [list, setList] = useState([]);

//   const fetchList = useCallback(async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/products`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("Products from API:", data.products || data);

//       setList(data.products || data || []);
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to fetch products");
//     }
//   }, [token]);

//   const removeProduct = async (id, name) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${name}"? This action cannot be undone.`,
//     );

//     if (!confirmed) return;

//     try {
//       const { data } = await axios.delete(`${backendUrl}/api/products/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success(data.message || "Product removed");

//       fetchList();
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to remove product");
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, [fetchList]);

//   return (
//     <main className="flex flex-col gap-2">
//       <p className="mb-2 font-semibold">All Products List</p>

//       <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border-b border-gray-200 text-sm font-bold">
//         <p>Image</p>
//         <p>Name</p>
//         <p>Category</p>
//         <p>Price</p>
//         <p className="text-center">Action</p>
//       </div>

//       {list.length > 0 ? (
//         list.map((item) => (
//           <div
//             key={item._id}
//             className="md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border-b border-gray-100 text-sm"
//           >
//             <img
//               className="w-12 h-12 object-cover"
//               src={Array.isArray(item.image) ? item.image[0] : item.image}
//               alt={item.name}
//             />

//             <p>{item.name}</p>
//             <p>{item.category}</p>
//             <p>
//               {currency}
//               {item.price}
//             </p>

//             <div className="flex justify-center gap-4 text-lg">
//               <Link
//                 to={`/edit/${item._id}`}
//                 className="cursor-pointer text-blue-500 hover:text-blue-700 transition"
//                 title="Edit product"
//               >
//                 <SquarePen />
//               </Link>

//               <button
//                 type="button"
//                 className="cursor-pointer text-red-500 hover:text-red-700 transition"
//                 onClick={() => removeProduct(item._id, item.name)}
//                 title="Delete product"
//               >
//                 <Trash2 />
//               </button>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-500 text-center py-4">No products available</p>
//       )}
//     </main>
//   );
// };

// export default List;
