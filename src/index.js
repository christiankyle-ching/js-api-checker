// UI References
const __table = document.querySelector("#tableJSApi");
const __tableBody = __table.querySelector("tbody");

const __formSearch = document.querySelector("#formSearch");
const __inputSearch = __formSearch.search;

// UI Functions
const __buildResultRowNode = (name, isHeader = false) => {
  const row = document.createElement("tr");
  const colName = document.createElement("td");
  const spanName = document.createElement(isHeader ? "strong" : "span");

  spanName.innerText = name;

  row.appendChild(colName);
  colName.appendChild(spanName);

  return row;
};

// Helpers
const __formatName = (isFn, ...names) => {
  let n = names.join(".");
  n += isFn ? "()" : "";
  return n;
};
const __hasChild = (obj) =>
  typeof obj === "function" || typeof obj === "object";
const __isFn = (obj) => typeof obj === "function";
const removeDups = (arr) => {
  const seen = {};
  arr.forEach((e) => (seen[e] = 0));
  return Object.keys(seen);
};

// Main Function
const __ALL_JS_API = [];

const __traverseObjNames = (obj, accumulator) => {
  const objName = obj.constructor.name;
  accumulator.push({
    name: objName,
    el: __buildResultRowNode(objName, true),
  });

  // Use for..in and Object.getOwnPropertyNames
  const _headers = [];
  for (const header in obj) {
    _headers.push(header);
  }
  _headers.push(...Object.getOwnPropertyNames(obj));
  const headers = removeDups(_headers);

  for (const header of headers) {
    try {
      // Skip locally made vars
      if (header.substr(0, 2) === "__") continue;

      // Header
      const headerName = __formatName(__isFn(obj[header]), objName, header);
      accumulator.push({
        name: headerName,
        el: __buildResultRowNode(headerName, true),
      });

      // Check first
      if (__hasChild(obj[header])) {
        // Props
        for (const prop in obj[header]) {
          // Skip locally made vars
          if (prop.substr(0, 2) === "__") continue;

          const propName = __formatName(
            __isFn(obj[header][prop]),
            objName,
            header,
            prop
          );
          accumulator.push({
            name: propName,
            el: __buildResultRowNode(propName, false),
          });
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }
};

// Load Objects
__traverseObjNames(window, __ALL_JS_API);
__traverseObjNames(navigator, __ALL_JS_API);
__traverseObjNames(document, __ALL_JS_API);

__formSearch.addEventListener("submit", __onSearch);
__inputSearch.addEventListener("input", (e) => {
  if (e.target.value === "") {
    __updateTable(__ALL_JS_API);
  }
});

function __onSearch(e) {
  e.preventDefault();
  const searchTerm = __inputSearch.value;

  const results = __ALL_JS_API.filter((api) =>
    api.name.toLowerCase().includes(searchTerm)
  );

  __updateTable(results);
}

const __updateTable = (list) => {
  // Clear first
  __tableBody.innerHTML = "";

  // Add each again
  list.forEach((api) => {
    __tableBody.appendChild(api.el);
  });
};

// Load all first
__updateTable(__ALL_JS_API);
