import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CourseListingScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const coursesRef = ref(db, "courses");

    const unsubscribeCourses = onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const coursesArray = Object.values(data);
        setCourses(coursesArray);
      }
    });

    const auth = getAuth();
    const unsubscribeUser = onAuthStateChanged(auth, (userData) => {
      setUser(userData);
    });

    const usersRef = ref(db, "users");

    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData && user && user.email) {
        const currentUserData = userData[user.email];
        setUser(currentUserData);
      }
    });

    return () => {
      unsubscribeCourses();
      unsubscribeUser();
      unsubscribeUsers();
    };
  }, []);

  const handleLoginPress = () => {
    navigation.navigate("StudentLogin");
  };

  const isUserEnrolled = (course) => {
    return (
      user &&
      user.email &&
      user.enrollmentStatus === "Enrolled" &&
      course.enrolledCourses &&
      course.enrolledCourses.includes(user.email)
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={courses.filter((course) => !isUserEnrolled(course))}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseItem}
            onPress={() => {
              navigation.navigate("CourseDetails", { course: item });
            }}
          >
            <Text style={styles.courseName}>{item.name}</Text>
            <Text style={styles.instructorName}>
              Instructor: {item.instructor}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Login" onPress={handleLoginPress} />
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
    marginBottom: 8,
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
});

export default CourseListingScreen;
