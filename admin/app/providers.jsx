"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";

export function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

export const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();

  return <>{isLoading ? <Loader /> : { children }}</>;
};
