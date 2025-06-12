import { signOut } from "next-auth/react";
import toast from "react-hot-toast";


export const makeAdmin = async (userId) => {

    try {
        const data = { userId };
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json().catch(() => null);

        if (response.ok) {
            toast.success('Successfully made the user an admin');
            signOut();
            return responseData;
        } else {
            toast.error(`Error: ${responseData?.error || response.statusText}`);
            return null;
        }
    } catch (error) {
        console.error("Request Error:", error);
        toast.error(`Error: ${error.message}`);
        return null;
    }
}

export const postRequest = async (endpoint, data, message) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
      });
    
      if (response.ok) {
        toast.success(`${message}`)
       
      } else {
        const errorText = await response.text(); 
        console.log(errorText);
        toast.error(`Error: ${errorText || 'An error occurred'}`);
      }
}

