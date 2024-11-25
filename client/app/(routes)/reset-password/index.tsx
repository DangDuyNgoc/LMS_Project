import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Entypo, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { commonStyles } from "@/styles/common/common.styles";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";

export default function ResetPassword() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [error, setError] = useState({
    password: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetNewPassword = async () => {
    if(newPassword.trim() === "") {
      setError({ password: "Please enter new password!" });
      setButtonSpinner(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError({ password: "Passwords do not match" });
      setButtonSpinner(false);
      return;
    }

    const activation_token = await AsyncStorage.getItem("activation_token");
    if (!activation_token) {
      Toast.show("Token not found. Please try again.", {
        type: "danger",
        placement: "top",
      });
      return;
    }

    setButtonSpinner(true);

    try {
      const res = await axios.post(`${SERVER_URI}/user/password-reset`, {
        newPassword,
        activation_token,
      });
      setNewPassword("");
      setConfirmPassword("");
      Toast.show(res.data.message || "An error occurred", {
        type: "success",
        placement: "top",
      });
      router.push("/(routes)/login");
      setButtonSpinner(false);
    } catch (error: any) {
      console.log(error);
      Toast.show(error?.response?.data?.message, {
        type: "danger",
        placement: "top",
      });
      setButtonSpinner(false);
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
        <ScrollView>
          <Image
            style={styles.signInImage}
            source={require("@/assets/sign-in/sign_in.png")}
          />
          <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
            Reset Password
          </Text>
          <Text style={styles.learningText}>
            Create new password. Ensure it differs from old password!
          </Text>

          <View style={styles.inputContainer}>
            <View>
              <TextInput
                style={commonStyles.input}
                keyboardType="default"
                secureTextEntry={!isPasswordVisible}
                defaultValue=""
                value={newPassword}
                placeholder="Enter new password"
                onChangeText={(text) => {
                  setNewPassword(text);
                  setError({ password: "" });
                }}
              />
              <TouchableOpacity
                style={styles.visibleIcon}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <Ionicons
                    name="eye-off-outline"
                    size={23}
                    color={"#747474"}
                  />
                ) : (
                  <Ionicons name="eye-outline" size={23} color={"#747474"} />
                )}
              </TouchableOpacity>
              <SimpleLineIcons
                style={styles.icon2}
                name="lock"
                size={20}
                color={"#A1A1A1"}
              />
            </View>
            {error.password && (
              <View style={[commonStyles.errorContainer, { top: 130 }]}>
                <Entypo name="cross" size={18} color={"red"} />
                <Text style={{ color: "red", fontSize: 11, marginTop: -1 }}>
                  {error.password}
                </Text>
              </View>
            )}

            <View style={{ marginTop: 20 }}>
              <TextInput
                style={commonStyles.input}
                keyboardType="default"
                secureTextEntry={!isPasswordVisible}
                defaultValue=""
                value={confirmPassword}
                placeholder="Confirm password"
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.visibleIcon}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <Ionicons
                    name="eye-off-outline"
                    size={23}
                    color={"#747474"}
                  />
                ) : (
                  <Ionicons name="eye-outline" size={23} color={"#747474"} />
                )}
              </TouchableOpacity>
              <SimpleLineIcons
                style={styles.icon2}
                name="lock"
                size={20}
                color={"#A1A1A1"}
              />
            </View>

            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 8,
                marginHorizontal: 16,
                backgroundColor: "#2467EC",
                marginTop: 30,
              }}
              onPress={handleResetNewPassword}
            >
              {buttonSpinner ? (
                <ActivityIndicator size="small" color={"white"} />
              ) : (
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 16,
                    fontFamily: "Raleway_700Bold",
                  }}
                >
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupRedirect}>
              <Text style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold" }}>
                Back To?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(routes)/login")}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Raleway_600SemiBold",
                    color: "#2467EC",
                    marginLeft: 5,
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    textAlign: "center",
    fontSize: 24,
  },
  signInImage: {
    width: "60%",
    height: 250,
    alignSelf: "center",
    marginTop: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    fontFamily: "Nunito_400Regular",
  },
  learningText: {
    textAlign: "center",
    color: "#575757",
    fontSize: 15,
    marginTop: 5,
  },
  inputContainer: {
    marginTop: 30,
  },
  visibleIcon: {
    position: "absolute",
    right: 30,
    top: 15,
  },
  icon2: {
    position: "absolute",
    left: 23,
    top: 17.8,
    marginTop: -2,
  },
  signupRedirect: {
    flexDirection: "row",
    marginHorizontal: 16,
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20,
  },
});
