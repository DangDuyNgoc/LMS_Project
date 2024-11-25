import CartScreen from "@/screens/cart/cart.screen";
import { SERVER_URI } from "@/utils/uri";
import { StripeProvider } from "@stripe/stripe-react-native";
import axios from "axios";
import { useEffect, useState } from "react";

export default function index() {
  const [publishableKey, setPublishableKey] = useState("");

  const fetchPublishableKey = async () => {
    try {
      const key = await axios.get(
        `${SERVER_URI}/order/payment/publishable-key`
      );
      setPublishableKey(key.data.publishableKey);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);
  return (
    <StripeProvider publishableKey={publishableKey}>
      <CartScreen />
    </StripeProvider>
  );
}
