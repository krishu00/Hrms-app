import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

       const handleLogin = async () => {
        setErrorMessage('');
        try {
            // const response = await axios.post('http://hrmsapi.mhsindia.com/login', {
                // const response = await axios.post('http://192.168.17.59:8080/login', {
                    const response = await axios.post(
                                  `${process.env.REACT_APP_API_URL}/login`,

                         {
   
                email,

                password,
            }, {
                withCredentials: true,
            });
    
            if (response.data.success) {
                const employee = response.data.employee;
                if (employee) {
                    const employeeId = employee.employee_id;
                    const companyCode = employee.company_code; 
    
                    // Store values in AsyncStorage
                    await AsyncStorage.setItem('employee_id', employeeId);
                    await AsyncStorage.setItem('companyCode', companyCode); 
                    await AsyncStorage.setItem('userToken', employeeId);
                    
                    console.log('Stored employee ID:', employeeId);
                    console.log('Stored company code:', companyCode);
                    
                    onLoginSuccess(employeeId);
                } else {
                    setErrorMessage('Token or employee data missing in response.');
                }
            } else {
                setErrorMessage(response.data.message || 'Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Sign-in error:', error);
            console.log('Error response:', error.response); 
            setErrorMessage(error.response?.data?.message || 'An error occurred during sign-in. Please try again.');
        }
    };
const checkStoredData = async () => {
    try {
        const employeeId = await AsyncStorage.getItem('employee_id');
        const companyCode = await AsyncStorage.getItem('companyCode');
        
        console.log('Retrieved Employee ID:', employeeId);
        console.log('Retrieved Company Code:', companyCode);
    } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
    }
};

// Call this function after a successful login
checkStoredData();
    
    return (
        <LinearGradient
            colors={['#F3F4F3', '#E5EEE6', '#DEECDD']}
            style={styles.container}
        >
            <SafeAreaView style={styles.content}>
                <Image
                    source={require('../../logos/m2r.png')}
                    style={styles.logo}
                />

                <View style={styles.titleContainer}>
                    <Text style={styles.subTitleText}>Welcome To HRMS </Text>
                </View>

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Email or Mobile number"
                        style={styles.textInput}
                        placeholderTextColor="#AFAFB0"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Enter Your Password"
                        style={styles.textInput}
                        placeholderTextColor="#AFAFB0"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <View style={styles.forgotPasswordContainer}>
                    <TouchableOpacity>
                        <Text style={styles.forgotPasswordText}>Forgot Your Password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
                    <Text style={styles.signInButtonText}>Login</Text>
                </TouchableOpacity>

                <Text style={styles.bottomText}>@powered by M2R Technomations</Text>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 32,
    },
    logo: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    subTitleText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#6a9689',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 8,
    },
    inputContainer: {
        marginVertical: 16,
    },
    textInput: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        color: "#000",
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
    },
    forgotPasswordText: {
        color: '#0066B2',
        fontWeight: '600',
    },
    signInButton: {
        padding: 16,
        backgroundColor: "#81BAA5",
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 32,
        width: '50%',
        alignSelf: 'center',
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomText: {
        textAlign: 'center',
        marginTop: 'auto',
        color: '#AFAFB0',
    },
});

export default LoginScreen;
