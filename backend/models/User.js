import mongoose from "mongoose";

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true, 
        minlength: 5
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
    updateDate:{
        type:Date,
        default: Date.now,
    },
    deletionDate: {
        type: Date,
    }

})

export default mongoose.model("User", userSchema)
