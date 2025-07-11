import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyRequests from '../RequestScreensComp/MyRequests';
import Approvals from '../RequestScreensComp/Approvals';
import FilterOptions from '../RequestScreensComp/FilterOptions';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Tab = createMaterialTopTabNavigator();

const RequestScreen = () => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Callback to toggle background color when BottomSheet is opened or closed
  const handleBottomSheetChange = (isOpen) => {
    setIsBottomSheetOpen(isOpen);
  };

  return (
    <GestureHandlerRootView style={styles.filterContainer}>
      
      <View style={[styles.container, { backgroundColor: isBottomSheetOpen ? '#D3D3D3' : '#fff' }]}>
        <NavigationContainer independent={true}>
          <Tab.Navigator
            screenOptions={{
              tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
              tabBarStyle: { backgroundColor: '#f5f5f5' }, // Background color for tabs
              tabBarIndicatorStyle: { backgroundColor: '#6a9689' }, // Tab underline color
            }}>
            <Tab.Screen name="Approvals" component={Approvals} />
            <Tab.Screen name="My Requests" component={MyRequests} />
            
          </Tab.Navigator>
        </NavigationContainer>

        {/* Pass the handler to FilterOptions */}
        <FilterOptions onBottomSheetChange={handleBottomSheetChange} />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Ensure the main container has a white background
  },
  filterContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Keep the filter options at the bottom
  },
});

export default RequestScreen;
