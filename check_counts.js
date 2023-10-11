const fs = require("fs");

function countObjects(filePath) {
  // Read the JSON data from the file
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Initialize a counter
  let count = 0;

  // Go through each object in the JSON array
  data.forEach((obj) => {
    // Check if 'origin' is equal to "BD (Directive 79/409/EEC)"
    // and 'D8' is in 'descriptors'
    if (obj.title) {
      count += 1;
    }
  });

  return count;
}

// Example usage:
const filePath = "./latest_measures_content_types_oct23.json";
console.log(`Number of matching objects: ${countObjects(filePath)}`);
