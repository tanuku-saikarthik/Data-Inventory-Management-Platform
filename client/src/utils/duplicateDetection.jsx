export const findDuplicates = (data) => {
    if (!Array.isArray(data)) {
      console.error("Invalid data: Expected an array but received", data);
      return [];
    }
  
    const seen = new Map();
  
    // Group records based on keys of interest
    data.forEach((record) => {
      const keysToCheck = [
        record["cust_id"],
        record["cust_ifsc"],
        record["gst_no"],
        record["cust_bk_act"],
      ]; // Include other fields as necessary
  
      keysToCheck.forEach((key) => {
        if (key) {
          if (seen.has(key)) {
            seen.get(key).push(record); // Add to existing group
          } else {
            seen.set(key, [record]); // Initialize group
          }
        }
      });
    });
  
    // Collect groups that have duplicates
    const groupedDuplicates = [];
    seen.forEach((group) => {
      if (group.length > 1) {
        groupedDuplicates.push(group);
      }
    });
  
    return groupedDuplicates;
  };
  
  // Function to merge duplicate records into one
  export const mergeDuplicates = (duplicates) => {
    if (!Array.isArray(duplicates)) {
      console.error(
        "Invalid input: Expected an array of duplicate groups",
        duplicates
      );
      return [];
    }
  
    return duplicates.map((group) => {
      const mergedRecord = {};
  
      // Merge fields within each group
      group.forEach((record) => {
        Object.keys(record).forEach((key) => {
          if (!mergedRecord[key] || !mergedRecord[key].trim()) {
            mergedRecord[key] = record[key]; // Take the first non-empty value
          }
        });
      });
  
      return mergedRecord;
    });
  };

  
  