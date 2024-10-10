import React, { useRef, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const FilterOptions = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedRequestType, setSelectedRequestType] = useState('All Requests');
  const [selectedRequestStatus, setSelectedRequestStatus] = useState('All status');
  const bottomSheetModalRef = useRef(null);

  // Snap Points at 45% and 100% screen height
  const snapPoints = ['45%', '80%'];

  const handleFilterClick = filter => {
    setActiveFilter(filter);
    bottomSheetModalRef.current?.present(); // Open the modal at its initial snap point
  };

  const handleRequestTypeSelect = type => {
    setSelectedRequestType(type);
  };

  const handleRequestStatusSelect = status => {
    setSelectedRequestStatus(status);
  };

  // Define request types
  const requestTypes = [
    'All Requests',
    'Leave',
    'Regularisation',
    'Work From Home',
    'On Duty',
    'Comp-Off',
    'Short Leave',
    'Restricted Holiday',
    'Expense',
    'Resignation',
  ];

  // Define request statuses for "Pending"
  const pendingStatuses = [
    'All status',
    'Pending',
    'Rejected',
    'Approved',
    'Deleted',
  ];

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        {/* Bottom Sheet Modal */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0} // Start at the initial snap point
          snapPoints={snapPoints} // Allows the modal to expand to 100%
          enablePanDownToClose={true} // Allows user to drag down to close the modal
          backgroundComponent={({ style }) => (
            <View style={[style, styles.modalBackground]} />
          )}
        >
          <View style={styles.bottomSheetContent}>
            {activeFilter === 'All requests' && (
              <>
                <Text style={styles.heading}>Request Type</Text>
                {/* Scrollable content inside BottomSheetModal for Request Types */}
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {requestTypes.map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.requestTypeRow}
                      onPress={() => handleRequestTypeSelect(type)}
                    >
                      <View style={styles.radioButtonContainer}>
                        <View
                          style={[
                            styles.radioButton,
                            selectedRequestType === type && styles.radioButtonSelected,
                          ]}
                        />
                      </View>
                      <Text style={styles.requestTypeText}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {activeFilter === 'Pending' && (
              <>
                <Text style={styles.heading}>Request Status</Text>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {pendingStatuses.map((status, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.requestTypeRow}
                      onPress={() => handleRequestStatusSelect(status)}
                    >
                      <View style={styles.radioButtonContainer}>
                        <View
                          style={[
                            styles.radioButton,
                            selectedRequestStatus === status && styles.radioButtonSelected,
                          ]}
                        />
                      </View>
                      <Text style={styles.requestTypeText}>{status}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        </BottomSheetModal>

        {/* Filter Options at Bottom */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              activeFilter === 'All requests' && styles.activeOption,
            ]}
            onPress={() => handleFilterClick('All requests')}
          >
            <Icon
              name="filter"
              size={16}
              color={activeFilter === 'All requests' ? '#6a9689' : '#666'}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === 'All requests' && styles.activeText,
              ]}
            >
              All requests
            </Text>
          </TouchableOpacity>

          {/* Separator */}
          <View style={styles.separator} />

          <TouchableOpacity
            style={[
              styles.filterOption,
              activeFilter === 'Pending' && styles.activeOption,
            ]}
            onPress={() => handleFilterClick('Pending')}
          >
            <Icon
              name="filter"
              size={16}
              color={activeFilter === 'Pending' ? '#6a9689' : '#666'}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === 'Pending' && styles.activeText,
              ]}
            >
              Pending
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Ensures filter buttons stay at the bottom
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(169, 169, 169, 0.8)', // Light gray background with transparency
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1A1A1A',
  },
  scrollContainer: {
    flexGrow: 1, // Ensure content inside the modal is scrollable if it overflows
  },
  requestTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioButtonContainer: {
    marginRight: 15,
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6a9689',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    backgroundColor: '#6a9689',
  },
  requestTypeText: {
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  activeText: {
    color: '#6a9689',
    fontWeight: 'bold',
  },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
  },
});

export default FilterOptions;
