import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Ratings from "@/utils/ratings";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";

export default function ReviewCard({
  item,
  fetchCourseContent,
  courseData,
}: {
  item: ReviewType;
  fetchCourseContent: () => void;
  courseData: CoursesType;
}) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await AsyncStorage.getItem("user_id");
      if (userData) {
        setUserId(userData);
      }
    };
    getUserData();
  }, []);

  const handleDeleteReview = async () => {
    const accessToken = await AsyncStorage.getItem("access_token");
    const refreshToken = await AsyncStorage.getItem("refresh_token");

    try {
      await axios.delete(`${SERVER_URI}/course/delete-review`, {
        headers: {
          "access-token": accessToken,
          "refresh-token": refreshToken,
        },
        data: {
          courseId: courseData._id,
          reviewId: item._id,
        },
      });
      Toast.show("Review deleted successfully!", {
        placement: "top",
        type: "success",
      });
    } catch (error: any) {
      Toast.show(error.response.data?.message, {
        placement: "top",
        type: "danger",
      });
      console.log(error);
    }
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <Image
        style={{ width: 50, height: 50, borderRadius: 100 }}
        source={{
          uri:
            item.user?.avatar?.url ||
            "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
        }}
      />
      <View style={{ marginHorizontal: 8, flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "space-around" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <View>
                <Text style={{ fontSize: 18, fontFamily: "Raleway_700Bold" }}>
                  {item.user.name}
                </Text>
              </View>
              <View>
                <Ratings rating={item.rating} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    paddingVertical: 5,
                    paddingHorizontal: 3,
                  }}
                >
                  {item.comment}
                </Text>
              </View>
            </View>
            {userId && item.user._id === userId && (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert("Delete Review", "Are you sure?", [
                    { text: "Cancel" },
                    { text: "Delete", onPress: handleDeleteReview },
                  ]);
                }}
              >
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
