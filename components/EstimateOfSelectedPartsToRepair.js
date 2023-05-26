import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Divider } from "@react-native-material/core";

import PartRepairExpandableItem from "./PartRepairExpandableItem";

export default function EstimateOfSelectedPartsToRepair({
  selectedPartsToRepair,
  onRemoveFromEstimate,
  handleAddCarInfoDialog,
}) {
  return (
    <ScrollView style={styles.container} alwaysBounceVertical>
      <Text style={styles.title}>Расчет</Text>
      {selectedPartsToRepair.map((part, index) => (
        <View key={index}>
          <PartRepairExpandableItem
            selectedPartToRepair={part}
            isExpanded={false}
            canBeRemoved
            onRemoveFromSelected={onRemoveFromEstimate}
            canExpandSubItems={false}
            showZeroItems={false}
          />

          <Divider style={styles.divider} />
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.button}
          onPress={() => handleAddCarInfoDialog(true)}
        >
          <Text style={styles.buttonText}>Далее</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  title: {
    fontWeight: "500",
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 24,
  },
  divider: {
    backgroundColor: "#E8E8E8",
    marginVertical: 5,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 26,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    width: 200,
    backgroundColor: "#DB5000",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});
