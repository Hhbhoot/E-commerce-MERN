import { Link } from 'react-router';
import { useAuth } from '../Context/Auth';

const Unahorized = () => {
  const { role } = useAuth();

  return (
    <div className="w-full h-screen bg-violet-500">
      <p className="text-2xl">Unauthorized</p>
      <Link to={role === 'Customer' ? '/customer/dashboard' : '/'}>
        <p className="text-2xl cursor-pointer">Go to Home</p>
      </Link>
    </div>
  );
};

export default Unahorized;
