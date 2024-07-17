const API_KEY = "6jMqb7bVVXyVisoG3m7ayxd52jM"
const API_URL = "https://ci-jshint.herokuapp.com/api"
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"))

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function displayException(error) {
    let results = ""
    let heading = "An Exception Occurred"

    results += `<div>The API returned code <span class="status_code">${error.status_code}</span></div>`
    results += `<div>Error number: <span class="error_number">${error.error_no}</span></div>`
    results += `<div>Error text: <span class="error_text">${error.error}</span></div>`

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}

function processOptions(form) {
    let optArray = [];
    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    form.delete("options");
    form.append("options", optArray.join());
    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));


    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body:form,
    });

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let results = "";
    let heading = `JSHint Results for ${data.file}`
    if (data.total_errors === 0) {
        results = `<div class="no_errors>No errors reported!</div>`
    } else {
        results = `<div>Total Errors: <span class="error_count>${data.total_errors}</span></div>`
        for (let error of data.error_list) {
            results += `<div>At line<span class="line">${error.line}</span>, `
            results += `column <span class="column">${error.col}</span></div>`
            results += `<div class="error">${error.error}</div>`
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok = true) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    document.getElementById("resultsModalTitle").innerText = "API Key Status";
    document.getElementById("results-content").innerText = `Your key is valid until 
    ${data.expiry}`
    resultsModal.show();
}