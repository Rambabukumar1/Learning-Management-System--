import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch All courses
    const fetchAllCourses = async () => {
        try {
            setAllCourses(dummyCourses); // Replace with actual API call
        } catch (error) {
            setError("Error fetching courses");
            console.error("Error fetching all courses:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch User Enrolled Courses
    const fetchEnrolledCourses = async () => {
        try {
            setEnrolledCourses(dummyCourses); // Replace with actual API call
        } catch (error) {
            setError("Error fetching enrolled courses");
            console.error("Error fetching enrolled courses:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to calculate average rating of a course
    const calculateRating = (course) => {
        if (!Array.isArray(course.courseRatings)) return 0;
        if (course.courseRatings.length === 0) return 0;
        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating;
        });
        return totalRating / course.courseRatings.length;
    };

    // Function to calculate Chapter Time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.forEach((lecture) => time += lecture.lectureDuration);
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
    };

    // Function to Calculate Course Duration
    const CalculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.forEach((chapter) =>
            chapter.chapterContent.forEach(
                (lecture) => time += lecture.lectureDuration
            )
        )
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm']})
    }

    // Function to calculate the number of lectures in a course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    };

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchAllCourses(), fetchEnrolledCourses()]);
        };

        fetchData();
    }, []);

    const value = {
        currency, allCourses, navigate, calculateRating,
        isEducator, setIsEducator, calculateNoOfLectures, CalculateCourseDuration,
        calculateChapterTime, enrolledCourses, fetchEnrolledCourses, loading, error
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
