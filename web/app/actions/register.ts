import { registerThermosnoopUser } from "@/data-layer/user";
import { RegisterSchema } from "@/lib/schemas";
import z from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields 😞" };
  }

  const { first_name, last_name, email, contact, district, password } =
    validatedFields.data;

  try {
    const response = await registerThermosnoopUser(
      first_name,
      last_name,
      email,
      contact,
      district,
      password
    );

    // Check for successful response based on your API's structure
    if (response && response.data && response.data.status === true) {
      return { success: "User registered successfully! 😊" };
    }

    // Handle case where API returns failure status
    if (response && response.data && response.data.status === false) {
      return { error: response.data.data + " 😞" };
    }

    return { error: "Registration failed - unexpected response format 😞" };
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          if (error.response.data.data === "wrong email format") {
            return { error: "Invalid email format 😞" };
          } else if (error.response.data.data === "weak password") {
            return { error: "Password is too weak 😞" };
          } else if (error.response.data.data === "wrong contact format") {
            return { error: "Invalid phone number format 😞" };
          }
          return { error: error.response.data.data + " 😞" };
        case 409:
          return { error: "Email already taken 😞" };
        case 500:
          return { error: "Server error - please try again later 😞" };
        default:
          return { error: `Registration failed (${error.response.status}) 😞` };
      }
    } else if (error.request) {
      return { error: "Network error - please check your connection 😞" };
    } else {
      return { error: "Registration configuration error 😞" };
    }
  }
};