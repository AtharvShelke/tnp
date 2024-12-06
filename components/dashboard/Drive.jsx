

export default function Drive(props) {
    return (
        <div>


            <div className="w-64  bg-white border border-gray-200 rounded-lg shadow ">
                <a href="#">
                    <img className="rounded-t-lg" src={props.img} alt="" />
                </a>
                <div className="p-5 relative">
                    <a href="#">
                        <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 ">{props.title}</h5>
                    </a>
                    <p className="mb-1 font-normal text-gray-700 text-sm">Date:{props.date}</p>
                    <p className="mb-3 font-normal text-gray-700 text-sm">Last Date:{props.last_date}</p>
                    <a href="/drives/drive" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300   ">
                        Read more
                        <svg className="rtl:rotate-180 w-3 h-3 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </a>
                </div>
            </div>

        </div>
    )
}
