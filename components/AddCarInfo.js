import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import { Formik } from "formik";
import ImagePickerForm from "./ImagePickerForm";
import { TextInputMask } from "react-native-masked-text";

import { firebase } from "../config/firebase";

export const uploadImage = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const filename = uri.substring(uri.lastIndexOf("/") + 1);
  const storageRef = firebase.storage().ref().child(filename);
  let downloadURL = "";
  try {
    const uploadTask = storageRef.put(blob);
    await uploadTask;
    Toast.show({
      type: "success",
      text1: "Фото загружено в облако",
      visibilityTime: 2000,
    });
    downloadURL = await storageRef.getDownloadURL();
  } catch (e) {
    Toast.show({
      type: "error",
      text1: e,
      visibilityTime: 2000,
    });
  }
  return downloadURL;
};

export const deletePhotoFromStorage = async (photoURL) => {
  try {
    const storageRef = firebase.storage().refFromURL(photoURL);
    await storageRef.delete();
    Toast.show({
      type: "info",
      text1: "Фото удалено из облака",
      visibilityTime: 2000,
    });
  } catch (error) {
    Toast.show({
      type: "error",
      text1: error,
      visibilityTime: 2000,
    });
  }
};

const AddCarInfoForm = ({
  setShowAddCarInfoForm,
  onCarInfoFormSubmit,
  initialValues,
  isEditable = true,
}) => {
  const [image, setImage] = useState(null);
  const [isSbtBtnActive, setIsSbtBtnActive] = useState(true);
  const route = useRoute();
  const { name } = route;

  useEffect(() => {
    if (initialValues.photoURL) {
      setImage({ uri: initialValues.photoURL });
    }
  }, []);
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          setIsSbtBtnActive(false);
          let photoURL = initialValues.photoURL;
          if (image?.uri && initialValues.photoURL !== image.uri) {
            photoURL = await uploadImage(image.uri);
            setImage(null);
          }

          const { model, color, number, owner, phone, vinCode, description } =
            values;

          onCarInfoFormSubmit({
            model,
            color,
            number,
            vinCode,
            owner,
            phone,
            description,
            photoURL,
          });

          setShowAddCarInfoForm(false);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View>
              {name !== "В работе" && name !== "Сервис" && (
                <ImagePickerForm
                  name={values.photo}
                  image={image}
                  setImage={setImage}
                ></ImagePickerForm>
              )}
              <View style={styles.inputContainer}>
                <Text style={styles.title}>Основные данные</Text>
                <Text style={styles.label}>Марка машины:</Text>
                <TextInput
                  style={styles.input}
                  value={values.model}
                  placeholder="Введите марку"
                  onChangeText={handleChange("model")}
                  editable={isEditable}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Цвет:</Text>
                <TextInput
                  style={styles.input}
                  value={values.color}
                  placeholder="Введите цвет"
                  onChangeText={handleChange("color")}
                  editable={isEditable}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Регистрационный номер:</Text>
                <TextInput
                  style={styles.input}
                  value={values.number}
                  placeholder="AB0000BA"
                  onChangeText={handleChange("number")}
                  editable={isEditable}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>VIN код:</Text>
                <TextInput
                  style={styles.input}
                  value={values.vinCode}
                  placeholder=""
                  onChangeText={handleChange("vinCode")}
                  editable={isEditable}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Ваделец:</Text>
                <TextInput
                  style={styles.input}
                  value={values.owner}
                  placeholder="Введите ФИО"
                  onChangeText={handleChange("owner")}
                  editable={isEditable}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Контактный номер:</Text>
                <TextInputMask
                  style={styles.input}
                  value={values.phone}
                  placeholder={"(099)999-99-99"}
                  type={"custom"}
                  options={{
                    mask: " (099) 999-99-99",
                  }}
                  onChangeText={handleChange("phone")}
                  handleBlur={handleBlur("phone")}
                  editable={isEditable}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Допонительная информация:</Text>
                <TextInput
                  style={{ ...styles.input, ...styles.description }}
                  value={values.description}
                  onChangeText={handleChange("description")}
                  editable={isEditable}
                />
              </View>
              {name !== "В работе" && name !== "Сервис" && (
                <TouchableOpacity
                  disabled={!isSbtBtnActive}
                  activeOpacity={0.7}
                  style={{
                    ...styles.button,
                    opacity: isSbtBtnActive ? 1 : 0.2,
                  }}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>Cохранить инфо</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 29,
    color: "#343434",
    marginTop: 24,
    marginBottom: 36,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  dateTouchBody: {
    height: 30,
    width: 100,
  },
  description: { height: 100 },
  button: {
    marginTop: 36,
    height: 60,
    alignItems: "center",
    paddingVertical: 20,
    textAlign: "center",
    backgroundColor: "#DB5000",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default AddCarInfoForm;
