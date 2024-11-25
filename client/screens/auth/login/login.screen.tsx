import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import { useState } from "react";
import { commonStyles } from "@/styles/common/common.styles";
import { router } from "expo-router";
import axios from "axios";
import { Toast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URI } from "@/utils/uri";

export default function LoginScreen() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handlePasswordValidation = (value: string) => {
    setError({
      ...error,
      password: "",
    });
    setUserInfo({ ...userInfo, password: value });
  };

  const handleSignIn = async () => {
    setError({ email: "", password: "" });

    let isValid = true;

    const newErrors = {
      email: "",
      password: "",
    };

    // Validate email
    if (!userInfo.email) {
      newErrors.email = "Please enter your email address";
      isValid = false;
    }

    // Validate password
    if (!userInfo.password) {
      newErrors.password = "Please enter your password";
      isValid = false;
    }

    setError(newErrors);

    if (!isValid) return;
    setButtonSpinner(true);
    try {
      const res = await axios.post(`${SERVER_URI}/user/login-user`, {
        email: userInfo.email,
        password: userInfo.password,
      });
      Toast.show("Login Successfully!", {
        type: "success",
        placement: "top"
      });
      router.push("/(tabs)");
      await AsyncStorage.setItem("access_token", res.data.accessToken);
      await AsyncStorage.setItem("user_id", res.data.user._id); 
      await AsyncStorage.setItem("refresh_token", res.data.refreshToken);
      setButtonSpinner(false);
    } catch (error: any) {
      console.log("Login failed:", error.response.data.message);
      Toast.show(error.response.data.message, {
      type: "danger",
      });
      setButtonSpinner(false);
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
    >
      <LinearGradient
        colors={["#E5ECF9", "#F6F7F9"]}
        style={{ flex: 1, paddingTop: 20 }}
      >
        <ScrollView>
          <Image
            style={styles.signInImage}
            source={require("@/assets/sign-in/sign_in.png")}
          />
          <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
            Welcome Back!
          </Text>
          <Text style={styles.learningText}>
            Login to your existing account
          </Text>
          <View style={styles.inputContainer}>
            <View>
              <TextInput
                style={[styles.input, { paddingLeft: 40 }]}
                keyboardType="email-address"
                value={userInfo.email}
                placeholder="Enter your email address"
                onChangeText={(value) =>
                  setUserInfo({ ...userInfo, email: value })
                }
              />
              <Fontisto
                style={{ position: "absolute", left: 26, top: 17.8 }}
                name="email"
                size={20}
                color={"#A1A1A1"}
              />
              {error.email && (
                <View style={[commonStyles.errorContainer, { top: 55 }]}>
                  <Entypo name="cross" size={18} color={"red"} />
                  <Text style={{ color: "red", fontSize: 11, marginTop: -1 }}>
                    {error.email}
                  </Text>
                </View>
              )}
              <View style={{ marginTop: 15 }}>
                <TextInput
                  style={commonStyles.input}
                  keyboardType="default"
                  secureTextEntry={!isPasswordVisible}
                  defaultValue=""
                  placeholder="********"
                  onChangeText={handlePasswordValidation}
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
              <TouchableOpacity
                onPress={() => router.push("/(routes)/forgot-password")}
              >
                <Text
                  style={[
                    styles.forgotSection,
                    { fontFamily: "Nunito_600SemiBold" },
                  ]}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 16,
                  borderRadius: 8,
                  marginHorizontal: 16,
                  backgroundColor: "#2467EC",
                  marginTop: 15,
                }}
                onPress={handleSignIn}
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
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.signupRedirect}>
                <Text
                  style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold" }}
                >
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(routes)/sign-up")}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Raleway_600SemiBold",
                      color: "#2467EC",
                      marginLeft: 5,
                    }}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  signInImage: {
    width: "60%",
    height: 250,
    alignSelf: "center",
    marginTop: 50,
  },
  welcomeText: {
    textAlign: "center",
    fontSize: 24,
  },
  learningText: {
    textAlign: "center",
    color: "#575757",
    fontSize: 15,
    marginTop: 5,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginTop: 30,
    rowGap: 30,
  },
  input: {
    height: 55,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingLeft: 35,
    fontSize: 16,
    backgroundColor: "white",
    color: "#A1A1A1",
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
  forgotSection: {
    marginHorizontal: 16,
    textAlign: "right",
    fontSize: 16,
    marginTop: 10,
  },
  signupRedirect: {
    flexDirection: "row",
    marginHorizontal: 16,
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20,
  },
});
