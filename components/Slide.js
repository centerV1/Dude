import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet } from 'react-native';

const Hs = ({ featuredMovie, handlePrev, handleNext, setSelectedItem }) => {
  return (
    <View style={styles.backgroundContainer}>
      <ImageBackground source={{ uri: featuredMovie.pic }} style={styles.featuredBackground}>
        <View style={styles.overlay} />
        <View style={styles.featuredContainer}>
          <TouchableOpacity onPress={handlePrev} style={styles.navigationButton}>
            <Text style={styles.navigationText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedItem(featuredMovie)} style={styles.featuredContent}>
            <Image source={{ uri: featuredMovie.pic }} style={styles.featuredImage} />
            <View style={styles.featuredDetails}>
              <Text style={styles.featuredTitle}>{featuredMovie.name}</Text>
              <Text style={styles.featuredDescription}>{featuredMovie.cat}</Text>
              <Text style={styles.featuredDescription}>⏱️ {featuredMovie.time}</Text>
              <Text style={styles.featuredDescription}>📅 {featuredMovie.year}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={[styles.navigationButton, styles.nextButton]}>
            <Text style={styles.navigationText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    position: 'relative',
  },
  featuredBackground: {
    width: '100%',
    height: 'auto',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
  },
  featuredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  navigationButton: {
    padding: 10,
  },
  navigationText: {
    color: 'white',
    fontSize: 30,
  },
  nextButton: {
    marginLeft: 'auto',
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featuredImage: {
    width: 170,
    height: 250,
    resizeMode: 'cover',
    marginRight: 20,
  },
  featuredDetails: {
    flex: 1,
  },
  featuredTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featuredDescription: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Hs;
