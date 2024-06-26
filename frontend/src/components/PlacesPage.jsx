import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import AccountNav from "./AccountNav";
import axios from "axios";
import PlaceImg from "./PlaceImg";

function PlacesPage() {
  const [places, setPlaces] = useState("");
  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      <AccountNav />

      <div className="text-center">
        <Link
          className="bg-primary inline-flex gap-1 text-wgite py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>
        <div className="mt-8 ">
          {places.length > 0 &&
            places.map((place) => (
              <Link
                key={place._id} // Add key prop here
                to={"/account/places/"+place._id}
                className="flex mt-4 w-auto cursor-pointer gap-4 bg-blue-100 p-4 rounded-2xl"
              >
                <div className="flex h-32 w-22 min-w-28 bg-gray-300 shrink-0 ">
                  <PlaceImg place={place}/>
                </div>
                <div className="grow-0 shrink">
                  <h2 className="text-xl font-semibold">{place.title}</h2>
                  <p className="text-sm mt-2">{place.description}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PlacesPage;
