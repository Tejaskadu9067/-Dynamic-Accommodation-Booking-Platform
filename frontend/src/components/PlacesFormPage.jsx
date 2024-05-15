import React, { useEffect, useState } from "react";
import Perks from "./Perks";
import axios from "axios";
import PhotosUploader from "./PhotosUploader";
import AccountNav from "./AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
    const{id} = useParams()
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(2);
  const [price, setPrice] = useState(100);
  const[redirect, setRedirect] = useState(false)
  useEffect(()=>{
    if(!id){
        return;
    }
    axios.get('/places/'+id).then(response =>{
        const {data} = response;
        setTitle(data.title)
        setAddress(data.address)
        setAddedPhotos(data.photos)
        setDescription(data.description)
        setPerks(data.perks)
        setExtraInfo(data.extraInfo)
        setCheckIn(data.checkIn)
        setCheckOut(data.checkOut)
        setMaxGuests(data.maxGuests)
        setPrice(data.price)
    })
  },[id])

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4 ">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(e) {
    e.preventDefault();
    try {
        if (id) {
            await axios.put(`/places/:id`, {
                id,
                title,
                address,
                addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price
            });
        } else {
            await axios.post("/places", {
                title,
                address,
                addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price
            });
        }
        setRedirect(true);
    } catch (error) {
        console.error("Error saving/updating place:", error);
        // Handle the error as needed, e.g., show an error message to the user
    }
}

  if(redirect){
    return <Navigate to={'/account/places'}/>
  }
  return (
    <div>
        <AccountNav/>
      <form onSubmit={savePlace}>
        {preInput("Title", "title for your place")}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="text"
          placeholder="title, for example: My lovely apartment"
        />
        {preInput("Address", "address for your place")}
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          className="text"
          placeholder="address"
        />

        {preInput("Photots", "photos for your place")}

        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {preInput("Description", "description of the place")}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {preInput("Perks", "Select all the perks of your place")}
        <Perks selected={perks} onChange={setPerks} />

        {preInput("Extra info", "house rules..etc")}
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />

        {preInput("Check in&out time", "add check in and out time")}
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 ">
          <div>
            <h3 className="mt-2 -mb-1 ">Check In time</h3>
            <input
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              type="text"
              className="text"
              placeholder="14:00"
            />
          </div>

          <div>
            <h3 className="mt-2 -mb-1 ">Check Out time</h3>
            <input
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              type="text"
              className="text"
            />
          </div>

          <div>
            <h3 className="mt-2 -mb-1 ">Max number of Guests</h3>
            <input
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              type="number"
              className="text"
            />
          </div>

          <div>
            <h3 className="mt-2 -mb-1 ">Price per night</h3>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              className="text"
            />
          </div>
        </div>
        <button className="primary my-4">Save </button>
      </form>
    </div>
  );
}
