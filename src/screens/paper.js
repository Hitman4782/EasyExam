import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Button, Text, Title, TextInput as PaperTextInput } from 'react-native-paper';
import { firebase } from '../firebase/config';

class MCQUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docName: '',
      numMCQs: '',
      mcqs: [],
    };
  }

  handleDocNameChange = (text) => {
    this.setState({ docName: text });
  };

  handleNumMCQsChange = (text) => {
    this.setState({ numMCQs: text });
  };

  handleNumMCQsSubmit = () => {
    const { numMCQs } = this.state;
    const mcqs = [];

    for (let i = 0; i < numMCQs; i++) {
      mcqs.push({
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '',
      });
    }

    this.setState({ mcqs });
  };

  handleQuestionChange = (index, text) => {
    const mcqs = [...this.state.mcqs];
    mcqs[index].question = text;
    this.setState({ mcqs });
  };

  handleOptionAChange = (index, text) => {
    const mcqs = [...this.state.mcqs];
    mcqs[index].optionA = text;
    this.setState({ mcqs });
  };

  handleOptionBChange = (index, text) => {
    const mcqs = [...this.state.mcqs];
    mcqs[index].optionB = text;
    this.setState({ mcqs });
  };

  handleOptionCChange = (index, text) => {
    const mcqs = [...this.state.mcqs];
    mcqs[index].optionC = text;
    this.setState({ mcqs });
  };

  handleOptionDChange = (index, text) => {
    const mcqs = [...this.state.mcqs];
    mcqs[index].optionD = text;
    this.setState({ mcqs });
  };

  handleCorrectAnswerChange = (index, text) => {
    const mcqs = [...this.state.mcqs];
    mcqs[index].correctAnswer = text;
    this.setState({ mcqs });
  };

  handleUpload = () => {
    const { docName, mcqs } = this.state;
    const { route } = this.props;
    const { subject, className } = route.params;
  
    if (!subject || !className) {
      console.error('Error: Subject or class name is missing.');
      return;
    }
  
    const mcqData = mcqs.map((mcq) => ({
      question: mcq.question,
      options: [mcq.optionA, mcq.optionB, mcq.optionC, mcq.optionD],
      correctAnswer: mcq.correctAnswer,
    }));
  
    const questionRef = firebase.firestore().collection('subjects').doc(subject);
    const subjectRef = questionRef.collection(className).doc(docName);
  
    const uniqueId = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit random number
  
    subjectRef
      .set({
        id: uniqueId, // Store the unique ID
        mcqs: mcqData,
      })
      .then(() => {
        Alert.alert('MCQs uploaded successfully!');
        console.log('MCQs uploaded successfully!');
        this.setState({ mcqs: [] });
      })
      .catch((error) => {
        console.error('Error uploading MCQs: ', error);
      });
  };
  

  renderMCQInputs = () => {
    return this.state.mcqs.map((mcq, index) => (
      <View key={index} style={{ marginBottom: 16 }}>
        <Title style={{ marginBottom: 8 }}>{`MCQ ${index + 1}`}</Title>
        <PaperTextInput
          style={{ marginBottom: 16, backgroundColor: '#F2F6FF', borderRadius: 2 }}
          label="Question"
          value={mcq.question}
          onChangeText={(text) => this.handleQuestionChange(index, text)}
          theme={{ colors: { primary: '#20688d' } }}
        />
        <PaperTextInput
          style={{ marginBottom: 16, backgroundColor: '#F2F6FF', borderRadius: 2 }}
          label="Option A"
          value={mcq.optionA}
          onChangeText={(text) => this.handleOptionAChange(index, text)}
          theme={{ colors: { primary: '#20688d' } }}
        />
        <PaperTextInput
          style={{ marginBottom: 16, backgroundColor: '#F2F6FF', borderRadius: 2 }}
          label="Option B"
          value={mcq.optionB}
          onChangeText={(text) => this.handleOptionBChange(index, text)}
          theme={{ colors: { primary: '#20688d' } }}
        />
        <PaperTextInput
          style={{ marginBottom: 16, backgroundColor: '#F2F6FF', borderRadius: 2 }}
          label="Option C"
          value={mcq.optionC}
          onChangeText={(text) => this.handleOptionCChange(index, text)}
          theme={{ colors: { primary: '#20688d' } }}
        />
        <PaperTextInput
          style={{ marginBottom: 16, backgroundColor: '#F2F6FF', borderRadius: 2 }}
          label="Option D"
          value={mcq.optionD}
          onChangeText={(text) => this.handleOptionDChange(index, text)}
          theme={{ colors: { primary: '#20688d' } }}
        />
        <PaperTextInput
          style={{ marginBottom: 16, backgroundColor: '#F2F6FF', borderRadius: 2 }}
          label="Correct Answer"
          value={mcq.correctAnswer}
          onChangeText={(text) => this.handleCorrectAnswerChange(index, text)}
          theme={{ colors: { primary: '#20688d' } }}
        />
      </View>
    ));
  };

  render() {
    return (
      <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#F2F6FF' }}>
        <View style={{ marginBottom: 16 }}>
          <PaperTextInput
            style={{ marginBottom: 16, backgroundColor: '#F2F6FF', borderRadius: 2 }}
            label="Test Name"
            value={this.state.docName}
            onChangeText={this.handleDocNameChange}
            theme={{ colors: { primary: '#20688d' } }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <PaperTextInput
              style={{ flex: 1, marginRight: 8,  backgroundColor: '#F2F6FF', borderRadius: 2 }}
              label="Number of MCQs"
              value={this.state.numMCQs}
              onChangeText={this.handleNumMCQsChange}
              keyboardType="numeric"
              theme={{ colors: { primary: '#20688d' } }}
            />
            <Button
              mode="contained"
              onPress={this.handleNumMCQsSubmit}
              style={{ backgroundColor: '#20688d', borderRadius: 20 }}
              labelStyle={{ color: '#F2F6FF' }}
            >
              Submit
            </Button>
          </View>
        </View>

        {this.state.mcqs.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 16, fontSize: 16, fontWeight: 'bold' }}>
              {`Number of MCQs to enter: ${this.state.mcqs.length}`}
            </Text>
            {this.renderMCQInputs()}
            <View style={{ marginBottom: 16 }}>
              <Button
                mode="contained"
                onPress={this.handleUpload}
                style={{ backgroundColor: '#20688d', borderRadius: 20 }}
                labelStyle={{ color: '#F2F6FF' }}
              >
                Upload
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

export default MCQUpload;
