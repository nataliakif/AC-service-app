import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthUserContext } from "../AuthContext";
import UserProfile from "../components/UserProfile";

const Header = ({ title, subtitle, name }) => {
  const { user } = useContext(AuthUserContext);
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
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
    paddingTop: 50,
    paddingBottom: 10,
    paddingRight: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  logo: {
    width: 60,
    height: 60,
  },

  title: {
    fontSize: 30,
    fontWeight: "600",
    lineHeight: 37,
  },
  subtitle: {
    fontSize: 16,
    color: "#DB5000",
    fontWeight: "500",
    lineHeight: 20,
  },
});

export default Header;
