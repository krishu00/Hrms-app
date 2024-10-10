import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const TimerCalender = () => {
  // Define the dates with specific times
  const markedDates = {
    '2024-09-25': { time: '8:00' },
    '2024-09-26': { time: '8:40' },
    '2024-09-27': { time: '6:50' },
    '2024-09-29': { time: '9:00' },
    '2024-09-02': { time: '7:40' },
    '2024-09-15': { time: '9:30' },
    '2024-09-09': { time: '9:00' },
  };

  // Function to check color based on the time
  const getTimeColor = (time) => {
    // Parse hours and minutes from the time string
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    // Check if total minutes is less than or greater than/equal to 480 (8 hours)
    return totalMinutes < 480 ? 'red' : 'green'; // Return the color as a string
  };

  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.calenderHeading}>Timing Calendar</Text>

      {/* Calendar */}
      <Calendar
        style={styles.calendar}
        markingType={'custom'}
        markedDates={Object.keys(markedDates).reduce((acc, date) => {
          acc[date] = {
            customStyles: {
              container: styles.dayContainer, // Base container style
              text: { color: 'black' },
            },
          };
          return acc;
        }, {})}
        dayComponent={({ date }) => {
          // Check if the current date is in markedDates
          const markedDate = markedDates[date.dateString];

          return (
            <View style={styles.dayWrapper}>
              {/* Render day number */}
              <Text style={styles.dayText}>{date.day}</Text>

              {/* Render time if available */}
              {markedDate && (
                <Text style={[styles.timeText, { color: getTimeColor(markedDate.time) }]}>
                  {markedDate.time}
                </Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

export default TimerCalender;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f8f8f8',
    padding: 20,
  },
  calenderHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  calendar: {
    borderRadius: 10,
    elevation: 8, // Shadow effect on Android
    shadowColor: '#000', // Shadow effect on iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow effect on iOS
    shadowOpacity: 0.2, // Shadow effect on iOS
    shadowRadius: 4, // Shadow effect on iOS
    height: 'auto', // Set the calendar height
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  dayWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1, // Space between days
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  timeText: {
    fontSize: 12,
    marginTop: 3, // Space between day number and time text
  },
});
