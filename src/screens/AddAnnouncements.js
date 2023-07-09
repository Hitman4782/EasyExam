import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Paragraph } from 'react-native-paper';
import { firebase } from '../firebase/config';
import { Picker } from '@react-native-picker/picker';

const AddAnnouncementScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [classSection, setClassSection] = useState('9th');

  const handleAddAnnouncement = async () => {
    try {
      // Create a new document in the "announcements" collection
      await firebase.firestore().collection('announcements').add({
        title,
        description,
        subject,
        classSection,
      });

      // Reset the input fields
      setTitle('');
      setDescription('');
      setSubject('');
      setClassSection('9th');

      // Show success message or navigate to another screen
      console.log('Announcement added successfully!');
    } catch (error) {
      console.log('Error adding announcement:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Add Announcement</Title>
      <TextInput
        style={styles.input}
        label="Title"
        value={title}
        onChangeText={setTitle}
        theme={{ colors: { primary: '#20688d' } }}
      />
      <TextInput
        style={styles.input}
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        theme={{ colors: { primary: '#20688d' } }}
      />
      <TextInput
        style={styles.input}
        label="Subject"
        value={subject}
        onChangeText={setSubject}
        theme={{ colors: { primary: '#20688d' } }}
      />
      <Picker
        style={styles.picker}
        selectedValue={classSection}
        onValueChange={setClassSection}
        theme={{ colors: { primary: '#20688d' } }}
      >
        <Picker.Item label="9th" value="9th" />
        <Picker.Item label="10th" value="10th" />
        <Picker.Item label="1st Year" value="1st Year" />
        <Picker.Item label="2nd Year" value="2nd Year" />
      </Picker>
      <Button mode="contained" style={styles.button} onPress={handleAddAnnouncement}>
        Add Announcement
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#F2F6FF'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F2F6FF', 
    borderRadius: 2 ,
    marginBottom: 16,
  },
  picker: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#20688d',
    marginTop: 16,
  },
});

export default AddAnnouncementScreen;
