import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import { StyleSheet, View, StatusBar } from "react-native";

export default function RegistrationScreen() {
  const isLogin = Math.random() < 0.5;
  return (
    <View style={styles.container}>
      {isLogin && (
        <>
          <Header
            title="Log In"
            subtitle="Sign Up"
            name="Registration"
          ></Header>
          <LoginForm></LoginForm>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 0,
    backgroundColor: "#fff",
  },
});
