import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  options: any[];
  selected: any[];
  onSelect: (value: any) => void;
}

const FilterModal = ({
  visible,
  onClose,
  options,
  selected,
  onSelect,
}: FilterModalProps) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Groups</Text>
          <FlatList
            data={options}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => onSelect(item.value)}>
                <Text>{item.label}</Text>
                {selected.includes(item.value) && (
                  <Text style={styles.selectedIndicator}>✔</Text>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.value}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  selectedIndicator: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});

export default FilterModal;
