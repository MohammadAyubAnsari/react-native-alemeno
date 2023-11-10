import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CourseListingScreen from "./components/CourseListingScreen";
import CourseDetailsScreen from "./components/CourseDetailsScreen";
import StudentDashboard from "./components/StudentDashboard";
import StudentLoginScreen from "./components/StudentLogin";
import StudentRegistration from "./components/StudentRegistration";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Course Listing">
        <Stack.Screen
          name="CourseListing"
          component={CourseListingScreen}
          options={{ title: "Courses" }}
        />
        <Stack.Screen
          name="CourseDetails"
          component={CourseDetailsScreen}
          options={{ title: "Course Details" }}
        />
        <Stack.Screen
          name="StudentDashboard"
          component={StudentDashboard}
          options={{ title: "Student Dashboard" }}
        />
        <Stack.Screen
          name="StudentLogin"
          component={StudentLoginScreen}
          options={{ title: "Student Login" }}
        />
        <Stack.Screen
          name="StudentRegistration"
          component={StudentRegistration}
          options={{ title: "Student Registration" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
