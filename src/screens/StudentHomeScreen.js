import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView, // Add ScrollView import
} from 'react-native';
import { Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebase/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Circle } from 'react-native-svg';
import Swiper from 'react-native-swiper';

const HomeScreen = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
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
          const userDoc = await firebase.firestore().collection('students').doc(uid).get();

          if (userDoc.exists) {
            const { fullName, rollNumber, class: userClass } = userDoc.data();
            setUserDetails({ displayName, email, fullName, rollNumber, class: userClass });

            // Fetch user result from Firestore
            const resultDoc = await firebase.firestore().collection('results').doc(uid).get();

            if (resultDoc.exists) {
              const { result } = resultDoc.data();
              const [marksGained, totalMarks] = result.split('/');
              const percentage = (Number(marksGained) / Number(totalMarks)) * 100;
              setPercentage(percentage);
              console.log(percentage);
            }
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

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const userClass = userDetails?.class;
        // if (!userClass) {
        //   console.error('Invalid user class');
        //   return;
        // }
  
        const announcementsSnapshot = await firebase
          .firestore()
          .collection('announcements')
          .where('classSection', '==', userClass)
          .get();
  
        const announcementsData = [];
        announcementsSnapshot.forEach((doc) => {
          announcementsData.push(doc.data());
        });
  
        setAnnouncements(announcementsData);
      } catch (error) {
        console.log('Error fetching announcements:', error);
      }
    };
  
    fetchAnnouncements();
  }, [userDetails]);
  

  const subjects = [
    { name: 'English', icon: 'book', color: '#20688d' },
    { name: 'Maths', icon: 'calculator', color: '#20688d' },
    { name: 'Computer', icon: 'desktop', color: '#20688d' },
    { name: 'Physics', icon: 'flask', color: '#20688d' },
    { name: 'Chemistry', icon: 'flask', color: '#20688d' },
    { name: 'Biology', icon: 'leaf', color: '#20688d' },
  ];

  const handleSubjectPress = (subjectName) => {
    const className = userDetails?.class;

    if (!subjectName || !className) {
      console.error('Invalid subject or className');
      return;
    }

    navigation.navigate('MCQ Exam', { subject: subjectName, className });
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
        <Text style={styles.subTitle1}>Student:</Text>
        <Animated.View style={[styles.userInfo, { opacity: fadeAnim }]}>
          <Text style={styles.subTitle}>Class: {userDetails?.class}</Text>
          <Text style={styles.subTitle}>Roll Number: {userDetails?.rollNumber}</Text>
          <Text style={styles.subTitle}>Email: {userDetails?.email}</Text>
          
        </Animated.View>
        <Text style={styles.subTitle1}>Select a Subject:</Text>
        <View style={styles.subjects}>
          {subjects.map((subject) => (
            <Card
              key={subject.name}
              style={[styles.card, { backgroundColor: subject.color }]}
              onPress={() => handleSubjectPress(subject.name)}
            >
              <Card.Content style={styles.cardContent}>
                <Icon name={subject.icon} size={24} color="white" style={styles.icon} />
                <Title style={styles.cardText}>{subject.name}</Title>
              </Card.Content>
            </Card>
          ))}
        </View>
        <Text style={styles.subTitle1}>Announcements:</Text>
        <ScrollView style={styles.announcementContainer}>
          {announcements.map((announcement, index) => (
            <View key={index} style={styles.slide}>
              <Text style={styles.announcementTitle}>{announcement.title}</Text>
              <Text style={styles.announcementDescription}>{announcement.description}</Text>
            </View>
          ))}
        </ScrollView>

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
    fontWeight: "bold",
  },
  currentDate: {
    fontSize: 14,
    color: '#fff',
  },
  subjects: {
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
    marginBottom: 4
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