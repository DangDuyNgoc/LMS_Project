import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { useFonts } from "expo-font";
import {
  Raleway_600SemiBold,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import Loader from "@/components/loader/loader";
import { LinearGradient } from "expo-linear-gradient";
import CourseCard from "@/components/cards/course.card";

export default function CoursesScreen() {k
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CoursesType[]>([]);
  const [categories, setCategories] = useState<{ title: string }[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [originalCourses, setOriginalCourses] = useState<CoursesType[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${SERVER_URI}/layout/get-layout/Categories`);
      setCategories(res.data?.layout?.categories);
    } catch (error) {
      console.log("Error fetching categories: ", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${SERVER_URI}/course/get-courses`);
      setCourses(res.data.course);
      setOriginalCourses(res.data.course);
    } catch (error) {
      console.log("Error fetching courses: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchCategories();
      await fetchCourses();
      setLoading(false);
    };

    fetchData();
  }, []);

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Raleway_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleCategories = (e: string) => {
    setActiveCategory(e);
    if (e === "All") {
      setCourses(originalCourses);
    } else {
      const filterCourses = originalCourses.filter(
        (i: CoursesType) => i.categories === e
      );
      setCourses(filterCourses);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={{ flex: 1, paddingTop: 65 }}
        >
          <View style={{ padding: 10 }}>
            <FlatList
              horizontal
              data={[{ title: "All" }, ...categories]}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: activeCategory === item.title ? "#2467EC" : "#000",
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    marginRight: 5,
                  }}
                  onPress={() => {
                    if (activeCategory !== item.title) handleCategories(item.title);
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View>
            <ScrollView style={{ marginHorizontal: 15, gap: 12 }}>
              {courses?.map((course: CoursesType, index: number) => (
                <CourseCard item={course} key={index} />
              ))}
            </ScrollView>
            {courses?.length === 0 && (
              <Text
                style={{ textAlign: "center", paddingTop: 50, fontSize: 18 }}
              >
                No data available!
              </Text>
            )}
          </View>
        </LinearGradient>
      )}
    </>
  );
}
