import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const StudentDashboard = ({ navigation }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchEnrolledCourses = () => {
      const db = getDatabase();
      const userUid = auth.currentUser.email;
      const sanitizedEmail = userUid.replace(/[.#$[\]]/g, "");
      const enrolledCoursesRef = ref(
        db,
        `users/${sanitizedEmail}/enrolledCourses`
      );

      onValue(enrolledCoursesRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const coursesArray = Object.values(data);
          setEnrolledCourses(coursesArray);
        }
      });
    };

    fetchEnrolledCourses();
  }, [auth]);

  const navigateToCourseListing = () => {
    navigation.navigate("CourseListing");
  };

  const navigateToStudentLogin = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("StudentLogin");
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Go to Course Listing"
        onPress={navigateToCourseListing}
        style={styles.button}
      />

      <FlatList
        data={enrolledCourses}
        keyExtractor={(item, index) =>
          item && item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <View
            key={item && item.id ? item.id.toString() : ""}
            style={styles.courseItem}
          >
            <Text style={styles.courseName}>{item && item.name}</Text>
            <Text style={styles.instructorName}>
              Instructor: {item && item.instructor}
            </Text>
            <Text style={styles.dueDate}>Due Date: {item && item.DueDate}</Text>

            <View style={styles.progressBar}>
              <View
                style={{
                  width: `${item && item.Progress ? item.Progress : 0}%`,
                  backgroundColor: "green",
                  height: 10,
                }}
              />
            </View>
            <Text style={styles.progressText}>
              Progress: {item && item.Progress}%
            </Text>
          </View>
        )}
      />

      <Button
        title="Logout"
        onPress={navigateToStudentLogin}
        color="#ff0000"
        style={[styles.button, styles.logoutButton]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  courseItem: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  instructorName: {
    fontSize: 16,
    marginTop: 8,
  },
  dueDate: {
    fontSize: 16,
    marginTop: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#ccc",
    marginTop: 8,
  },
  button: {
    marginBottom: 30,
  },
  logoutButton: {
    marginTop: 30,
  },
});

export default StudentDashboard;
