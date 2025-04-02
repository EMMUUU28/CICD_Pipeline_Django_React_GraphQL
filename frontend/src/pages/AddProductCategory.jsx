import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
const AddProductCategory = () => {
  const [activeTab, setActiveTab] = useState('category');
  
  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    inventoryQuantity: '',
    isPublished: true,
  });
  
  // UI state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categorySuccess, setCategorySuccess] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [productSuccess, setProductSuccess] = useState('');
  const [productError, setProductError] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          query: `
            {
              allCategories {
                id
                name
                description
              }
            }
          `,
        }),
      });

      const result = await response.json();
      
      if (result.data && result.data.allCategories) {
        setCategories(result.data.allCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle category form input changes
  const handleCategoryChange = (e) => {
    setCategoryForm({
      ...categoryForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle product form input changes
  const handleProductChange = (e) => {
    const value = e.target.type === 'checkbox' 
      ? e.target.checked 
      : e.target.value;
      
    setProductForm({
      ...productForm,
      [e.target.name]: value,
    });
  };

  // Submit category form
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCategorySuccess('');
    setCategoryError('');

    try {
      console.log(categoryForm)
      const response = await fetch('http://127.0.0.1:8000/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        
        
        body: JSON.stringify({
          query: `
            mutation {
              createCategory(
                name: "${categoryForm.name}",
                description: "${categoryForm.description}"
              ) {
                category {
                  id
                  name
                  description
                }
              }
            }
          `,
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (result.data && result.data.createCategory) {
        setCategorySuccess('Category created successfully!');
        setCategoryForm({ name: '', description: '' });
        fetchCategories(); // Refresh the categories list
      }
    } catch (error) {
      setCategoryError(error.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  // Submit product form
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProductSuccess('');
    setProductError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          query: `
            mutation {
              createProduct(
                name: "${productForm.name}",
                description: "${productForm.description}",
                price: ${parseFloat(productForm.price)},
                categoryId: ${parseInt(productForm.categoryId)},
                inventoryQuantity: ${parseInt(productForm.inventoryQuantity) || 0},
                isPublished: ${productForm.isPublished}
              ) {
                product {
                  id
                  name
                  description
                  price
                  inventoryQuantity
                  isPublished
                  category {
                    id
                    name
                  }
                }
              }
            }
          `,
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (result.data && result.data.createProduct) {
        setProductSuccess('Product created successfully!');
        setProductForm({
          name: '',
          description: '',
          price: '',
          categoryId: '',
          inventoryQuantity: '',
          isPublished: true,
        });
      }
    } catch (error) {
      setProductError(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Add Products & Categories</h1>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-5">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('category')}
                    className={`${
                      activeTab === 'category'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                  >
                    Add Category
                  </button>
                  <button
                    onClick={() => setActiveTab('product')}
                    className={`${
                      activeTab === 'product'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                  >
                    Add Product
                  </button>
                </nav>
              </div>
              
              {/* Category Form */}
              {activeTab === 'category' && (
                <div className="p-6">
                  {categorySuccess && (
                    <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-green-700">{categorySuccess}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {categoryError && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{categoryError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleCategorySubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Category Name
                      </label>
                      <div className="mt-1">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={categoryForm.name}
                          onChange={handleCategoryChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={categoryForm.description}
                          onChange={handleCategoryChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {loading ? 'Creating...' : 'Create Category'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Product Form */}
              {activeTab === 'product' && (
                <div className="p-6">
                  {productSuccess && (
                    <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-green-700">{productSuccess}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {productError && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{productError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">
                        Product Name
                      </label>
                      <div className="mt-1">
                        <input
                          id="product-name"
                          name="name"
                          type="text"
                          required
                          value={productForm.name}
                          onChange={handleProductChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="product-description"
                          name="description"
                          rows={3}
                          value={productForm.description}
                          onChange={handleProductChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <div className="mt-1">
                          <input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={productForm.price}
                            onChange={handleProductChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="inventoryQuantity" className="block text-sm font-medium text-gray-700">
                          Inventory Quantity
                        </label>
                        <div className="mt-1">
                          <input
                            id="inventoryQuantity"
                            name="inventoryQuantity"
                            type="number"
                            min="0"
                            value={productForm.inventoryQuantity}
                            onChange={handleProductChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <div className="mt-1">
                        <select
                          id="categoryId"
                          name="categoryId"
                          required
                          value={productForm.categoryId}
                          onChange={handleProductChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="isPublished"
                        name="isPublished"
                        type="checkbox"
                        checked={productForm.isPublished}
                        onChange={handleProductChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                        Publish product immediately
                      </label>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {loading ? 'Creating...' : 'Create Product'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddProductCategory;