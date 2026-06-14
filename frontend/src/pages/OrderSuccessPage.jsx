import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-green-600">
                Order Placed Successfully
            </h1>

            <p className="mt-4 text-gray-600">
                Thank you for your purchase.
            </p>

            <Link
                to="/orders"
                className="mt-6 px-6 py-3 bg-black text-white"
            >
                View My Orders
            </Link>
        </div>
    );
};

export default OrderSuccessPage;