import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import RadioGroup from "react-native-radio-buttons-group";

export default function ParamsSwitcher({ curValue, onItemChange }) {
  const [radioButtons, setRadioButtons] = useState([
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "I  ",
      value: 0,
    },
    {
      id: "2",
      label: "II ",
      value: 1,
    },
    {
      id: "3",
      label: "III",
      value: 2,
    },
  ]);
  useEffect(() => {
    setRadioButtons(
      radioButtons.map((btn, index) => {
        return { ...btn, selected: curValue === index };
      })
    );
  }, []);
  return (
    <RadioGroup
      radioButtons={radioButtons}
      onPress={(btns) => {
        onItemChange(btns.find((btn) => btn.selected === true).value);
      }}
      style={styles.option}
      selectedButtonStyle={styles.activeOption}
    />
  );
}
const styles = StyleSheet.create({
  option: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#757373",
    backgroundColor: "#fff",
  },

  activeOption: {
    backgroundColor: "#DB5000",
    borderColor: "#DB5000",
  },
});
