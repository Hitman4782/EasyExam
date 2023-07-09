import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [homeScreen, setHomeScreen] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check if user previously selected "Stay Logged In"
    AsyncStorage.getItem('rememberMe').then((value) => {
      if (value !== null) {
        setRememberMe(value === 'true');
      }
    });
    // Check if email and password were previously stored
    AsyncStorage.multiGet(['email', 'password']).then((values) => {
      const storedEmail = values[0][1];
      const storedPassword = values[1][1];
      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
      }
    });
  }, []);

  const onFooterLinkPress = () => {
    navigation.navigate('Register');
  };

  const onUserTypeSelect = (type) => {
    setUserType(type);
    setHomeScreen(type === 'student' ? 'StudentHomeScreen' : 'TeacherHomeScreen');
  };

  const onRememberMeToggle = () => {
    setRememberMe(!rememberMe);
    AsyncStorage.setItem('rememberMe', (!rememberMe).toString());
  };

  const onLoginPress = () => {
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

    setIsLoading(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const usersRef = firebase.firestore().collection(userType + 's');
        usersRef
          .doc(uid)
          .get()
          .then((firestoreDocument) => {
            setIsLoading(false);

            if (!firestoreDocument.exists) {
              alert('User does not exist anymore.');
              return;
            }
            const user = firestoreDocument.data();

            // Store email and password if "Stay Logged In" is selected
            if (rememberMe) {
              AsyncStorage.multiSet([
                ['email', email],
                ['password', password],
              ]);
            }

            navigation.replace(homeScreen, { user });
          })
          .catch((error) => {
            setIsLoading(false);
            alert(error);
          });
      })
      .catch((error) => {
        setIsLoading(false);
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always"
      >
        <Image
          style={styles.logo}
          source={require('../../assets/icon.png')}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Login as:</Text>
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'student' && styles.selectedUserTypeButton,
              ]}
              onPress={() => onUserTypeSelect('student')}
            >
              <Text
                style={[
                  styles.userTypeButtonText,
                  userType === 'student' && styles.selectedUserTypeButtonText,
                ]}
              >
                Student
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'teacher' && styles.selectedUserTypeButton,
              ]}
              onPress={() => onUserTypeSelect('teacher')}
            >
              <Text
                style={[
                  styles.userTypeButtonText,
                  userType === 'teacher' && styles.selectedUserTypeButtonText,
                ]}
              >
                Teacher
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.centerContainer}>
          {userType && (
            <>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setEmail(text)}
                value={email}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
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

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={onRememberMeToggle}
                >
                  {rememberMe && <View style={styles.checkboxTick} />}
                </TouchableOpacity>
                <Text style={styles.checkboxText}>Stay Logged In</Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => onLoginPress()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonTitle}>Log in</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footerView}>
                <Text style={styles.footerText}>
                  Don't have an account?{' '}
                  <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                    Sign up
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
    paddingVertical: 40,
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
    height: 210,
    resizeMode: 'contain',
    marginBottom: 25,
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
    marginBottom: 10,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#20688d',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxTick: {
    width: 14,
    height: 14,
    backgroundColor: '#20688d',
    borderRadius: 2,
  },
  checkboxText: {
    fontSize: 16,
    color: '#2e2e2d',
  },
});
