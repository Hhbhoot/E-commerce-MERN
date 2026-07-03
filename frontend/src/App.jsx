import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { Layout } from './Components/Layout';
import ProtectedRoutes from './Components/ProtectedRoutes';
import Unahorized from './Pages/Unahorized';
import Dashboard from './Pages/Dashboard';
import Products from './Pages/Products';
import CustomerDashboard from './Pages/CustomerDashboard';
import CustomerProducts from './Pages/CustomerProducts';
import CreateProduct from './Pages/CreateProduct';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unahorized />} />
      <Route element={<ProtectedRoutes roles={['Seller']} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/create" element={<CreateProduct />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoutes roles={['Customer']} />}>
        <Route element={<Layout />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/products" element={<CustomerProducts />} />
          <Route path="/customer/cart" element={<Cart />} />
          <Route path="/customer/cart/checkout" element={<Checkout />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
