import mongoose from "mongoose";

let patientSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required : true
    },
    userRole: {
        type: String,
        required : true,
        default : "patient"
    },
    emailVerified :{
        type : Boolean,
        required : true,
        default : false
    }
});

let Patient = mongoose.model('patient', patientSchema);

export default Patient;