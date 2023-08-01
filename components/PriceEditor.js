import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import Toast from "react-native-toast-message";

import { ref, set, onValue } from "firebase/database";
import { db } from "../config/firebase";

let partListData = [];
async function getPriceFromDB() {
  const dataRef = ref(db, "price");

  onValue(dataRef, (snapshot) => {
    partListData = snapshot.val();
  });
}
getPriceFromDB();

async function savePriceToDb(price) {
  set(ref(db, "price"), price).then(() => {
    Toast.show({
      type: "success",
      text1: "Цена в базе данных изменена",
      visibilityTime: 2000,
    });
  });
}

// Компонент для редактирования цен каждой части
const PartPriceEditor = ({ part, onSave }) => {
  const [paintPrice1, setPaintPrice1] = useState(
    String(part.workAmount.paintPrice[0])
  );
  const [paintPrice2, setPaintPrice2] = useState(
    String(part.workAmount.paintPrice[1])
  );
  const [paintPrice3, setPaintPrice3] = useState(
    String(part.workAmount.paintPrice[2])
  );

  const handleSave = () => {
    const updatedPart = {
      ...part,
      workAmount: {
        ...part.workAmount,
        paintPrice: [
          Number(paintPrice1),
          Number(paintPrice2),
          Number(paintPrice3),
        ],
      },
    };
    onSave(updatedPart);
  };

  return (
    <View style={styles.partContainer}>
      <Text style={styles.partName}>{part.partName}</Text>
      <View style={styles.priceContainer}>
        <TextInput
          style={styles.input}
          value={paintPrice1}
          onChangeText={setPaintPrice1}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={paintPrice2}
          onChangeText={setPaintPrice2}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={paintPrice3}
          onChangeText={setPaintPrice3}
          keyboardType="numeric"
        />

        <Button color="#DB5000" title="Сохранить" onPress={handleSave} />
      </View>
    </View>
  );
};

// Компонент PriceEditor, который рендерит список частей и позволяет их редактировать
const PriceEditor = () => {
  const [prices, setPrices] = useState(partListData);
  const filterPrices = (prices) => {
    return prices.filter(
      (item) =>
        item.workAmount.paintPrice.reduce((sum, price) => sum + price, 0) !== 0
    );
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const filteredPrices = filterPrices(prices);
  const handleSavePartPrice = (updatedPart) => {
    setPrices((prevPrices) => {
      const prevState = [...prevPrices];
      const itemToChangeIndex = prevState.findIndex(
        (item) => item.partName === updatedPart.partName
      );
      prevState[itemToChangeIndex] = updatedPart;
      savePriceToDb(prevState);
      return prevState;
    });
  };

  const handleSaveAll = () => {
    // Здесь можно добавить логику для сохранения измененных цен в базу данных или еще куда-либо
    console.log("Измененные цены:", prices);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView style={styles.container}>
          {filteredPrices.map((part) => (
            <PartPriceEditor
              key={part.partName}
              part={part}
              onSave={handleSavePartPrice}
            />
          ))}
          {/* <TouchableOpacity style={styles.saveButton} onPress={handleSaveAll}>
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </TouchableOpacity> */}
        </ScrollView>
      </TouchableWithoutFeedback>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  partContainer: {
    flexDirection: "column",

    marginBottom: 10,
  },
  priceContainer: { flexDirection: "row" },
  partName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginLeft: 8,
  },
  saveButton: {
    width: 200,
    backgroundColor: "#DB5000",
    color: "#fff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
});

export default PriceEditor;
