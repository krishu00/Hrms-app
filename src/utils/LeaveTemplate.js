import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';

export default function LeaveTemplate({
  appliedData = {},
  onClose,
  refreshData,
}) {
  const [remark, setRemark] = useState('');

  const handleAction = async action => {
    try {
      if (!remark.trim()) {
        alert('Please enter a remark before proceeding.');
        return;
      }

      const encrypt_id = appliedData?.encrypt_id;

      if (!encrypt_id) {
        alert('Invalid request data.');
        return;
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}/approve-or-reject/${encrypt_id}`,
        {
          action,
          remarks_message: remark,
        },
        {
          withCredentials: true,
        },
      );

      alert(`Request ${action}d successfully!`);
      onClose();
      refreshData();
    } catch (error) {
      alert(
        `Failed to ${action} request: ${
          error.response?.data?.message || 'Unknown error'
        }`,
      );
    }
  };

  return (
    <ScrollView style={styles.requestCardDiv}>
      <Text style={styles.requestCardTitle}>
        {appliedData?.leave_type || appliedData?.request_type}
      </Text>
      <View style={styles.raisedByBox}>
        <Text style={styles.userName}>
          {appliedData?.requestor_name || 'N/A'} (
          {appliedData?.requestor_id || 'N/A'})
        </Text>
        <Text style={styles.approverStatus}>
          <Text style={styles.approverStatusHead}>Status</Text>{' '}
          {appliedData?.completed_or_not ? 'Approved' : 'Pending'}
        </Text>
      </View>
      {appliedData?.request_type === 'Leave' && (
        <View style={styles.leavesBox}>
          <Text style={styles.boxTitle}>Leave Balance</Text>
          <View style={styles.leavesContainer}>
            <View style={styles.leaveRow}>
              <Text>Sick Leave:</Text>
              <Text style={styles.smallText}>3</Text>
            </View>
            <View style={styles.leaveRow}>
              <Text>Earned Leave:</Text>
              <Text style={styles.smallText}>5</Text>
            </View>
            <View style={styles.leaveRow}>
              <Text>Paid Leave:</Text>
              <Text style={styles.smallText}>2</Text>
            </View>
          </View>
        </View>
      )}
      <View style={styles.appliedDatesBox}>
        <Text style={styles.boxTitle}>Applied Dates</Text>
        {appliedData?.start_date &&
        appliedData?.end_date &&
        appliedData?.leave_type ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Start Date</Text>
              <Text style={styles.headerCell}>End Date</Text>
              <Text style={styles.headerCell}>Leave Type</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {appliedData?.start_date?.split('T')[0] || 'N/A'}
              </Text>
              <Text style={styles.tableCell}>
                {appliedData?.end_date?.split('T')[0] || 'N/A'}
              </Text>
              <Text style={styles.tableCell}>
                {appliedData?.leave_type || 'N/A'}
              </Text>
            </View>
          </View>
        ) : appliedData?.request_type && appliedData?.reason ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Request Type</Text>
              <Text style={styles.headerCell}>Reason</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {appliedData?.request_type || 'N/A'}
              </Text>
              <Text style={styles.tableCell}>
                {appliedData?.reason || 'N/A'}
              </Text>
            </View>
          </View>
        ) : (
          <Text>No data available to display.</Text>
        )}
      </View>

      <View style={styles.reasonsBox}>
        <Text style={styles.boxTitle}>Reasons</Text>
        <Text style={styles.boxReason}>{appliedData?.reason || 'N/A'}</Text>
      </View>

      <View style={styles.approversBox}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Approver's Name</Text>
            <Text style={styles.headerCell}>Current Level</Text>
            <Text style={styles.headerCell}>Applied Date</Text>
            <Text style={styles.headerCell}>Status</Text>
          </View>
          {appliedData?.list_of_approvers?.length > 0 ? (
            appliedData.list_of_approvers.map((approver, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{approver?.name || 'N/A'}</Text>
                <Text style={styles.tableCell}>
                  {appliedData?.current_level || 'N/A'}
                </Text>
                <Text style={styles.tableCell}>
                  {appliedData?.raised_on?.split('T')[0] || 'N/A'}
                </Text>
                <Text style={styles.tableCell}>
                  {appliedData?.completed_or_not ? 'Approved' : 'Pending'}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell} colSpan={4}>
                No approvers available
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.reasonsBox}>
        <Text style={styles.boxTitle}>Remark</Text>
        <TextInput
          style={styles.remarkInput}
          value={remark}
          onChangeText={setRemark}
          placeholder="Enter your remark"
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleAction('approve')}>
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleAction('reject')}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  requestCardDiv: {
    // ... (add styles from your CSS, adjusted for React Native)
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    alignSelf: 'center',
  },
  requestCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  // ... (add more styles as needed)
  raisedByBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#135e4f',
  },
  approverStatus: {
    fontSize: 14,
    color: '#135e4f',
  },
  approverStatusHead: {
    color: 'black',
    opacity: 0.5,
  },
  leavesBox: {
    marginBottom: 10,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  leavesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  leaveRow: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  smallText: {
    fontSize: 14,
    color: '#555',
  },
  appliedDatesBox: {
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  reasonsBox: {
    marginBottom: 10,
  },
  boxReason: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  approversBox: {
    marginBottom: 10,
    headerCell: {
      fontSize: 12,
    },
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
