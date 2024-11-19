import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../Firestore'; // Correct import according to your project structure
import { Accelerometer } from 'expo-sensors';
import { collection, getDocs } from 'firebase/firestore';

export default function EditUser({ navigation }) {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [randomMovie, setRandomMovie] = useState(null);

  const Logout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); 
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Error signing out: " + error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieCollection = await getDocs(collection(db, 'Movie'));
        const movies = movieCollection.docs.map(doc => doc.data());
        setData(movies);
      } catch (error) {
        console.error("Error fetching movies: ", error);
      }
    };
    fetchData();
  }, []);

  const handleShake = () => {
    if (data.length === 0) return;

    const randomIndex = Math.floor(Math.random() * data.length);
    const randomMovie = data[randomIndex];
    setRandomMovie(randomMovie);
    setModalVisible(true);
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(400);
    const subscription = Accelerometer.addListener(accelerometerData => {
      const totalForce = Math.sqrt(
        accelerometerData.x * accelerometerData.x +
        accelerometerData.y * accelerometerData.y +
        accelerometerData.z * accelerometerData.z
      );

      if (totalForce > 1.75) { // Adjust threshold as needed
        handleShake();
      }
    });

    return () => subscription && subscription.remove();
  }, [data]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.shakeArea} onPress={handleShake}>
      <View style={styles.box}>
        <Image
          source={require('../../assets/Shakephone.png')} // Adjust the path to your image
          style={styles.phoneIcon}
        />
        <Text style={styles.shakeText}>
          <Text style={styles.shakeTextRed}>shake your </Text>
          <Text style={styles.shakeTextBlue}>phone!!</Text>
        </Text>
      </View>
    </TouchableOpacity>
  
    {randomMovie && (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Image
              source={{ uri: randomMovie.pic }}
              style={styles.modalImage}
            />
            <Text style={styles.modalText}>{randomMovie.name}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Image
                source={require('../../assets/iconsX.png')} // Adjust the path to your icon image
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )}
  </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a001f',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  shakeArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  phoneIcon: {
    width: 250,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  shakeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shakeTextRed: {
    color: 'red',
  },
  shakeTextBlue: {
    color: '#00cefc',
  },
  logoutButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 30,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 37,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: 200,
    height: 300,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // ให้ไอคอนอยู่บนสุด
  },
  
  closeIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  
});