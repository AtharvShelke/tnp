import { ArrowUpRight } from "lucide-react";


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
                    
                    <a href={`booklets/${props.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300   ">
                        Read more
                        <ArrowUpRight/>
                    </a>
                </div>
            </div>

        </div>
    )
}
