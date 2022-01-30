// UI References
const __table = document.querySelector("#tableJSApi");
const __tableBody = __table.querySelector("tbody");

const __formSearch = document.querySelector("#formSearch");
const __inputSearch = __formSearch.search;

const __btnScrollTop = document.querySelector("#btnScrollTop");
const __btnScrollBottom = document.querySelector("#btnScrollBottom");

const __timerElement = document.querySelector("#timer");

// Timer Functions
const __timers = {};

const __startTimer = (key) => {
  __timers[key] = new Date();
};

const __endTimer = (key) => {
  try {
    return new Date() - __timers[key];
  } catch (e) {
    console.error(e);
    return -1;
  }
};

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

__btnScrollTop.addEventListener("click", () =>
  scrollTo({ top: 0, behavior: "smooth" })
);
__btnScrollBottom.addEventListener("click", () =>
  scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
);

document.addEventListener("scroll", () => {
  const showTop = window.scrollY > window.innerHeight;
  const showBottom =
    window.scrollY < document.body.scrollHeight - window.innerHeight;

  if (showTop) __btnScrollTop.classList.add("is-active");
  else __btnScrollTop.classList.remove("is-active");

  if (showBottom) __btnScrollBottom.classList.add("is-active");
  else __btnScrollBottom.classList.remove("is-active");
});

const __updateTimer = (ms) => {
  __timerElement.innerText = "Refreshed in: " + ms + " ms";
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
  const headers = removeDups(_headers.concat(Object.getOwnPropertyNames(obj)));

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
    __loadAll();
  }
});

function __onSearch(e) {
  e.preventDefault();
  __startTimer("search");

  try {
    const searchTerm = __inputSearch.value.toLowerCase();

    if (searchTerm == "") return;

    const results = __ALL_JS_API.filter((api) =>
      api.name.toLowerCase().includes(searchTerm)
    );

    __updateTable(results);
  } catch (e) {
    console.error(e);
  } finally {
    __updateTimer(__endTimer("search"));
  }
}

const __loadAll = () => {
  __startTimer("reset");
  __updateTable(__ALL_JS_API);
  __updateTimer(__endTimer("reset"));
};

const __updateTable = (list) => {
  // Clear first
  __tableBody.innerHTML = "";

  // Add elements on a fragment
  const d = document.createDocumentFragment();
  list.forEach((api) => {
    d.appendChild(api.el);
  });

  // Append the whole fragment to body
  __tableBody.appendChild(d);
};

// Load all first
// __updateTable(__ALL_JS_API);
__loadAll();
