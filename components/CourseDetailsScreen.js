import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, push, onValue } from "firebase/database";

const CourseDetails = ({ route, navigation }) => {
  const { course } = route.params;
  const [enrollmentStatus, setEnrollmentStatus] = useState(
    course.enrollmentStatus
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ enrolledCourses: [] });
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (userData) => {
      setIsLoggedIn(!!userData);
      setUser(userData);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const navigateToStudentDashboard = () => {
    navigation.navigate("StudentDashboard");
  };
  const handleEnroll = () => {
    if (enrollmentStatus === "Open" && user && user.email) {
      const sanitizedEmail = user.email.replace(/[.#$[\]]/g, "");
      const db = getDatabase();
      const userRef = ref(db, `users/${sanitizedEmail}/enrolledCourses`);

      if (
        !user.enrolledCourses ||
        !user.enrolledCourses.some((c) => c.name === course.name)
      ) {
        setEnrollmentStatus("Enrolled");

        updateUserEnrolledCourses(user.email, course);

        Alert.alert(
          "Enrollment Successful",
          "You are now enrolled in this course."
        );
      } else {
        Alert.alert(
          "Enrollment Failed",
          "You are already enrolled in this course."
        );
      }
    } else {
      Alert.alert(
        "Enrollment Failed",
        "Enrollment is not available for this course."
      );
    }
  };

  const handleLogin = () => {
    navigation.navigate("StudentLogin");
  };

  const updateUserEnrolledCourses = (userEmail, enrolledCourse) => {
    if (userEmail && enrolledCourse && user) {
      const sanitizedEmail = userEmail.replace(/[.#$[\]]/g, "");
      const db = getDatabase();
      const userRef = ref(db, `users/${sanitizedEmail}/enrolledCourses`);
      push(userRef, { ...enrolledCourse, enrollmentStatus: "Enrolled" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.courseName}>{course.name}</Text>
      <Text style={styles.instructorName}>Instructor: {course.instructor}</Text>
      <Text style={styles.instructorName}>
        Description: {course.description}
      </Text>
      <Text style={styles.instructorName}>
        Course Duration: {course.courseDuration}
      </Text>
      <Text style={styles.instructorName}>Schedule: {course.schedule}</Text>
      <Text style={styles.instructorName}>Location: {course.location}</Text>
      <Text style={styles.instructorName}>
        Prerequisites: {course.prerequisites}
      </Text>
      <Text style={styles.instructorName}>Syllabus: {course.syllabus}</Text>
      <Text style={styles.enrollmentStatus}>
        Enrollment Status: {enrollmentStatus}
      </Text>
      {isLoggedIn &&
        enrollmentStatus !== "Enrolled" &&
        course.enrollmentStatus === "Open" &&
        !enrolledCourses.some((c) => c.name === course.name) && (
          <Button title="Enroll" onPress={handleEnroll} />
        )}
      {isLoggedIn ? (
        <Button
          title="StudentDashboard"
          onPress={navigateToStudentDashboard}
          disabled={enrolledCourses.some((c) => c.name === course.name)}
        />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  courseName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  instructorName: {
    fontSize: 18,
    marginBottom: 8,
  },
  enrollmentStatus: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default CourseDetails;
