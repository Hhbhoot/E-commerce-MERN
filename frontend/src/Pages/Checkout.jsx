import React, { useEffect, useState } from 'react';
import { useCart } from '../Context/Cart';
import http from '../Api';
import config from '../Config';
import { useNavigate } from 'react-router';

const Checkout = () => {
  const navigate = useNavigate();

  const { cart, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const fetchAddress = async () => {
      const response = await http.get('/api/v1/auth/addresses');
      setAddresses(response.data.data);
    };

    fetchAddress();
  }, []);

  const handleCreateOrder = async () => {
    const orderItems = cart.map((prod) => {
      return {
        product: prod._id,
        name: prod.name,
        price: prod.price,
        quantity: prod.quantity,
      };
    });

    const shippingAddress = addresses[selected];

    const response = await http.post('/api/v1/order', {
      orderItems,
      shippingAddress,
    });

    if (response.data.status !== 'success') {
      throw new Error('Something went wrong');
    }

    alert('Order created successfully');
    clearCart();
    navigate('/customer/products');
  };

  return (
    <div className="w-full p-4 flex flex-col items-center justify-center">
      <div className="w-96 flex items-center justify-center flex-col p-2">
        {cart.map((prod) => {
          return (
            <div className="w-full flex flex-col gap-2">
              <img
                className="w-40 h-40"
                src={`${config.API_BASE_URL}/${prod.images[0]}`}
                alt="image"
              />
              <p>Price : {prod.price}</p>
              <p>Stock : {prod.stock}</p>
            </div>
          );
        })}
      </div>

      <div className="flex my-4 items-center justify-between w-full gap-4">
        <button className="p-2 border-2">select address</button>
        {addresses.map((address, index) => {
          return (
            <div
              className={`w-full flex flex-col border-2 p-4 rounded-2xl cursor-pointer ${selected === index ? 'bg-slate-300' : ''} hover:bg-slate-300`}
              onClick={() => setSelected(index)}
            >
              <p>Name :{address.fullName}</p>
              <p>city :{address.city}</p>
              <p>state :{address.state}</p>
              <p>pincode :{address.pincode}</p>
              <p>country:{address.country}</p>
            </div>
          );
        })}
      </div>

      <div>
        <button className="p-2 border-2" onClick={handleCreateOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
