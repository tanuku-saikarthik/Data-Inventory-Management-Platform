import React, { useState, useEffect } from "react";
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api"; // Importing API functions
import styles from "../styles/Table.module.css";

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    cust_id: "",
    cust_name: "",
    cust_add1: "",
    cust_city: "",
    cust_pincode: "",
    cust_mob: "",
    cust_bank: "",
    cust_bk_act: "",
    cust_ifsc: "",
    gst_no: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // or 'desc'
  const [filterCity, setFilterCity] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const customerList = await fetchCustomers();
        setCustomers(customerList);
        setFilteredCustomers(customerList);
      } catch (error) {
        console.error("Error loading customers:", error);
      }
    };
    loadCustomers();
  }, []);

  useEffect(() => {
    let updatedCustomers = [...customers];

    // Apply search filter
    if (searchQuery) {
      updatedCustomers = updatedCustomers.filter((customer) =>
        Object.values(customer).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply city filter
    if (filterCity) {
      updatedCustomers = updatedCustomers.filter(
        (customer) => customer.cust_city === filterCity
      );
    }

    // Apply sorting
    if (sortField) {
      updatedCustomers.sort((a, b) => {
        const valueA = a[sortField];
        const valueB = b[sortField];
        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredCustomers(updatedCustomers);
  }, [searchQuery, filterCity, sortField, sortOrder, customers]);

  const handleChange = (e) => {
    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCustomer = async () => {
    try {
      const addedCustomer = await createCustomer(newCustomer);
      setCustomers([...customers, addedCustomer]);
      setNewCustomer({
        cust_id: "",
        cust_name: "",
        cust_add1: "",
        cust_city: "",
        cust_pincode: "",
        cust_mob: "",
        cust_bank: "",
        cust_bk_act: "",
        cust_ifsc: "",
        gst_no: "",
      });
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleDeleteCustomer = async (cust_id) => {
    try {
      await deleteCustomer(cust_id);
      setCustomers(customers.filter((customer) => customer.cust_id !== cust_id));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setNewCustomer(customer);
  };

  const handleUpdateCustomer = async () => {
    try {
      const updatedCustomer = await updateCustomer(newCustomer.cust_id, newCustomer);
      setCustomers(
        customers.map((customer) =>
          customer.cust_id === newCustomer.cust_id ? updatedCustomer : customer
        )
      );
      setEditingCustomer(null);
      setNewCustomer({
        cust_id: "",
        cust_name: "",
        cust_add1: "",
        cust_city: "",
        cust_pincode: "",
        cust_mob: "",
        cust_bank: "",
        cust_bk_act: "",
        cust_ifsc: "",
        gst_no: "",
      });
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.title}>All Customers</h3>
      <div className={styles.formContainer}>
        <input
          type="text"
          name="cust_id"
          placeholder="Customer ID"
          value={newCustomer.cust_id}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cust_name"
          placeholder="Customer Name"
          value={newCustomer.cust_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cust_add1"
          placeholder="Address 1"
          value={newCustomer.cust_add1}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cust_city"
          placeholder="City"
          value={newCustomer.cust_city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cust_pincode"
          placeholder="Pincode"
          value={newCustomer.cust_pincode}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cust_mob"
          placeholder="Mobile"
          value={newCustomer.cust_mob}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cust_bank"
          placeholder="Bank"
          value={newCustomer.cust_bank}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cust_bk_act"
          placeholder="Account No"
          value={newCustomer.cust_bk_act}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cust_ifsc"
          placeholder="IFSC"
          value={newCustomer.cust_ifsc}
          onChange={handleChange}
        />
        <input
          type="text"
          name="gst_no"
          placeholder="GST No"
          value={newCustomer.gst_no}
          onChange={handleChange}
        />
        <button onClick={editingCustomer ? handleUpdateCustomer : handleAddCustomer}>
          {editingCustomer ? "Update Customer" : "Add Customer"}
        </button>
      </div>
      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setFilterCity(e.target.value)} value={filterCity}>
          <option value="">Filter by City</option>
          {[...new Set(customers.map((customer) => customer.cust_city))].map(
            (city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            )
          )}
        </select>
      </div>

      {/* Add/Edit Customer Form */}
      <div className={styles.formContainer}>
        {/* Input fields omitted for brevity */}
        <button onClick={editingCustomer ? handleUpdateCustomer : handleAddCustomer}>
          {editingCustomer ? "Update Customer" : "Add Customer"}
        </button>
      </div>

      {/* Customers Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort("cust_id")} style={{ cursor: "pointer" }}
            >CUST ID</th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("cust_name")}>CUST NAME</th>
            <th>ADDRESS 1</th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("cust_city")}>CITY</th>
            <th>PINCODE</th>
            <th>MOBILE</th>
            <th>BANK</th>
            <th>ACCOUNT NO</th>
            <th>IFSC</th>
            <th>GST NO</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer, index) => (
            <tr key={index}>
              <td>{customer.cust_id}</td>
              <td>{customer.cust_name}</td>
              <td>{customer.cust_add1}</td>
              <td>{customer.cust_city}</td>
              <td>{customer.cust_pincode}</td>
              <td>{customer.cust_mob}</td>
              <td>{customer.cust_bank}</td>
              <td>{customer.cust_bk_act}</td>
              <td>{customer.cust_ifsc}</td>
              <td>{customer.gst_no}</td>
              <td>
                <button onClick={() => handleEditCustomer(customer)}>Edit</button>
                <button onClick={() => handleDeleteCustomer(customer.cust_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
