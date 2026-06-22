import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
    Boxes,
    IndianRupee,
    PackageCheck,
    ShoppingBag,
    TrendingUp,
    Users,
} from "lucide-react";
import { toast } from "react-toastify";

import { backendUrl, currency } from "../App";

const Dashboard = ({ token }) => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);


    const fetchDashboardData = useCallback(async () => {
        try {
            // Products API
            try {
                const productRes = await axios.get(`${backendUrl}/api/products`);

                setProducts(
                    productRes.data.products ||
                    productRes.data.data ||
                    productRes.data ||
                    []
                );
            } catch (productError) {
                console.error("Product API Error:", productError);
                toast.error(
                    productError.response?.data?.message ||
                    "Products API failed. Check backend product list route."
                );
                setProducts([]);
            }

            // Orders API
            try {
                const orderRes = await axios.get(`${backendUrl}/api/orders/admin/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setOrders(orderRes.data.orders || orderRes.data.data || []);
            } catch (orderError) {
                console.error("Order API Error:", orderError);
                toast.error(
                    orderError.response?.data?.message ||
                    "Orders API failed. Check admin order route."
                );
                setOrders([]);
            }
        } catch (error) {
            console.error("Dashboard Error:", error);
            toast.error("Dashboard loading failed");
        }
    }, [token]);


    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const totalRevenue = orders.reduce((sum, order) => {
        return sum + Number(order.total || order.amount || 0);
    }, 0);

    const pendingOrders = orders.filter(
        (order) =>
            order.orderStatus === "Pending" ||
            order.status === "Pending" ||
            order.status === "Order Placed"
    ).length;

    const latestOrders = orders.slice(0, 5);

    const stats = [
        {
            title: "Total Products",
            value: products.length,
            icon: Boxes,
            bg: "bg-blue-50",
            text: "text-blue-600",
        },
        {
            title: "Total Orders",
            value: orders.length,
            icon: ShoppingBag,
            bg: "bg-purple-50",
            text: "text-purple-600",
        },
        {
            title: "Revenue",
            value: `${currency}${totalRevenue.toLocaleString("en-IN")}`,
            icon: IndianRupee,
            bg: "bg-green-50",
            text: "text-green-600",
        },
        {
            title: "Pending Orders",
            value: pendingOrders,
            icon: PackageCheck,
            bg: "bg-orange-50",
            text: "text-orange-600",
        },
    ];

    return (
        <section className="space-y-6">
            {/* Header */}
            {/* <div className="rounded-3xl bg-black p-6 text-white shadow-xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-300">Welcome back 👋</p>
                        <h1 className="mt-1 text-3xl font-semibold">
                            Admin Dashboard
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-gray-300">
                            Manage your products, orders, revenue and store performance from
                            one clean dashboard.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
                        <div className="flex items-center gap-3">
                            <TrendingUp size={32} />
                            <div>
                                <p className="text-sm text-gray-300">Store Status</p>
                                <h2 className="text-lg font-semibold">Active</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {item.title}
                                    </p>
                                    <h3 className="mt-2 text-2xl font-bold text-gray-900">
                                        {item.value}
                                    </h3>
                                </div>

                                <div className={`rounded-2xl p-3 ${item.bg}`}>
                                    <Icon className={item.text} size={26} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                {/* Recent Orders */}
                <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Recent Orders
                            </h2>
                            <p className="text-sm text-gray-500">
                                Latest customer purchases
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left text-sm">
                            <thead>
                                <tr className="border-b bg-gray-50 text-gray-500">
                                    <th className="px-4 py-3 font-medium">Order</th>
                                    <th className="px-4 py-3 font-medium">Customer</th>
                                    <th className="px-4 py-3 font-medium">Items</th>
                                    <th className="px-4 py-3 font-medium">Amount</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {latestOrders.length > 0 ? (
                                    latestOrders.map((order, index) => (
                                        <tr
                                            key={order._id || index}
                                            className="border-b last:border-none hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-4 font-medium text-gray-900">
                                                #{order._id?.slice(-6) || index + 1}
                                            </td>

                                            <td className="px-4 py-4 text-gray-600">
                                                {order.address?.fullName ||
                                                    order.user?.name ||
                                                    "Customer"}
                                            </td>

                                            <td className="px-4 py-4 text-gray-600">
                                                {order.items?.length || 0}
                                            </td>

                                            <td className="px-4 py-4 font-semibold text-gray-900">
                                                {currency}
                                                {Number(
                                                    order.total || order.amount || 0
                                                ).toLocaleString("en-IN")}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                                                    {order.orderStatus ||
                                                        order.status ||
                                                        "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-4 py-10 text-center text-gray-500"
                                        >
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Store Summary */}
                <div className="space-y-6">
                    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-indigo-50 p-3">
                                <Users className="text-indigo-600" size={26} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">Store Summary</h2>
                                <p className="text-sm text-gray-500">
                                    Quick overview of your shop
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-4">
                            <SummaryRow label="Products Added" value={products.length} />
                            <SummaryRow label="Orders Received" value={orders.length} />
                            <SummaryRow label="Pending Orders" value={pendingOrders} />
                            <SummaryRow
                                label="Total Revenue"
                                value={`${currency}${totalRevenue.toLocaleString("en-IN")}`}
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-black p-5 text-white shadow-lg">
                        <h2 className="text-lg font-semibold">Admin Tip</h2>
                        <p className="mt-2 text-sm text-gray-300">
                            Keep product images clean, add discounts, and update order status
                            quickly to improve customer trust.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SummaryRow = ({ label, value }) => {
    return (
        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="font-semibold text-gray-900">{value}</span>
        </div>
    );
};

export default Dashboard;