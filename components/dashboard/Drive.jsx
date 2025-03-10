import { ArrowRight } from "lucide-react";

export default function Drive({ id, title, img, date, last_date }) {
    const eventDate = new Date(date);
    const lastEventDate = new Date(last_date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    lastEventDate.setHours(0, 0, 0, 0);

    let eventStatus;
    let statusColor;

    if (eventDate > today) {
        eventStatus = "Upcoming";
        statusColor = "bg-yellow-100 text-yellow-800 border-yellow-300";
    } else if (today > lastEventDate) {
        eventStatus = "Closed";
        statusColor = "bg-red-100 text-red-800 border-red-300";
    } else {
        eventStatus = "Active";
        statusColor = "bg-green-100 text-green-800 border-green-300";
    }

    return (
        <div className="md:w-72 sm:w-full bg-white border border-gray-200 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <img 
                className="rounded-t-xl h-40 w-full object-cover" 
                src={img} 
                alt="Drive" 
            />
            <div className="p-5">
                <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900">{title}</h5>
                
                <p className="mb-1 text-sm text-gray-700">📅 Date: <span className="font-medium">{date}</span></p>
                <p className="mb-1 text-sm text-gray-700">⏳ Last Date: <span className="font-medium">{last_date}</span></p>

                <div className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColor}`}>
                    {eventStatus}
                </div>

                <a 
                    href={`/drives/${id}`} 
                    className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all focus:ring-4 focus:ring-blue-300 focus:outline-none"
                >
                    Read More <ArrowRight className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
}
