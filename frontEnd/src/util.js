import toast from "react-hot-toast";

const baseUrl =
  import.meta.env.MODE === "development" ? `http://localhost:5000` : "";

export const validateForm = (formData) => {
  if (!formData.username.trim()) return toast.error("Full name is required");
  if (!formData.email.trim()) return toast.error("Email is required");
  if (!/\S+@\S+\.\S+/.test(formData.email))
    return toast.error("Invalid email format");
  if (!formData.password) return toast.error("Password is required");
  if (formData.password.length < 6)
    return toast.error("Password must be at least 6 characters");

  return true;
};
export const validateLogin = (formData) => {
  if (!formData.email.trim()) return toast.error("Email is required");
  if (!/\S+@\S+\.\S+/.test(formData.email))
    return toast.error("Invalid email format");
  if (!formData.password) return toast.error("Password is required");
  if (formData.password.length < 6)
    return toast.error("Password must be at least 6 characters");

  return true;
};

export default baseUrl;
