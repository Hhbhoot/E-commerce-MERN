import { Button, Input } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../Context/Auth';
import http from '../Api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { setUser, setIsAuth, setRole } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("")
      setLoading(true)

      const response = await http.post("/api/v1/auth/login", formData)

      if (response.data.status !== "success") {

        throw new Error("Something went wrong")
      }

      localStorage.setItem("token", response.data.token)

      setUser(response.data.data)
      setRole(response.data.data.role)
      setIsAuth(true)

      if (response.data.data.role === "Seller") {
        navigate("/")
      } else {
        navigate("/customer/dashboard")
      }

    } catch (error) {
      setError(error.response.data.message || error.message || "Something went wrong")
      console.log(error.response.data.message || error.message || "Something went wrong")

    } finally {
      setLoading(false)
    }

  };

  return (
    <div className="w-full  h-screen bg-linear-to-r from-blue-500 via-violet-400 to-purple-600 flex flex-col items-center justify-center">
      <h1 className="font-bold text-violet-900 text-4xl my-2">
        Welcome ! Please Login{' '}
      </h1>
      <form
        className="w-[30%] flex flex-col gap-2 bg-white border-2 p-4 rounded-2xl items-center justify-center"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="email">Email</label>
          <Input
            type={'email'}
            value={formData.email}
            name="email"
            autoComplete="email"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="password">Password</label>
          <Input
            type={'password'}
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {
          error && (
            <div className='text-red-500'>{error}</div>
          )
        }

        <Button
          disabled={loading}
          loading={loading}
          htmlType="submit"
          className="mt-4 w-full text-xl"
          type="primary"
        >
          {' '}
          Login{' '}
        </Button>
        <div className="mt-4">
          Don't have an account ?
          <Link
            to={'/register'}
            className="underline underline-offset-2 text-blue-400 text-xl"
          >
            {' '}
            Register{' '}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
