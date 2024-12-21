export const GET = async () => {
    try {
        // Fetch the list of students
        const studentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/student/`);
        if (!studentResponse.ok) {
          throw new Error('Failed to fetch student data');
        }
        const students = await studentResponse.json();
    
        // Combine user and department data with each student
        const combinedUserDataPromises = students.map(async (student) => {
          try {
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${student.userId}`);
            if (!userResponse.ok) {
              throw new Error(`Failed to fetch user data for userId: ${student.userId}`);
            }
            const userData = await userResponse.json();
    
            const departmentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/department/${student.departmentId}`);
            if (!departmentResponse.ok) {
              throw new Error(`Failed to fetch department data for departmentId: ${student.departmentId}`);
            }
            const departmentData = await departmentResponse.json();
    
            return {
              prn: student.PRN,
              name: userData.name,
              department: departmentData.title,
              dob: student.dob,
              gender: student.gender,
              email: userData.email,
              phone: student.phone,
              address: student.address,
              cgpa: student.cgpa,
              yearGap: student.yearGap,
              liveBacklogs: student.liveBack,
              deadBacklogs: student.deadBack,
              admissionType: student.admissionType,
              passOutYear: student.passOutYear,
              preference1: student.preference1,
              preference2: student.preference2,
              preference3: student.preference3,
              placed: student.placed,
            };
          } catch (error) {
            console.error(`Error fetching data for student ${student.PRN}:`, error);
            return null; // Skip this student if data fetching fails
          }
        });
    
        const combinedData = await Promise.all(combinedUserDataPromises);
        const filteredData = combinedData.filter((data) => data !== null); // Remove null entries
    
        res.status(200).json(filteredData);
      } catch (error) {
        console.error('Error in /api/student/combined:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
}