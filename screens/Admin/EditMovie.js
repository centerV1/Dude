import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { db } from '../../Firestore';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const MovieScreen = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editedPic, setEditedPic] = useState('');
  const [editedName, setEditedName] = useState('');
  const [editedCat, setEditedCat] = useState('');
  const [editedTime, setEditedTime] = useState('');
  const [editedYear, setEditedYear] = useState('');
  const [editedCast, setEditedCast] = useState('');
  const [editedStory, setEditedStory] = useState('');
  const [editedWatch, setEditedWatch] = useState('');
  const [editedWatch2, setEditedWatch2] = useState('');
  const [editedWatch3, setEditedWatch3] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const moviesCollectionRef = collection(db, 'Movie');
        const snapshot = await getDocs(moviesCollectionRef);
        const moviesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMovies(moviesList);
      } catch (error) {
        Alert.alert('Error', 'Error fetching movies');
        console.error('Error fetching movies: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleDeleteMovie = async (movieId) => {
    try {
      await deleteDoc(doc(db, 'Movie', movieId));
      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    } catch (error) {
      Alert.alert('Error', 'Error deleting movie');
      console.error('Error deleting movie: ', error);
    }
  };

  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
    setEditedPic(movie.pic);
    setEditedName(movie.name);
    setEditedCat(movie.cat);
    setEditedTime(movie.time);
    setEditedYear(movie.year);
    setEditedCast(movie.cast);
    setEditedStory(movie.story);
    setEditedWatch(movie.watch);
    setEditedWatch2(movie.watch2);
    setEditedWatch3(movie.watch3);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, 'Movie', selectedMovie.id), {
        pic: editedPic,
        name: editedName,
        cat: editedCat,
        time: editedTime,
        year: editedYear,
        cast: editedCast,
        story: editedStory,
        watch: editedWatch,
        watch2: editedWatch2,
        watch3: editedWatch3,
      });
      setMovies(prevMovies =>
        prevMovies.map(movie => (movie.id === selectedMovie.id ? { ...movie, pic: editedPic, name: editedName, cat: editedCat, time: editedTime, year: editedYear, cast: editedCast, story: editedStory, watch: editedWatch, watch2: editedWatch2, watch3: editedWatch3 } : movie))
      );
      setSelectedMovie(null);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Error updating movie');
      console.error('Error updating movie: ', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Movies</Text>
      <View style={styles.box}>
        <ScrollView>
          {movies.map((movie, index) => (
            <TouchableOpacity key={index} style={styles.movieContainer} onPress={() => handleEditMovie(movie)}>
              <Text style={styles.movieText}>{movie.name}</Text>
              <Ionicons name="trash-bin" size={24} color="red" onPress={() => handleDeleteMovie(movie.id)} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {selectedMovie && (
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Pic URL"
                  value={editedPic}
                  onChangeText={text => setEditedPic(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={editedName}
                  onChangeText={text => setEditedName(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Category"
                  value={editedCat}
                  onChangeText={text => setEditedCat(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Duration"
                  value={editedTime}
                  onChangeText={text => setEditedTime(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Year"
                  value={editedYear}
                  onChangeText={text => setEditedYear(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Cast"
                  value={editedCast}
                  onChangeText={text => setEditedCast(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Story"
                  value={editedStory}
                  onChangeText={text => setEditedStory(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Watch URL"
                  value={editedWatch}
                  onChangeText={text => setEditedWatch(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Watch URL 2"
                  value={editedWatch2}
                  onChangeText={text => setEditedWatch2(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Watch URL 3"
                  value={editedWatch3}
                  onChangeText={text => setEditedWatch3(text)}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141231',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 40,
    color: '#ffffff',
    position: 'absolute',
    top: 50,
    left: 20,
  },
  box: {
    width: 330,
    height: 400,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
  },
  movieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  movieText: {
    fontSize: 16,
    color: '#000000',
  },
  formContainer: {
    marginTop: 20,
    width: 300,
  },
  input: {
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  closeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 350,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
});

export default MovieScreen;
