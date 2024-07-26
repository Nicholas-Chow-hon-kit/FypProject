import React from "react";
import { View, Modal, Button, StyleSheet } from "react-native";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
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

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  onClose,
  onSelectColor,
  currentColor,
}) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <ColorPicker
          value={currentColor}
          onComplete={onSelectColor}
          style={styles.colorPicker}>
          <Preview />
          <Panel1 />
          <HueSlider />
          <OpacitySlider />
          <Swatches />
        </ColorPicker>
        <Button title="Close" onPress={onClose} />
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
  colorPicker: {
    backgroundColor: "white",
    padding: 20,
    width: 280,
    alignSelf: "center",
    gap: 10,
    paddingVertical: 20,
    borderRadius: 20,
  },
});

export default ColorPickerModal;
