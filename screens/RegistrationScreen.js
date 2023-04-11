import RegistrationForm from "../components/RegistratonForm";
import Header from "../components/Header";
import { StyleSheet, View, StatusBar } from "react-native";

export default function RegistrationScreen() {
  const isLogin = Math.random() < 0.5;
  return (
    <View style={styles.container}>
      {!isLogin && (
        <>
          <Header title="Sign Up" subtitle="Log In" name="Login"></Header>
          <RegistrationForm></RegistrationForm>
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
