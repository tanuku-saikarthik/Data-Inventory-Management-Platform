// Duplicate detection and merging logic
const findDuplicatesWithConfidence = (data) => {
  const duplicates = [];
  
  // Loop through the data to find duplicates
  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      // Simple duplicate matching based on name and mobile number
      if (data[i].cust_name === data[j].cust_name && data[i].cust_mob === data[j].cust_mob) {
        // Calculate confidence score (this is a simple example, you can adjust it)
        const confidence = calculateConfidence(data[i], data[j]);

        duplicates.push({
          record: data[i],
          matchedWith: data[j],
          confidence, // Include confidence score with the duplicate matches
        });
      }
    }
  }

  return duplicates;
};

// Simple confidence calculation (this logic can be more complex based on your needs)
const calculateConfidence = (record1, record2) => {
  let score = 0;

  // Compare each relevant field and add to the confidence score
  if (record1.cust_name === record2.cust_name) score += 0.2;
  if (record1.cust_mob === record2.cust_mob) score += 0.2;
  if (record1.cust_pincode === record2.cust_pincode) score += 0.2;
  if (record1.gst_no === record2.gst_no) score += 0.2;
  if (record1.cust_id === record2.cust_id) score += 0.2;

  // Normalize the score between 0 and 1
  return Math.min(score, 1);
};

// Logic to merge two records


export default findDuplicatesWithConfidence ;
