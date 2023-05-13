import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title, subtitle, name }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Image source={require("../images/logo.jpeg")} style={styles.logo} />
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => navigation.navigate(name)}>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 0.25,
    marginBottom: 16,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginTop: 50,
    // marginBottom: 28,
    backgroundColor: "#fff",
  },
  logo: {
    width: 42,
    height: 55,
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
