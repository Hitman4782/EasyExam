import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { firebase } from '../firebase/config';
import { Picker } from '@react-native-picker/picker';

const EditScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [Class, setClass] = useState('');
  const [pickerValue, setPickerValue] = useState('');

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const getCurrentUserData = async () => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const userRef = firebase.firestore().collection('students').doc(currentUser.uid);
        try {
          const doc = await userRef.get();
          if (doc.exists) {
            const data = doc.data();
            setEmail(data.email || '');
            setFullName(data.fullName || '');
            setRollNumber(data.rollNumber || '');
            setClass(data.class || '');
            setPickerValue(data.class || ''); // Set picker value to the class value from Firebase
          }
        } catch (error) {
          console.log('Error getting user data from Firestore:', error);
        }
      }
    };

    getCurrentUserData();
  }, []);

  const handleSave = () => {
    const userRef = firebase.firestore().collection('students').doc(user.uid);
    userRef
      .update({
        fullName: fullName,
        rollNumber: rollNumber,
        class: pickerValue, // Update with the selected picker value
      })
      .then(() => {
        Alert.alert('Success', 'User data updated successfully!, Please logout and log back in for changes to come in effect.');
      })
      .catch((error) => {
        console.error('Error updating user data:', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name:</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <View style={styles.emailWrapper}>
          <Text style={styles.emailText}>{email.charAt(0).toUpperCase() + email.slice(1)}</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Roll Number:</Text>
        <TextInput style={styles.input} value={rollNumber} onChangeText={setRollNumber} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Class:</Text>
        <Picker
          style={styles.picker}
          selectedValue={pickerValue}
          onValueChange={(itemValue) => setPickerValue(itemValue)}
        >
          <Picker.Item label="9th" value="9th" />
          <Picker.Item label="10th" value="10th" />
          <Picker.Item label="1st Year" value="1st Year" />
          <Picker.Item label="2nd Year" value="2nd Year" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  emailWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
  },
  emailText: {
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#20688d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginVertical: 20,
    top: -30,
    alignSelf: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    backgroundColor: '#CCCCCC',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EditScreen;
