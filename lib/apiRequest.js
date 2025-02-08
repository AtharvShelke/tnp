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

export const makePostRequest = async(reset, setLoading, endpoint, message, data) => {
    try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${endpoint}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)

        })
        if (response.ok) {
            toast.success(`Successfully Added the ${message}`);
            reset(); 
        }
        else {
            const errorText = await response.text(); 
            console.error(errorText);
            toast.error(`Error: ${errorText || 'An error occurred'}`);
        }
    } catch (error) {
        
        toast.error(`Error: ${error.message}`);
    }finally{
        setLoading(false);

    }
}

export const updateRequest = async (reset, setLoading, endpoint, message, data)=>{
    try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${endpoint}`, {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })

        if (response.ok) {
            toast.success(`Successfully Updated the ${message}`);
            reset();
        } else {
            const errorText = await response.text(); 
            console.error(errorText);
            toast.error(`Error: ${errorText || 'An error occurred'}`);
        }
    } catch (error) {
        setLoading(false);
        
        toast.error(`Error: ${error.message}`);
    }finally{
        setLoading(false)
    }
}