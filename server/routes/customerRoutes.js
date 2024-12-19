import express from 'express';
import Customer from '../models/customer.js';
import findDuplicatesWithConfidence from '../utils/duplicateDetection.js';
import { logAction } from '../middleware/auditMiddleware.js'; // Import the logAction utility

const router = express.Router();

// Fetch all customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    await logAction(req.user.id, 'READ', 'Customer', 'Fetched all customers');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch a single customer by ID
router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findOne({ cust_id: req.params.id });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    await logAction(req.user.id, 'READ', 'Customer', `Fetched customer with ID ${req.params.id}`);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new customer
router.post('/customers', async (req, res) => {
  const { cust_id, cust_name, cust_add1, cust_city, cust_pincode, cust_mob, cust_mail, cust_bank, cust_bk_act, cust_ifsc, gst_no } = req.body;
  try {
    const newCustomer = new Customer({
      cust_id,
      cust_name,
      cust_add1,
      cust_city,
      cust_pincode,
      cust_mob,
      cust_mail,
      cust_bank,
      cust_bk_act,
      cust_ifsc,
      gst_no,
    });
    await newCustomer.save();
    await logAction(req.user.id, 'CREATE', 'Customer', `Created customer ${cust_name}`);
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an existing customer by ID
router.put('/customers/:id', async (req, res) => {
  const updates = req.body;
  try {
    const updatedCustomer = await Customer.findOneAndUpdate(
      { cust_id: req.params.id },
      updates,
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    await logAction(req.user.id, 'UPDATE', 'Customer', `Updated customer ${req.params.id}`);
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a customer by ID
router.delete('/customers/:id', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findOneAndDelete({ cust_id: req.params.id });
    if (!deletedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    await logAction(req.user.id, 'DELETE', 'Customer', `Deleted customer ${req.params.id}`);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Match and merge duplicates
router.post('/customers/merge', async (req, res) => {
  try {
    const { record, matchedWith, mergedData } = req.body;

    const customer1 = await Customer.findById(record);
    const customer2 = await Customer.findById(matchedWith);

    if (!customer1 || !customer2) {
      return res.status(404).json({ message: 'Customer records not found' });
    }

    // Merge fields from customer2 into customer1 based on mergedData
    for (const field in mergedData) {
      if (mergedData[field]) {
        customer1[field] = customer2[field];
      }
    }

    await customer1.save();
    await Customer.deleteOne({ _id: customer2._id }); // Delete duplicate record
    await logAction(req.user.id, 'MERGE', 'Customer', `Merged customers ${record} and ${matchedWith}`);

    res.json({ message: 'Records merged successfully', mergedCustomer: customer1 });
  } catch (error) {
    console.error('Error merging customer records:', error);
    res.status(500).send('Server error');
  }
});

// Find duplicates with confidence levels
router.post('/customers/findDuplicates', (req, res) => {
  const { data } = req.body;
  try {
    const duplicates = findDuplicatesWithConfidence(data);
    res.status(200).json(duplicates);
  } catch (error) {
    console.error('Error finding duplicates:', error);
    res.status(500).json({ message: 'Error finding duplicates', error: error.message });
  }
});

export default router;
