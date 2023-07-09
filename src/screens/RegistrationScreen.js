import React, { useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../firebase/config';
import { Picker } from '@react-native-picker/picker';

export default function RegistrationScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [homeScreen, setHomeScreen] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const [rollNumber, setRollNumber] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');


  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };

  const onUserTypeSelect = (type) => {
    setUserType(type);
    setHomeScreen(type === 'student' ? 'StudentHomeScreen' : 'TeacherHomeScreen');
  };

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
  
    if (!userType) {
      alert('Please select a user type.');
      return;
    }
  
    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    // Basic password validation
    if (!password || password.length < 6) {
      alert('Please enter a password with at least 6 characters.');
      return;
    }
  
    // Basic full name validation
    if (!fullName) {
      alert('Please enter your full name.');
      return;
    }
  
    // Additional field validations for student
    if (userType === 'student') {
      if (!rollNumber) {
        alert('Please enter your roll number.');
        return;
      }
  
      if (!selectedYear) {
        alert('Please select your class.');
        return;
      }
    }
  
    // Additional field validations for teacher
    if (userType === 'teacher') {
      if (!employeeNumber) {
        alert('Please enter your employee number.');
        return;
      }
  
      if (!selectedSubject) {
        alert('Please select your subject.');
        return;
      }
    }
  
    setIsLoading(true); // Start the loading indicator
  
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const data = {
          id: uid,
          email,
          fullName,
          class: selectedYear,
          subject: selectedSubject,
          rollNumber: userType === 'student' ? rollNumber : null,
          employeeNumber: userType === 'teacher' ? employeeNumber : null,
        };
        const usersRef = firebase.firestore().collection(userType + 's');
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            setIsLoading(false); // Stop the loading indicator
            navigation.replace(homeScreen, { user: data });
          })
          .catch((error) => {
            setIsLoading(false); // Stop the loading indicator
            alert(error);
          });
      })
      .catch((error) => {
        setIsLoading(false); // Stop the loading indicator
        alert(error);
      });
  };
  

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <Image style={styles.logo} source={require('../../assets/icon.png')} />
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Register as:</Text>
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'student' && styles.selectedUserTypeButton,
              ]}
              onPress={() => onUserTypeSelect('student')}>
              <Text
                style={[
                  styles.userTypeButtonText,
                  userType === 'student' && styles.selectedUserTypeButtonText,
                ]}>
                Student
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'teacher' && styles.selectedUserTypeButton,
              ]}
              onPress={() => onUserTypeSelect('teacher')}>
              <Text
                style={[
                  styles.userTypeButtonText,
                  userType === 'teacher' && styles.selectedUserTypeButtonText,
                ]}>
                Teacher
              </Text>
            </TouchableOpacity>
          </View>
          {userType && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setFullName(text)}
                value={fullName}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setEmail(text)}
                value={email}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
              {userType === 'student' && (
                <TextInput
                  style={styles.input}
                  placeholder="Enter Roll Number"
                  placeholderTextColor="#aaaaaa"
                  onChangeText={(text) => setRollNumber(text)}
                  value={rollNumber}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                />
              )}

              {userType === 'teacher' && (
                <TextInput
                  style={styles.input}
                  placeholder="Enter Employee Number"
                  placeholderTextColor="#aaaaaa"
                  onChangeText={(text) => setEmployeeNumber(text)}
                  value={employeeNumber}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                />
              )}

              <TextInput
                style={styles.input}
                placeholderTextColor="#aaaaaa"
                secureTextEntry
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
                value={password}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholderTextColor="#aaaaaa"
                secureTextEntry
                placeholder="Confirm Password"
                onChangeText={(text) => setConfirmPassword(text)}
                value={confirmPassword}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />

              {userType === 'student' && (
                <>
                  <Text style={styles.label}>Select Class</Text>
                  <Picker
                    style={styles.input}
                    selectedValue={selectedYear}
                    onValueChange={(itemValue) => setSelectedYear(itemValue)}>
                    <Picker.Item label="9th" value="9th" />
                    <Picker.Item label="10th" value="10th" />
                    <Picker.Item label="1st Year" value="1st Year" />
                    <Picker.Item label="2nd Year" value="2nd Year" />
                  </Picker>
                </>
              )}

              {userType === 'teacher' && (
                <>
                  <Text style={styles.label}>Select Subject</Text>
                  <Picker
                    style={styles.input}
                    selectedValue={selectedSubject}
                    onValueChange={(itemValue) => setSelectedSubject(itemValue)}>
                    <Picker.Item label="English" value="English" />
                    <Picker.Item label="Math" value="Math" />
                    <Picker.Item label="Computer" value="Computer" />
                    <Picker.Item label="Physics" value="Physics" />
                    <Picker.Item label="Chemistry" value="Chemistry" />
                    <Picker.Item label="Biology" value="Biology" />
                  </Picker>
                </>
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={() => onRegisterPress()}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonTitle}>Create account</Text>
                )}
              </TouchableOpacity>
              <View style={styles.footerView}>
                <Text style={styles.footerText}>
                  Already got an account?{' '}
                  <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                    Log in
                  </Text>
                </Text>
              </View>
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  userTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginRight: 10,
  },
  selectedUserTypeButton: {
    backgroundColor: '#20688d',
  },
  userTypeButtonText: {
    fontSize: 16,
    color: '#000',
  },
  selectedUserTypeButtonText: {
    color: '#fff',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '90%',
  },
  button: {
    backgroundColor: '#20688d',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#2e2e2d',
  },
  footerLink: {
    color: '#20688d',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    textAlign: 'left'
  }
  
});
