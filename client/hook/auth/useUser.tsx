import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useUser() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState("");
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const subscription = async () => {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      try {
        const res = await axios.get(`${SERVER_URI}/user/me`, {
          headers: {
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        });
        setUser(res.data.user);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        setError(error?.response.data?.message);
      }
    };
    subscription();
  }, [refetch]);

  return { loading, user, error, refetch, setRefetch };
}
