import { useCart } from '../Context/Cart';
import config from '../Config';
import { Link } from 'react-router';

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, totalValue } = useCart();

  return (
    <div className="w-full p-4 flex">
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

            <p className="cursor-pointer">
              Quantity :{' '}
              <span
                className="p-2 border-2"
                onClick={() => decreaseQuantity(prod._id)}
              >
                -
              </span>{' '}
              {prod.quantity}{' '}
              <span
                className="p-2 border-2"
                onClick={() => increaseQuantity(prod._id)}
              >
                +
              </span>
            </p>
          </div>
        );
      })}

      <div>TotalValue : {totalValue}</div>
      <Link to="/customer/cart/checkout" className="p-2 border-2">
        Checkout
      </Link>
    </div>
  );
};

export default Cart;
