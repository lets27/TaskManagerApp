import { useState } from "react";
import useRegister from "../../Hooks/useRegister";
import { validateForm } from "../../util";
import { Loader } from "lucide-react";

function RegisterForm() {
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [regUser, setRegUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { mutateAsync: registerUser, isLoading } = useRegister();

  console.log("regUser:", regUser);

  const handlerUserInput = (name, e) => {
    const { value } = e.target;

    setRegUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validInput = validateForm(regUser);
    if (!validInput) return; //stop execution if not valid input
    const dataToSubmit = new FormData();
    //get entries from regUser
    for (const [key, data] of Object.entries(regUser)) {
      dataToSubmit.append(key, data);
    }
    if (file) dataToSubmit.append("file", file);

    await registerUser(dataToSubmit);
    setRegUser(null);
    setFile(null);
  };

  const togglePassword = () => setShowPassword(!showPassword);

  // if (isError) {
  //   toast.error(error.error);
  // }

  if (isLoading) {
    return <Loader className="size-10 animate-spin" />;
  }
  const handleFileChange = (e) => {
    console.log("Files selected:", e.target.files); // Debug log

    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log("Selected file:", selectedFile); // Debug log
      setFile(selectedFile);
    } else {
      console.log("No file selected");
      setFile(null);
    }
  };

  console.log("file", file);

  return (
    <form className="relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]">
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Register for an Account
        </h1>
        <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
          Create an account. Already have an account?{" "}
          <a
            href="/login"
            className="font-bold text-[#2ECC71] hover:text-[#7263F3] transition-all duration-300"
          >
            Login here
          </a>
        </p>
        <div className="flex flex-col">
          <div className="mb-4">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-amber-500 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <label htmlFor="username" className="mb-1 text-[#999]">
            Full Name
          </label>
          <input
            type="text"
            id="username"
            value={regUser.username}
            onChange={(e) => handlerUserInput("username", e)}
            name="username"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
            placeholder="John Doe"
          />
        </div>
        <div className="mt-[1rem] flex flex-col">
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={regUser.email}
            onChange={(e) => handlerUserInput("email", e)}
            name="email"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
            placeholder="johndoe@gmail.com"
          />
        </div>
        <div className="relative mt-[1rem] flex flex-col">
          <label htmlFor="password" className="mb-1 text-[#999]">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={regUser.password}
            onChange={(e) => handlerUserInput("password", e)}
            name="password"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
            placeholder="***************"
          />
          <button
            type="button"
            className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
          >
            {showPassword ? (
              <i className="fas fa-eye-slash" onClick={togglePassword}></i>
            ) : (
              <i className="fas fa-eye" onClick={togglePassword}></i>
            )}
          </button>
        </div>

        <div className="flex">
          <button
            type="submit"
            disabled={!regUser.username || !regUser.email || !regUser.password}
            onClick={handleSubmit}
            className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors"
          >
            Register Now
          </button>
        </div>
      </div>
      <img src="/flurry.png" alt="" />
    </form>
  );
}

export default RegisterForm;
