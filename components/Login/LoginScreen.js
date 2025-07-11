import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MMKV} from 'react-native-mmkv';
import {apiMiddleware} from '../../src/apiMiddleware/apiMiddleware';
import logoImage from '../../src/logos/m2r.png';

const storage = new MMKV();

const LoginScreen = ({onLoginSuccess}) => {
  const [email, setEmail] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [controller, setController] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    const abortController = new AbortController();
    setController(abortController);

    try {
      const response = await apiMiddleware.post(
        '/login',
        {email, password, platform: 'mobile'},
        {
          headers: {'Content-Type': 'application/json'},
          signal: abortController.signal,
        },
      );

      if (response?.data?.success) {
        const {employee} = response.data;
        if (employee?.employee_id && employee?.company_code) {
          storage.set('employee_id', employee.employee_id);
          storage.set('companyCode', employee.company_code);
          storage.set('userToken', employee.employee_id);
          storage.set('platform', 'mobile');
          onLoginSuccess(employee.employee_id);
        } else {
          setErrorMessage('Employee data missing in response.');
        }
      } else {
        setErrorMessage(response?.data?.message || 'Invalid credentials.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setErrorMessage(
          error.response?.data?.message ||
            'An error occurred during login. Please try again.',
        );
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return;
    try {
      const response = await apiMiddleware.post(
        '/forgot_password',
        {email},
        {
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (response?.data?.success) {
        setPopupMessage('Password reset link sent to your email');
      } else {
        setPopupMessage(response?.data?.message || 'Failed to send email');
      }
    } catch (error) {
      setPopupMessage(
        error.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
    }

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  useEffect(() => {
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, [controller]);

  return (
    <LinearGradient
      colors={['#F3F4F3', '#E5EEE6', '#DEECDD']}
      style={styles.container}>
      <SafeAreaView style={styles.content}>
        <Image source={logoImage} style={styles.logo} />
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
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Your Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>@powered by M2R Technomations</Text>

        {showPopup && (
          <View style={styles.popupBox}>
            <Text style={styles.popupText}>{popupMessage}</Text>
          </View>
        )}
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
  popupBox: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#4BB543',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    zIndex: 999,
  },
  popupText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
