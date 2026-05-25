import axiosInstance from "@/lib/axiosinstance";
import { RequestOtpSchema } from "@/lib/schemas";
import axios from 'axios';
import z from "zod";

export const requestOtp = async (
  values: z.infer<typeof RequestOtpSchema>
): Promise<{
  success?: string;
  error?: string;
  otpData?: unknown;
}> => {
  const validatedFields = RequestOtpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email format" };
  }

  const { email } = validatedFields.data;

  try {
    const response = await axiosInstance.post(
      "/request/otp",
      { email },
      {
        timeout: 30000, // 30 seconds
      }
    );

    if (response.data?.status === true) {
      return {
        success: "OTP sent successfully! Check your email.",
        otpData: response.data?.result,
      };
    }

    return {
      error:
        response.data?.data ||
        response.data?.message ||
        "Failed to send OTP",
    };
  } catch (error: unknown) {
    console.error("OTP request error:", error);

    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        return {
          error: "Request timed out. The server is taking too long to send OTP.",
        };
      }

      if (error.response) {
        const message =
          error.response.data?.data ||
          error.response.data?.message ||
          error.response.data?.error;

        switch (error.response.status) {
          case 400:
            return { error: message || "Invalid email format" };

          case 404:
            return { error: message || "OTP endpoint was not found" };

          case 409:
            return { error: message || "Email not registered" };

          case 422:
            return { error: message || "Invalid request data" };

          case 500:
            return {
              error: message || "Server error - please try again later",
            };

          default:
            return {
              error: message || "Failed to send OTP",
            };
        }
      }

      if (error.request) {
        return {
          error:
            "No response from server. Check if your backend is running and API URL is correct.",
        };
      }
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred" };
  }
};