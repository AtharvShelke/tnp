import toast from "react-hot-toast";

export const getRequest = async (endpoint) => {
    const timestamp = new Date().getTime();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${endpoint}`,{
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
        
    }
}



export const makePostRequest = async (reset, setLoading, endpoint, message, data) => {
    try {
        if (setLoading) setLoading(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json().catch(() => null); // Handle cases where response isn't JSON

        if (response.ok) {
            toast.success(`Successfully added the ${message}`);
            if (reset) reset(); // Prevents issues if reset isn't passed
            return responseData;
        } else {
            console.error("API Error:", responseData || response.statusText);
            toast.error(`Error: ${responseData?.error || response.statusText || "An error occurred"}`);
            return null;
        }
    } catch (error) {
        console.error("Request Error:", error);
        toast.error(`Error: ${error.message}`);
        return null;
    } finally {
        if (setLoading) setLoading(false);
    }
};


// export const updateRequest = async (reset, setLoading, endpoint, message, data)=>{
//     try {
//         setLoading(true)
//         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${endpoint}`, {
//             method:"PUT",
//             headers:{
//                 "Content-Type":"application/json"
//             },
//             body:JSON.stringify(data)
//         })

//         if (response.ok) {
//             toast.success(`Successfully Updated the ${message}`);
//             reset();
//         } else {
//             const errorText = await response.text(); 
//             console.error(errorText);
//             toast.error(`Error: ${errorText || 'An error occurred'}`);
//         }
//     } catch (error) {
//         setLoading(false);
        
//         toast.error(`Error: ${error.message}`);
//     }finally{
//         setLoading(false)
//     }
// }

export const deleteRequest = async (endpoint) => {
    const timestamp = new Date().getTime();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/${endpoint}`,
        {
          method: "DELETE",
          headers: {
            "Cache-Control": "no-store",
            "Pragma": "no-cache",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to Delete", error.message);
      toast.error("Failed to Delete");
    }
  };
  
  
  //  function for updating data
  export const updateRequest = async (endpoint, body) => {
    const timestamp = new Date().getTime();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/${endpoint}`,
        {
          method: "PUT",
          headers: {
            "Cache-Control": "no-store",
            "Pragma": "no-cache",
          },
          body: JSON.stringify(body),
        }
      );
  
      console.log("response is : " ,response)
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      toast.success("Updated successfully");
      return data;
    } catch (error) {
      console.error("Update failed", error.message);
      toast.error("Update failed");
    }
  };
  export const putRequest = async (endpoint, data) => {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  };

  export const updateStudentRequest = async (studentId, payload) => {
    try {
        const response = await fetch(`/api/student/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Failed to update student');
        }

        const data = await response.json();
        console.log('Student updated successfully:', data);
    } catch (error) {
        console.error('Error updating student:', error);
    }
};
export const createStudentRequest = async (payload) => {
  try {
      const response = await fetch('/api/student', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      });

      if (!response.ok) {
          throw new Error('Failed to create student');
      }

      const data = await response.json();
      console.log('Student created successfully:', data);
  } catch (error) {
      console.error('Error creating student:', error);
  }
};