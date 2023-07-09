import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase/config';

class TestHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tests: [],
      selectedTest: null,
    };

    this.unsubscribe = null;
  }

  componentDidMount() {
    const { email } = firebase.auth().currentUser;

    // Query the "results" collection to fetch tests given by the logged-in user's email
    const resultsRef = firebase.firestore().collection('results');
    this.unsubscribe = resultsRef
      .where('email', '==', email)
      .onSnapshot((querySnapshot) => {
        const tests = querySnapshot.docs.map((doc) => doc.data());
        this.setState({ tests });
      }, (error) => {
        console.error('Error fetching test history: ', error);
      });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleTestPress = (test) => {
    this.setState({ selectedTest: test });
  };

  renderTests = () => {
    const { tests, selectedTest } = this.state;

    if (tests.length === 0) {
      return <Text style={styles.noTestsText}>No tests found.</Text>;
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tests.map((test, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.testContainer, selectedTest === test && styles.selectedTestContainer]}
            onPress={() => this.handleTestPress(test)}
          >
            <Text style={styles.testTitle}>{test.selectedCollection}</Text>
            <Text style={styles.testResult}>Result: {test.result}</Text>
            {selectedTest === test && (
              <View style={styles.additionalDetailsContainer}>
                <Text style={styles.additionalDetailsText}>Date: {test.date.toDate().toDateString()}</Text>
                <Text style={styles.additionalDetailsText}>Subject: {test.subject}</Text>
                <Text style={styles.additionalDetailsText}>Full Name: {test.fullName}</Text>
                <Text style={styles.additionalDetailsText}>Roll Number: {test.rollNumber}</Text>
                <Text style={styles.additionalDetailsText}>Class: {test.userClass}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Test History</Text>
        {this.renderTests()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F2F6FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 0, // Adjust the padding value as per your bottom navigator's height
  },
  testContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedTestContainer: {
    backgroundColor: '#EAF6FF',
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  testResult: {
    fontSize: 14,
  },
  additionalDetailsContainer: {
    marginTop: 8,
  },
  additionalDetailsText: {
    fontSize: 12,
    color: '#666666',
  },
  noTestsText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default TestHistory;
