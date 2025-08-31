import axiosInstance from "@/lib/axiosinstance";
import axios from "axios";
import { he } from "zod/v4/locales";

//get farms per user
export const getFarmsPerUser = async (
    user_id: string,
    access_token: string
)=>{
    try {
        const response = await axiosInstance.get(`/myfarms/${user_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,

          }
        });
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

//get weather data for a farm
export const getWeatherData = async (
  lat: number,
  lon: number,
  farm_id: string
)=>{
  try {
    const response = await axiosInstance.get(`/weather/check`)
    if(response.data.status === "true" || response.status === 200){
        return {
            success: "weather retrived successfully",
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
            return { error: error.response.data?.reason || "Invalid Request" };
          case 404:
            return { error: "Weather data not found" };
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
}}

//get farm logs per farm
export const getFarmLogs = async (
  farm_id: string,
)=>{
  try {
    const response = await axiosInstance.get(`/farmlogs/${farm_id}`)
    if(response.data.status === "true" || response.status === 200){
        return {
            success: "farm logs retrived successfully",
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
            return { error: error.response.data?.reason || "Invalid Request" };
          case 404:
            return { error: "Farm logs not found" };
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