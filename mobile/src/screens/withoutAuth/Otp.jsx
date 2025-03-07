import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
const OtpPopup = ({ visible, onClose, title, onOtpCompleted }) => {
  const [otpCode, setOtpCode] = useState("");
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Enter 6 digit OTP</Text>
          <Text style={styles.subtitle}>sent to your Email</Text>

          <View style={styles.otpContainer}>
            <OtpInput
              numberOfDigits={6}
              onChangeText={(otp) => setOtpCode(otp)}
              inputStyle={styles.otpInput}
              containerStyle={styles.otpInputContainer}
              theme={{
                
             pinCodeTextStyle: styles.pinText,
                }}
            />
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              if (otpCode.length === 6) {
                onOtpCompleted(otpCode); 
                onClose();
              }
            }}
          >
            <Text style={styles.submitButtonText}>Submit OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
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
  popupContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
  },
  otpContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  otpInput: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  otpInputContainer: {
    justifyContent: "space-between",
    width: "100%",
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: 'darkgreen',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    color: "darkgreen",
    fontSize: 16,
  },
  pinText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#000000', // Ensure text is visible
      textAlign: 'center',
    },
});

export default OtpPopup;

