import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from './components/Dashboard';
import LoginScreen from './components/Login/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native'; // Import ActivityIndicator

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                setIsAuthenticated(token !== null); // Check for existence of token
            } catch (error) {
                console.error('Error checking auth status:', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleLoginSuccess = async (token) => {
        try {
            await AsyncStorage.setItem('userToken', token);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error saving token:', error);
        }
    };

    // Logout function to be called when the user logs out
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error removing token:', error);
        }
    };

    if (loading) {
        // Show loading spinner while checking authentication status
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? (
                // Pass the logout function to Dashboard
                <Dashboard onLogoutSuccess={handleLogout} />
            ) : (
                <LoginScreen onLoginSuccess={handleLoginSuccess} />
            )}
        </NavigationContainer>
    );
};

export default App;
