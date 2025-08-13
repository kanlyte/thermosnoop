// actions/verify-otp.ts
import axiosInstance from "@/lib/axiosinstance";
import { VerifyOtpSchema } from "@/lib/schemas";
import { z } from "zod";
import axios from 'axios';

export const verifyOtp = async (
  user_id: string,
  values: { otp: string } // Simplified to match API expectations
) => {
  try {
    const response = await axiosInstance.post(`/verify/otp/${user_id}`, { 
      otp: values.otp 
    });

    if (response.data.status) {
      return { success: "OTP verified successfully!" };
    }
    return { error: response.data.reason || "OTP verification failed" };

  } catch (error: unknown) {
    console.error("OTP verification error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return { error: error.response.data?.reason || "Invalid OTP" };
          case 404:
            return { error: "No OTP record found" };
          case 500:
            return { error: "Server error - please try again later" };
          default:
            return { error: error.response.data?.reason || "OTP verification failed" };
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
};