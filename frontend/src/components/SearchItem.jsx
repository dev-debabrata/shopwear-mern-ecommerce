import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

import Input from "./Input";
import { useAppContext } from "../context/AppContext";

const SearchItem = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");

    const { isSearchBarOpen, setIsSearchBarOpen, products } = useAppContext();

    const handleSearch = () => {
        if (!searchInput.trim()) return;

        setIsSearchBarOpen(false);
        navigate(`/collection?search=${encodeURIComponent(searchInput.trim())}`);
    };

    const searchedProducts = useMemo(() => {
        const search = searchInput.toLowerCase().trim();

        if (!search) return [];

        return products.filter((product) => {
            return (
                product.name?.toLowerCase().includes(search) ||
                product.category?.toLowerCase().includes(search) ||
                product.subCategory?.toLowerCase().includes(search)
            );
        });
    }, [products, searchInput]);

    if (!isSearchBarOpen) return null;

    return (
        <div className="relative flex items-center justify-center border-t border-gray-200 bg-gray-50">
            <div className="w-3/4 flex items-center justify-between px-5 py-2 mx-3 my-5 sm:w-1/2 border border-gray-400 rounded-full">
                <Input
                    htmlType="text"
                    size="large"
                    value={searchInput}
                    inputClassName="text-sm bg-inherit border-0 outline-none text-gray-700 z-50"
                    placeholder="Search..."
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                />

                <button className=" text-gray-500 cursor-pointer" onClick={handleSearch}>
                    <Search size={20} />
                </button>
            </div>

            <button
                className=" text-gray-500 cursor-pointer"
                onClick={() => {
                    setSearchInput("");
                    setIsSearchBarOpen(false);
                }}
            >
                <X size={20} />
            </button>

            {searchInput.trim() && (
                <div className="absolute top-[70px] z-50 w-[90%] sm:w-1/2 bg-white border border-gray-200 shadow-lg rounded-md max-h-80 overflow-y-auto">
                    {searchedProducts.length > 0 ? (
                        searchedProducts.map((product) => (
                            <Link
                                key={product._id}
                                to={`/products/${product._id}`}
                                onClick={() => {
                                    setSearchInput("");
                                    setIsSearchBarOpen(false);
                                }}
                                className="flex items-center gap-3 p-3 hover:bg-gray-100"
                            >
                                <img
                                    src={product.image?.[0]}
                                    alt={product.name}
                                    className="object-cover w-12 h-12 rounded"
                                />

                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {product.name}
                                    </p>
                                    <p className="text-xs text-gray-500">₹{product.price}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="p-4 text-sm text-center text-gray-500">
                            No products found
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchItem;