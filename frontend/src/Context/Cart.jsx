import { useContext, createContext, useMemo, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const isExisting = prev.find((prod) => prod._id === product._id);

      if (isExisting) {
        return prev.map((prod) =>
          prod._id === product._id
            ? { ...prod, quantity: prod.quantity + 1 }
            : prod,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((prod) => prod._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const increaseQuantity = (id) => {
    setCart((prev) => {
      return prev.map((prod) =>
        prod._id == id ? { ...prod, quantity: prod.quantity + 1 } : prod,
      );
    });
  };

  const decreaseQuantity = (id) => {
    setCart((prev) => {
      return prev
        .map((prod) =>
          prod._id == id ? { ...prod, quantity: prod.quantity - 1 } : prod,
        )
        .filter((prod) => prod.quantity > 0);
    });
  };

  const totalValue = useMemo(
    () => cart.reduce((acc, val) => acc + val.price * val.quantity, 0),
    [cart],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        totalValue,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
