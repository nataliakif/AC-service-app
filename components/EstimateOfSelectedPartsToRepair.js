import { StyleSheet, ScrollView } from "react-native";
import { Divider } from "@react-native-material/core";

import PartRepairExpandableItem from "./PartRepairExpandableItem";

export default function EstimateOfSelectedPartsToRepair({
  selectedPartsToRepair,
  onRemoveFromEstimate,
}) {
  return (
    <ScrollView style={styles.container} alwaysBounceVertical>
      {selectedPartsToRepair.map((part) => (
        <>
          <Divider style={styles.divider} />
          <PartRepairExpandableItem
            key={Math.random()}
            selectedPartToRepair={part}
            isExpanded={false}
            canBeRemoved
            onRemoveFromSelected={onRemoveFromEstimate}
            canExpandSubItems={false}
            showZeroItems={false}
          />
        </>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },

  divider: {
    marginLeft: 10,
    marginRight: 10,

    backgroundColor: "gray",
  },
});
