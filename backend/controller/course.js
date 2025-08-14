// course.js
import { Course } from '../models/course.js'; // Import the new Mongoose Course model

// Create Course
export const createCourse = async (req, res) => {
    try {
        const { courseName, description } = req.body;
        // Create a new course using the Mongoose model
        const newCourse = await Course.create({ courseName, description });

        res.status(201).json({ courseId: newCourse._id });
        console.log('Course created successfully');
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Courses
export const getCourses = async (req, res) => {
    try {
        // Find all courses and populate the teacherID with user data
        const courses = await Course.find({}).populate('description');
        res.json(courses);
    } catch (error) {
        console.error('Error getting courses:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Course by ID
export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        // Find a single course by its Mongoose _id and populate teacher data
        const course = await Course.findById(courseId).populate('description');

        if (!course) {
            return res.status(404).send('Course not found');
        }
        res.json(course);
    } catch (error) {
        console.error('Error getting course:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update Course
export const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const { courseName } = req.body;
        
        // Find and update a course by its ID
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { courseName, adminID },
            { new: true } // Return the updated document
        );

        if (!updatedCourse) {
            return res.status(404).send('Course not found');
        }
        res.json(updatedCourse);
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete Course
export const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        // Find and delete a course by its ID
        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return res.status(404).send('Course not found');
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
