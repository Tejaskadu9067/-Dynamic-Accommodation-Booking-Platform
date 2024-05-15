import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidget from "./BookingWidget";
import PlaceGallery from "./PlaceGallery";
import AddressLink from "./AddressLink";

export default function PlacePage() {
  const [place, setPlace] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((res) => {
      console.log(res.data);
      setPlace(res.data);
    });
  }, [id]);

  if (!place) return "";

  return (
    <>
      <div className="mt-8 bg-gray-100 -mx-8 px-8 pt-8">
        <h1 className="text-3xl">{place.title}</h1>
        <AddressLink>{place.address}</AddressLink>
        <PlaceGallery place={place}/>
        
        <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr] ">
          <div>
          <div className="my-4">
          <h2 className="font-semibold text-2xl ">Description</h2>
          {place.description}
        </div>
            <b>Check In:</b> {place.checkIn}
            <br />
            <b>Check Out:</b> {place.checkOut}
            <br />
            <b>Max number of guests:</b> {place.maxGuests}
            
          </div>
          <div>
            <BookingWidget place={place} className = 'mb-2 mt-4 text-gray-500'/>
          </div>
        </div>
        <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
                <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="text-sm text-gray-700 my-4 leading-5 mb-4 mt-2">{place.extraInfo}</div>
        </div>
        
      </div>
    </>
  );
}
