const eeaCountries = require("./eeaCountries");

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

measure_field_names = [
  "sector",
  "use",
  "origin",
  "nature",
  "status",
  "impacts",
  "impacts_further_details",
  "water_body_cat",
  "spatial_scope",
  "country_coverage",
  "measure_purpose",
  "measure_type",
  "measure_location",
  "measure_response",
  "measure_additional_info",
  "pressure_type",
  "pressure_name",
  "ranking",
  "season",
  "approaching_areas",
  "areas_to_be_avoided",
  "descriptors",
  "ecological_impacts",
  "future_scenarios",
  "effect_on_hydromorphology",
  "ktms_it_links_to",
  "links_to_existing_policies",
  "msfd_spatial_scope",
  "mspd_implementation_statue",
  "nature_of_physical_modification",
  "source",
  "authority",
  "general_view",
  "ports",
  "future_expectations",
  "safety_manner",
  "objective",
  "categories",
  "precautionary_areas",
  "priority_areas",
  "relevant_targets",
  "relevant_features_from_msfd_annex_iii",
  "region",
  "shipping_tackled",
  "traffic_separation_scheme",
  "type_of_pressure",
];

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

function findValueByLabel(label) {
  const country = eeaCountries.find((country) => country.label === label);
  return country ? country.value : null;
}

const generateGeolocation = (countryCov) => {
  var geoLoc = [];
  if (Array.isArray(countryCov)) {
    countryCov.forEach((country) => {
      geoLoc.push({
        label: country,
        value: findValueByLabel(country),
      });
    });
  }
  if (typeof countryCov === "string") {
    geoLoc = [
      {
        label: countryCov,
        value: findValueByLabel(countryCov),
      },
    ];
  }
  return geoLoc;
};

const mergeObjects = (merged, item) => {
  for (const key in item) {
    if (!omitFields.includes(key) && measure_field_names.includes(key)) {
      if (!merged.hasOwnProperty(key)) {
        if (item[key] !== "" && item[key] !== undefined && item[key] !== null) {
          merged[key] = [].push(item[key]);
        } else merged[key] = [];
      } else if (Array.isArray(merged[key])) {
        if (
          item[key] !== "" &&
          item[key] !== undefined &&
          item[key] !== null &&
          merged[key] !== "" &&
          merged[key] !== undefined &&
          merged[key] !== null &&
          !merged[key].includes(item[key])
        ) {
          merged[key].push(item[key]);
        }
      } else if (merged[key] !== item[key]) {
        if (
          item[key] !== "" &&
          item[key] !== undefined &&
          item[key] !== null &&
          merged[key] !== "" &&
          merged[key] !== undefined &&
          merged[key] !== null
        ) {
          merged[key] = [merged[key], item[key]];
        } else {
          if (
            item[key] !== "" &&
            item[key] !== undefined &&
            item[key] !== null
          ) {
            merged[key] = [].push(item[key]);
          } else merged[key] = [];
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
      "Relevant targets": relevantTargets,
      "Relevant features from MSFD Annex III": relevantFeaturesFromMSFDAnnexIII,
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
      "KTMs it links to": ktmsItLinksTo,
      "Link to existing policies": linkToExistingPolicies,
      measureCode,
      "Measure purpose": measurePurpose,
      measureOriginId,
      measureImpactToId,
      "Measure additional info": measureAdditionalInfo,
      "Measure response": measureResponse,
      "Nature of physical modification": natureOfPhyModification,
      "Effect on hydromorphology": effectOnHydromorphology,
      "Ecological impacts": ecologicalImpacts,
      measureStatusId,
      Descriptors,
      "MSFD Spatial scope": MSFDSpatialScope,
      "Type of pressure": typeOfPressure,
      Region: region,
      "MSPD implementation status": mspdImplementationStatus,
      "Shipping Tackled": shippingTackled,
      "Traffic separation scheme": trafficSeparationScheme,
      "Priority Areas": priorityAreas,
      "Approaching Areas": approachingAreas,
      "Precautionary areas": precautionaryAreas,
      "Areas to be avoided": areasToBeAvoided,
      "Future Scenarios": futureScenarios,
      Source,
      Authority,
      "General View": generalView,
      Ports,
      "Future Expectations": futureExpectations,
      "Safety manner": safetyManner,
      Objective,
      Categories,
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
      approaching_areas: approachingAreas,
      contributors: [],
      country_coverage: Country,
      areas_to_be_avoided: areasToBeAvoided,
      created: new Date().toISOString(),
      creators: ["andrei"],
      description: measureName,
      descriptors: Descriptors,
      ecological_impacts: ecologicalImpacts,
      future_scenarios: futureScenarios,
      effective: null,
      effect_on_hydromorphology: effectOnHydromorphology,
      expires: null,
      id: measureID,
      impacts,
      impacts_further_details: impactsFurtherDetails,
      is_folderish: true,
      ktms_it_links_to: ktmsItLinksTo,
      language: "en",
      layout: "view",
      links_to_existing_policies: linkToExistingPolicies,
      lock: {},
      measure_additional_info: null,
      measure_location: measureLocation,
      measure_purpose: measurePurpose,
      measure_response: measureResponse,
      measure_type: measureType,
      msfd_spatial_scope: MSFDSpatialScope,
      mspd_implementation_statue: mspdImplementationStatus,
      modified: new Date().toISOString(),
      nature_of_physical_modification: natureOfPhyModification,
      nature,
      source: Source,
      authority: Authority,
      general_view: generalView,
      ports: Ports,
      future_expectations: futureExpectations,
      safety_manner: safetyManner,
      objective: Objective,
      categories: Categories,
      precautionary_areas: precautionaryAreas,
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
      priority_areas: priorityAreas,
      ranking: Ranking,
      relevant_targets: relevantTargets,
      relevant_features_from_msfd_annex_iii: relevantFeaturesFromMSFDAnnexIII,
      review_state: "private",
      region,
      rights: "",
      season: Season,
      sector: Sector,
      shipping_tackled: shippingTackled,
      spatial_scope: spatialScope,
      status: Status,
      subjects: [],
      title: measureName,
      traffic_separation_scheme: trafficSeparationScheme,
      type_of_pressure: typeOfPressure,
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

  // Group items with the same title and merge their data
  const groupedData = mappedData.reduce((acc, item) => {
    const measureID = item.title
      .replace(/[^a-zA-Z0-9 ]/g, "_")
      .replace(/\s+/g, "_")
      .substring(0, 50)
      .toLowerCase()
      .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");

    const existingItem = acc.find(
      (groupedItem) => groupedItem.title === item.title
    );
    if (!existingItem) {
      // Transform all field names (except title) into an array of strings
      const transformedItem = {};
      measure_field_names.forEach((fieldName) => {
        if (fieldName === "title") {
          transformedItem[fieldName] = item[fieldName];
        } else if (
          item[fieldName] !== null &&
          item[fieldName] !== "" &&
          item[fieldName] !== undefined
        ) {
          transformedItem[fieldName] = [item[fieldName]];
        } else {
          transformedItem[fieldName] = [];
        }
      });

      acc.push({
        ...transformedItem,
        id: measureID,
        title: item.title,
        "@id": `${parentFolder}/${measureID}`,
        "@type": "spmeasure",
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
        topics: ["Marine", "Water and marine environment"],
        temporal_coverage: {
          temporal: [
            {
              label: "2021",
              value: "2021",
            },
          ],
        },
        publisher: ["EEA"],
        other_organisations: ["ETC/ICM"],
        geo_coverage: {
          geolocation: [
            {
              label: "Albania",
              value: "geo-783754",
            },
            {
              label: "Portugal",
              value: "geo-2264397",
            },
          ],
        },
      });
    } else {
      mergeObjects(existingItem, item);
    }

    return acc;
  }, []);

  // Set eea core metadata country coverage with codes
  const withGeoCoverage = groupedData.map((item, i) => {
    const newItem = { ...item };
    newItem.geo_coverage = {
      geolocation: item?.country_coverage
        ? generateGeolocation(item.country_coverage)
        : "",
    };
    return newItem;
  });

  return withGeoCoverage;
}

module.exports = transformData;
