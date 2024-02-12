import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthUserContext } from "../AuthContext";
import { Platform } from "react-native";
import UserProfile from "../components/UserProfile";
import { Platform } from "react-native";

const Header = ({ title, subtitle, name }) => {
  const { user } = useContext(AuthUserContext);

  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.header,
        Platform.OS === "android" ? styles.androidStyle : styles.iosStyle,
      ]}
    >
      <Image source={require("../images/logo.jpeg")} style={styles.logo} />
      <Text style={styles.title}>{title}</Text>
      {user ? (
        <UserProfile></UserProfile>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate(name)}>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 0.1,
    paddingBottom: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },
  androidStyle: {
    paddingTop: 20,
  },
  iosStyle: {
    paddingTop: 60,
  },
  logo: {
    width: 60,
    height: 60,
  },

  title: {
    fontSize: 30,
    fontWeight: "600",
    lineHeight: 37,
    marginLeft: 50,
  },
  subtitle: {
    fontSize: 16,
    marginLeft: 30,
    color: "#DB5000",
    fontWeight: "500",
    lineHeight: 20,
  },
});

export default Header;
