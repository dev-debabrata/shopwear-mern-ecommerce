import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { shippingFee } from "../components/constants";

import Container from "../layout/Container";
import Title from "../components/Title";

import PaymentMethods from "../components/PaymentMethods";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { createRazorpayOrder } from "../services/paymentService";
import { createOrder } from "../services/orderService";
import Address from "../components/Address";

const Checkout = () => {
  const { subTotal, cartItems, clearCart } = useAppContext();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    emailAddress: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    mobile: "",
  });

  const saveOrder = async (paymentStatus = "pending", paymentInfo = null) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    const orderData = {
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: Array.isArray(item.image) ? item.image[0] : item.image,
      })),

      address: formData,
      paymentMethod,
      paymentStatus,

      razorpayPaymentId: paymentInfo?.razorpay_payment_id || "",
      razorpayOrderId: paymentInfo?.razorpay_order_id || "",
      razorpaySignature: paymentInfo?.razorpay_signature || "",

      subTotal,
      shippingFee,
      totalAmount: subTotal + shippingFee,
    };

    await createOrder(orderData);

    await clearCart();

    return true;
  };

  const handleRazorpayPayment = async () => {
    try {
      if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
        toast.error("Please enter a valid Indian mobile number");
        return;
      }

      const totalAmount = subTotal + shippingFee;
      const data = await createRazorpayOrder(totalAmount);

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "ShopWear Store",
        description: "Order Payment",
        order_id: data.order.id,

        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },

        handler: async function (response) {
          const success = await saveOrder("paid", response);

          if (success) {
            toast.success("Payment Successful");
            navigate("/order-success");
          }
        },

        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.emailAddress,
          contact: `91${formData.mobile}`,
        },

        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log("Payment error:", error);
      toast.error(error?.response?.data?.message || "Payment Failed");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!formData._id || !formData.mobile || !formData.street) {
      toast.error("Please select or add delivery address");
      return;
    }

    // if (!formData.mobile || !formData.street) {
    //   toast.error("Please select or add delivery address");
    //   return;
    // }

    if (paymentMethod === "cod") {
      const success = await saveOrder("pending");

      if (success) {
        toast.success("Order placed successfully");
        navigate("/order-success");
      }

      return;
    }

    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment();
      return;
    }

    if (paymentMethod === "stripe") {
      toast.info("Stripe payment is not added yet");
    }
  };

  return (
    <Container>
      <form
        onSubmit={handlePlaceOrder}
        className="border-t border-gray-200 
      flex flex-col justify-between sm:flex-row min-h-[80vh] pt-5 sm:pt-14 gap-4"
      >
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="my-3 text-xl sm:text-2xl">
            <Title text1="DELIVERY" text2="INFORMATION" />
          </div>

          <Address
            mode="checkout"
            formData={formData}
            setFormData={setFormData}
          />
        </div>
        <div className="mt-8">
          <div className="min-w-70 mt-8">
            <div className="w-full">
              <div className="text-2xl">
                <Title text1="CART" text2="TOTAL" />
              </div>
              <div className="mt-2 flex flex-col text-sm gap-2">
                <div className="flex justify-between text-lg font-medium">
                  <p>Sub Total</p>
                  <p>₹ {subTotal.toFixed(2)}</p>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-medium">
                  <p>Shipping Fee</p>
                  <p>₹ {shippingFee.toFixed(2)}</p>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-2xl font-semibold">
                  <p>Total Amount</p>
                  <p>₹ {(subTotal + shippingFee).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <div>
                {" "}
                <Title text1="PAYMENT" text2="Methods" />
              </div>

              <PaymentMethods
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default Checkout;
