import axiosInstance from "@/lib/axiosinstance";


// export const registerThermosnoopUser = async (first_name:string, last_name: string, email: string, contact: string, district: string, password: string) => {

//     try {
//         const response = await axiosInstance.post('/account', { first_name, last_name, email, contact, district, password});

//         if (response.status === 201) {
//             const {status, data} = response.data
//             return data; 
//         }
//         return null;
//     } catch (error) {
//         console.error('Error Saving user details:', error);
//         return null;
//     }
// }


export const registerThermosnoopUser = async (
  first_name: string,
  last_name: string,
  email: string,
  contact: string,
  district: string,
  password: string
) => {
  try {
    const response = await axiosInstance.post('/account', {
      first_name,
      last_name,
      email,
      contact,
      district,
      password
    });
    // Return the entire response for the register function to handle
    return response;
  } catch (error) {
    console.error('Error Saving user details:', error);
    throw error;
  }
};