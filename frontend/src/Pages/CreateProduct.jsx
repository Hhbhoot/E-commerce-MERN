import { useEffect, useState } from 'react';
import http from '../Api';
import { useNavigate } from 'react-router';
import { Input, Select } from 'antd';

const CreateProduct = () => {
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    images: [],
  });

  const navigate = useNavigate();

  const [previewImages, setPreviewImages] = useState([]);

  const [categoties, setCategories] = useState([]);

  const handleFileChanges = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => URL.createObjectURL(file));

    setPreviewImages((prev) => [...prev, ...previews]);
    setProductDetails((prev) => ({ ...prev, images: files }));
  };

  useEffect(() => {
    const fecthCategories = async () => {
      try {
        const { data } = await http.get('/api/v1/category');

        setCategories(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fecthCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', productDetails.name);
      formData.append('description', productDetails.description);
      formData.append('category', productDetails.category);
      formData.append('price', productDetails.price);
      formData.append('stock', productDetails.stock);

      for (let image of productDetails.images) {
        formData.append('images', image);
      }

      const response = await http.post('/api/v1/product/seller', formData);
      if (response.status === 201 || response.status === 200) {
        alert('Product created successfully');
        setProductDetails({
          name: '',
          description: '',
          category: '',
          price: 0,
          stock: 0,
          images: [],
        });

        navigate('/products');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full  p-4 flex items-center justify-center">
      <form
        className="w-[50%] bg-slate-300 p-6 rounded-2xl  flex flex-col gap-2 items-center justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="name">Name</label>
          <Input
            placeholder="Product Name"
            className="my-2 w-full"
            value={productDetails.name}
            onChange={(e) => {
              setProductDetails((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="description">Description</label>
          <Input
            type="text"
            value={productDetails.description}
            placeholder="Product Description"
            className="my-2"
            onChange={(e) => {
              setProductDetails((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="price">Price</label>
          <Input
            type="number"
            value={productDetails.price}
            placeholder="Product Price"
            className="my-2"
            onChange={(e) => {
              setProductDetails((prev) => ({
                ...prev,
                price: parseFloat(e.target.value) || 0,
              }));
            }}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="stock">Stock</label>
          <Input
            type="number"
            placeholder="Product Stock"
            className="my-2"
            value={productDetails.stock}
            onChange={(e) => {
              setProductDetails((prev) => ({
                ...prev,
                stock: parseInt(e.target.value) || 0,
              }));
            }}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="category">Category</label>
          <Select
            placeholder="Select a category"
            value={productDetails.category}
            onChange={(val) => {
              setProductDetails((prev) => ({
                ...prev,
                category: val,
              }));
            }}
          >
            {categoties.map((category) => (
              <option key={category._id} value={category._id}>
                {category.category}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="images">Images</label>
          <Input
            type="file"
            className="my-2"
            multiple
            onChange={handleFileChanges}
            // onChange={(e) => {
            //   const files = Array.from(e.target.files);
            //   setProductDetails((prev) => ({
            //     ...prev,
            //     images: files,
            //   }));
            // }}
          />
        </div>

        {previewImages && previewImages.length > 0 && (
          <div className="flex items-center gap-2 justify-center flex-wrap">
            {previewImages.map((image) => (
              <img src={image} className="w-40 h-40" />
            ))}
          </div>
        )}

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
