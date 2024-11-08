import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  SafeAreaView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MMKV } from 'react-native-mmkv';
import { apiMiddleware } from '../../src/apiMiddleware/apiMiddleware';
import logoImage from '../../src/logos/m2r.png';

const storage = new MMKV();

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [controller, setController] = useState(null); // Store controller to abort if needed

  const handleLogin = async () => {
    setErrorMessage('');

    // Step 1: Create an AbortController instance
    const abortController = new AbortController();
    setController(abortController); // Save it in state to access it for cleanup

    try {
      const response = await apiMiddleware.post(
        '/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          signal: abortController.signal, // Step 2: Pass the abort signal    
        }
      );

      console.log('Login request:', { email, password });
      console.log('API response:', response);

      if (response?.data?.success) {
        const { employee } = response.data;

        if (employee && employee.employee_id && employee.company_code) {
          storage.set('employee_id', employee.employee_id);
          storage.set('companyCode', employee.company_code);
          storage.set('userToken', employee.employee_id);

          console.log('Stored Employee ID:', employee.employee_id);
          console.log('Stored Company Code:', employee.company_code);

          onLoginSuccess(employee.employee_id);
        } else {
          setErrorMessage('Employee data missing in response.');
        }
      } else {
        setErrorMessage(response?.data?.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Login request aborted');
      } else {
        console.error('Login error:', error);
        setErrorMessage(
          error.response?.data?.message || 'An error occurred during login. Please try again.'
        );
      }
    }
  };

  // Cleanup on unmount to abort ongoing requests
  useEffect(() => {
    return () => {
      if (controller) {
        controller.abort(); // Step 3: Abort if component unmounts
      }
    };
  }, [controller]);

  const checkStoredData = () => {
    try {
      const employeeId = storage.getString('employee_id');
      const companyCode = storage.getString('companyCode');

      console.log('Retrieved Employee ID:', employeeId);
      console.log('Retrieved Company Code:', companyCode);
    } catch (error) {
      console.error('Error retrieving data from MMKV:', error);
    }
  };

  checkStoredData();

  return (
    <LinearGradient
      colors={['#F3F4F3', '#E5EEE6', '#DEECDD']}
      style={styles.container}>
      <SafeAreaView style={styles.content}>
        <Image
        //   source={require('../../src/logos/m2r.png')}
        source={logoImage}
          style={styles.logo}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.subTitleText}>Welcome To HRMS</Text>
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

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
    color: '#000',
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
    backgroundColor: '#81BAA5',
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
