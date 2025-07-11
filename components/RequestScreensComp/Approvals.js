import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import axios from "axios";
import LeaveTemplate from "../../src/utils/LeaveTemplate"; 

export default function AppliedByYou() {
    const [appliedData, setAppliedData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAppliedData = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/request/get_requested_to_me`
            );
            if (response.data?.data) {
                setAppliedData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching applied data:", error);
        } finally{
            setIsLoading(false);
        }
    };

    const handleRevoke = async (encryptId) => {
        // Implement revoke logic if needed
        console.log("Revoke:", encryptId);
    };

    useEffect(() => {
        fetchAppliedData();
    }, []);

    const handleRowClick = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <View style={styles.applied_main_container}>
            {/* <Text style={styles.request_heading}>Requests Assigned to You</Text> */}
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ScrollView style={styles.tableContainer}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.headerCellSNo ,styles.headerText]}>S.No</Text>
                        <Text style={[styles.headerCellRequestor,styles.headerText]}>Requestor By</Text>
                        {/* <Text style={styles.headerCell}>Request Type</Text> */}
                        <Text style={[styles.headerCellReason,styles.headerText]}>Reason</Text>
                        <Text style={[styles.headerCellAppliedOn,styles.headerText]}>Applied On</Text>
                        {/* <Text style={styles.headerCell}>Status</Text> */}
                    </View>
                    {appliedData.reverse().map((item, index) => (
                        <TouchableOpacity
                            key={item._id}
                            style={index % 2 === 0 ? styles.dataRow : styles.dataRowEven}
                            onPress={() => handleRowClick(item)}
                        >
                            <Text style={[styles.dataCellSNo, styles.tableTest]}>{index + 1}</Text>
                            <Text style={[styles.dataCellRequestor,styles.tableTest]}>
                                {item.requestor_name}
                            </Text>
                            {/* <Text style={styles.dataCell}>
                                {item.request_type}
                            </Text> */}
                            <Text style={[styles.dataCellReason,styles.tableTest]}>{item.reason}</Text>
                            <Text style={[styles.dataCellAppliedOn,styles.tableTest]}>
                                {formatDate(item.raised_on)}
                            </Text>
                            {/* <Text style={styles.dataCell}>
                                {item?.completed_or_not ? "Approved" : "Pending"}
                            </Text> */}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                        <LeaveTemplate
                            appliedData={selectedItem}
                            onClose={closeModal}
                            refreshData={fetchAppliedData}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
  applied_main_container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
  },
  request_heading: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: "#333",
  },
  tableContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  headerRow: {
      flexDirection: "row",
      backgroundColor: "#e0f2e7",
      paddingVertical: 10,
  },
  headerText: {  
    color: "black", 
    fontWeight: "bold", 
},
tableTest:{
 color: "#A0A5A8", 
    fontWeight: "bold", 
},
  dataRow: {
      flexDirection: "row",
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
  },
  headerCell: {
      fontWeight: "bold",
      textAlign: "center",
      paddingHorizontal: 5,
  },
  dataCell: {
      textAlign: "center",
      paddingHorizontal: 5,
  },
  headerCell: {
      fontWeight: "bold",
      textAlign: "center",
      paddingHorizontal: 5,
  },
  dataCell: {
      textAlign: "center",
      paddingHorizontal: 10,
  },
  // Styles for specific columns
  headerCellSNo: {
      width: 50, // Fixed width for S.No
      fontWeight: "bold",
      textAlign: "center",
      paddingHorizontal: 5,
      
  },
  dataCellSNo: {
      width: 50, // Fixed width for S.No
      textAlign: "center",
      paddingHorizontal: 5,
      paddingVertical: 10,

  },
  headerCellRequestor: {
      flex: 2, // Adjust flex as needed
      fontWeight: "bold",
      textAlign: "center",
      paddingHorizontal: 5,
  },
  dataCellRequestor: {
      flex: 2,
      textAlign: "center",
      paddingHorizontal: 5, 
             paddingVertical: 10,

  },
  headerCellReason: {
      flex: 3, // Adjust flex as needed
      fontWeight: "bold",
      textAlign: "center",
      paddingHorizontal: 5,
  },
  dataCellReason: {
      flex: 3,
      textAlign: "center",
      paddingHorizontal: 5,
      paddingVertical: 10,

  },
  headerCellAppliedOn: {
      flex: 2, // Adjust flex as needed
      fontWeight: "bold",
      textAlign: "center",
      paddingHorizontal: 5,
  },
  dataCellAppliedOn: {
      flex: 2,
      textAlign: "center",
      paddingHorizontal: 5,
      paddingVertical: 10,

  },
  modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor:"transparent" , 
      padding: 20,
      borderRadius: 10,
      width: "90%",
  },
  closeButton: {
      alignSelf: "flex-end",
      padding: 10,
     
  },
  closeButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#222222",
  },



  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dataRowEven: {
    backgroundColor: '#f0f0f0',
    color:"red",
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
// const styles = StyleSheet.create({
//     applied_main_container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: "#fff",
//     },
//     request_heading: {
//         fontSize: 24,
//         fontWeight: "bold",
//         marginBottom: 20,
//         textAlign: "center",
//         color: "#333",
//     },
//     tableContainer: {
//         width: "100%",
//     },
//     headerRow: {
//         flexDirection: "row",
//         backgroundColor: "#e0f2e7",
//         paddingVertical: 10,
//     },
//     dataRow: {
//         flexDirection: "row",
//         paddingVertical: 5,
//         borderBottomWidth: 1,
//         borderBottomColor: "#ddd",
//     },
//     headerCell: {
//         flex: 1,
//         fontWeight: "bold",
//         textAlign: "center",
//         paddingHorizontal: 5,
//     },
//     dataCell: {
//         flex: 1,
//         textAlign: "center",
//         paddingHorizontal: 5,
//     },
//     modalOverlay: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "rgba(0,0,0,0.5)",
//     },
//     modalContent: {
//         backgroundColor: "white",
//         padding: 20,
//         borderRadius: 10,
//         width: "90%",
//     },
//     closeButton: {
//         alignSelf: "flex-end",
//         padding: 10,
//     },
//     closeButtonText: {
//         fontSize: 16,
//         color: "blue",
//     },
// });