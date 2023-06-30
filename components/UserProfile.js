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

export default function UserProfile() {
  const { user, handleLogout } = useContext(AuthUserContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

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
        {user.photoURL ? (
          <Avatar.Image
            size={60}
            source={{ uri: user.photoURL }}
            onPress={toggleModal}
          />
        ) : (
          <Avatar.Text
            size={60}
            label={user.email ? user.email[0].toUpperCase() : ""}
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
