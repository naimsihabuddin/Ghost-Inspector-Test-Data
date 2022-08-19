const MY_API_KEY = "<placeholder>"; // PUT YOUR GI API KEY HERE
const SUITE_ID = "<placeholder>"; // PUT SUITE ID HERE

const getTestIds = async (api, suite_id) => {
  const url = `https://api.ghostinspector.com/v1/suites/${suite_id}/tests/?apiKey=${api}`;
  const response = await fetch(url);
  const raw_data = await response.json();
  const { data: tests = [] } = raw_data;
  const suiteName = tests[0].suite.name;
  const testIds = tests.map((test) => test._id);
  return [suiteName, testIds];
};

const getTestData = async (api, test_id) => {
  const URL = `https://api.ghostinspector.com/v1/tests/${test_id}/?apiKey=${api}`;
  const response = await fetch(URL);
  const raw_data = await response.json();

  const {
    data: { name: testName, steps: testSteps },
  } = raw_data;

  const testData = testSteps
    .filter((testStep) => {
      return testStep.variableName != "" && testStep.command == "store";
    })
    .map((item) => {
      const { variableName, value } = item;
      return { variableName, value };
    });

  let testDetails = {
    testName: testName,
    testData: testData,
    testURL: `https://app.ghostinspector.com/tests/${test_id}`,
  };

  return testDetails;
};

const getData = async () => {
  const [suiteName, testIds] = await getTestIds(MY_API_KEY, SUITE_ID);

  document.querySelector("h2").innerHTML = suiteName;

  const results = testIds.map((id) => {
    const response = getTestData(MY_API_KEY, id);
    return response;
  });

  return Promise.all(results);
};

const generateTableHead = (table, data) => {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    if (key !== "testURL") {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }
};

const generateTable = (table, data) => {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      if (key !== "testURL" && key !== "testName") {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
      if (key === "testName") {
        let cell = row.insertCell();
        const a = document.createElement("a");
        const text = document.createTextNode(element[key]);
        a.appendChild(text);
        a.setAttribute("href", element.testURL);
        cell.appendChild(a);
      }
    }
  }
};

const generateTestNameHeading = (table, testName, testURL) => {
  const row = table.insertRow();
  const a = document.createElement("a");
  const text = document.createTextNode(testName);
  a.appendChild(text);
  a.setAttribute("href", testURL);
  row.appendChild(a);
};

const prepareEmptyVariables = (data) => {
  const allVariablesAllTests = data
    .reduce((testAccumulator, { testData }) => {
      return [...testAccumulator, ...testData];
    }, [])
    .map(({ variableName }) => {
      return variableName;
    });
  const emptyVariables = [...new Set(allVariablesAllTests)].reduce(
    (accumulator, value) => {
      return { ...accumulator, [value]: "" };
    },
    {}
  );
  return emptyVariables;
};

const getTestIdentifier = ({ testName, testURL }) => {
  return { testName, testURL };
};

const convertTestDataArrToObj = ({ testData }) => {
  let obj = {};
  testData.forEach((dt) => {
    obj = { ...obj, [dt.variableName]: dt.value };
  });
  return obj;
};

const resolveDuplicateVariables = ({ testData }) => {
  const variableNames = testData.map((dt) => {
    return dt.variableName;
  });
  const duplicateVariables = variableNames.filter(
    (variable, index) => index !== variableNames.indexOf(variable)
  );
  const newFormVariables = duplicateVariables.map((variable) => {
    const consolidatedValues = testData
      .filter((dt) => variable == dt.variableName)
      .map((dt) => {
        return dt.value;
      })
      .join(", ");
    return { [variable]: consolidatedValues };
  });
  const resolvedVariables = newFormVariables.reduce((accumulator, variable) => {
    return { ...accumulator, ...variable };
  }, {});
  return resolvedVariables;
};

getData()
  .then((data) => {
    const defaultVariables = prepareEmptyVariables(data);
    const refinedData = data.map((test) => {
      return {
        ...getTestIdentifier(test),
        ...defaultVariables,
        ...convertTestDataArrToObj(test),
        ...resolveDuplicateVariables(test),
      };
    });

    const table = document.querySelector("table");
    const header = Object.keys(refinedData[0]);
    generateTable(table, refinedData);
    generateTableHead(table, header);
  })
  .catch((err) => {
    document.querySelector("h2").innerHTML = err;
    document.querySelector("p").innerHTML =
      "Please make sure that valid API key and Suite ID have been updated in script.js 😁";
    console.log(err);
  });
