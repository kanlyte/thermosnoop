import axiosInstance from "@/lib/axiosinstance";
import axios from "axios";

export const getFarmsPerUser = async (
    user_id: string,
)=>{
    try {
        const response = await axiosInstance.get(`/myfarms/${user_id}`);
        if(response.data.status === "true" || response.status === 200){
            return {
                success: "farms retrived successfully",
                result: response.data.result,
            }
        }else{
            return{
                 error: response.data.data || "An Error Occured"
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return { error: error.response.data?.reason || "Invalid OTP" };
          case 404:
            return { error: "Farms not found" };
          case 500:
            return { error: "Server error - please try again later" };
          default:
            return { error: error.response.data?.data || "An Error Occured" };
        }
      } else if (error.request) {
        return { error: "Network error - please check your connection" };
      }
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred" };
  
    }
}