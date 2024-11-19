import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Icon component
import AdminScreen from './Admin.js';
import EditUserScreen from './EditUser.js';
import EditMovieScreen from './EditMovie.js';
import EditReviewScreen from './EditReview.js';

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
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Admin':
              iconName = 'settings';
              break;
            case 'EditUser':
              iconName = 'person';
              break;
            case 'EditMovie':
              iconName = 'film';
              break;
            case 'EditReview':
              iconName = 'create'; // Icon for EditReview
              break;
            default:
              iconName = 'circle';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#070420',
        },
      })}
    >
      <Tab.Screen name="Admin" component={AdminScreen} />
      <Tab.Screen name="EditUser" component={EditUserScreen} />
      <Tab.Screen name="EditMovie" component={EditMovieScreen} />
      <Tab.Screen name="EditReview" component={EditReviewScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#070420',
    flex: 1,
  },
});
