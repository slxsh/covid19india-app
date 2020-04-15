import 'react-native-gesture-handler';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Home from './Home'
import Charts from './Charts'
import Links from './Links'
import About from './About'

const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home-variant' : 'home-variant-outline';
            } else if (route.name === 'Charts') {
              iconName = focused ? 'chart-areaspline' : 'chart-line';
            }
            else if(route.name === 'Links') {
              iconName = focused ? 'link-box' : 'link-box-outline';
            }
            else if(route.name === 'About') {
              iconName = focused ? 'information' : 'information-outline';
            }
            return <MaterialCommunityIcons name={iconName} size={25} color={color} />
          },
        })}
        tabBarOptions={{
          activeTintColor: '#5979FF',
          inactiveTintColor: 'gray',
          style : styles.navigator
        }}
      >
        <Tab.Screen name="Home" component={Home} options={{tabBarLabel : ''}} />
        <Tab.Screen name="Charts" component={Charts} options={{tabBarLabel : ''}} />
        <Tab.Screen name="Links" component={Links} options={{tabBarLabel : ''}} />
        <Tab.Screen name="About" component={About} options={{tabBarLabel : ''}} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  navigator : {
    height: 70,
    paddingTop: 12
  },
})