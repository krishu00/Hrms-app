import React from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import dayjs from 'dayjs';
import Geolocation from 'react-native-geolocation-service';
import CookieManager from '@react-native-cookies/cookies';
import axios from 'axios'; // For API requests
   
const { width } = Dimensions.get('screen');
const SIZE = width * 0.7;
const TICK_INTERVAL = 1000;    

export default class ClockInOut extends React.Component {
  state = {
    currentTime: dayjs(),
    secondDegree: new Animated.Value(0),   
    minuteDegree: new Animated.Value(0),
    hourDegree: new Animated.Value(0),
    isPunchedIn: false,
    latitude: null,
    longitude: null,
  };

  componentDidMount() {
    this._ticker = setInterval(this.updateClock, TICK_INTERVAL);
    this.updateClockHands();
  }

  componentWillUnmount() {
    clearInterval(this._ticker);
    this._ticker = null;
  }

  updateClock = () => {
    const current = dayjs();
    this.setState({ currentTime: current }, this.updateClockHands);
  };

  updateClockHands = () => {
    const { currentTime } = this.state;
    const seconds = currentTime.second();
    const minutes = currentTime.minute();
    const hours = currentTime.hour() % 12; // Convert 24-hour to 12-hour format

    const secondDegree = (seconds / 60) * 360;
    const minuteDegree = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDegree = (hours / 12) * 360 + (minutes / 60) * 30;

    this.state.secondDegree.setValue(secondDegree);
    this.state.minuteDegree.setValue(minuteDegree);
    this.state.hourDegree.setValue(hourDegree);
  };

  requestLocationPermission = async () => {
    // Assuming permission is granted for this example
    // Implement actual permission request logic as needed
    return true; 
  };

  getLocationAndPunchIn = async () => {
    const permissionGranted = await this.requestLocationPermission();
    if (!permissionGranted) return;
  
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        this.setState({ latitude, longitude });
        console.log('Location obtained:', { latitude, longitude });
        await this.punchIn(latitude, longitude); // Ensure punchIn is awaited
      },
      (error) => {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Unable to get your location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  punchIn = async (latitude, longitude) => {
    try {
      // Fetch cookies
      const cookies = await CookieManager.getAll();
      console.log('Retrieved cookies:', cookies);

      // Check for the specific cookies
      const employeeId = cookies.employee_id ? cookies.employee_id.value : null;
      const companyCode = cookies.companyCode ? cookies.companyCode.value : null;

      if (!employeeId || !companyCode) {
        Alert.alert('Error', 'Unable to retrieve cookies');
        return;
      }

      const data = {
        latitude,
        longitude,
      };

      const headers = {
        'Content-Type': 'application/json',
        'Cookie': `employee_id=${employeeId}; companyCode=${companyCode}`, // Corrected cookie string
      };

      // API call
      const response = await axios.post(
        'http://hrmsapi.mhsindia.com/attendance/punch_in',
        data,
        { headers }
      );

      if (response.status === 200) {
        console.log('Punch-in successful:', response.data);
        this.togglePunch();
      } else {
        console.log('Punch-in failed:', response.data);
        Alert.alert('Error', 'Punch-in failed');
      }
    } catch (error) {
      console.error('API call error:', error);
      Alert.alert('Error', 'Unable to punch in');
    }
  };

  togglePunch = () => {
    this.setState((prevState) => ({ isPunchedIn: !prevState.isPunchedIn }));
  };

  render() {
    const { currentTime, secondDegree, minuteDegree, hourDegree, isPunchedIn } = this.state;

    const transformSeconds = {
      transform: [
        {
          rotate: secondDegree.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg'],
          }),
        },
      ],
    };

    const transformMinutes = {
      transform: [
        {
          rotate: minuteDegree.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg'],
          }),
        },
      ],
    };

    const transformHours = {
      transform: [
        {
          rotate: hourDegree.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg'],
          }),
        },
      ],
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />

        <View style={styles.clockContainer}>
          <View style={[styles.bigQuadran]} />
          <View style={[styles.mediumQuadran]} />
          <Animated.View style={[styles.mover, transformHours]}>
            <View style={[styles.hours]} />
          </Animated.View>
          <Animated.View style={[styles.mover, transformMinutes]}>
            <View style={[styles.minutes]} />
          </Animated.View>
          <Animated.View style={[styles.mover, transformSeconds]}>
            <View style={[styles.seconds]} />
          </Animated.View>
          <View style={[styles.smallQuadran]} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.currentTime}>
            {currentTime.format('hh:mm:ss A')}
          </Text>

          <View style={styles.punchSection}>
            <Text style={styles.punchInOut}>
              In Time: <Text style={styles.darkerTimeText}>09:00</Text>
            </Text>
            <Text style={styles.punchInOut}>
              Out Time: <Text style={styles.darkerTimeText}>06:00</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.punchButton} onPress={this.getLocationAndPunchIn}>
          <Text style={styles.buttonText}>
            {isPunchedIn ? 'Punch Out' : 'Punch In'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 450,
  },
  clockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 220,
  },
  mover: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  hours: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: '25%',
    marginTop: '25%',
    width: 5,
    borderRadius: 4,
  },
  minutes: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    height: '30%',
    marginTop: '20%',
    width: 3,
    borderRadius: 3,
  },
  seconds: {
    backgroundColor: '#aeaeae',
    height: '33%',
    width: 2,
    borderRadius: 2,
    marginTop: '17%',
  },
  bigQuadran: {
    width: SIZE * 0.8,
    height: SIZE * 0.8,
    borderRadius: SIZE * 0.4,
    backgroundColor: '#C1D8C3',
    position: 'absolute',
  },
  mediumQuadran: {
    width: SIZE * 0.5,
    height: SIZE * 0.5,
    borderRadius: SIZE * 0.25,
    backgroundColor: '#E3F0E3',
    position: 'absolute',
  },
  smallQuadran: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8F9498',
    position: 'absolute',
  },
  infoContainer: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  currentTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f4062',
  },
  punchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  punchInOut: {
    fontSize: 18,
    color: '#333',
  },
  darkerTimeText: {
    color: '#111',
    fontWeight: 'bold',
  },
  punchButton: {
    backgroundColor: '#60a5fa',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
