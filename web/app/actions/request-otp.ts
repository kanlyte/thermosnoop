import axiosInstance from "@/lib/axiosinstance";
import { RequestOtpSchema } from "@/lib/schemas";
import axios from 'axios';
import z from "zod";

export const requestOtp = async (values: z.infer<typeof RequestOtpSchema>) => {
  const validatedFields = RequestOtpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email format" };
  }
  const { email } = validatedFields.data;

  try {
    const response = await axiosInstance.post('/request/otp', { email });

    // Handle successful response
    if (response.data.status) {
      return { 
        success: "OTP sent successfully! Check your email.",
        otpData: response.data.result 
      };
    }

    return { error: response.data.data || "Failed to send OTP" };

  } catch (error: unknown) {
    console.error("OTP request error:", error);

    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return { error: "Invalid email format" };
          case 409:
            return { error: "Email not registered" };
          case 500:
            return { error: "Server error - please try again later" };
          default:
            return { error: error.response.data?.data || "Failed to send OTP" };
        }
      } else if (error.request) {
        return { error: "Network error - please check your connection" };
      }
    }
       // Handle generic errors
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred" };
  }
};