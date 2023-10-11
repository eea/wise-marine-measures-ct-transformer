# wise-marine-measures-ct-transformer

Data was retrieved using curl -XGET http://<elasticsearch_ip>:9200/<index_name>/\_search?size=10000 | jq -c '.hits.hits[]."\_source"' > data.json on the elastic search endpoint queried here https://water.europa.eu/marine/state-of-europe-seas/marine-sectors-catalogue-of-measures/charts?size=n_10_n and dumped into es_data.json/es_data2.js(exported js const)

# Documentation for Using Scripts

## Overview

This documentation provides a simple guide on how to use two Node.js scripts: `script.js` and `check_counts.js`. The `script.js` file is responsible for transforming data and writing it to a JSON file, while `check_counts.js` is a utility script to check the number of measures by field values.

### Prerequisites

- Node.js installed on your machine.
- The scripts and necessary data files should be in the same directory.

## 1. Transforming Data with `script.js`

### Description

The `script.js` script transforms data from an ElasticSearch endpoint into Plone content-types and writes the transformed data to a JSON file.

### How to Use

1. **Setup:**
   Ensure that the required modules and data are available:
   - `transformData` module
   - `es_data2` data object (containing the data dump of these measures from the elastic search endpoint)
   - Ensure the `parentFolder` URL and `parentUID` are correctly set for the import.

2. **Running the Script:**
   Navigate to the directory containing `script.js` and run the following command in your terminal:
   ```sh
   node script.js
   ```
   This will create a JSON file named `latest_measures_content_types_oct23.json` (or another name if modified in the script) containing the transformed data.

## 2. Counting Objects with `check_counts.js`

1. **Specify File Path:**
   Ensure the `filePath` variable in the script is set to the path of the JSON file to be checked.

2. **Running the Script:**
   Navigate to the directory containing `check_counts.js` and run the following command in your terminal:
   ```sh
   node check_counts.js
   ```
## Notes

- Ensure that the scripts and any required files are in the same directory before running them.
- Always check the file paths and module imports to avoid errors during execution.
- The scripts should be run in a Node.js environment.

---

**End of Documentation**
