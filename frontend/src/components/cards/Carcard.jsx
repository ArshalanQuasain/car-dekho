import React, { useState } from 'react';
import { MdCreate, MdDelete } from 'react-icons/md';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function CarCard({ title, images = [], description, tags = [], onEdit, onDelete }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Navigate to the next image
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex < images.length - 1 ? prevIndex + 1 : 0 // Loop back to the first image
        );
    };

    // Navigate to the previous image
    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : images.length - 1 // Loop back to the last image
        );
    };

    return (
        <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out max-w-sm">
            {/* Title */}
            <div className="flex items-center justify-between mb-4">
                <h6 className="text-lg font-semibold">{title}</h6>
            </div>

            {/* Image Carousel */}
            <div className="relative flex items-center justify-center mb-4">
                {images.length > 0 ? (
                    <img 
                        src={images[currentImageIndex]} 
                        alt={`${title} image ${currentImageIndex + 1}`} 
                        className="w-full h-48 object-cover rounded"
                        onError={(e) => { e.target.src = 'fallback_image_url_here'; }} // Set a fallback image if URL is invalid
                    />
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded">
                        <span className="text-gray-500">No Image Available</span>
                    </div>
                )}
                
                {/* Previous Arrow */}
                {images.length > 1 && (
                    <button 
                        onClick={handlePrevImage} 
                        className="absolute left-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-200"
                    >
                        <FaArrowLeft />
                    </button>
                )}
                
                {/* Next Arrow */}
                {images.length > 1 && (
                    <button 
                        onClick={handleNextImage} 
                        className="absolute right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-200"
                    >
                        <FaArrowRight />
                    </button>
                )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 mb-2">{description?.slice(0, 100)}...</p>

            {/* Tags Section */}
            {tags.length > 0 && (
                <div className="text-xs text-slate-500 mb-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="mr-2">#{tag}</span>
                    ))}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2">
                <MdCreate 
                    className="icon-btn hover:text-green-600" 
                    onClick={onEdit} 
                />
                <MdDelete 
                    className="icon-btn hover:text-red-500" 
                    onClick={onDelete} 
                />
            </div>
        </div>
    );
}

export default CarCard;
