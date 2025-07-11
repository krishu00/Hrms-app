import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback, // Import TouchableWithoutFeedback
} from 'react-native';
import axios from 'axios';
import ApplyLeave from '../ApplyRequests/ApplyLeave';
import WorkFromHome from '../ApplyRequests/WorkFromHome';
import NewAssets from '../ApplyRequests/NewAssets';
import RepairAssets from '../ApplyRequests/RepairAssets';
import RequestToHr from '../ApplyRequests/RequestToHr';

const {height} = Dimensions.get('window');

export default function RequestedByYou() {
  const [requestedData, setRequestedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const optionsHeight = 300;
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isWorkFromHomeOpen, setIsWorkFromHomeOpen] = useState(false);
  const [isNewAssetOpen, setIsNewAssetOpen] = useState(false);
  const [isRepairAssetOpen, setIsRepairAssetOpen] = useState(false);
  const [isHrRequestOpen, setIsHrRequestOpen] = useState(false);
  const fetchRequestedData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/request/get_all_requested_by_me`,
      );
      if (response.data && response.data.data) {
        setRequestedData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching requested data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequestedData();
  }, [fetchRequestedData]);

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const toggleOptions = () => {
    setIsOptionsVisible(!isOptionsVisible);
    Animated.timing(slideAnim, {
      toValue: isOptionsVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleOptionSelect = option => {
    console.log('Selected option:', option);
    toggleOptions();
    if (option === 'Leaves') {
      setIsLeaveOpen(true);
    } else if (option === 'Work From Home') {
      setIsWorkFromHomeOpen(true);
    } else if (option === 'Assets') {
      setIsNewAssetOpen(true);
    } else if (option === 'Repair Assets') {
      setIsRepairAssetOpen(true);
    } else if (option === 'HR Request') {
      setIsHrRequestOpen(true);
    }
  };

  const closeLeavePopup = shouldRefresh => {
    setIsLeaveOpen(false);
    if (shouldRefresh) {
      fetchRequestedData();
    }
  };

  const closeWorkFromHomePopup = shouldRefresh => {
    setIsWorkFromHomeOpen(false);
    if (shouldRefresh) {
      fetchRequestedData();
    }
  };
  const closeNewAssetPopup = shouldRefresh => {
    setIsNewAssetOpen(false);
    if (shouldRefresh) {
      fetchRequestedData();
    }
  };
  const closeRepairAssetPopup = shouldRefresh => {
    setIsRepairAssetOpen(false);
    if (shouldRefresh) {
      fetchRequestedData();
    }
  };
  const closeHrRequestPopup = shouldRefresh => {
    setIsHrRequestOpen(false);
    if (shouldRefresh) {
      fetchRequestedData();
    }
  };

  const handleScreenPress = () => {
    if (isOptionsVisible) {
      toggleOptions();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View style={styles.applied_main_container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView style={styles.tableScrollView}>
            <View style={styles.tableContainer}>
              <View style={styles.headerRow}>
                <Text style={[styles.headerCellSNo,styles.headerText]}>S.No</Text>
                <Text style={[styles.headerCellRequestor,styles.headerText]}>Request Type</Text>
                <Text style={[styles.headerCellReason,styles.headerText]}>Reason</Text>
                <Text style={[styles.headerCellStatus,styles.headerText]}>Status</Text>
              </View>
              {requestedData.map((item, index) => (
                <View
                  key={item._id}
                  style={index % 2 === 0 ? styles.dataRow : styles.dataRowEven}>
                  <Text style={[styles.dataCellSNo,styles.tableTest]}>{index + 1}</Text>
                  <Text style={[styles.dataCellRequestor,styles.tableTest]}>
                    {item.request_type}
                  </Text>
                  <Text style={[styles.dataCellReason,styles.tableTest]}>{item.reason}</Text>
                  <Text style={[styles.dataCellStatus,styles.tableTest]}>
                    {item.completed_or_not ? 'Completed' : 'Pending'}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        <Animated.View
          style={[
            styles.optionsContainer,
            {
              height: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, optionsHeight],
              }),
              bottom: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-optionsHeight, 60],
              }),
            },
          ]}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionSelect('Leaves')}>
            <Text style={styles.optionText}>Leaves</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionSelect('Work From Home')}>
            <Text style={styles.optionText}>Work From Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionSelect('Assets')}>
            <Text style={styles.optionText}>Assets</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionSelect('Repair Assets')}>
            <Text style={styles.optionText}>Repair Assets</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionSelect('HR Request')}>
            <Text style={styles.optionText}>HR Request</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionSelect('Regularization')}>
            <Text style={styles.optionText}>Regularization</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.applyButton} onPress={toggleOptions}>
          <Text style={styles.applyButtonText}>Apply For</Text>
        </TouchableOpacity>

        <ApplyLeave
          leaveOpen={isLeaveOpen}
          closeLeavePopup={closeLeavePopup}
          onLeaveApplied={fetchRequestedData}
        />
        <WorkFromHome
          wfhOpen={isWorkFromHomeOpen}
          closeWFHPopup={closeWorkFromHomePopup}
          onWorkFromHomeApplied={fetchRequestedData}
        />
        <NewAssets
          visible={isNewAssetOpen}
          onClose={closeNewAssetPopup}
          onAssetApplied={fetchRequestedData}
        />
        <RepairAssets
          visible={isRepairAssetOpen}
          onClose={closeRepairAssetPopup}
          onAssetApplied={fetchRequestedData}
        />
        <RequestToHr
          visible={isHrRequestOpen}
          onClose={closeHrRequestPopup}
          onHrRequestApplied={fetchRequestedData}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  applied_main_container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  tableScrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  tableContainer: {    
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingBottom: 100,
  },    
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#e0f2e7',
    paddingVertical: 10,
  },
  headerCellSNo: {
    width: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  headerCellRequestor: {
    flex: 2,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  headerCellReason: {
    flex: 3,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  headerCellStatus: {
    flex: 2,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  dataCellSNo: {
    width: 50,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  dataCellRequestor: {
    flex: 2,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },

  dataCellReason: {
    flex: 3,
    display: 'block',
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  dataCellStatus: {
    flex: 2,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dataRowEven: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  applyButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#84c7ae',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },  headerText: {  
    color: "black", 
    fontWeight: "bold", 
},
tableTest:{
 color: "#A0A5A8", 
    fontWeight: "bold", 
},
});
