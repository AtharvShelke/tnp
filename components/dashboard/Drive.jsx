

import { ArrowRight } from "lucide-react";



export default function Drive(props) {
    const eventDate = new Date(props.date);
    const lastEventDate = new Date(props.last_date);
    const today = new Date();




    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    let eventStatus;

    if (eventDate > today) {
        eventStatus = 'Upcoming';
    } else if (today > lastEventDate) {
        eventStatus = 'Closed';
    } else {
        eventStatus = 'Active';
    }



    return (
        <div>
            <div className="w-64 bg-white border border-gray-200 rounded-lg shadow">

                <img className="rounded-t-lg h-40 object-cover self-center mx-auto" src={props.img} alt="Drive" />

                <div className="p-5 relative">
                    <a href="#">
                        <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900">{props.title}</h5>
                    </a>
                    <p className="mb-1 font-normal text-gray-700 text-sm">Date: {props.date}</p>
                    <p className="mb-3 font-normal text-gray-700 text-sm">Last Date: {props.last_date}</p>
                    <p className="mb-3 font-normal text-gray-700 text-sm">
                        Status: <span className={`font-semibold ${eventStatus === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                            {eventStatus}
                        </span>
                    </p>
                    <a href={`/drives/${props.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                        Read more
                        <ArrowRight className="h-4 w-4" />
                    </a>

                </div>
            </div>
        </div>
    );
}
