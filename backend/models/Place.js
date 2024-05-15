const mongoose = require("mongoose")

const placeSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title:{
        type: String
    },
    address:{
        type: String
    },
    photos:{
        type: Array
    },
    description:{
        type: String
    },
    perks:{
        type: Array
    },
    extraInfo:{
        type: String
    },
    checkIn:{
        type: Number
    },
    checkOut:{
        type: Number
    },
    maxGuests:{
        type: Number
    },
    price:{
        type: Number
    }
})

const PlaceModel = mongoose.model("Place", placeSchema)
module.exports = PlaceModel;