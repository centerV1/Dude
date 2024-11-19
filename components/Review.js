import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, query, where } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const db = getFirestore();
const auth = getAuth();

const Review = ({ itemId, onAverageRatingChange }) => {
  const user = auth.currentUser;
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchReviews();
    fetchUsername();
  }, []);

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, "Reviews"), where("itemId", "==", itemId));
      const querySnapshot = await getDocs(q);
      const reviewsList = [];
      let totalRating = 0;
      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();
        reviewsList.push(reviewData);
        totalRating += reviewData.rating;
      });
      setReviews(reviewsList);
      if (reviewsList.length > 0) {
        const avgRating = totalRating / reviewsList.length;
        setAverageRating(avgRating);
        onAverageRatingChange(avgRating);
      } else {
        setAverageRating(0);
        onAverageRatingChange(0);
      }
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    }
  };

  const fetchUsername = async () => {
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.name);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    }
  };

  const handleReviewSubmit = async () => {
    if (!review || rating === 0) {
      Alert.alert("Error", "Please enter a review and select a rating.");
      return;
    }

    const newReview = {
      userId: user.uid,
      username: username, // use fetched username
      review,
      rating,
      itemId: itemId,
      timestamp: new Date()
    };

    try {
      await setDoc(doc(collection(db, "Reviews")), newReview);
      Alert.alert("Success", "Review added!");
      setReview('');
      setRating(0);
      fetchReviews();
    } catch (e) {
      console.error("Error adding review: ", e);
      Alert.alert("Error", "Failed to add review.");
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <View style={styles.starsContainer}>
        {[...Array(fullStars)].map((_, index) => (
          <Icon key={`full-${index}`} name="star" size={24} color="orange" />
        ))}
        {halfStar && <Icon key="half" name="star-half" size={24} color="orange" />}
        {[...Array(emptyStars)].map((_, index) => (
          <Icon key={`empty-${index}`} name="star-o" size={24} color="orange" />
        ))}
      </View>
    );
  };

  return (
    <View>
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Leave a Review</Text>
        <TextInput
          style={styles.reviewInput}
          placeholder="Write your review"
          value={review}
          onChangeText={setReview}
        />
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Rating:</Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Icon name={rating >= star ? "star" : "star-o"} size={24} color="orange" />
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Submit Review" onPress={handleReviewSubmit} color="#006ee7" />
      </View>

      <View style={styles.reviewList}>
        <Text style={styles.reviewTitle}>Reviews</Text>
        <View style={styles.averageRatingContainer}>
          <Text style={styles.averageRatingText}>{averageRating.toFixed(1)}</Text>
          {renderStars(averageRating)}
          <Text style={styles.ratingCount}>{reviews.length} Ratings</Text>
        </View>
        {reviews.map((review, index) => (
          <View key={index} style={styles.reviewItem}>
            <Text style={styles.reviewUser}>{review.username}</Text>
            <Text style={styles.reviewText}>{review.review}</Text>
            <View style={styles.ratingContainer}>{renderStars(review.rating)}</View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewSection: {
    padding: 20,
  },
  reviewTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    color: 'white',
    marginRight: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  reviewList: {
    padding: 20,
  },
  reviewItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  reviewUser: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reviewText: {
    marginBottom: 5,
  },
  averageRatingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  averageRatingText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  ratingCount: {
    fontSize: 16,
  },
});

export default Review;
