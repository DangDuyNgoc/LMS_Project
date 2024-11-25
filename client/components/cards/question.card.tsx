import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";

export default function QuestionCard({
  item,
  fetchCourseContent,
  courseData,
  contentId,
}: {
  item: CommentType;
  fetchCourseContent: () => void;
  courseData: CoursesType;
  contentId: string;
}) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [showFullQuestion, setShowFullQuestion] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
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

  const handleReplySubmit = async () => {
    const accessToken = await AsyncStorage.getItem("access_token");
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    try {
      const res = await axios.post(
        `${SERVER_URI}/course/add-answer`,
        {
          answer: reply,
          courseId: courseData?._id,
          contentId: contentId,
          questionId: item?._id,
        },
        {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        }
      );
      setReply("");
      setOpen(!open);
      fetchCourseContent();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteQuestion = async () => {
    const accessToken = await AsyncStorage.getItem("access_token");
    const refreshToken = await AsyncStorage.getItem("refresh_token");

    try {
      await axios.delete(`${SERVER_URI}/course/delete-question`, {
        headers: {
          "access-token": accessToken,
          "refresh-token": refreshToken,
        },
        data: {
          courseId: courseData._id,
          courseContentId: contentId,
          questionId: item._id,
        },
      });
      Toast.show("Question deleted successfully!", {
        placement: "top",
        type: "success",
      });
      fetchCourseContent();
    } catch (error: any) {
      Toast.show(error.response.data?.message, {
        placement: "top",
        type: "danger",
      });
      console.log(error);
    }
  };

  return (
    <>
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
                <Text style={{ fontSize: 18, fontFamily: "Raleway_700Bold" }}>
                  {item.user.name}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ marginHorizontal: 8, flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        paddingVertical: 5,
                        paddingHorizontal: 3,
                        flexWrap: "wrap",
                      }}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      onPress={() => setShowFullQuestion(true)}
                    >
                      {item.question}
                    </Text>
                  </View>
                  {userId && item.user._id === userId && (
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert("Delete Question", "Are you sure?", [
                          { text: "Cancel" },
                          { text: "Delete", onPress: handleDeleteQuestion },
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
        </View>
      </View>
      {item?.questionReplies.length === 0 ? (
        <TouchableOpacity onPress={() => setOpen(!open)}>
          <Text style={{ fontSize: 18, paddingLeft: 15, paddingBottom: 10 }}>
            Add Reply
          </Text>
        </TouchableOpacity>
      ) : (
        <View>
          <TouchableOpacity onPress={() => setShowReplies(!showReplies)}>
            <Text style={{ fontSize: 18, paddingLeft: 15, paddingBottom: 10 }}>
              Replies
            </Text>
          </TouchableOpacity>
          {showReplies && (
            <>
              {item?.questionReplies?.map((reply: any, index: number) => (
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  }}
                  key={index}
                >
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
                          <Text
                            style={{
                              fontSize: 18,
                              fontFamily: "Raleway_700Bold",
                            }}
                          >
                            {reply.user.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              paddingVertical: 5,
                              paddingHorizontal: 3,
                            }}
                          >
                            {reply?.answer}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
              <TouchableOpacity onPress={() => setOpen(!open)}>
                <Text
                  style={{ fontSize: 18, paddingLeft: 15, paddingBottom: 10 }}
                >
                  Add Reply
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      <Modal animationType="slide" visible={open}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 15,
            backgroundColor: "#9BA8B2",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity onPress={() => setOpen(!open)}>
              <Ionicons name="close-outline" size={25} />
            </TouchableOpacity>
          </View>
          <TextInput
            value={reply}
            onChangeText={setReply}
            placeholder="Enter your reply..."
            style={{
              marginVertical: 20,
              textAlignVertical: "top",
              justifyContent: "flex-start",
              backgroundColor: "#fff",
              borderRadius: 10,
              height: 100,
              padding: 10,
            }}
            multiline={true}
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity
              style={[styles.button]}
              disabled={reply === ""}
              onPress={() => handleReplySubmit()}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* modal show full question */}
      <Modal
        visible={showFullQuestion}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFullQuestion(false)} 
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => setShowFullQuestion(false)} 
              style={{ alignSelf: "flex-end" }}
            >
              <Ionicons name="close-outline" size={25} />
            </TouchableOpacity>
            <Text
              style={{ fontSize: 18}}
            >
              {item.question}
            </Text>
            <Text style={{ fontSize: 16 }}></Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: widthPercentageToDP("35%"),
    height: 40,
    backgroundColor: "#2467EC",
    marginVertical: 10,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
