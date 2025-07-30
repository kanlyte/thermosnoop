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

    // Handle successful response (201 Created)
    if (response.status === 201) {
      return { success: response.data.data.message || "User registered successfully! 😊" };
    }

    return { error: "Registration failed - unexpected response 😞" };
  } catch (error: any) {
    if (error.response) {
      // Handle error responses from API
      const errorData = error.response.data;
      
      if (errorData && errorData.data) {
        // Handle structured error messages
        const errorMessage = typeof errorData.data === 'string' 
          ? errorData.data 
          : errorData.data.message || 'Registration failed';
          
        return { error: `${errorMessage} 😞` };
      }

      // Fallback status code handling
      switch (error.response.status) {
        case 400:
          return { error: "Invalid input data 😞" };
        case 409:
          return { error: "Email already registered 😞" };
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

