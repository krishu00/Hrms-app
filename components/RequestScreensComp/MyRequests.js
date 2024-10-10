import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const MyRequests = () => {
  return (
    <View style={styles.screen}>
    <Text style={styles.text}>No Requests Found</Text>
    <Text style={styles.text}> Requests</Text>
  </View>
  )
}

export default MyRequests

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', 
      },
      text: {
        fontSize: 18,
        color: '#000000', 
      },
})