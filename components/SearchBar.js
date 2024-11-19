import React from 'react';
import { SearchBar } from 'react-native-elements';
import { StyleSheet } from 'react-native';

const Search = ({ search, updateSearch }) => {
  return (
    <SearchBar
      placeholder="Search Movies..."
      onChangeText={updateSearch}
      value={search}
      containerStyle={styles.searchBarContainer}
      inputContainerStyle={styles.searchBarInput}
      lightTheme
      round
    />
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: '#070420',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInput: {
    backgroundColor: '#fff',
  },
});

export default Search;
