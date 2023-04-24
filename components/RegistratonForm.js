import React, { useState } from "react";
import { StyleSheet, View, TextInput, Button, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Feather } from "@expo/vector-icons";

const RegistrationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Введите правильный email")
    .required("Введите email"),
  password: Yup.string().required("Введите пароль"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Пароли должны совпадать")
    .required("Подтвердите пароль"),
});

const EyeIcon = ({ visible, onPress }) => {
  return (
    <Feather
      name={visible ? "eye" : "eye-off"}
      size={20}
      color="gray"
      onPress={onPress}
    />
  );
};

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Formik
      style={styles.container}
      initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
      validationSchema={RegistrationSchema}
      onSubmit={(values) => console.log(values)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View>
          <TextInput
            style={styles.input}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            placeholder="Имя"
            value={values.name}
          />
          {touched.name && errors.name && (
            <Text style={[styles.error]}>{errors.name}</Text>
          )}
          <TextInput
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            placeholder="Email"
          />
          {touched.email && errors.email && (
            <Text style={{ color: "red" }}>{errors.email}</Text>
          )}

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              placeholder="Пароль"
              secureTextEntry={!showPassword}
              style={{ flex: 1 }}
            />
            <EyeIcon
              visible={showPassword}
              onPress={() => setShowPassword((prevState) => !prevState)}
            />
          </View>
          {touched.password && errors.password && (
            <Text style={{ color: "red" }}>{errors.password}</Text>
          )}

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
              placeholder="Подтвердите пароль"
              secureTextEntry={!showConfirmPassword}
              style={{ flex: 1 }}
            />
            <EyeIcon
              visible={showConfirmPassword}
              onPress={() => setShowConfirmPassword((prevState) => !prevState)}
            />
          </View>
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={{ color: "red" }}>{errors.confirmPassword}</Text>
          )}

          <Button title="Зарегистрироваться" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  input: {
    height: 52,
    borderWidth: 1,
    paddingLeft: 16,
    fontWeight: "500",
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 16,
  },
  inputFocused: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  error: {
    color: "red",
  },
  button: {
    marginTop: 110,
    height: 60,
    paddingHorizontal: 140,
    paddingVertical: 20,
    textAlign: "center",
    backgroundColor: "#DB5000",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    flexDirection: "row",
  },
  iconContainer: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});

export default RegistrationForm;

// import React, { useState } from "react";
// import {
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   View,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from "react-native";
// import { Feather } from "@expo/vector-icons";
// import * as Yup from "yup";
// import { Formik } from "formik";

// const RegistrationSchema = Yup.object().shape({
//   name: Yup.string().required("Введите имя"),
//   email: Yup.string().email("Некорректный email").required("Введите email"),
//   password: Yup.string()
//     .min(8, "Пароль должен быть не менее 8 символов")
//     .required("Введите пароль"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Пароли должны совпадать")
//     .required("Подтвердите пароль"),
// });

// const EyeIcon = ({ visible, onPress }) => {
//   return (
//     <Feather
//       name={visible ? "eye" : "eye-off"}
//       size={20}
//       color="gray"
//       onPress={onPress}
//     />
//   );
// };

// export default function RegistrationForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isFocused, setIsFocused] = useState(false);

//   const dismissKeyboard = () => {
//     Keyboard.dismiss();
//   };

//   const handleRegistration = (values) => {
//     console.log(values);
//   };

//   return (
//     <Formik
//       initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
//       validationSchema={RegistrationSchema}
//       onSubmit={handleRegistration(values)}
//     >
//       {({
//         handleChange,
//         handleBlur,
//         handleSubmit,
//         values,
//         errors,
//         touched,
//       }) => (
//         <TouchableWithoutFeedback onPress={dismissKeyboard}>
//           <View style={styles.container}>
//             <TextInput
//               style={[styles.input]}
//               onChangeText={handleChange("name")}
//               onBlur={handleBlur("name")}
//               placeholder="Имя"
//               value={values.name}
//             />
//             {touched.name && errors.name && (
//               <Text style={[styles.error]}>{errors.name}</Text>
//             )}

//             <TextInput
//               onChangeText={handleChange("email")}
//               onBlur={handleBlur("email")}
//               value={values.email}
//               placeholder="Email"
//             />

//             {touched.email && errors.email && (
//               <Text style={[styles.error]}>{errors.email}</Text>
//             )}
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <TextInput
//                 onChangeText={handleChange("password")}
//                 onBlur={handleBlur("password")}
//                 value={values.password}
//                 placeholder="Пароль"
//                 secureTextEntry={!showPassword}
//                 style={{ flex: 1 }}
//               />
//               <EyeIcon
//                 visible={showPassword}
//                 onPress={() => setShowPassword((prevState) => !prevState)}
//               />
//             </View>
//             {touched.password && errors.password && (
//               <Text style={{ color: "red" }}>{errors.password}</Text>
//             )}

//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <TextInput
//                 onChangeText={handleChange("confirmPassword")}
//                 onBlur={handleBlur("confirmPassword")}
//                 value={values.confirmPassword}
//                 placeholder="Подтвердите пароль"
//                 secureTextEntry={!showConfirmPassword}
//                 style={{ flex: 1 }}
//               />
//               <EyeIcon
//                 visible={showConfirmPassword}
//                 onPress={() =>
//                   setShowConfirmPassword((prevState) => !prevState)
//                 }
//               />
//             </View>
//             {touched.confirmPassword && errors.confirmPassword && (
//               <Text style={{ color: "red" }}>{errors.confirmPassword}</Text>
//             )}

//             <TouchableOpacity
//               activeOpasity={0.7}
//               style={styles.button}
//               onPress={handleRegistration}
//             >
//               <Text style={styles.buttonText}>Register</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableWithoutFeedback>
//       )}
//     </Formik>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "column",
//   },
//   input: {
//     height: 52,
//     borderWidth: 1,
//     paddingLeft: 16,
//     fontWeight: "500",
//     borderColor: "#ccc",
//     borderRadius: 5,
//     marginBottom: 16,
//   },
//   inputFocused: {
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//   },
//   error: {
//     color: "red",
//   },
//   button: {
//     marginTop: 110,
//     height: 60,
//     paddingHorizontal: 140,
//     paddingVertical: 20,
//     textAlign: "center",
//     backgroundColor: "#DB5000",
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "500",
//     flexDirection: "row",
//   },
//   iconContainer: {
//     position: "absolute",
//     top: 15,
//     right: 15,
//   },
// });
