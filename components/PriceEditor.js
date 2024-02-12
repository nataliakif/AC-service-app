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
  Alert,
} from "react-native";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogHeader,
  Provider,
} from "@react-native-material/core";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
import uuid from "react-native-uuid";
import { ref, set, remove, update, onValue } from "firebase/database";
import { db } from "../config/firebase";

let partListData = [];
async function getPriceFromDB() {
  const dataRef = ref(db, "price");

  onValue(dataRef, (snapshot) => {
    const dataFromDB = snapshot.val();
    partListData = Object.keys(dataFromDB).map((key) => {
      return { ...dataFromDB[key], id: key };
    });
  });
}

getPriceFromDB();

async function saveNewPriceItemToDb(item) {
  set(ref(db, "price/" + item.id), item).then(() => {
    Toast.show({
      type: "success",
      text1: `"${item.partName}" добавлен в базу данных`,
      visibilityTime: 2000,
    });
  });
}

async function updatePriceItemToDb(item) {
  update(ref(db, "price/" + item.id), item).then(() => {
    Toast.show({
      type: "success",
      text1: "Изменения сохранены в базе данных",
      visibilityTime: 2000,
    });
  });
}

async function deletePriceItemFromDb(id) {
  remove(ref(db, "price/" + id))
    .then(() => {
      Toast.show({
        type: "success",
        text1: "Запись удалена из базы данных",
        visibilityTime: 2000,
      });
    })
    .catch((error) => {
      Toast.show({
        type: "error",
        text1: error,
        visibilityTime: 2000,
      });
    });
}

// Компонент для редактирования цен каждой части
const PartPriceEditor = ({
  part,
  onSave,
  onRemove,
  newPriceItemAdding = false,
}) => {
  const [wasEdited, setWasEdited] = useState(false);

  const [newPriceItemName, setNewPriceItemName] = useState("");

  const [paintPrice1, setPaintPrice1] = useState(
    String(part.workAmount.paintPrice[0])
  );
  const [paintPrice2, setPaintPrice2] = useState(
    String(part.workAmount.paintPrice[1])
  );
  const [paintPrice3, setPaintPrice3] = useState(
    String(part.workAmount.paintPrice[2])
  );

  const [assemblingPrice1, setAssemblingPrice1] = useState(
    String(part.workAmount.assemblingPrice[0])
  );
  const [assemblingPrice2, setAssemblingPrice2] = useState(
    String(part.workAmount.assemblingPrice[1])
  );
  const [assemblingPrice3, setAssemblingPrice3] = useState(
    String(part.workAmount.assemblingPrice[2])
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
        assemblingPrice: [
          Number(assemblingPrice1),
          Number(assemblingPrice2),
          Number(assemblingPrice3),
        ],
      },
    };
    if (newPriceItemAdding) {
      updatedPart.partName = newPriceItemName;
      updatedPart.id = uuid.v1();
      saveNewPriceItemToDb(updatedPart);
      onSave(updatedPart);
      return;
    }
    onSave(updatedPart);
    setWasEdited(false);
  };

  return (
    <View style={styles.partContainer}>
      <View style={styles.partNameContainer}>
        {newPriceItemAdding ? (
          <TextInput
            style={styles.textInput}
            value={newPriceItemName}
            onChangeText={setNewPriceItemName}
          />
        ) : (
          <Text style={styles.partName}>{part.partName}</Text>
        )}

        {!newPriceItemAdding && (
          <IconButton
            size="small"
            icon={(props) => (
              <Ionicons
                name="trash-outline"
                {...props}
                onPress={() => {
                  //удаляем
                  Alert.alert(
                    "Подтверждение",
                    `Удалить "${part.partName}" из базы данных`,
                    [
                      {
                        text: "Отмена",
                        style: "cancel",
                      },
                      {
                        text: "Да",
                        style: "destructive",
                        onPress: () => {
                          onRemove(part.id);
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }}
              />
            )}
          />
        )}
      </View>

      <View style={styles.priceContainer}>
        <Ionicons size={25} name="construct-outline" />
        <TextInput
          style={styles.input}
          value={assemblingPrice1}
          onChangeText={setAssemblingPrice1}
          onPressOut={() => {
            setWasEdited(true);
          }}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={assemblingPrice2}
          onChangeText={setAssemblingPrice2}
          onPressOut={() => {
            setWasEdited(true);
          }}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={assemblingPrice3}
          onChangeText={setAssemblingPrice3}
          onPressOut={() => {
            setWasEdited(true);
          }}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.priceContainer}>
        <Ionicons size={25} name="color-palette-outline" />
        <TextInput
          style={styles.input}
          value={paintPrice1}
          onChangeText={setPaintPrice1}
          onPressOut={() => {
            setWasEdited(true);
          }}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={paintPrice2}
          onChangeText={setPaintPrice2}
          onPressOut={() => {
            setWasEdited(true);
          }}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={paintPrice3}
          onChangeText={setPaintPrice3}
          onPressOut={() => {
            setWasEdited(true);
          }}
          keyboardType="numeric"
        />
      </View>
      <Button
        color={wasEdited ? "red" : "#DB5000"}
        title="Сохранить"
        onPress={handleSave}
        disabled={newPriceItemAdding && newPriceItemName.length < 3}
      />
    </View>
  );
};

// Компонент PriceEditor, который рендерит список частей и позволяет их редактировать
const PriceEditor = () => {
  const [prices, setPrices] = useState(partListData);
  const [showAddPartPriceDialog, setShowAddPartPriceDialog] = useState(false);
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSavePartPrice = (updatedPart) => {
    setPrices((prevPrices) => {
      const prevState = [...prevPrices];
      const itemToChangeIndex = prevState.findIndex(
        (item) => item.id === updatedPart.id
      );
      prevState[itemToChangeIndex] = updatedPart;
      updatePriceItemToDb(updatedPart);
      return prevState;
    });
  };

  const handleDeletePartFromPrice = (id) => {
    deletePriceItemFromDb(id);
    setPrices((prevPrices) => {
      return [...prevPrices].filter((part) => part.id !== id);
    });
  };

  const handleAddPartToPrice = (part) => {
    setShowAddPartPriceDialog(false);
    setPrices((prevPrices) => {
      return [part, ...prevPrices];
    });
    console.log(part);
  };

  return (
    <Provider>
      {showAddPartPriceDialog && (
        <Dialog
          visible={showAddPartPriceDialog}
          onDismiss={() => {
            setShowAddPartPriceDialog(false);
          }}
        >
          <View style={{ padding: 5 }}>
            <PartPriceEditor
              newPriceItemAdding
              onSave={handleAddPartToPrice}
              part={{
                workAmount: {
                  assemblingPrice: [0, 0, 0],
                  paintPrice: [0, 0, 0],
                },
              }}
            />
          </View>
        </Dialog>
      )}
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <>
          <ScrollView style={styles.container}>
            <IconButton
              color="#fff"
              backgroundColor="#DB5000"
              icon={(props) => (
                <Ionicons
                  name="add-outline"
                  {...props}
                  onPress={() => {
                    console.log("Показ");
                    setShowAddPartPriceDialog(true);
                  }}
                />
              )}
            />
            {prices.map((part) => (
              <PartPriceEditor
                key={part.id}
                part={part}
                onSave={handleSavePartPrice}
                onRemove={handleDeletePartFromPrice}
              />
            ))}
          </ScrollView>
        </>
      </TouchableWithoutFeedback>
      <Toast />
    </Provider>
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
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  partNameContainer: {
    flexDirection: "row",

    justifyContent: "space-between",
  },
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
  textInput: {
    flex: 1,
    marginLeft: 8,
    marginBottom: 5,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default PriceEditor;
