import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
  View,
} from "react-native";
import NumericInput from "react-native-numeric-input";
import Ionicons from "react-native-vector-icons/Ionicons";

const vocabularyTasks = {
  mountingTime: "снятие / установка",
  assemblingTime: "разборка / сборка",
  repairTime: "ремонт / рихтовка",
  paintPrice: "покраска",
  //polishingPrice: "полировка",
  orderNewDetailPrice: "заказ новой детали",
};

export default function PartRepairTaskExpandable({
  repairTaskName,
  repairTaskPrice,
  isExpanded = false,
  onPriceChangeDuringAdd,
  onSubitemExpand,
  canExpand = true,
  numericInputStep = 0.1,
  changeParamsOfPartFromEstimate,
  partIndex,
  routeName,
  editable,
}) {
  const [itemBaseHeight] = useState(new Animated.Value(0));
  const [expanded, setExpanded] = useState(isExpanded);

  useEffect(() => {
    Animated.timing(itemBaseHeight, {
      toValue: expanded ? 30 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [expanded, itemBaseHeight]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (!canExpand) {
            return;
          }
          if (expanded) {
            onSubitemExpand((prevVal) => prevVal - 1);
          } else onSubitemExpand((prevVal) => prevVal + 1);
          setExpanded(!expanded);
        }}
      >
        <View style={styles.titleCont}>
          <View style={styles.taskNameTitleCont}>
            <Ionicons
              style={styles.icon}
              name={expanded ? "caret-down-outline" : "caret-forward-outline"}
            />
            <Text style={styles.taskName}>
              {vocabularyTasks[repairTaskName]}
            </Text>
          </View>
          <Text style={styles.price}>
            {editable ? `${repairTaskPrice}` : ""}
          </Text>
        </View>
      </TouchableOpacity>
      {routeName !== "В работе" && routeName !== "Сервис" && (
        <Animated.View style={{ height: itemBaseHeight, alignItems: "center" }}>
          {expanded && (
            <NumericInput
              rounded
              totalHeight={35}
              initValue={repairTaskPrice}
              onChange={(value) => {
                if (changeParamsOfPartFromEstimate) {
                  changeParamsOfPartFromEstimate(
                    partIndex,
                    repairTaskName,
                    value
                  );
                } else {
                  onPriceChangeDuringAdd((prevState) => {
                    return {
                      ...prevState,
                      ...(prevState.workAmount[repairTaskName] = value),
                    };
                  });
                }
              }}
              style={styles.priceInput}
              step={numericInputStep}
              minValue={0}
              valueType="real"
            />
          )}
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  taskName: {
    fontWeight: "400",
    fontSize: 18,
    marginLeft: 5,
  },
  taskNameTitleCont: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    marginLeft: 10,
  },
  icon: {
    marginLeft: 5,
  },
  titleCont: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    textAlign: "right",
    marginRight: 15,
  },
  priceInput: {
    borderWidth: 1,
    paddingLeft: 25,
    paddingRight: 15,
    borderRadius: 15,
  },
});
