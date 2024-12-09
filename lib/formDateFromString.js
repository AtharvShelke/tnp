const formDateFromString = (string) => {
    const date = new Date(string);
  
    const formattedDate = date.toISOString().split('T')[0];
  
     return formattedDate;
  } 

export default formDateFromString;