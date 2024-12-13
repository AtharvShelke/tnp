import { UploadDropzone } from '@uploadthing/react';
import { Pencil } from 'lucide-react';
import React from 'react';

export default function PdfInput({ 
    className = "col-span-full", 
    label, 
    pdfUrl = "", 
    setPdfUrl, 
    endpoint = "pdfUploader" 
}) {
    return (
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
                        onClick={() => setPdfUrl("")}
                        type="button"
                        className="flex space-x-2 bg-slate-900 rounded-md shadow text-slate-50 px-2 py-1 items-center"
                    >
                        <Pencil className="w-4 h-4" />
                        <span className="text-sm font-medium">Change PDF</span>
                    </button>
                )}
            </div>
            {pdfUrl ? (
                <iframe src={pdfUrl} width="100%" height="600px" />
            ) : (
                <UploadDropzone
                    endpoint={endpoint}
                    onClientUploadComplete={(res) => {
                        setPdfUrl(res[0].url);
                        console.log("Files: ", res);
                        console.log("Upload Completed");
                    }}
                    onUploadError={(error) => {
                        console.log(`ERROR! ${error.message}`);
                    }}
                />
            )}
        </div>
    );
}
