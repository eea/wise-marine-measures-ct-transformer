const fs = require("fs");

//transformator
const transformData = require("./transformData");

//es data objects
const data = require("./es_data2");

//be sure to match it with your parent folder url
const parentFolder =
  "http://localhost:8085/Plone/marine/sandbox/shipping-and-ports-measures";
//and id
const parentUID = "8d24626ab01f439b8a32d28e2c7c55b0";

const transformedData = transformData(data, parentFolder, parentUID);

// Write transformedData to a JSON file
// change the name if you want
const fileName = "transformed_data_merged.json";
const jsonContent = JSON.stringify(transformedData, null, 2);

fs.writeFile(fileName, jsonContent, "utf8", (err) => {
  if (err) {
    console.error(`Error writing to ${fileName}:`, err);
  } else {
    console.log(`Successfully generated ${fileName} with ${jsonContent?.length} items in it`);
  }
});
