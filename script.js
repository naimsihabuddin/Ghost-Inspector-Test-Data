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
      return testStep.variableName != "";
    })
    .map((item) => {
      const { variableName, value } = item;
      return { variableName, value };
    });

  let testDetails = {
    testName: testName,
    testData: testData,
    // testID: test_id,
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
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
};

const generateTable = (table, data) => {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
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

getData().then((data) => {
  const table = document.querySelector("table");
  data.forEach((test) => {
    generateTestNameHeading(table, test.testName, test.testURL);
    generateTable(table, test.testData);
    const row = table.insertRow();
    const td = document.createElement("td");
    const text = document.createTextNode("#".repeat(70));
    td.appendChild(text);
    row.appendChild(td);
  });
});
