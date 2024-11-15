import React, { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

function ImageInput({ images, setImages }) {
    const [selectedImages, setSelectedImages] = useState(images || []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const updatedImages = [...selectedImages, ...files];
        console.log(updatedImages);
        setSelectedImages(updatedImages);
        setImages(updatedImages);
    };

    const handleRemoveImage = (imageToRemove) => {
        const updatedImages = selectedImages.filter((image) => image !== imageToRemove);
        setSelectedImages(updatedImages);
        setImages(updatedImages);
    };

    return (
        <div>
            <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-600">
                    <MdAdd className="text-2xl text-blue-700 hover:text-white" />
                </div>
                <span>Add Photos</span>
            </label>

            {selectedImages.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mt-2">
                    {selectedImages.map((image, index) => (
                        <div key={index} className="relative w-10 h-10">
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`Upload preview ${index + 1}`}
                                className="object-cover w-full h-full rounded"
                            />
                            <button
                                onClick={() => handleRemoveImage(image)}
                                className="absolute top-0 right-0 bg-white rounded-full p-0.5 hover:bg-gray-200"
                                style={{ transform: 'translate(25%, -25%)' }}
                            >
                                <MdClose className="text-xs text-black" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ImageInput;
