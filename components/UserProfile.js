import React, { useContext, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import { Avatar } from "react-native-paper";
import { AuthUserContext } from "../App";
import UserProfileSettings from "./UserProfileSettings";
import { getUserFromAsyncStorage } from "./functions";

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState("");

  const { handleLogout } = useContext(AuthUserContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUser = await getUserFromAsyncStorage();

        const { uid, email, photoURL } = currentUser;

        const user = {
          uid,
          email,
          photoURL,
        };

        setUserInfo(user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const openModal = () => {
    setMenuVisible(false);
    setSettingsVisible(true);
  };

  const closeModal = () => {
    setSettingsVisible(false);
  };

  const toggleModal = () => {
    setMenuVisible(!menuVisible);
  };

  const handleOutsidePress = () => {
    if (menuVisible) {
      toggleModal();
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleModal}>
        {userInfo.photoURL ? (
          <Avatar.Image
            size={60}
            source={{ uri: userInfo.photoURL }}
            onPress={toggleModal}
          />
        ) : (
          <Avatar.Text
            size={60}
            label={userInfo.email ? userInfo.email[0].toUpperCase() : ""}
            onPress={toggleModal}
          />
        )}
      </TouchableOpacity>
      {menuVisible && (
        <Modal
          visible={menuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={toggleModal}
        >
          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={null}>
                <View style={styles.menuContainer}>
                  <TouchableOpacity style={styles.menuItem} onPress={openModal}>
                    <Text style={styles.menuText}>Настройки</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.menuItem, styles.logoutItem]}
                    onPress={() => {
                      handleLogout();
                    }}
                  >
                    <Text style={[styles.menuText, styles.logoutText]}>
                      Выйти
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
      {settingsVisible && (
        <UserProfileSettings
          settingsVisible={settingsVisible}
          closeModal={closeModal}
          user={userInfo}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    position: "absolute",
    top: 110,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#ccc",
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  logoutText: {
    color: "red",
  },
});
