import { Input, Select, Button } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import http from '../Api';
import { useAuth } from '../Context/Auth';
const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: '',
    role: '',
  });

  const { setUser, setIsAuth, setRole } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


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

      const response = await http.post("/api/v1/auth/register", formData)

      if (response.data.status !== "success") {
        throw new Error("Something went wrong")
      }

      localStorage.setItem("token", response.data.token)

      setUser(response.data.data)
      setRole(response.data.data.role)
      setIsAuth(true)
      navigate("/")

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
        Welcome ! Please Regiseter{' '}
      </h1>
      <form
        className="w-[30%] flex flex-col gap-2 bg-white border-2 p-4 rounded-2xl items-center justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="fullName">FullName</label>
          <Input
            type={'text'}
            value={formData.fullName}
            onChange={handleChange}
            name="fullName"
          />
        </div>
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
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="gender">Gender</label>
          <Select
            placeholder="Select gender"
            value={formData.gender}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, gender: value }))
            }
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'OTHER', label: 'Other' },
            ]}
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="role">Role</label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option disabled value="">
              Select Role
            </option>
            <option value="Customer">Customer</option>
            <option value="Seller">Seller</option>
          </select>
        </div>

        {
          error && (
            <div className='text-red-500'>
              {error}
            </div>
          )
        }

        <Button
          loading={loading}
          htmlType="submit"
          className="mt-4 w-full text-xl"
          type="primary"
        >
          {' '}
          Register{' '}
        </Button>
        <div className="mt-4">
          Already have an Account ?
          <Link
            to={'/login'}
            className="underline underline-offset-2 text-blue-400 text-xl"
          >
            {' '}
            Login{' '}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
