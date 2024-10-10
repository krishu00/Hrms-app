// Dashboard.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from './Header/Header';
import HomeScreen from './Screens/HomeScreen';
import FeedsScreen from './Screens/FeedsScreen';
import RequestScreen from './Screens/RequestsScreen';
import MoreScreen from './Screens/MoreScreens';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const Dashboard = ({ onLogoutSuccess }) => {
  return (
    <View style={styles.container}>
      {/* Header is displayed at the top, passing the logout handler */}
      <Header onLogoutSuccess={onLogoutSuccess} />
      
      {/* Bottom Tab Navigator */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Hide default header provided by react-navigation
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Feeds') {
              iconName = 'inbox';
            } else if (route.name === 'Request') {
              iconName = 'envelope';
            } else if (route.name === 'More') {
              iconName = 'list';
            }

            // Set color based on active or inactive tab
            color = focused ? '#6a9689' : 'darkgray';
            return <Icon name={iconName} color={color} size={30} />;
          },
          tabBarActiveTintColor: '#6a9689',
          tabBarInactiveTintColor: 'darkgray',
          tabBarStyle: { height: 55, paddingBottom: 2, paddingTop: 5 },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Feeds" component={FeedsScreen} />
        <Tab.Screen name="Request" component={RequestScreen} />
        <Tab.Screen name="More" component={MoreScreen} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Dashboard;
