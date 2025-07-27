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

    if (response.status === 201) {
      return response.data;
    }
    // For any non-201 status, throw an error
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error) {
    console.error('Error Saving user details:', error);
    // Re-throw the error so it can be caught in the register function
    throw error;
  }
};