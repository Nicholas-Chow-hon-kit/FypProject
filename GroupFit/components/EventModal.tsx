import React from 'react';
import { View, Modal, TextInput, Button, StyleSheet } from 'react-native';

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  newEvent: { title: string, date: string };
  setNewEvent: (event: { title: string, date: string }) => void;
  onAddEvent: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ visible, onClose, newEvent, setNewEvent, onAddEvent }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TextInput
          style={styles.input}
          placeholder="Event Title"
          value={newEvent.title}
          onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
        />
        <Button title="Add Event" onPress={onAddEvent} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    width: '80%',
  },
});

export default EventModal;
