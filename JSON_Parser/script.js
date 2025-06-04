function formatJSON() {
  const input = document.getElementById("json-input").value;
  const output = document.getElementById("json-output");
  output.innerHTML = "";

  try {
    const json = JSON.parse(input);
    const formatted = renderJSON(json);
    output.appendChild(formatted);
  } catch (e) {
    showErrorWithPosition(e);
  }
}

function renderJSON(value, key = null, path = "") {
  const container = document.createElement("div");
  const fullPath = key !== null ? (path ? `${path}.${key}` : key) : path;

  if (typeof value === "object" && value !== null) {
    const isArray = Array.isArray(value);
    const wrapper = document.createElement("div");
    wrapper.classList.add("collapsible", "expanded");

    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.onclick = () => {
      wrapper.classList.toggle("collapsed");
      wrapper.classList.toggle("expanded");
    };

    const label = document.createElement("span");
    label.innerText =
      key !== null ? `"${key}": ${isArray ? "[" : "{"}` : isArray ? "[" : "{";
    label.title = fullPath;

    wrapper.appendChild(arrow);
    wrapper.appendChild(label);

    const nested = document.createElement("div");
    nested.className = "nested";

    for (let k in value) {
      nested.appendChild(renderJSON(value[k], k, fullPath));
    }

    const close = document.createElement("div");
    close.innerText = isArray ? "]" : "}";

    wrapper.appendChild(nested);
    wrapper.appendChild(close);
    container.appendChild(wrapper);
  } else {
    const line = document.createElement("div");
    if (key !== null) {
      line.innerHTML = `<span style="color:#9cdcfe" title="${fullPath}">"${key}"</span>: <span style="color:#ce9178">${formatPrimitive(
        value
      )}</span>`;
    } else {
      line.innerHTML = `<span style="color:#ce9178">${formatPrimitive(
        value
      )}</span>`;
    }
    container.appendChild(line);
  }

  return container;
}

function formatPrimitive(value) {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (value === null) return "null";
  return "";
}
function flattenJSON(obj, prefix = "", result = {}) {
  for (let key in obj) {
    let newKey = prefix ? `${prefix}.${key}` : key;
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      flattenJSON(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}

function unflattenJSON(flatObj) {
  const result = {};
  for (let flatKey in flatObj) {
    const keys = flatKey.split(".");
    keys.reduce((acc, key, i) => {
      if (i === keys.length - 1) {
        acc[key] = flatObj[flatKey];
      } else {
        if (!acc[key]) acc[key] = {};
      }
      return acc[key];
    }, result);
  }
  return result;
}
function flatten() {
  try {
    const input = document.getElementById("json-input").value;
    const json = JSON.parse(input);
    const flattened = flattenJSON(json);
    document.getElementById("json-input").value = JSON.stringify(
      flattened,
      null,
      2
    );
    formatJSON();
  } catch (e) {
    showErrorWithPosition(e);
  }
}

function unflatten() {
  try {
    const input = document.getElementById("json-input").value;
    const json = JSON.parse(input);
    const unflattened = unflattenJSON(json);
    document.getElementById("json-input").value = JSON.stringify(
      unflattened,
      null,
      2
    );
    formatJSON();
  } catch (e) {
    showErrorWithPosition(e);
  }
}

function showErrorWithPosition(e) {
  const output = document.getElementById("json-output");
  const message = e.message;
  let match = message.match(/at position (\d+)/);
  if (match) {
    const pos = parseInt(match[1]);
    const input = document.getElementById("json-input").value;
    const before = input.substring(0, pos);
    const line = before.split("\n").length;
    const column = pos - before.lastIndexOf("\n");
    output.textContent = `Invalid JSON at line ${line}, column ${column}:\n${message}`;
  } else {
    output.textContent = `Invalid JSON:\n${message}`;
  }
}
