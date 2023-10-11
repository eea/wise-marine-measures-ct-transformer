const fs = require("fs");

//transformator
const transformData = require("./transformData");

//es data objects
const data = require("./es_data2");

//be sure to match it with your parent folder url
const parentFolder =
  "https://wise-test.eionet.europa.eu/marine/europe-seas/marine-sectors-catalogue-of-measures/shipping-and-ports-measures";
//and id
const parentUID = "766de17e1df7484d94ca62d61b449bcd";

const transformedData = transformData(data, parentFolder, parentUID);

// Write transformedData to a JSON file
// change the name if you want
const fileName = "latest_measures_content_types_oct23.json";
const jsonContent = JSON.stringify(transformedData, null, 2);

fs.writeFile(fileName, jsonContent, "utf8", (err) => {
  if (err) {
    console.error(`Error writing to ${fileName}:`, err);
  }
});
