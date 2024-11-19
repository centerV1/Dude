import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { app } from '../../Firestore';
import { Picker } from '@react-native-picker/picker';

const db = getFirestore(app);
const auth = getAuth(app);

const Admin = ({ navigation }) => {
  const [pic, setPic] = useState('');
  const [name, setName] = useState('');
  const [cat, setCat] = useState('');
  const [time, setTime] = useState('');
  const [year, setYear] = useState('');
  const [cast, setCast] = useState('');
  const [story, setStory] = useState('');
  const [watch, setWatch] = useState('');
  const [watch2, setWatch2] = useState('');
  const [watch3, setWatch3] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const clearFields = () => {
    setPic('');
    setName('');
    setCat('');
    setTime('');
    setYear('');
    setCast('');
    setStory('');
    setWatch('');
    setWatch2('');
    setWatch3('');
  };

  const validateFields = () => {
    return pic && name && cat && time && year && cast && story && watch && watch2 && watch3;
  };

  const addDataToFirestore = async () => {
    if (!validateFields()) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "Movie"), {
        pic: pic,
        name: name,
        cat: cat,
        time: time,
        year: year,
        cast: cast,
        story: story,
        watch: watch,
        watch2: watch2,
        watch3: watch3,
      });
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Success", `Document successfully created with ID: ${docRef.id}`);
      clearFields();
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "Error adding document: " + e.message);
    }
  };

  const Logout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Error signing out: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Movie</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPic}
          value={pic}
          placeholder="Enter Movie Picture URL"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="Enter Movie Name"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker(!showPicker)}
        >
          <Text style={[styles.pickerText, cat ? styles.selectedPickerText : styles.placeholderText]}>
            {cat ? cat : "Select Category"}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <Picker
            selectedValue={cat}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setCat(itemValue);
              setShowPicker(false);
            }}
          >
            <Picker.Item label="Action" value="Action" />
            <Picker.Item label="Comedy" value="Comedy" />
            <Picker.Item label="Drama" value="Drama" />
            <Picker.Item label="Horror" value="Horror" />
            <Picker.Item label="Romance" value="Romance" />
          </Picker>
        )}
        <TextInput
          style={styles.input}
          onChangeText={setTime}
          value={time}
          placeholder="Enter Movie Duration"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          onChangeText={setYear}
          value={year}
          placeholder="Enter Release Year"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          onChangeText={setCast}
          value={cast}
          placeholder="Enter Movie Cast"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          onChangeText={setStory}
          value={story}
          placeholder="Enter Movie Storyline"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          onChangeText={setWatch}
          value={watch}
          placeholder="Enter Where to Watch"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          onChangeText={setWatch2}
          value={watch2}
          placeholder="Enter Where to Watch"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          onChangeText={setWatch3}
          value={watch3}
          placeholder="Enter Where to Watch"
          placeholderTextColor="#aaa"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={addDataToFirestore}
          >
            <Text style={styles.saveButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={Logout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070420',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    position: 'absolute',
    top: 50,
    left: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 100, // Enough padding to avoid the title overlap
    paddingBottom: 150, // Enough padding to avoid the buttons overlap
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '100%',
  },
  picker: {
    height: 150,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerText: {
    color: '#333',
  },
  selectedPickerText: {
    color: '#000',
  },
  placeholderText: {
    color: '#aaa',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
    bottom: 70,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Admin;
