import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';
import { firebase } from '../firebase/config';

class MCQExam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: [],
      selectedCollection: '',
      mcqs: [],
      selectedAnswers: {},
      submitted: false,
      result: null,
    };
  }

  componentDidMount() {
    const { subject, className } = this.props.route.params;
    console.log('subject:', subject);
    console.log('className:', className);
    this.fetchCollections(subject, className);
  }

  fetchCollections = (subject, className) => {


    if (!subject || !className) {
      console.error('Invalid subject or className');
      return;
    }
  
    const questionRef = firebase.firestore().collection('subjects').doc(subject);
    const subjectRef = questionRef.collection(className);

    subjectRef
      .get()
      .then((querySnapshot) => {
        const collections = querySnapshot.docs.map((doc) => doc.id);
        this.setState({ collections });
      })
      .catch((error) => {
        console.error('Error fetching collections: ', error);
      });
  };

  fetchMCQs = () => {
    const { selectedCollection } = this.state;
    const { route } = this.props;
    const { subject, className } = route.params;
  
    if (!subject || !className || !selectedCollection) {
      console.error('Invalid subject, className, or selectedCollection');
      return;
    }
  
    const questionRef = firebase.firestore().collection('subjects').doc(subject);
    const subjectRef = questionRef.collection(className);

    subjectRef
      .doc(selectedCollection)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const mcqs = doc.data().mcqs || [];
          const selectedAnswers = {};
          mcqs.forEach((mcq, index) => {
            selectedAnswers[index] = null;
          });
          this.setState({ mcqs, selectedAnswers });
        }
      })
      .catch((error) => {
        console.error('Error fetching MCQs: ', error);
      });
  };

  

  handleCollectionChange = (value) => {
    this.setState({ selectedCollection: value }, () => {
      this.fetchMCQs(); // Fetch MCQs when the collection is selected
    });
  };

  handleAnswerChange = (index, value) => {
    const selectedAnswers = { ...this.state.selectedAnswers };
    selectedAnswers[index] = value;
    this.setState({ selectedAnswers });
  };

  handleSubmit = () => {
    const { mcqs, selectedAnswers } = this.state;

    const result = mcqs.reduce((total, mcq, index) => {
      const selectedAnswer = selectedAnswers[index];
      if (selectedAnswer === mcq.correctAnswer) {
        return total + 1;
      }
      return total;
    }, 0);

    // Get user information
    const { uid, email } = firebase.auth().currentUser;
    const { selectedCollection } = this.state;
    const { subject } = this.props.route.params;

    // Create a reference to the user document in the "students" collection
    const userRef = firebase.firestore().collection('students').doc(uid);

    // Fetch the user document
    userRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          // Get the rollNumber and fullName from the user document
          const { rollNumber, fullName, class: userClass} = doc.data();

          // Create a new document in the "results" collection with an auto-generated ID
          const resultRef = firebase.firestore().collection('results').doc();

          // Set the fields of the result document
          resultRef
            .set({
              selectedCollection,
              result: `${result}/${mcqs.length}`,
              date: new Date(),
              subject,
              fullName,
              rollNumber,
              email,
              userClass,
            })
            .then(() => {
              // Result saved successfully, update the state
              this.setState({ submitted: true, result: `${result}/${mcqs.length}` });
            })
            .catch((error) => {
              console.error('Error saving result: ', error);
            });
        } else {
          console.error('User document does not exist');
        }
      })
      .catch((error) => {
        console.error('Error fetching user document: ', error);
      });
  };
  

  renderCollections = () => {
    return this.state.collections.map((collection, index) => (
      <Button
        key={index}
        mode="contained"
        style={styles.collectionButton}
        onPress={() => this.handleCollectionChange(collection)}
      >
        {collection}
      </Button>
    ));
  };

  renderMCQs = () => {
    const { mcqs, selectedAnswers, submitted } = this.state;
  
    if (mcqs.length === 0) {
      // Display activity indicator when MCQs are being loaded
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      );
    }
  
    return mcqs.map((mcq, index) => (
      <View key={index} style={styles.mcqContainer}>
        <Text style={styles.mcqQuestion}>{mcq.question}</Text>
        {mcq.options.map((option, optionIndex) => {
          const selectedAnswer = selectedAnswers[index];
          const isWrongAnswer = submitted && selectedAnswer !== mcq.correctAnswer;
          const optionStyle = isWrongAnswer ? styles.wrongOptionText : styles.optionText;
  
          return (
            <View key={optionIndex} style={styles.optionContainer}>
              <RadioButton.Group
                value={selectedAnswer}
                onValueChange={(value) => this.handleAnswerChange(index, value)}
              >
                <View style={styles.radioButtonContainer}>
                  <RadioButton
                    value={option}
                    color="#20688d"
                    uncheckedColor="#757575"
                  />
                  <Text style={optionStyle}>{option}</Text>
                </View>
              </RadioButton.Group>
            </View>
          );
        })}
      </View>
    ));
  };
  
  
  
  renderResult = () => {
    const { mcqs, selectedAnswers, result } = this.state;

    return mcqs.map((mcq, index) => (
      <View key={index} style={styles.resultContainer}>
        <Text style={styles.mcqQuestion}>{mcq.question}</Text>
        <Text style={styles.resultText}>
          Your Answer: {selectedAnswers[index] || 'Not answered'}
        </Text>
        <Text style={styles.resultText}>Correct Answer: {mcq.correctAnswer}</Text>
      </View>
    ));
  };

  render() {
    const { selectedCollection, mcqs, submitted, result } = this.state;

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>MCQ Exam</Text>

        {!selectedCollection ? (
          <View>
            <Text style={styles.subtitle}>Select a Collection:</Text>
            {this.renderCollections()}
          </View>
        ) : (
          <View>
            <Text style={styles.subtitle}>MCQs:</Text>
            {mcqs.length > 0 ? (
              <View>
                {this.renderMCQs()}
                {!submitted ? (
                  <Button
                    mode="contained"
                    style={styles.submitButton}
                    onPress={this.handleSubmit}
                  >
                    Submit
                  </Button>
                ) : (
                  <View>
                    <Text style={styles.resultTitle}>Result:</Text>
                    <Text style={styles.resultText}>{`You scored ${result}`}</Text>
                    {this.renderResult()}
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.noMCQsText}>loading</Text>
            )}
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F2F6FF'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  collectionButton: {
    marginBottom: 8,
    backgroundColor:'#20688d'
  },
  mcqContainer: {
    marginBottom: 16,
  },
  mcqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  wrongOptionText: {
    color: 'red',
    marginLeft: 8,
  },
  correctOptionText: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  optionContainer: {
    marginBottom: 4,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 8,
  },
  resultContainer: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 4,
  },
  noMCQsText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor:'#20688d'
  },
});

export default MCQExam;
