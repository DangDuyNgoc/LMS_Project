import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_400Regular,
} from "@expo-google-fonts/nunito";
import { router } from "expo-router";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";

export default function ForgotPassword() {
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    try {
      setButtonSpinner(true);
      const res = await axios.post(
        `${SERVER_URI}/user/request-password-reset`,
        { email }
      );

      await AsyncStorage.setItem("activation_token", res.data?.activationToken);
      setEmail("");
      Toast.show(res.data.message || "An error occurred", { type: "success" });
      router.push({
        pathname: "/(routes)/verifyAccount",
        params: {mode: "reset-password"}
      });
      setButtonSpinner(false);
    } catch (error: any) {
      console.log(error);
      Toast.show(error?.response?.data.message || "An error occurred", {
        type: "danger",
      });
      setButtonSpinner(false);
    }
  };

  let [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      <Text style={styles.headerText}>Reset Email Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Username@gmail.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={[styles.button, email.trim() === "" && styles.buttonDisabled]}
        disabled={email.trim() === ""}
        onPress={handleResetPassword}
      >
        {buttonSpinner ? (
          <ActivityIndicator size="small" color={"white"} />
        ) : (
          <Text style={styles.buttonText}>Send</Text>
        )}

      </TouchableOpacity>
      <View style={styles.loginLink}>
        <Text style={styles.backText}>Back To?</Text>
        <TouchableOpacity onPress={() => router.push("/(routes)/login")}>
          <Text style={styles.loginText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    fontFamily: "Nunito_400Regular",
  },
  headerText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3876EE",
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: "#b0c4de",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
  },
  loginLink: {
    flexDirection: "row",
    marginTop: 30,
  },
  loginText: {
    color: "#3876EE",
    marginLeft: 5,
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
  backText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
});

