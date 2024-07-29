import React from "react";
import { View, Modal, Button, StyleSheet, Pressable, Text } from "react-native";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
  colorKit,
} from "reanimated-color-picker";

type ColorObject = {
  hex: string;
};

type ColorPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectColor: (color: ColorObject) => void;
  currentColor: string;
};

const customSwatches = [
  "#E74C3C",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFEB3B",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#9E9E9E",
];

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  onClose,
  onSelectColor,
  currentColor,
}) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.colorPickerContainer}>
          <ColorPicker
            value={currentColor}
            onComplete={onSelectColor}
            style={styles.colorPicker}>
            <Preview />
            <Panel1 />
            <HueSlider />
            <OpacitySlider />
            <Swatches colors={customSwatches} style={styles.swatchContainer} />
          </ColorPicker>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: "#707070", fontWeight: "bold" }}>Close</Text>
          </Pressable>
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  colorPickerContainer: {
    alignSelf: "center",
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  colorPicker: {
    backgroundColor: "white",
    padding: 20,
    width: 280,
    alignSelf: "center",
    gap: 10,
    paddingVertical: 20,
    borderRadius: 20,
  },
  closeButton: {
    position: "absolute",
    bottom: 15,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignSelf: "center",
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 0.3,
    elevation: 5,
  },
  swatchContainer: {
    paddingTop: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#bebdbe",
  },
});

export default ColorPickerModal;
