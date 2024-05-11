import React from 'react'
import { useState } from 'react'
import axios from "axios"

export default function PhotosUploader({addedPhotos, onChange}) {

    
    const [photoLink, setPhotoLink] = useState('')

    async function addPhotoByLink(e){
        e.preventDefault()
        const {data:filename} = await axios.post('/upload-by-link', {link:photoLink})
        onChange(prev => {
          return [...prev, filename]
        })
        setPhotoLink('');
    
      }
    
      async function uploadPhoto(e){
        const files = e.target.files;
        const data = new FormData()
        for(let i=0; i<files.length; i++){
    
          data.append('photos', files[i])
        }
        
       axios.post('/upload', data, {
          headers : {
            'Content-type' : 'multipart/form-data'
          }
        }).then(response =>{
          const {data:filenames} = response
          onChange(prev => {
            return [...prev, ...filenames]
          })
        })
        
      }
  return (
    <>
    <div className="flex gap-2">
              <input
                value={photoLink}
                onChange={(e)=> setPhotoLink(e.target.value)}
                type="text"
                placeholder={"Add using link....jpg"}
                className=""
              />
              <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">
                Add&nbsp;photo
              </button>
            </div>
            
            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {addedPhotos.length > 0 && addedPhotos.map(link=>(
                <div key={link} className="h-32 flex">
                  <img className="rounded-2xl w-full object-cover" src={'http://localhost:8000/uploads/'+link} alt="" />
                </div>
              ))}
              <label className="flex h-32 cursor-pointer items-center justify-center gap-1 border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
              <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                  />
                </svg>
                Upload
              </label>
            </div>
            </>
  )
}
