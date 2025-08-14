import { Router } from 'express';
import * as controller from '../controller/course.js';
import verifyToken from '../middleware/verifyToken.js';

import {checkCourseOwnership,checkRole} from '../middleware/CheckAccess.js';

const router = Router();

//API routes of events
// Create a new course
router.post('/create', verifyToken, checkRole(['admin']), controller.createCourse);

// Get all courses
router.get('/all', controller.getCourses);

// Get a course by ID
router.get('/:id', controller.getCourseById);


// Update a course
router.put('/:id',verifyToken,checkRole(['admin']),checkCourseOwnership, controller.updateCourse);



router.delete('/:id', verifyToken, checkRole(['admin']), checkCourseOwnership, controller.deleteCourse);

// To check for just one role, you can simply pass an array with a single item.
// checkRole(['teacher'])


export default router;
