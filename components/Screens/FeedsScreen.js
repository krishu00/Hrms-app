import { StatusBar, StyleSheet, Text, View, Button, PermissionsAndroid, Platform, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';

const FeedsScreen = () => {
  const [isTripStarted, setIsTripStarted] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
          return;
        }
      }
    };
    requestLocationPermission();
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => value * (Math.PI / 180);
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // distance in meters
  };

  const startTrip = () => {
    setIsTripStarted(true);

    const intervalId = setInterval(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          const newCoordinate = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,   
          };

          setCoordinates((prevCoordinates) => {
            // Skip duplicate coordinates or very small movements (below threshold)
            const threshold = 5; // in meters
            const lastCoordinate = prevCoordinates[prevCoordinates.length - 1];
            if (
              lastCoordinate &&
              getDistance(
                lastCoordinate.latitude,
                lastCoordinate.longitude,
                newCoordinate.latitude,
                newCoordinate.longitude
              ) < threshold
            ) {
              return prevCoordinates; // Return without updating if below threshold
            }

            const updatedCoordinates = [...prevCoordinates, newCoordinate];

            if (updatedCoordinates.length > 1) {
              const distance = getDistance(
                lastCoordinate.latitude,
                lastCoordinate.longitude,
                newCoordinate.latitude,
                newCoordinate.longitude
              );

              setTotalDistance((prevDistance) => prevDistance + distance);
            }

            console.log('New Coordinate:', newCoordinate);
            console.log('Updated Coordinates Array:', updatedCoordinates);
            return updatedCoordinates;
          });
        },
        (error) => {
          console.log('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }, 10000); // 10 seconds interval

    setWatchId(intervalId);
  };

  const endTrip = () => {
    setIsTripStarted(false);
    if (watchId !== null) {
      clearInterval(watchId);
      setWatchId(null);
    }
  };

  const resetTrip = () => {
    setCoordinates([]);
    setTotalDistance(0);
    setIsTripStarted(false);
    if (watchId !== null) {
      clearInterval(watchId);
      setWatchId(null);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {!isTripStarted ? (
        <Button title="Start Trip" onPress={startTrip} />
      ) : (
        <Button title="End Trip" onPress={endTrip} />
      )}

      <Text style={styles.paragraph}>
        {isTripStarted ? 'Trip in progress...' : 'Trip not started'}
      </Text>

      <Text style={styles.paragraph}>Total Distance Covered: {totalDistance.toFixed(2)} meters</Text>

      <Text style={styles.paragraph}>Coordinates:</Text>

      <ScrollView style={styles.scrollContainer}>
        {coordinates.map((coord, index) => (
          <Text key={index} style={styles.paragraph}>
            {index + 1}. Latitude: {coord.latitude}, Longitude: {coord.longitude}
          </Text>
        ))}
      </ScrollView>

      <Button title="Reset Trip" onPress={resetTrip} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    margin: 10,
  },
  scrollContainer: {
    width: '100%',
    maxHeight: 350, 
    marginVertical: 10,
  },
});

export default FeedsScreen;
