import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import axios from 'axios';
import {MMKV} from 'react-native-mmkv';
import {SelectList} from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/FontAwesome';

const storage = new MMKV();

const RepairAssets = ({onClose, visible}) => {
  const [newAssetData, setNewAssetData] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([
    'Mobile',
    'Television',
    'Radio',
    'Smart Watch',
    'Others',
  ]);

  const getCompanyCode = () => {
    try {
      return storage.getString('companyCode');
    } catch (error) {
      console.error('Error getting company code from MMKV:', error);
      return null;
    }
  };

  const getEmployeeId = () => {
    try {
      return storage.getString('employee_id');
    } catch (error) {
      console.error('Error getting employee ID from MMKV:', error);
      return null;
    }
  };

  const getAuthToken = () => {
    try {
      return storage.getString('userToken');
    } catch (error) {
      console.error('Error getting auth token from MMKV:', error);
      return null;
    }
  };
  const resetForm = () => {
    setNewAssetData({});
    setInputValue('');
  };
  const handleInputChange = (name, value) => {
    setInputValue(value);
    setNewAssetData(old => ({
      ...old,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const companyCode = getCompanyCode();
    const employeeId = getEmployeeId();
    const authToken = getAuthToken();

    if (!companyCode || !employeeId || !authToken) {
      alert(
        'Could not retrieve company code, employee ID, or auth token. Please ensure you are logged in.',
      );
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/request/repair_asset`,
        newAssetData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      alert('Repairing Asset application submitted successfully!');
      onClose(true);
      resetForm();
    } catch (error) {
      console.error('Error submitting Repairing Asset application:', error);
      alert('Failed to submit Repairing Asset application. Please try again.');
    }
  };

  const assetCategoriesData = options.map((category, index) => ({
    key: String(index),
    value: category,
  }));
  const handleClose = () => {
    onClose(false);
    resetForm();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.crossIcon}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}>
                <Icon name="times" size={30} color="gray" />
              </TouchableOpacity>
            </View>

            <Text style={styles.heading}>RepairAsset Request</Text>
            <View style={styles.formContainer}>
              <SelectList
                data={assetCategoriesData}
                setSelected={selected =>
                  handleInputChange('selected_asset', selected)
                }
                placeholder="Select Asset Type"
                boxStyles={styles.selectListBox}
                dropdownStyles={styles.selectListDropdown}
                searchPlaceholder="Search Asset Type"
                marginBottom={15}
              />

              <TextInput
                style={styles.textArea}
                placeholder="Describe your issue"
                multiline
                numberOfLines={4}
                value={newAssetData.reason}
                onChangeText={text => handleInputChange('reason', text)}
                marginBottom={15}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '95%',
  },
  crossIcon: {
    position: 'absolute',
    top: -10,
    right: 5,
    zIndex: 2,
    padding: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  formContainer: {
    alignItems: 'stretch',
  },
  selectListBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  selectListDropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 4,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
    height: 120,
  },
  submitButton: {
    backgroundColor: '#84c7ae',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: -15,
    padding: 10,
    borderRadius: 5,
  },
});

export default RepairAssets;
