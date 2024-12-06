import { UploadDropzone } from '@uploadthing/react';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

export default function PdfInput({
    className="col-span-full",
    label, 
    pdfUrl="",
    setpdfUrl,
    endpoint="pdfUploader"
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
                    {pdfUrl && (
                        <button
                            onClick={() => setpdfUrl("")}
                            type="button"
                            className="flex space-x-2  bg-slate-900 rounded-md shadow text-slate-50 px-2 py-1 items-center"
                        >
                            <Pencil className="w-4 h-4" />
                            <span className='text-sm font-medium'>Change pdf</span>
                        </button>
                    )}
                </div>
                {pdfUrl ? (
                    <iframe src={pdfUrl} width={'100%'} height={'600px'}/>
                ) : (
                    <UploadDropzone
                        endpoint={endpoint}
                        onClientUploadComplete={(res) => {
                            setpdfUrl(res[0].url);
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
