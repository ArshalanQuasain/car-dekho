import React, { useState } from 'react';
import TagInput from '../../components/Input/TagInput';
import ImageInput from '../../components/Input/InputImage'
import { MdClose } from 'react-icons/md';
import axiosInstances from '../../utils/axiosinstance';

function AddEditCar({ carData, getAllCars, type, onClose, showToastMsg }) {
    const [formData, setFormData] = useState({
        title: carData?.title || "",
        description: carData?.description || "",
        tags: carData?.tags || [],
    });
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState("");

    // Handle text and tag inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTagChange = (tags) => {
        setFormData((prev) => ({ ...prev, tags }));
    };

    // Validate inputs
    const validateForm = () => {
        if (!formData.title) return "Title is required.";
        if (!formData.description) return "Description is required.";
        return "";
    };

    // Add or Edit car
    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        const carFormData = new FormData();
        carFormData.append("title", formData.title);
        carFormData.append("description", formData.description);
        formData.tags.forEach((tag, index) => carFormData.append(`tags[${index}]`, tag));
        photos.forEach((photo) => carFormData.append("photos", photo));

        try {
            const endpoint = type === "edit" ? `/updateCarListing/${carData._id}` : "/add-car";
            const method = type === "edit" ? "put" : "post";

            const response = await axiosInstances[method](endpoint, carFormData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data && response.data.data) {
                const message = type === "edit" ? "Car updated successfully!" : "Car added successfully!";
                showToastMsg(message, type === "edit" ? "edit" : "add");
                getAllCars();
                onClose();
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while processing your request. Please try again.");
        }
    };

    return (
        <div className="relative p-4">
            {/* Close Button */}
            <button
                className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-300"
                onClick={onClose}
            >
                <MdClose className="text-xl text-slate-400" />
            </button>

            {/* Title Input */}
            <div className="flex flex-col gap-2">
                <label className="input-label">TITLE</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Enter car title"
                />
            </div>

            {/* Description Input */}
            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">DESCRIPTION</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="text-xs text-slate-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder="Enter car description"
                    rows={5}
                />
            </div>

            {/* Tags Input */}
            <div className="mt-4">
                <label className="input-label">TAGS</label>
                <TagInput tags={formData.tags} setTags={handleTagChange} />
            </div>

            {/* File Input with ImageInput Component */}
            <div className="mt-4">
                <label className="input-label">PHOTOS</label>
                <ImageInput images={photos} setImages={setPhotos} />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

            {/* Submit Button */}
            <button className="btn-primary font-medium mt-5 p-3 w-full" onClick={handleSubmit}>
                {type === "edit" ? "UPDATE" : "ADD"}
            </button>
        </div>
    );
}

export default AddEditCar;
