import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Approvals = () => {
  return (
    <View style={styles.screen}>
    <Text style={styles.text}>No Approvals Found</Text>

  </View>

  )
}

export default Approvals

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