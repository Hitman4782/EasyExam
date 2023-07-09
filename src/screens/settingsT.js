import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { firebase } from '../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsT = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await firebase.auth().currentUser;

        if (user) {
          const { displayName, email, uid } = user;

          // Fetch additional user details from Firestore
          const userDoc = await firebase.firestore().collection('teachers').doc(uid).get();

          if (userDoc.exists) {
            const { fullName, employeeNumber, subject} = userDoc.data();
            setUserDetails({ displayName, email, fullName, employeeNumber ,subject });
          }
        }
      } catch (error) {
        console.log('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);


  const AddAnnouncement = () => {
    navigation.navigate('Add Announcement');
  };
  const handleAboutUs = () => {
    navigation.navigate('About us');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('Support');
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();

      // Reset stayLoggedIn preference in AsyncStorage
      await AsyncStorage.setItem('stayLoggedIn', 'false');

      // Clear AsyncStorage cache
      await AsyncStorage.clear();

      // Navigate to the login screen and reset the navigation stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };



  return (
    <ScrollView style={styles.container}>

      <View style={styles.profileContainer}>
        <View View style={styles.profileContainer1}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.sectionTitle}>User Information</Text>
        <View style={styles.profileBox}>
          <Text style={styles.profileHeading}>Email:</Text>
          <Text style={styles.profileText}>{userDetails?.email}</Text>
        </View>
        <View style={styles.profileBox}>
          <Text style={styles.profileHeading}>Name:</Text>
          <Text style={styles.profileText}>{userDetails?.fullName}</Text>
        </View>
        <View style={styles.profileBox}>
          <Text style={styles.profileHeading}>Employee Number:</Text>
          <Text style={styles.profileText}>{userDetails?.employeeNumber}</Text>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        
        <TouchableOpacity style={styles.optionContainer} onPress={AddAnnouncement}>
          <Text style={styles.optionText}>Add Announcement</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer} onPress={handlePrivacyPolicy}>
          <Text style={styles.optionText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={handleAboutUs}>
          <Text style={styles.optionText}>About Us</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.sectionButton} onPress={() => navigation.navigate('Edit Teacher Profile')}>
        <Text style={styles.sectionButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileContainer1: {
    width: 160,
    height: 180,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    backgroundColor: '#CCCCCC',
    flex: 1,
  },
  profileContainer: {
    marginBottom: 20,
    top: -20,
  },
  profileBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  profileText: {
    fontSize: 15,
    color: '#333',
  },
  sectionButton: {
    backgroundColor: '#20688d',
    borderRadius: 5,
    paddingVertical: 12,
    marginBottom: 10,
    top: -40,
  },
  sectionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
    top: -35,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    paddingVertical: 12,
    top: -40,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SettingsT;