import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthUserContext = createContext();

export const AuthUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.log("Ошибка получения данных пользователя:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = async (user) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    // При выходе из учетной записи удаляем информацию о пользователе из AsyncStorage
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthUserContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthUserContext.Provider>
  );
};
