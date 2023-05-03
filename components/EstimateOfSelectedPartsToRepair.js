import { StyleSheet, ScrollView, Text } from "react-native";
import { Divider } from "@react-native-material/core";

import PartRepairExpandableItem from "./PartRepairExpandableItem";

export default function EstimateOfSelectedPartsToRepair({
  selectedPartsToRepair,
  onRemoveFromEstimate,
}) {
  return (
    <ScrollView style={styles.container} alwaysBounceVertical>
      <Text style={styles.title}>Расчет</Text>
      {selectedPartsToRepair.map((part) => (
        <>
          <PartRepairExpandableItem
            key={Math.random()}
            selectedPartToRepair={part}
            isExpanded={false}
            canBeRemoved
            onRemoveFromSelected={onRemoveFromEstimate}
            canExpandSubItems={false}
            showZeroItems={false}
          />

          <Divider style={styles.divider} />
        </>
      ))}
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
});
