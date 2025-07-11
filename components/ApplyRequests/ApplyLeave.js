import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SelectList} from 'react-native-dropdown-select-list';
import {Calendar} from 'react-native-calendars';
import axios from 'axios';
import {MMKV} from 'react-native-mmkv'; // Import MMKV

const storage = new MMKV(); // Create an instance of MMKV

const ApplyLeave = ({leaveOpen, closeLeavePopup}) => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const leaveCategories = [
    'Annual Leave',
    'Sick Leave',
    'Casual Leave',
    'Medical Leave',
    'Other',
  ];
  const leaveCategoriesData = leaveCategories.map((category, index) => ({
    key: String(index),
    value: category,
  }));

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setNumberOfDays(diffDays);
    } else {
      setNumberOfDays(0);
    }
  }, [startDate, endDate]);

  const getCompanyCode = () => {
    try {
      const companyCode = storage.getString('companyCode');
      return companyCode;
    } catch (error) {
      console.error('Error getting company code from MMKV:', error);
      return null;
    }
  };

  const getEmployeeId = () => {
    try {
      const employeeId = storage.getString('employee_id');
      return employeeId;
    } catch (error) {
      console.error('Error getting employee ID from MMKV:', error);
      return null;
    }
  };

  const getAuthToken = () => {
    try {
      const authToken = storage.getString('userToken'); // Assuming you store it as 'userToken'
      return authToken;
    } catch (error) {
      console.error('Error getting auth token from MMKV:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!leaveType) {
      alert('Please select a leave type.');
      return;
    }
    if (!startDate) {
      alert('Please select a start date.');
      return;
    }
    if (!endDate) {
      alert('Please select an end date.');
      return;
    }

    const companyCode = getCompanyCode();
    const employeeId = getEmployeeId();
    const authToken = getAuthToken();

    if (!companyCode || !employeeId) {
      alert(
        'Could not retrieve company code or employee ID. Please ensure you are logged in.',
      );
      return;
    }

    // Find the selected leave type name based on the key
    const selectedLeave = leaveCategoriesData.find(
      item => item.key === leaveType,
    );
    const leaveTypeName = selectedLeave ? selectedLeave.value : '';

    const leaveRequestData = {
      start_date: startDate, // Use 'start_date' as the API expects
      end_date: endDate, // Use 'end_date' as the API expects
      leave_type: leaveTypeName, // Send the name of the leave type
      number_of_days: numberOfDays, // Use 'number_of_days' as the API expects
      reason: reason, // Use 'reason' as the API expects
      // companyCode, // You might not need to send these directly in the body if handled by the API via session/token
      // employeeId,  // Same as above
    };

    console.log('Sending Leave Request Data:', leaveRequestData);

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/request/leave`;
      const headers = authToken ? {Authorization: `Bearer ${authToken}`} : {};

      const response = await axios.post(apiUrl, leaveRequestData, {
        headers: headers,
      });

      console.log('API Response:', response.data);
      alert('Leave request submitted successfully!');
      closeLeavePopup(true);
      resetForm();
    } catch (error) {
      console.error('Error submitting leave application:', error);
      if (error.response) {
        console.error('API Error Response:', error.response.data);
        alert(
          `Failed to submit leave application: ${
            error.response.data.message || 'An error occurred.'
          }`,
        );
      } else if (error.request) {
        alert('Failed to submit leave application: No response from server.');
      } else {
        alert(
          'Failed to submit leave application: An unexpected error occurred.',
        );
      }
    } finally {
      setShowStartDateCalendar(false);
      setShowEndDateCalendar(false);
    }
  };

  const resetForm = () => {
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setReason('');
    setNumberOfDays(0);
    setShowStartDateCalendar(false);
    setShowEndDateCalendar(false);
  };

  const handleClose = () => {
    closeLeavePopup(false);
    resetForm();
  };

  const openStartDateCalendar = () => {
    setShowStartDateCalendar(true);
    setShowEndDateCalendar(false);
  };

  const openEndDateCalendar = () => {
    setShowEndDateCalendar(true);
    setShowStartDateCalendar(false);
  };

  return (
    <Modal visible={leaveOpen} transparent={true} animationType="fade">
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

            <Text style={styles.heading}>Apply for Leave</Text>
            <View style={styles.formContainer}>
              <SelectList
                data={leaveCategoriesData}
                setSelected={setLeaveType}
                placeholder="Select Leave Type"
                boxStyles={styles.selectListBox}
                dropdownStyles={styles.selectListDropdown}
                searchPlaceholder="Search Leave Type"
                marginBottom={15}
              />

              <TouchableOpacity
                style={styles.dateInput}
                onPress={openStartDateCalendar}>
                <Text style={styles.dateInputText}>
                  {startDate ? `Start Date: ${startDate}` : 'Select Start Date'}
                </Text>
                <Icon
                  name="calendar"
                  size={16}
                  color="gray"
                  style={styles.calendarIcon}
                />
              </TouchableOpacity>

              {showStartDateCalendar && (
                <Calendar
                  onDayPress={day => {
                    setStartDate(day.dateString);
                    setShowStartDateCalendar(false);
                    if (
                      endDate &&
                      new Date(day.dateString) > new Date(endDate)
                    ) {
                      setEndDate('');
                    }
                  }}
                  markedDates={
                    startDate
                      ? {
                          [startDate]: {
                            selected: true,
                            marked: true,
                            selectedColor: '#84c7ae',
                          },
                        }
                      : {}
                  }
                  style={styles.calendar}
                  maxDate={endDate ? endDate : undefined}
                />
              )}

              <TouchableOpacity
                style={styles.dateInput}
                onPress={openEndDateCalendar}>
                <Text style={styles.dateInputText}>
                  {endDate ? `End Date: ${endDate}` : 'Select End Date'}
                </Text>
                <Icon
                  name="calendar"
                  size={16}
                  color="gray"
                  style={styles.calendarIcon}
                />
              </TouchableOpacity>

              {showEndDateCalendar && (
                <Calendar
                  onDayPress={day => {
                    setEndDate(day.dateString);
                    setShowEndDateCalendar(false);
                    if (
                      startDate &&
                      new Date(day.dateString) < new Date(startDate)
                    ) {
                      setEndDate(startDate);
                    }
                  }}
                  markedDates={
                    endDate
                      ? {
                          [endDate]: {
                            selected: true,
                            marked: true,
                            selectedColor: '#84c7ae',
                          },
                        }
                      : {}
                  }
                  minDate={startDate ? startDate : undefined}
                  style={styles.calendar}
                />
              )}

              <Text style={styles.label}>Number of Days: {numberOfDays}</Text>

              <TextInput
                style={styles.textArea}
                placeholder="Reason for Leave"
                multiline
                numberOfLines={4}
                value={reason}
                onChangeText={setReason}
                marginBottom={15}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>
                  Submit Request
                </Text>
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
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  calendar: {
    marginBottom: 15,
    borderRadius: 10,
  },
  selectedDateText: {
    marginBottom: 10,
    fontSize: 16,
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
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  dateInputText: {
    fontSize: 16,
  },
  calendarIcon: {
    marginLeft: 10,
  },
});

export default ApplyLeave;
