import toast from "react-hot-toast";

export const getRequest = async (endpoint) => {
    const timestamp = new Date().getTime();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${endpoint}?timestamp=${timestamp}`,{
            method:"GET",
            headers:{
                "Cache-Control":"no-store",
                "Pragma":"no-cache"
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch", error.message);
        toast.error("Failed to fetch")
    }
}