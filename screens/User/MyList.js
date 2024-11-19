import {StatusBar} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Button, Alert } from 'react-native';
import { getFirestore, collection, query, where, onSnapshot, deleteDoc, doc, getDocs } from "firebase/firestore";
import { app } from '../../Firestore';
import { getAuth } from 'firebase/auth';
import Info from '../../components/Info.js'; 
const db = getFirestore(app);
const auth = getAuth();

const MyList = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "MyList"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const dataList = [];
        querySnapshot.forEach((doc) => {
          dataList.push({ id: doc.id, ...doc.data() });
        });
        setData(dataList);
      }, (error) => {
        console.error("Error fetching real-time documents: ", error);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const removeFromMyListDocument = async (name) => {
    try {
      // Query for the document with the matching name
      const q = query(collection(db, "MyList"), where("name", "==", name), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;


        await deleteDoc(doc(db, "MyList", docId));

      } else {
        Alert.alert("Error", "Document not found in your list.");
      }
    } catch (e) {
      console.error("Error removing document: ", e);
      Alert.alert("Error", "Failed to remove document from your list.");
    }
  };

  const renderItem = ({ item }) => {
    console.log("Image URL:", item.pic);
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => setSelectedItem(item)}>
          <Image
            source={{ uri: item.pic }}
            style={styles.image}
          />
          <Text style={styles.itemText}>{item.name}</Text>
        </TouchableOpacity>
        <Button
          title="Remove"
          onPress={() => removeFromMyListDocument(item.name)}
          color="#ff0000"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {selectedItem ? (
        <Info item={selectedItem} onBack={() => setSelectedItem(null)} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.container}
        />
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
    resizeMode: 'cover',
    justifyContent: 'center',
    height: 190,
    width: 130,
  },
  itemText: {
    color: 'white',
    marginTop: 10,
    textAlign: 'center', 
  },
});

export default MyList;
