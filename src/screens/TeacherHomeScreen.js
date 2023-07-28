import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebase/config';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => {
  const [userDetails, setUserDetails] = useState(null);
  const currentDate = new Date().toDateString();
  const navigation = useNavigation();

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await firebase.auth().currentUser;

        if (user) {
          const { displayName, email, uid } = user;

          // Fetch additional user details from Firestore
          const userDoc = await firebase.firestore().collection('teachers').doc(uid).get();

          if (userDoc.exists) {
            const { fullName, employeeNumber, subject } = userDoc.data();
            setUserDetails({ displayName, email, fullName, employeeNumber, subject });
          }
        }
      } catch (error) {
        console.log('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const classes = [
    { name: '9th', color: '#20688d', icon: 'book' },
    { name: '10th', color: '#20688d', icon: 'book' },
    { name: '1st Year', color: '#20688d', icon: 'book' },
    { name: '2nd Year', color: '#20688d', icon: 'book' },
  ];

  const handleClassesPress = (className) => {
    const { subject } = userDetails;
    navigation.navigate('MCQ Paper', { className, subject });
  };

  const Extra = [
    { name: 'Announcements', color: '#20688d', icon: 'bullhorn' },
  ];

  const handleExtraPress = () => {
    navigation.navigate('Add Announcement');
  };



  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <StatusBar backgroundColor="#20688d" barStyle="light-content" />
        <View style={styles.headerShape}>
          <Text style={styles.welcomeText}>Welcome, {userDetails?.fullName}</Text>
          <Text style={styles.currentDate}>{currentDate}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.subTitle1}>Teacher Information:</Text>
        <Animated.View style={[styles.userInfo, { opacity: fadeAnim }]}>
          <Text style={styles.subTitle}>Subject Teacher: {userDetails?.subject}</Text>
          <Text style={styles.subTitle}>Employee Number: {userDetails?.employeeNumber}</Text>
          <Text style={styles.subTitle}>Email: {userDetails?.email}</Text>
        </Animated.View>
        <Text style={styles.subTitle1}>Select your class:</Text>
        <View style={styles.classes}>
          {classes.map((classItem) => (
            <Card
              key={classItem.name}
              style={[styles.card, { backgroundColor: classItem.color }]}
              onPress={() => handleClassesPress(classItem.name)}
            >
              <Card.Content style={styles.cardContent}>
                <Icon name={classItem.icon} size={24} color="white" style={styles.icon} />
                <Title style={styles.cardText}>{classItem.name}</Title>
              </Card.Content>
            </Card>
          ))}
        </View>
        <Text style={styles.subTitle1}>Extras:</Text>
        <View style={styles.classes}>
          {Extra.map((classItem) => (
            <Card
              key={classItem.name}
              style={[styles.card1, { backgroundColor: classItem.color }]}
              onPress={() => handleExtraPress(classItem.name)}
            >
              <Card.Content style={styles.cardContent}>
                <Icon name={classItem.icon} size={24} color="white" style={styles.icon} />
                <Title style={styles.cardText}>{classItem.name}</Title>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FF',
  },
  headerContainer: {
    paddingTop: StatusBar.currentHeight,
  },
  headerShape: {
    height: Dimensions.get('window').width / 6,
    backgroundColor: '#20688d',
    borderBottomLeftRadius: Dimensions.get('window').width / 5,
    borderBottomRightRadius: Dimensions.get('window').width / 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  percentageCircle: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -60 }],
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#20688d',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  subTitle1: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: 'bold',
  },
  currentDate: {
    fontSize: 14,
    color: '#fff',
  },
  classes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  card1: {
    width: '60%',
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  cardText: {
    color: 'white',
    fontSize: 16,
  },
  announcementContainer: {
    bottom: 2,
    padding: 2,
    borderWidth: 0.3,
    borderRadius: 4,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  announcementDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
