
import React from 'react';
import { ScrollView, Button, StyleSheet } from 'react-native';

const Cat = ({ setFilter }) => {
  return (
    <ScrollView horizontal style={styles.buttonContainer} showsHorizontalScrollIndicator={false}>
      <Button title="Action" onPress={() => setFilter('Action')} color="#006ee7" />
      <Button title="Drama" onPress={() => setFilter('Drama')} color="#006ee7" />
      <Button title="Sci-Fi" onPress={() => setFilter('Sci-Fi')} color="#006ee7" />
      <Button title="Comedy" onPress={() => setFilter('Comedy')} color="#006ee7" />
      <Button title="Horror" onPress={() => setFilter('Horror')} color="#006ee7" />
      <Button title="All" onPress={() => setFilter('')} color="#006ee7" />
    </ScrollView>
  );
};

/* 

 /\_/\  
( o.o ) 
 > ^ <
 
*/

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});

export default Cat;

