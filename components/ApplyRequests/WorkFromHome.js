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
import {Calendar} from 'react-native-calendars';
import axios from 'axios';
import {MMKV} from 'react-native-mmkv'; // Import MMKV

const storage = new MMKV(); // Create an instance of MMKV

const WorkFromHome = ({wfhOpen, closeWFHPopup}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);

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

    const wfhRequestData = {
      start_date: startDate,
      end_date: endDate,
      number_of_days: numberOfDays,
      reason: reason,
    };

    console.log('Sending Work From Home Request Data:', wfhRequestData);

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/request/work_from_home`;
      const headers = authToken ? {Authorization: `Bearer ${authToken}`} : {};

      const response = await axios.post(apiUrl, wfhRequestData, {
        headers: headers,
      });

      console.log('API Response:', response.data);
      alert('Work from home request submitted successfully!');
      closeWFHPopup(true);
      resetForm();
    } catch (error) {
      console.error('Error submitting work from home application:', error);
      if (error.response) {
        console.error('API Error Response:', error.response.data);
        alert(
          `Failed to submit work from home application: ${
            error.response.data.message || 'An error occurred.'
          }`,
        );
      } else if (error.request) {
        alert(
          'Failed to submit work from home application: No response from server.',
        );
      } else {
        alert(
          'Failed to submit work from home application: An unexpected error occurred.',
        );
      }
    } finally {
      setShowStartDateCalendar(false);
      setShowEndDateCalendar(false);
    }
  };

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setReason('');
    setNumberOfDays(0);
    setShowStartDateCalendar(false);
    setShowEndDateCalendar(false);
  };

  const handleClose = () => {
    closeWFHPopup(false);
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
    <Modal visible={wfhOpen} transparent={true} animationType="fade">
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

            <Text style={styles.heading}>W.F.H Request</Text>
            <View style={styles.formContainer}>
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
                placeholder="Reason for Work From Home"
                multiline
                numberOfLines={4}
                value={reason}
                onChangeText={setReason}
                marginBottom={15}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit Request</Text>
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

export default WorkFromHome;
