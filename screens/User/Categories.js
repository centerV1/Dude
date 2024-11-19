import {StatusBar} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from '../../Firestore'; // Ensure this path is correct based on your project structure
import Info from '../../components/Info.js'; // Ensure the path is correct based on your project structure
import Cat from '../../components/Cat.js'; // Ensure the path is correct based on your project structure

const db = getFirestore(app);

const Categories = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState(''); // State for current filter

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Movie"), (querySnapshot) => {
      const dataList = [];
      querySnapshot.forEach((doc) => {
        dataList.push({ id: doc.id, ...doc.data() });
      });
      setData(dataList);
      setFilteredData(dataList); // Initially show all data
    }, (error) => {
      console.error("Error fetching real-time documents: ", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (filter) {
      setFilteredData(data.filter(item => item.cat === filter));
    } else {
      setFilteredData(data); // Show all data if no filter is selected
    }
  }, [filter, data]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedItem(item)} style={styles.itemContainer}>
      <Image
        source={{ uri: item.pic }}
        style={styles.image}
      />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {selectedItem ? (
        <Info item={selectedItem} onBack={() => setSelectedItem(null)} />
      ) : (
        <View style={styles.container}>
          <Cat setFilter={setFilter} />
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
          />
        </View>
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
    flex: 1,
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
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

export default Categories;