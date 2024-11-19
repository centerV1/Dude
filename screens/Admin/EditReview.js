import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { db } from '../../Firestore'; // Import the initialized Firestore instance
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import Firestore functions

const ReviewScreen = () => {
  const [userEmails, setUserEmails] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchUserEmails = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        const snapshot = await getDocs(usersCollectionRef);
        const emails = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserEmails(emails);
      } catch (error) {
        console.error('Error fetching user emails: ', error);
      }
    };

    fetchUserEmails();
  }, []);

  const fetchReviews = async (userId) => {
    try {
      const reviewsCollectionRef = collection(db, 'Reviews');
      const snapshot = await getDocs(reviewsCollectionRef);
      const userReviews = snapshot.docs
        .filter(doc => doc.data().userId === userId)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(userReviews);
    } catch (error) {
      console.error('Error fetching reviews: ', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, 'Reviews', reviewId));
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>User Reviews</Text>

      
      <ScrollView style={styles.emailList}>
        {userEmails.map(user => (
          <View key={user.id}>
            <TouchableOpacity
              style={styles.emailButton}
              onPress={() => {
                setSelectedUser(user.id);
                fetchReviews(user.id);
              }}
            >
              <Text style={styles.emailText}>{user.email}</Text>
            </TouchableOpacity>
            {selectedUser === user.id && (
              <ScrollView style={styles.reviewList}>
                {reviews.map(review => (
                  <View key={review.id} style={styles.reviewContainer}>
                    <Text style={styles.reviewText}>{review.review}</Text>
                    <TouchableOpacity onPress={() => handleDeleteReview(review.id)} style={styles.deleteButton}>
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        ))}
      </ScrollView>
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
  label:  {
    fontSize: 40,
    color: '#ffffff',
    position: 'absolute',
    top: 50,
    left: 20,
  },
  emailList: {
    width: '90%',
    marginTop: 120,

  },
  emailButton: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  emailText: {
    fontSize: 16,
    color: '#000000',
  },
  reviewList: {
    width: '90%',

  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    
  },
  reviewText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default ReviewScreen;
