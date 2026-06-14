import { useState } from "react";

import Container from "../layout/Container";
import Title from "../components/Title";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAppContext } from "../context/AppContext";

const ProfilePage = () => {
    const { user } = useAppContext();

    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const [addressForm, setAddressForm] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
    });

    if (!user) {
        return (
            <Container>
                <div className="flex min-h-[50vh] items-center justify-center">
                    <p className="text-gray-500">Please login to view profile.</p>
                </div>
            </Container>
        );
    }

    const handleChange = (e) => {
        setAddressForm({
            ...addressForm,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setAddressForm({
            fullName: "",
            phone: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
        });
        setEditingIndex(null);
        setShowAddressForm(false);
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();

        if (editingIndex !== null) {
            setAddresses((prev) =>
                prev.map((address, index) =>
                    index === editingIndex ? addressForm : address
                )
            );
        } else {
            setAddresses((prev) => [...prev, addressForm]);
        }

        resetForm();
    };

    const handleEditAddress = (address, index) => {
        setAddressForm(address);
        setEditingIndex(index);
        setShowAddressForm(true);
    };

    const handleDeleteAddress = (index) => {
        setAddresses((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <Container>
            <div className="pt-14 border-t border-gray-200">
                <div className="mb-8 text-2xl">
                    <Title text1="MY" text2="PROFILE" />
                </div>

                <div className="max-w-3xl p-6 border border-gray-200 rounded-md shadow-sm">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="flex items-center justify-center w-20 h-20 text-3xl font-semibold text-white bg-black rounded-full">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {user.name}
                            </h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm mb-8">
                        <div>
                            <p className="text-gray-500">Name</p>
                            <p className="font-medium text-gray-800">{user.name}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium text-gray-800">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Address</h3>

                        <Button
                            onClick={() => setShowAddressForm(true)}
                            type="primary"
                            size="small"
                            className="rounded px-4"
                        >
                            Add Address
                        </Button>
                    </div>

                    {showAddressForm && (
                        <form onSubmit={handleSaveAddress} className="grid gap-4 mb-6">
                            <Input
                                htmlType="text"
                                name="fullName"
                                value={addressForm.fullName}
                                onChange={handleChange}
                                placeholder="Full Name"
                            />

                            <Input
                                htmlType="text"
                                name="phone"
                                value={addressForm.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                            />

                            <Input
                                htmlType="text"
                                name="street"
                                value={addressForm.street}
                                onChange={handleChange}
                                placeholder="Street Address"
                            />

                            <div className="grid gap-4 sm:grid-cols-3">
                                <Input
                                    htmlType="text"
                                    name="city"
                                    value={addressForm.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                />

                                <Input
                                    htmlType="text"
                                    name="state"
                                    value={addressForm.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                />

                                <Input
                                    htmlType="text"
                                    name="pincode"
                                    value={addressForm.pincode}
                                    onChange={handleChange}
                                    placeholder="Pincode"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button buttonType="submit" type="primary" size="small">
                                    {editingIndex !== null ? "Update" : "Save"}
                                </Button>

                                <Button onClick={resetForm} type="transparent" size="small">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}

                    {addresses.length === 0 ? (
                        <p className="text-sm text-gray-500">No address added.</p>
                    ) : (
                        <div className="space-y-4">
                            {addresses.map((address, index) => (
                                <div
                                    key={index}
                                    className="p-4 border border-gray-200 rounded-md"
                                >
                                    <p className="font-medium">{address.fullName}</p>
                                    <p className="text-sm text-gray-600">{address.phone}</p>
                                    <p className="text-sm text-gray-600">
                                        {address.street}, {address.city}, {address.state} -{" "}
                                        {address.pincode}
                                    </p>

                                    <div className="flex gap-3 mt-3">
                                        <button
                                            onClick={() => handleEditAddress(address, index)}
                                            className="text-sm text-blue-600 cursor-pointer"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDeleteAddress(index)}
                                            className="text-sm text-red-600 cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default ProfilePage;


// import Container from "../layout/Container";
// import Title from "../components/Title";
// import { useAppContext } from "../context/AppContext";

// const ProfilePage = () => {
//     const { user } = useAppContext();

//     if (!user) {
//         return (
//             <Container>
//                 <div className="flex min-h-[50vh] items-center justify-center">
//                     <p className="text-gray-500">Please login to view profile.</p>
//                 </div>
//             </Container>
//         );
//     }

//     return (
//         <Container>
//             <div className="pt-14 border-t border-gray-200">
//                 <div className="mb-8 text-2xl">
//                     <Title text1="MY" text2="PROFILE" />
//                 </div>

//                 <div className="max-w-xl p-6 border border-gray-200 rounded-md shadow-sm">
//                     <div className="flex items-center gap-5 mb-6">
//                         <div className="flex items-center justify-center w-20 h-20 text-3xl font-semibold text-white bg-black rounded-full">
//                             {user.name?.charAt(0).toUpperCase()}
//                         </div>

//                         <div>
//                             <h2 className="text-xl font-semibold text-gray-800">
//                                 {user.name}
//                             </h2>
//                             <p className="text-sm text-gray-500">{user.email}</p>
//                         </div>
//                     </div>

//                     <div className="space-y-4 text-sm">
//                         <div>
//                             <p className="text-gray-500">Name</p>
//                             <p className="font-medium text-gray-800">{user.name}</p>
//                         </div>

//                         <div>
//                             <p className="text-gray-500">Email</p>
//                             <p className="font-medium text-gray-800">{user.email}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Container>
//     );
// };

// export default ProfilePage;