import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AboutUsScreen = () => {
  return (
    <View style={styles.container}>
    <View style={styles.container1}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.logo}
      />
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Support</Text>
        <Text>husnaintariq772@gmail.com</Text>
        <Text>mubahm650@gmail.com</Text>
        <Text>hitman4782@gmail.com</Text>

        <Text style={styles.sectionTitle}>Contact us</Text>
        <Text>+92 309 1458480</Text>
        <Text>+92 302 0489761</Text>
        <Text>+92 316 4352618</Text>

        <Text style={styles.sectionTitle}>Developers</Text>
        <Text>Husnain Tariq</Text>
        <Text>Mubeen Ahmed</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    backgroundColor:'white',
  },
  container1: {
    padding: 16,
    alignItems: 'center',
    backgroundColor:'white',
  },
  content: {
    paddingHorizontal: 16,
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 1,
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