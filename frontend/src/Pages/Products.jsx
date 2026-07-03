import { useEffect, useState } from 'react';
import http from '../Api';
import config from '../Config';
import { Trash } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const { data } = await http.get('/api/v1/product/seller');

        if (data.status !== 'success') {
          throw new Error('Failed to fetch data');
        }

        setProducts(data.data);
      } catch (error) {
        setError(
          error.response.data.message ||
            error.message ||
            'Something went wrong',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <div className="w-60 h-60 border-2 rounded-2xl flex flex-col items-center justify-start relative">
              <img
                className="w-60 h-40 rounded-t-2xl"
                src={`${config.API_BASE_URL}/${product.images[0]}`}
                alt=""
              />
              <p>Name :{product.name}</p>
              <p>Price :{product.price}</p>
              <p>Stock :{product.stock}</p>
              <Trash
                className="absolute top-2 cursor-pointer text-red-500 right-2"
                onClick={async () => {
                  await http.delete(`/api/v1/product/${product._id}`);
                  setProducts((prev) =>
                    prev.filter((prod) => prod._id !== product._id),
                  );
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
