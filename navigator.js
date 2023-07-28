import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import StudentHome from './src/screens/StudentHomeScreen';
import TeacherHome from './src/screens/TeacherHomeScreen';
import Setting from './src/screens/setting';
import SettingsT from './src/screens/settingsT';
import paper from './src/screens/paper';
import Login from './src/screens/LoginScreen';
import Register from './src/screens/RegistrationScreen';
import MCQExam from './src/screens/MCQtest';
import StudentResult from './src/screens/StudentResults';
import SubjectResult from './src/screens/SubjectResult';
import AddAnnouncementScreen from './src/screens/AddAnnouncements';
import EditScreen from './src/screens/EditScreen';
import EditTeacher from './src/screens/EditTeacher';
import AboutScreen from './src/screens/About';
import Support from './src/screens/Support';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Tabuser = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="StudentHomeScreen" component={TabNavigatorp} options={{ headerShown: false }} />
        <Stack.Screen name="TeacherHomeScreen" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Student Result" component={StudentResult} options={{ headerShown: false }} />
        <Stack.Screen name="Subject Result" component={SubjectResult} options={{ headerShown: false }} />
        <Stack.Screen name="MCQ Exam" component={MCQExam} options={{ headerShown: true }} />
        <Stack.Screen name="MCQ Paper" component={paper} options={{ headerShown: true }} />
        <Stack.Screen name="Add Announcement" component={AddAnnouncementScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Edit Profile" component={EditScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Edit Teacher Profile" component={EditTeacher} options={{ headerShown: true }} />
        <Stack.Screen name="About us" component={AboutScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Support" component={Support} options={{ headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const TabNavigatorp = () => {
  return (
    <Tabuser.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'person';
          } else if (route.name === 'Student Result') {
            iconName = 'newspaper';
          } else if (route.name === 'Setting') {
            iconName = 'cog';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#20688d',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: 'gray',
        },
      })}
    >

      <Tab.Screen name="Home" component={StudentHome} options={{ headerShown: false }} />
      <Tab.Screen name="Student Result" component={StudentResult} />
      <Tab.Screen name="Setting" component={Setting} />
    </Tabuser.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'person';
          } else if (route.name === 'Subject Result') {
            iconName = 'document';
          } else if (route.name === 'Setting') {
            iconName = 'cog';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#20688d',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: 'gray',
         
        },
      })}
    >

      <Tab.Screen name="Home" component={TeacherHome} options={{ headerShown: false }} />
      <Tab.Screen name="Subject Result" component={SubjectResult}  />
      <Tab.Screen name="Setting" component={SettingsT} />
    </Tab.Navigator>
  );
};


export default MainNavigator;