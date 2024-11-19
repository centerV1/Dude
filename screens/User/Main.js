import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Icon component
import RandomScreen from './Random.js';
import CategoriesScreen from './Categories.js';
import HomeScreen from './Home.js';
import MyListScreen from './MyList.js';
import ProfileScreen from './Profile.js';

const Tab = createBottomTabNavigator();

export default function AssetExample() {
  return (
    <View style={styles.container}>
      <MyTabs />
    </View>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              size = 35; // Set fixed size for Home icon
              break;
            case 'Categories':
              iconName = 'list';
              break;
            case 'MyList':
              iconName = 'bookmark';
              break;
            case 'Random':
              iconName = 'shuffle';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
              break;
          }

          return (
            <View style={focused ? styles.iconFocused : styles.icon}>
              <Icon name={iconName} size={size} color={color} />
            </View>
          );
        },
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#070420',
          height: 70, // Increase height of the tab bar
          borderTopWidth: 0,
          paddingBottom: 10, // Add padding to align icons
        },
      })}
    >

      <Tab.Screen name="Random" component={RandomScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="MyList" component={MyListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#070420',
    flex: 1,
  },
  icon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  iconFocused: {
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});

