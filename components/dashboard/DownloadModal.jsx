'use client'
import { Download } from "lucide-react";
import { useState } from "react";

export default function DownloadModal(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={props.className}>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className=" border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all flex items-center gap-5"
            >

                Documents
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow ">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                            <h3 className="text-lg font-semibold text-gray-90">
                                Download Documents
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center "
                            >
                                <span className="sr-only">Close modal</span>
                                ✕
                            </button>
                        </div>
                        <div className="p-4 md:p-5">

                            <ul className="space-y-3">

                                {props.documents.map((document, i) => (
                                    <li key={i}>

                                        <a
                                            href={document.link} download className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow  "
                                        >
                                            <span className="flex-1 ms-3 whitespace-nowrap">{document.title}</span>
                                            <Download />
                                        </a>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
