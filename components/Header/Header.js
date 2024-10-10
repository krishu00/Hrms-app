// Header.js

import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const Header = ({ onLogoutSuccess }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setDropdownVisible(false); // Close dropdown after logging out
            onLogoutSuccess(); // Call the parent component function to update UI
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleToggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    const handleOutsidePress = () => {
        if (dropdownVisible) {
            setDropdownVisible(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.container}>
                <LinearGradient
                    colors={['#C1DFC4', '#DEECDD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerContainer}
                >
                    <Image
                        source={require('../../logos/daksh-logo.png')}
                        style={styles.logo}
                    />

                    <View style={styles.userInfoContainer}>
                        <TouchableOpacity onPress={handleToggleDropdown}>
                            <Text style={styles.username}>Krishna Sharma</Text>
                            <Text style={styles.userId}>XEL-0585</Text>
                        </TouchableOpacity>

                        {dropdownVisible && (
                            <View style={styles.dropdownContainer}>
                                <TouchableOpacity onPress={handleLogout} style={styles.dropdownOption}>
                                    <Text style={styles.dropdownText}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </LinearGradient>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    headerContainer: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        width: 100,
        height: 50,
        resizeMode: 'contain',
    },
    userInfoContainer: {
        alignItems: 'flex-end',
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    userId: {
        fontSize: 14,
        color: '#666',
    },
    dropdownContainer: {
        position: 'absolute',
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 4,
        marginTop: 17,
        padding: 8,
    },
    dropdownOption: {
        padding: 3 ,
    },
    dropdownText: {
        color: '#81BAA5',
        fontWeight: '600',
    },
});

export default Header;
