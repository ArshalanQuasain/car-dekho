import { Router } from 'express';
import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
} from '../controller/user.controller.js';

import {createCarListing , getUserCars,
    updateCarListing,
    deleteCarListing,
    getSearchCars} from "../controller/car.controller.js"

import {verifyJWT} from "../middlewwares/auth.middleware.js";
import { upload } from '../middlewwares/multer.middleware.js';

const router = Router();

// User routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route('/current-user').get(verifyJWT, getCurrentUser);

// Car routes
router.route('/add-car').post(verifyJWT,  upload.fields([
    {
        name : "photos" ,
        maxCount : 10 
    }
]) ,
    createCarListing);
router.route('/getUserCars').get(verifyJWT, getUserCars);
router.route('/updateCarListing/:carId').put(verifyJWT,upload.fields([
    {
        name : "photos" ,
        maxCount : 10 
    }
]) , updateCarListing); 
router.route('/deleteCarListing/:carId').delete(verifyJWT, deleteCarListing); // Changed "noteId" to "carId"
router.route('/getSearchCars').get(verifyJWT, getSearchCars);

export default router;