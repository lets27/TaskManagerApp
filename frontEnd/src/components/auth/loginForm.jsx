import { useState } from "react";
import { validateLogin } from "../../util";
import useLogin from "../../Hooks/useLogin";
import { Link } from "react-router-dom";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [logData, setLogData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = logData;

  const { mutateAsync: loginUser, isLoading } = useLogin();

  const handlerUserInput = (name, e) => {
    const { value } = e.target;
    setLogData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validInput = validateLogin({ email, password });
    if (!validInput) return;

    await loginUser({ email, password });
  };

  const togglePassword = () => setShowPassword(!showPassword);

  if (isLoading) {
    return <p>loading</p>;
  }

  return (
    <form className="relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]">
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Login to Your Account
        </h1>
        <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
          Login Now. Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-[#2ECC71] hover:text-[#7263F3] transition-all duration-300"
          >
            Register here
          </Link>
        </p>

        <div className="mt-[1rem] flex flex-col">
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
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
            value={password}
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
        <div className="mt-4 flex justify-end">
          <Link
            to="/forgot-password"
            className="font-bold text-[#2ECC71] text-[14px] hover:text-[#7263F3] transition-all duration-300"
          >
            Forgot password?
          </Link>
        </div>
        <div className="flex">
          <button
            type="submit"
            disabled={!email || !password}
            onClick={handleSubmit}
            className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors"
          >
            Login Now
          </button>
        </div>
      </div>
      <img src="/flurry.png" alt="" />
    </form>
  );
}

export default LoginForm;
