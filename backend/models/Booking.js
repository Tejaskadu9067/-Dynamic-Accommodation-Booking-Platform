const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    place:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    checkIn:{
        type: Date,
        required: true
    },
    checkOut:{
        type: Date,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    price:{
        type: Number
    }
})

const BookingModel = mongoose.model("Booking", bookingSchema)
module.exports = BookingModel;