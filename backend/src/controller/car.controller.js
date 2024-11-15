import { asyncHandler } from '../utils/assynchandler.js';
import { ApiResponse } from '../utils/apiresponse.js';
import { ApiError } from '../utils/aperror.js';
import { Car } from '../models/car.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Create a new car listing
const createCarListing = asyncHandler(async (req, res) => {
    const { title, description, tags } = req.body;

    // Check if all required fields are provided
    if (![title, description].every(field => field && field.trim())) {
        throw new ApiError(400, "All fields are required.");
    }

    const photos = req.files.photos;
    if (!photos || photos.length === 0) {
        throw new ApiError(400, "At least one photo is required.");
    }

    // Upload each photo to Cloudinary and collect the URLs
    const photoUrls = [];
    for (const photo of photos) {
        const localPath = photo.path;
        const uploadResponse = await uploadOnCloudinary(localPath); 
        if (uploadResponse && uploadResponse.url) {
            photoUrls.push(uploadResponse.url);
        } else {
            console.error("Failed to upload photo:", localPath);
        }
    }
    const userId = req.user._id;
    const car = await Car.create({
        title,
        description,
        tags,
        photos: photoUrls, 
        owner: userId,
    });
    if (!car) {
        throw new ApiError(500, "Car listing creation failed");
    }

    return res.status(201).json(new ApiResponse(201, car, "Car listing created successfully"));
});


const getUserCars = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query; 

    const cars = await Car.find({ owner: userId })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    if (cars.length === 0) {
        throw new ApiError(404, "No car listings found.");
    }

    return res.status(200).json(new ApiResponse(200, cars, "User's car listings fetched successfully"));
});


// Update a car listing
const updateCarListing = asyncHandler(async (req, res) => {
    const { carId } = req.params;
    const { title, description, tags } = req.body;

    // Find car by ID
    const car = await Car.findById(carId);

    if (!car) {
        throw new ApiError(404, "Car listing not found");
    }

    // Check if the user is the owner
    if (car.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to update this car listing");
    }

    const photos = req.files.photos;
    if (!photos || photos.length === 0) {
        throw new ApiError(400, "At least one photo is required.");
    }

    // Upload each photo to Cloudinary and collect the URLs
    const photoUrls = [];
    for (const photo of photos) {
        const localPath = photo.path;
        const uploadResponse = await uploadOnCloudinary(localPath); 
        if (uploadResponse && uploadResponse.url) {
            photoUrls.push(uploadResponse.url);
        } else {
            console.error("Failed to upload photo:", localPath);
        }
    }

    car.title = title || car.title;
    car.description = description || car.description;
    car.tags = tags || car.tags;
    car.photos = photoUrls || car.photos ; 

    await car.save();

    return res.status(200).json(new ApiResponse(200, car, "Car listing updated successfully"));
});

// Delete a car listing
const deleteCarListing = asyncHandler(async (req, res) => {
    const noteId = req.params.carId;

    const car = await Car.findByIdAndDelete(noteId);

    if (!car) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Car deleted successfully"));
});

// Search cars based on query
const getSearchCars = asyncHandler(async (req, res) => {
    const user = req.user;
    const query = req.query.q;

    if (!query) {
        throw new ApiError(400, "Query parameter 'q' must be provided");
    }

    try {
        const regexQuery = new RegExp(query, "i");  // Cache the regex to use it across multiple fields

        const matchingCars = await Car.find({
            owner: user._id,
            $or: [
                { title: { $regex: regexQuery } },
                { description: { $regex: regexQuery } },
                { tags: { $elemMatch: { $regex: regexQuery } } },
            ],
        }).sort({ createdAt: -1 });

        return res.status(200).json(new ApiResponse(200, matchingCars, "All matched cars retrieved successfully"));
    } catch (error) {
        console.error('Error searching cars:', error);
        throw new ApiError(500, "Internal server error");
    }
});

export {
    createCarListing,
    getUserCars,
    updateCarListing,
    deleteCarListing,
    getSearchCars
};
