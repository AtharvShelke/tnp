import { UploadDropzone } from '@uploadthing/react';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

export default function ImageInput({
    className="col-span-full",
    label, 
    imageUrl="",
    setImageUrl,
    endpoint="imageUploader"
}) {
    return (
        <>
            {/* Upload thing */}
            <div className={className}>
                <div className="flex justify-between items-center mb-4">
                    <label
                        htmlFor="item-image"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        {label}
                    </label>
                    {imageUrl && (
                        <button
                            onClick={() => setImageUrl("")}
                            type="button"
                            className="flex space-x-2  bg-slate-900 rounded-md shadow text-slate-50 px-2 py-1 items-center"
                        >
                            <Pencil className="w-4 h-4" />
                            <span className='text-sm font-medium'>Change Image</span>
                        </button>
                    )}
                </div>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="item image"
                        width={1000}
                        height={667}
                        className="w-full h-64 object-contain"
                    />
                ) : (
                    <UploadDropzone
                        endpoint={endpoint}
                        onClientUploadComplete={(res) => {
                            setImageUrl(res[0].url);
                            // Do something with the response
                            console.log("Files: ", res);
                            console.log("Upload Completed");
                        }}
                        onUploadError={(error) => {
                            // Do something with the error.
                            console.log(`ERROR! ${error.message}`);
                        }}
                    />
                )}
            </div>
        </>
    )
}
