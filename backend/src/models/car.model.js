import mongoose, { Schema } from 'mongoose';

const carSchema = new Schema(
    {
        title: {
            type: String, 
            required: true,
        },
        description: {
            type: String, 
            required: true,
        },
        tags: {
            type: [String], 
            default: [],
        },
        photos: {
            type: [String], 
            validate: {
                validator: function (value) {
                    return value.length <= 10;
                },
                message: 'You can upload a maximum of 10 photos.',
            },
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true 
        }
    },
    {
        timestamps: true 
    }
);

export const Car = mongoose.model("Car", carSchema);
