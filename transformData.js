function generateUID() {
  let uid = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 32;
  for (let i = 0; i < length; i++) {
    uid += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return uid;
}

const mergeObjects = (merged, item) => {
  const omitFields = [
    "UID",
    "contributors",
    "created",
    "creators",
    "lock",
    "modified",
    "parent",
    "subjects",
    "workflow_history",
  ];

  for (const key in item) {
    if (!omitFields.includes(key)) {
      if (!merged.hasOwnProperty(key)) {
        merged[key] = item[key];
      } else if (Array.isArray(merged[key])) {
        if (
          item[key] !== undefined &&
          item[key] !== null &&
          !merged[key].includes(item[key])
        ) {
          merged[key].push(item[key]);
        }
      } else if (merged[key] !== item[key]) {
        if (merged[key] !== undefined && merged[key] !== null) {
          merged[key] = [merged[key], item[key]];
        } else {
          merged[key] = item[key];
        }
      }
    }
  }
  return merged;
};

function transformData(data, parentFolder, parentUID) {
  console.log("Initial Array is :", data.length, " items long");
  const mappedData = data.map((item) => {
    const {
      CodeCatalogue,
      Sector,
      "Use or activity": useOrActivity,
      "Measure name": measureName,
      Status,
      "Origin of the measure": origin,
      "Nature of the measure": nature,
      "Water body category": waterBodyCategory,
      "Spatial scope": spatialScope,
      Country,
      "Measure Impacts to": impacts,
      "Measure Impacts to (further details)": impactsFurtherDetails,
      sectorId,
      waterBodyCategoryId,
      "Pressure type": pressureType,
      "Pressure name": pressureName,
      "Spatial scale": spatialScale,
      useOrActivityId,
      "Measure type recommended to address E02 and/or E03": measureType,
      "Measure location": measureLocation,
      Season,
      countryCode,
      pressureCode,
      measureNatureId,
      featureCode,
      subUnit,
      Ranking,
      measureCode,
      "Measure purpose": measurePurpose,
      measureOriginId,
      measureImpactToId,
      "Measure additional info": measureAdditionalInfo,
      "Measure response": measureResponse,
      measureStatusId,
      Descriptors,
    } = item._source;

    let measureID = measureName
      .replace(/[^a-zA-Z0-9 ]/g, "_")
      .replace(/\s+/g, "_")
      .substring(0, 50)
      .toLowerCase();

    // Remove leading underscores from measureID
    measureID = measureID.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");

    return {
      "@id": `${parentFolder}/${measureID}`,
      "@type": "spmeasure",
      UID: generateUID(),
      allow_discussion: false,
      contributors: [],
      country_coverage: Country,
      created: new Date().toISOString(),
      creators: ["andrei"],
      description: measureName,
      effective: null,
      expires: null,
      id: measureID,
      impacts,
      impacts_further_details: impactsFurtherDetails,
      is_folderish: true,
      language: "en",
      layout: "view",
      lock: {},
      measure_additional_info: null,
      measure_location: measureLocation,
      measure_name: measureName,
      measure_purpose: measurePurpose,
      measure_response: measureResponse,
      measure_type: measureType,
      modified: new Date().toISOString(),
      nature,
      origin,
      parent: {
        "@id": parentFolder,
        "@type": "Document",
        UID: parentUID,
        description: "Work in progress",
        image_field: null,
        image_scales: null,
        review_state: "private",
        title: parentFolder,
      },
      pressure_name: pressureName,
      pressure_type: pressureType,
      ranking: Ranking,
      review_state: "private",
      rights: "",
      season: Season,
      sector: Sector,
      spatial_scope: spatialScope,
      status: Status,
      subjects: [],
      title: measureName,
      use: useOrActivity,
      version: "current",
      water_body_cat: waterBodyCategory,
      workflow_history: {
        wise_generic_workflow: [
          {
            action: null,
            actor: "andrei",
            comments: "",
            review_state: "private",
            time: new Date().toISOString(),
          },
        ],
      },
      working_copy: null,
      working_copy_of: null,
    };
  });

  // Group items with the same measure_name and merge their data
  const groupedData = mappedData.reduce((acc, item) => {
    const measureID = item.measure_name
      .replace(/[^a-zA-Z0-9 ]/g, "_")
      .replace(/\s+/g, "_")
      .substring(0, 50)
      .toLowerCase()
      .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");

    const existingItem = acc.find(
      (groupedItem) => groupedItem.measure_name === item.measure_name
    );

    if (!existingItem) {
      acc.push({
        ...item,
        id: measureID,
        "@id": `${parentFolder}/${measureID}`,
        UID: generateUID(),
        parent: {
          "@id": parentFolder,
          "@type": "Document",
          UID: parentUID,
          description: "Work in progress",
          image_field: null,
          image_scales: null,
          review_state: "private",
          title: parentFolder,
        },
      });
    } else {
      mergeObjects(existingItem, item);
    }

    return acc;
  }, []);

  return groupedData;
}

module.exports = transformData;
