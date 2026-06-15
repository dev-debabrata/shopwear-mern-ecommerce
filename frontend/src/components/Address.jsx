import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SquarePen, Trash2 } from "lucide-react";
import AddressModal, { emptyAddress } from "./AddressModel";
import Button from "./Button";

import {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../services/addressService";
import Loading from "./Loading";

const Address = ({
  mode = "profile",
  formData: checkoutFormData,
  setFormData: setCheckoutFormData,
}) => {
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState(emptyAddress);

  const { data: addresses = [], isLoading: loading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const data = await getMyAddresses();
      return data.addresses || [];
    },
  });

  const closeModal = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setFormData(emptyAddress);
  };

  const handleSelectAddress = (address) => {
    if (mode !== "checkout" || !setCheckoutFormData) return;

    setCheckoutFormData({
      _id: address._id,
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      emailAddress: address.emailAddress || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "",
      mobile: address.mobile || "",
    });
  };

  const handleSaveAddress = async (e) => {
    e?.preventDefault();

    try {
      setSaving(true);

      let data;

      if (editingAddressId) {
        data = await updateAddress(editingAddressId, formData);
        toast.success("Address updated successfully");
      } else {
        data = await createAddress(formData);
        toast.success("Address saved successfully");
      }

      await queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      if (mode === "checkout" && setCheckoutFormData && data?.address) {
        handleSelectAddress(data.address);
      }

      closeModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Address save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEditAddress = (address) => {
    setFormData({
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      emailAddress: address.emailAddress || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "",
      mobile: address.mobile || "",
    });

    setEditingAddressId(address._id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (!confirmed) return;

    try {
      await deleteAddress(id);

      await queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Address delete failed");
    }
  };

  const visibleAddresses =
    mode === "checkout" && !showAll ? addresses.slice(0, 2) : addresses;

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Address</h3>

          <Button
            buttonType="button"
            onClick={() => setShowAddressForm(true)}
            type="primary"
            size="small"
            className="rounded px-4"
          >
            {mode === "checkout" ? "New Address" : "Add Address"}
          </Button>
        </div>
        {loading ? (
          <div className="py-4">
            <Loading text="Loading addresses..." />
          </div>
        ) : addresses.length === 0 ? (
          <p className="text-sm text-gray-500">No address added.</p>
        ) : (
          <div className="space-y-4">
            {visibleAddresses.map((address) => {
              const isSelected = checkoutFormData?._id === address._id;

              return (
                <div
                  key={address._id}
                  onClick={() => handleSelectAddress(address)}
                  className={`relative p-4 pr-16 border rounded-md ${
                    mode === "checkout" ? "cursor-pointer" : ""
                  } ${
                    isSelected ? "border-black bg-gray-50" : "border-gray-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(address);
                    }}
                    className="absolute top-4 right-4 text-sm text-blue-600 cursor-pointer"
                  >
                    <SquarePen />
                  </button>

                  <div className="flex gap-3">
                    {mode === "checkout" && (
                      <input
                        type="radio"
                        name="checkoutAddress"
                        checked={isSelected}
                        onChange={() => handleSelectAddress(address)}
                        className="mt-1"
                      />
                    )}

                    <div>
                      <p className="font-medium">
                        {address.firstName} {address.lastName}
                      </p>

                      <p className="text-sm text-gray-600">
                        {address.emailAddress}
                      </p>
                      <p className="text-sm text-gray-600">{address.mobile}</p>

                      <p className="text-sm text-gray-600">
                        {address.street}, {address.city}, {address.state},{" "}
                        {address.country} - {address.zipCode}
                      </p>
                    </div>
                  </div>

                  {mode === "profile" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address._id);
                      }}
                      className="absolute top-18 right-4 text-sm text-red-600 cursor-pointer"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              );
            })}

            {/* {visibleAddresses.map((address) => (
                            <div
                                key={address._id}
                                className="p-4 border border-gray-200 rounded-md"
                            >
                                <div className="flex gap-3">
                                    {mode === "checkout" && (
                                        <input
                                            type="radio"
                                            name="checkoutAddress"
                                            checked={checkoutFormData?._id === address._id}
                                            onChange={() => handleSelectAddress(address)}
                                            className="mt-1"
                                        />
                                    )}

                                    <div>
                                        <p className="font-medium">
                                            {address.firstName} {address.lastName}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            {address.emailAddress}
                                        </p>

                                        <p className="text-sm text-gray-600">{address.mobile}</p>

                                        <p className="text-sm text-gray-600">
                                            {address.street}, {address.city}, {address.state},{" "}
                                            {address.country} - {address.zipCode}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => handleEditAddress(address)}
                                        className="text-sm text-blue-600 cursor-pointer"
                                    >
                                        Edit
                                    </button>

                                    {mode === "profile" && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteAddress(address._id)}
                                            className="text-sm text-red-600 cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))} */}

            {mode === "checkout" && addresses.length > 2 && (
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-blue-600 cursor-pointer"
              >
                {showAll ? "See Less" : "See More"}
              </button>
            )}
          </div>
        )}
      </div>

      {showAddressForm && (
        <AddressModal
          formData={formData}
          setFormData={setFormData}
          onClose={closeModal}
          onSave={handleSaveAddress}
          editingIndex={editingAddressId}
          saving={saving}
        />
      )}
    </>
  );
};

export default Address;

// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// import AddressModal, { emptyAddress } from "./AddressModel";
// import Button from "./Button";
// import {
//     getMyAddresses,
//     createAddress,
//     updateAddress,
//     deleteAddress,
// } from "../services/addressService";

// const Address = () => {
//     const [addresses, setAddresses] = useState([]);
//     const [showAddressForm, setShowAddressForm] = useState(false);
//     const [editingAddressId, setEditingAddressId] = useState(null);
//     const [formData, setFormData] = useState(emptyAddress);

//     const fetchAddresses = async () => {
//         try {
//             const data = await getMyAddresses();
//             setAddresses(data.addresses || []);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         fetchAddresses();
//     }, []);

//     const closeModal = () => {
//         setShowAddressForm(false);
//         setEditingAddressId(null);
//         setFormData(emptyAddress);
//     };

//     const handleSaveAddress = async (e) => {
//         e.preventDefault();

//         try {
//             if (editingAddressId) {
//                 const data = await updateAddress(editingAddressId, formData);

//                 setAddresses((prev) =>
//                     prev.map((address) =>
//                         address._id === editingAddressId ? data.address : address
//                     )
//                 );

//                 toast.success("Address updated successfully");
//             } else {
//                 const data = await createAddress(formData);
//                 setAddresses((prev) => [data.address, ...prev]);

//                 toast.success("Address saved successfully");
//             }

//             closeModal();
//         } catch (error) {
//             toast.error(error?.response?.data?.message || "Address save failed");
//         }
//     };

//     const handleEditAddress = (address) => {
//         setFormData({
//             firstName: address.firstName || "",
//             lastName: address.lastName || "",
//             emailAddress: address.emailAddress || "",
//             street: address.street || "",
//             city: address.city || "",
//             state: address.state || "",
//             zipCode: address.zipCode || "",
//             country: address.country || "",
//             mobile: address.mobile || "",
//         });

//         setEditingAddressId(address._id);
//         setShowAddressForm(true);
//     };

//     const handleDeleteAddress = async (id) => {
//         const confirmed = window.confirm(
//             "Are you sure you want to delete this address?"
//         );

//         if (!confirmed) return;

//         try {
//             await deleteAddress(id);

//             setAddresses((prev) =>
//                 prev.filter((address) => address._id !== id)
//             );

//             toast.success("Address deleted successfully");
//         } catch (error) {
//             toast.error(
//                 error?.response?.data?.message || "Address delete failed"
//             );
//         }
//     };

//     // const handleDeleteAddress = async (id) => {
//     //     if (!window.confirm("Delete this address?")) return;

//     //     try {
//     //         await deleteAddress(id);
//     //         setAddresses((prev) =>
//     //             prev.filter((address) => address._id !== id)
//     //         );

//     //         toast.success("Address deleted successfully");
//     //     } catch (error) {
//     //         toast.error("Address delete failed");
//     //     }
//     // };

//     return (
//         <>
//             <div>
//                 <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold">Address</h3>

//                     <Button
//                         onClick={() => setShowAddressForm(true)}
//                         type="primary"
//                         size="small"
//                         className="rounded px-4"
//                     >
//                         Add Address
//                     </Button>
//                 </div>

//                 {addresses.length === 0 ? (
//                     <p className="text-sm text-gray-500">No address added.</p>
//                 ) : (
//                     <div className="space-y-4">
//                         {addresses.map((address) => (
//                             <div
//                                 key={address._id}
//                                 className="p-4 border border-gray-200 rounded-md"
//                             >
//                                 <p className="font-medium">
//                                     {address.firstName} {address.lastName}
//                                 </p>

//                                 <p className="text-sm text-gray-600">
//                                     {address.emailAddress}
//                                 </p>
//                                 <p className="text-sm text-gray-600">{address.mobile}</p>

//                                 <p className="text-sm text-gray-600">
//                                     {address.street}, {address.city}, {address.state},{" "}
//                                     {address.country} - {address.zipCode}
//                                 </p>

//                                 <div className="flex gap-3 mt-3">
//                                     <button
//                                         onClick={() => handleEditAddress(address)}
//                                         className="text-sm text-blue-600 cursor-pointer"
//                                     >
//                                         Edit
//                                     </button>

//                                     <button
//                                         onClick={() => handleDeleteAddress(address._id)}
//                                         className="text-sm text-red-600 cursor-pointer"
//                                     >
//                                         Delete
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {showAddressForm && (
//                 <AddressModal
//                     formData={formData}
//                     setFormData={setFormData}
//                     onClose={closeModal}
//                     onSave={handleSaveAddress}
//                     editingIndex={editingAddressId}
//                 />
//             )}
//         </>
//     );
// };

// export default Address;
