import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, SafeAreaView, Alert, ScrollView } from 'react-native';
import { getFirestore, collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { app } from '../Firestore'; // Ensure this path is correct based on your project structure
import { getAuth } from 'firebase/auth';
import Review from './Review';  // Import the Review component

const db = getFirestore(app);
const auth = getAuth();

const Info = ({ item, onBack }) => {
  const user = auth.currentUser;
  const [sameCategoryMovies, setSameCategoryMovies] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchSameCategoryMovies();
  }, []);

  const fetchSameCategoryMovies = async () => {
    try {
      const q = query(collection(db, "Movies"), where("cat", "==", item.cat));
      const querySnapshot = await getDocs(q);
      const moviesList = [];
      querySnapshot.forEach((doc) => {
        moviesList.push({ id: doc.id, ...doc.data() });
      });
      setSameCategoryMovies(moviesList);
    } catch (error) {
      console.error("Error fetching same category movies: ", error);
    }
  };

  const addToMyList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "MyList"));
      let movieExists = false;
      let maxIndex = 0;
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid && data.id === item.id) {
          movieExists = true;
        }
        const docId = doc.id;
        const match = docId.match(/document(\d+)/);
        if (match) {
          const currentIndex = parseInt(match[1], 10);
          if (currentIndex > maxIndex) {
            maxIndex = currentIndex;
          }
        }
      });
  
      if (movieExists) {
        Alert.alert("Notice", "This movie is already in your list.");
        return;
      }
  
      const newDocId = `document${maxIndex + 1}`;
  
      await setDoc(doc(db, "MyList", newDocId), {
        userId: user.uid,
        ...item
      });
  
      Alert.alert("Success", "Movie added to your list!");
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "Failed to add movie to your list.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Button title="Go Back" onPress={onBack} color="#f0f8ff" />
            <Button title="Add to My List" onPress={addToMyList} color="#006ee7" />
          </View>
          <View style={styles.detailContainer}>
            <Image source={{ uri: item.pic }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>{item.name}</Text>
              <Text style={styles.descriptionText}>{item.year}</Text>
              <Text style={styles.descriptionText}>🎬{item.cat}</Text>
              <Text style={styles.descriptionText}>🌟 {averageRating.toFixed(1)*2}/10</Text>
              <Text style={styles.descriptionText}>⏱️ {item.time}</Text>
              <Text style={styles.descriptionText}><Text style={styles.boldText}>WatchNow</Text></Text>
              <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: item.watch }} style={styles.watchimage} />
                <Image source={{ uri: item.watch2 }} style={styles.watchimage} />
                <Image source={{ uri: item.watch3 }} style={styles.watchimage} />
                <Image source={{ uri: item.watch4 }} style={styles.watchimage} />
              </View>
            </View>
          </View>
          <Text style={styles.storylineText}><Text style={styles.boldText}>CAST</Text>{'\n'}{item.cast}</Text>
          <Text style={styles.storylineText}><Text style={styles.boldText}>Storyline</Text>{'\n'}{item.story}</Text>
        </View>

        {/* Use the Review component */}
        <Review itemId={item.id} onAverageRatingChange={setAverageRating} />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070420',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  image: {
    width: 150,
    height: 225,
    resizeMode: 'contain',
  },
  watchimage: {
    width: 28,
    height: 28,
    borderRadius: 8,
    marginLeft: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  titleText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  descriptionText: {
    color: 'white',
    fontSize: 18,
    marginVertical: 5,
  },
  storylineText: {
    color: 'white',
    fontSize: 18,
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default Info;
