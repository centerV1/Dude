import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../Firestore';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';


const UserScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedRole, setEditedRole] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        const snapshot = await getDocs(usersCollectionRef);
        const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        Alert.alert('Error', 'Error fetching users');
        console.error('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      Alert.alert('Error', 'Error deleting user');
      console.error('Error deleting user: ', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditedRole(user.role);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, 'users', selectedUser.id), {
        name: editedName,
        email: editedEmail,
        role: editedRole
      });
      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === selectedUser.id ? { ...user, name: editedName, email: editedEmail, role: editedRole } : user))
      );
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Error updating user');
      console.error('Error updating user: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Users</Text>
      <View style={styles.box}>
      <ScrollView>
        {users.map((user, index) => (
            <TouchableOpacity key={index} style={styles.emailContainer} onPress={() => handleEditUser(user)}>
              <Text style={styles.emailText}>{user.email}</Text>
              <Ionicons name="trash-bin" size={24} color="red" onPress={() => handleDeleteUser(user.id)} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedName}
              onChangeText={text => setEditedName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editedEmail}
              onChangeText={text => setEditedEmail(text)}
            />
            <Picker
              selectedValue={editedRole}
              style={{height: 60, width: 300}}
              onValueChange={(itemValue, itemIndex) => setEditedRole(itemValue)}
            >
              <Picker.Item label="Admin" value="admin" />
              <Picker.Item label="User" value="user" />
            </Picker>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  label: {
    fontSize: 40,
    color: '#ffffff',
    position: 'absolute',
    top: 50,
    left: 20,
  },
  box: {
    width: 330,
    height: 400,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    width: 300,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
    marginTop: 90,
  },
  closeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 350,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
});

export default UserScreen;
