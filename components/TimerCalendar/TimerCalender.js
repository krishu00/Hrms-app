import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {isNotNull} from '../../src/utils/utils';
import {apiMiddleware} from '../../src/apiMiddleware/apiMiddleware';
import {MMKV} from 'react-native-mmkv';

const TimerCalender = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [weekOffDays, setWeekOffDays] = useState([]);
  const [visibleMonth, setVisibleMonth] = useState({
    month: new Date().getMonth(), // 0-based
    year: new Date().getFullYear(),
  });

  const storage = new MMKV();
  const employeeId = storage.getString('employee_id');
  const companyCode = storage.getString('companyCode');

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const getDayIndex = dayName => {
    const daysMap = {
      Sunday: 1,
      Monday: 2,
      Tuesday: 3,
      Wednesday: 4,
      Thursday: 5,
      Friday: 6,
      Saturday: 7,
    };
    return daysMap[dayName];
  };

  const getTimeColor = time => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes < 480 ? 'red' : 'green';
  };

  const formatWorkingHours = hours => {
    const totalMinutes = Math.round(hours * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs} Hr ${mins} min`;
  };

  const formatTime = dateTimeString => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const fetchAttendanceData = async date => {
    setLoading(true);
    try {
      await delay(1000);
      const response = await apiMiddleware.get(
        `/attendance/daily_attendance?date=${date}`,
      );
      setAttendanceData(response.data[0]);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkingHours = async (month, year, weekOffDaysParam) => {
    try {
      const response = await apiMiddleware.get(
        `/attendance/daily_working_hours?month=${month}&year=${year}`,
      );
      const {workingHoursPerDay} = response.data;
      const data = {};

      const weekOffIndices = weekOffDaysParam.map(getDayIndex);

      if (isNotNull(workingHoursPerDay)) {
        workingHoursPerDay.forEach(({date, decimal_hours}) => {
          const formattedDate = `${year}-${String(month).padStart(
            2,
            '0',
          )}-${String(date).padStart(2, '0')}`;
          const hours = Math.floor(decimal_hours);
          const minutes = Math.round((decimal_hours - hours) * 60);
          const time = `${hours}:${String(minutes).padStart(2, '0')}`;

          data[formattedDate] = {
            customStyles: {
              container: styles.dayContainer,
              text: {color: getTimeColor(time)},
            },
            time,
            isTimeAvailable: !(time === '0:00' || time === '0:0'),
          };
        });
      }

      for (let day = 1; day <= 31; day++) {
        const dateObj = new Date(year, month - 1, day);
        if (isNaN(dateObj)) continue;

        const dow = dateObj.getDay();
        const formatted = dateObj.toISOString().split('T')[0];

        if (weekOffIndices.includes(dow)) {
          const dayName = dateObj.toLocaleString('en-US', {weekday: 'long'});

          const existing = data[formatted];
          const hasTime = existing?.isTimeAvailable;

          data[formatted] = {
            // customStyles: getWeekOffStyle(dayName),
            time: hasTime ? existing.time : 'W/O',
          };
        }
      }

      setMarkedDates(data);
    } catch (err) {
      console.error('Error fetching working hours:', err);
    }
  };

  const onDayPress = date => {
    setSelectedDate(date.dateString);
    setModalVisible(true);
    fetchAttendanceData(date.dateString);
  };

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const init = async () => {
      try {
        const response = await apiMiddleware.get(
          `/company/${companyCode}/employee/${employeeId}`,
        );
        const weekOff = response.data.data.weekly_off.map(d => d.day_off);
        setWeekOffDays(weekOff);

        await fetchWorkingHours(currentMonth, currentYear, weekOff);
      } catch (err) {
        console.error('Error fetching week off days:', err);
      }
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.calenderHeading}>Timing Calendar</Text>

      <Calendar
        style={styles.calendar}
        markingType={'custom'}
        markedDates={markedDates}
        onDayPress={onDayPress}
        onMonthChange={monthObj => {
          setVisibleMonth({month: monthObj.month - 1, year: monthObj.year});
        }}
        dayComponent={({date}) => {
          const markedDate = markedDates[date.dateString];
          const dateObj = new Date(date.dateString);

          const isCurrentVisibleMonth =
            dateObj.getMonth() === visibleMonth.month &&
            dateObj.getFullYear() === visibleMonth.year;

          const isWeekOff = weekOffDays.includes(
            dateObj.toLocaleString('en-US', {weekday: 'long'}),
          );

          return (
            <TouchableOpacity onPress={() => onDayPress(date)}>
              <View style={styles.dayWrapper}>
                <View
                  style={[
                    styles.dateCircle,
                    isWeekOff && styles.weekOffBackground,
                  ]}>
                  <Text
                    style={[
                      styles.dayText,
                      {color: isCurrentVisibleMonth ? '#000' : '#A9A9A9'},
                    ]}>
                    {date.day}
                  </Text>
                </View>

                {markedDate && (
                  <Text
                    style={[
                      styles.timeText,
                      {
                        color: isWeekOff
                          ? 'red'
                          : getTimeColor(markedDate.time),
                      },
                    ]}>
                    {markedDate.time}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* MODAL */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Date: <Text style={styles.modalDate}>{selectedDate}</Text>
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#00503D" />
            ) : attendanceData && attendanceData.employee_Id ? (
              <View style={styles.dataContainer}>
                {[
                  {
                    label: 'Punch In Time',
                    value: formatTime(attendanceData.punch_in_time),
                  },
                  {
                    label: 'Punch Out Time',
                    value: formatTime(attendanceData.punch_out_time),
                  },
                  {
                    label: 'Punch In Location',
                    value: (
                      <Text
                        style={styles.linkText}
                        onPress={() =>
                          Linking.openURL(
                            `https://www.google.com/maps?q=${attendanceData.punch_in_time_latitude_coordinates},${attendanceData.punch_in_time_longitude_coordinates}`,
                          )
                        }>
                        View Location
                      </Text>
                    ),
                  },
                  {
                    label: 'Punch Out Location',
                    value: (
                      <Text
                        style={styles.linkText}
                        onPress={() =>
                          Linking.openURL(
                            `https://www.google.com/maps?q=${attendanceData.punch_out_time_latitude_coordinates},${attendanceData.punch_out_time_longitude_coordinates}`,
                          )
                        }>
                        View Location
                      </Text>
                    ),
                  },
                  {label: 'Status', value: attendanceData.status},
                  {
                    label: 'Working Hours',
                    value: formatWorkingHours(attendanceData.working_hours),
                  },
                ].map(({label, value}, index) => (
                  <View style={styles.row} key={index}>
                    <Text style={styles.titleText}>{label}:</Text>
                    <Text style={styles.dataText}>{value}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text>No data available for this date</Text>
            )}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimerCalender;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    height: 'auto',
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  dayWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 1,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 10,
    textAlign: 'center',
  },
  dayContainer: {
    borderRadius: 10,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    width: '90%',
    maxWidth: 400,
  },

  modalText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#6a9689',
    fontWeight: '600',
  },
  modalDate: {
    color: '#00503D',
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: '#a8d7c5',
    elevation: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  titleText: {
    fontWeight: 'bold',
    color: '#6a9689',
    fontSize: 14,
    width: '40%',
  },
  dataText: {
    color: '#00503D',
    fontSize: 14,
    width: '55%',
    fontWeight: '700',
  },
  linkText: {
    color: '#0000FF',
    textDecorationLine: 'underline',
  },
  weekOffCircle: {
    backgroundColor: 'gray',
    borderRadius: 100,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  dateCircle: {
    width: 36,
    height: 25,
    // borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  weekOffBackground: {
    backgroundColor: '#ffb3b3', 
  },
});
