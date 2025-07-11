import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Modal} from 'react-native';

const DisplayTotalLeaves = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to toggle the modal visibility
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      {/* Touchable to show the modal */}
      <TouchableOpacity style={styles.section} onPress={toggleModal}>
        <Text style={styles.sectionTitle}>Leaves</Text>
        <Text style={styles.sectionValue}>3.75</Text>
        <Text style={styles.sectionDetails}>Leaves Taken: 0</Text>
      </TouchableOpacity>

      {/* Modal for displaying leave details */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            {/* Leaves Boxes */}
            <View style={styles.leaveBox}>
              <Text style={styles.leaveTitle}>LOP</Text>
              <Text style={styles.leaveValue}>360</Text>
            </View>
            <View style={styles.leaveBox}>
              <Text style={styles.leaveTitle}>Annual Leave</Text>
              <Text style={styles.leaveValue}>4</Text>
            </View>
            <View style={styles.leaveBox}>
              <Text style={styles.leaveTitle}>Sick Leave</Text>
              <Text style={styles.leaveValue}>0</Text>
            </View>
            {/* Close button */}
            <TouchableOpacity   style={styles.punchButton} onPress={toggleModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DisplayTotalLeaves;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  section: {
    alignItems: 'center',
    width:'100%'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f4062',
    marginBottom: 10,
  },
  sectionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6a9689', // Light green color for the number
    marginBottom: 10,
  },
  sectionDetails: {
    fontSize: 14,
    color: '#6a9689',
    textAlign: 'center',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  punchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a8d7c5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,   
    fontWeight: 'bold',
  },
  leaveBox: {
    display:'flex',
    flexDirection:'row',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
  },
  leaveTitle: {
    width:'50%',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft:10,
    color:'#1f4062'
  },
  leaveValue: {
    width:'50%',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6a9689',
    textAlign: 'center',
     },
});
