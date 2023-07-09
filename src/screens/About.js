import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AboutUsScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>About EasyExam</Text>

      <Text style={styles.description}>
      Welcome to EasyExam, the ultimate online solution for conducting multiple-choice question (MCQ) exams for teachers in any educational institution. With EasyExam, teachers can easily create and manage MCQ exams, making the entire examination process efficient and hassle-free. Say goodbye to the traditional paper-based exams and embrace the power of technology to streamline your assessment methods.
      </Text>

      <Text style={styles.description}>
      EasyExam provides a user-friendly interface that allows teachers to effortlessly create exam questions, and customize exam parameters. The intuitive question editor enables teachers to add multiple-choice questions. The flexibility of EasyExam empowers teachers to design comprehensive and engaging exams that accurately assess students' knowledge and understanding.
      </Text>

      <Text style={styles.description}>
        Thank you for choosing EasyExam. We look forward to being a part of your amazing Academic Adventures!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor:'white',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center', 
  },
});

export default AboutUsScreen;