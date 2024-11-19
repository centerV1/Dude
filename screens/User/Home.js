import {StatusBar} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from '../../Firestore'; // Ensure this path is correct based on your project structure
import Info from '../../components/Info.js'; // Ensure the path is correct based on your project structure
import Search from '../../components/SearchBar.js';
import Hs from '../../components/Slide.js'; // Import Hs component

const db = getFirestore(app);

const Home = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // State to handle current index for featured movie

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Movie"), (querySnapshot) => {
      const dataList = [];
      querySnapshot.forEach((doc) => {
        dataList.push({ id: doc.id, ...doc.data() });
      });
      setData(dataList);
      setFilteredData(dataList);

      if (dataList.length > 0) {
        setCurrentIndex(0); // Set the first movie as the featured movie
      }
    }, (error) => {
      console.error("Error fetching real-time documents: ", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredData.length);
    }, 50000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [filteredData]);

  const updateSearch = (searchText) => {
    setSearch(searchText);
    if (searchText) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().startsWith(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredData.length) % filteredData.length);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedItem(item)} style={styles.itemContainer}>
      <Image
        source={{ uri: item.pic }}
        style={styles.image}
      />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const featuredMovie = filteredData[currentIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      {selectedItem ? (
        <Info item={selectedItem} onBack={() => setSelectedItem(null)} />
      ) : (
        <ScrollView>
          <Search search={search} updateSearch={updateSearch} />
          {!search && featuredMovie && (
            <Hs 
              featuredMovie={featuredMovie} 
              handlePrev={handlePrev} 
              handleNext={handleNext} 
              setSelectedItem={setSelectedItem}
            />
          )}
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.container}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070420',
    marginTop: StatusBar.currentHeight || 0,
  },
  container: {
    padding: 20,
  },
  itemContainer: {
    flex: 1,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  itemText: {
    color: 'white',
    marginTop: 10,
  },
});

export default Home;
