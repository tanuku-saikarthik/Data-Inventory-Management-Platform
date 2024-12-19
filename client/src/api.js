// api.js (Frontend API handler)
export const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      console.log(response.JSON);
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };
  export const findDuplicates = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/customers/findDuplicates`, { data });
      console.log("yo man")
      console.log(response.data)
      return response.data;  // Returns the duplicates with confidence scores
    } catch (error) {
      console.error('Error finding duplicates:', error);
      throw new Error('Error finding duplicates. Please try again.');
    }
  };
  export const mergeDuplicates = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/mergeDuplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to merge duplicates');
      }
      return await response.json();
    } catch (error) {
      console.error('Error merging duplicates:', error);
      return [];
    }
  };
  
  import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api'; // Backend base URL

// Fetch all customers
export const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/customers`);
    return response.data;  // Return customer data from response
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    throw error;  // Propagate error for handling in UI
  }
};

// Fetch a single customer by ID
export const fetchCustomerById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/customers/${id}`);
    return response.data;  // Return customer data from response
  } catch (error) {
    console.error("Error fetching customer:", error.message);
    throw error;  // Propagate error for handling in UI
  }
};

// Create a new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${BASE_URL}/customers`, customerData);
    return response.data;  // Return the newly created customer
  } catch (error) {
    console.error("Error creating customer:", error.message);
    throw error;  // Propagate error for handling in UI
  }
};

// Update an existing customer
export const updateCustomer = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/customers/${id}`, updatedData);
    return response.data;  // Return the updated customer data
  } catch (error) {
    console.error("Error updating customer:", error.message);
    throw error;  // Propagate error for handling in UI
  }
};

// Delete a customer by ID
export const deleteCustomer = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/customers/${id}`);
    return id;  // Return the ID of the deleted customer
  } catch (error) {
    console.error("Error deleting customer:", error.message);
    throw error;  // Propagate error for handling in UI
  }
};

axios.defaults.baseURL = 'http://localhost:5000/api'; // Adjust this based on your server URL
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
