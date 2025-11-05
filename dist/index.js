import * as ChartJs from "chart.js";
const allEventsKey = "eventsKey";
let allEvents = [];
let variants = [];
let chart;
// @ts-ignore
ChartJs.Chart.register.apply(null, Object.values(ChartJs).filter((chartClass) => chartClass.id));
function renderGraph() {
    const labels = Array.from({ length: allEvents.length }, (_, index) => index.toString());
    const data = Array.from({ length: allEvents.length }, (_, index) => allEvents[index].numberOfSet);
    const ctx = document.getElementById("myChart");
    chart = new ChartJs.Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "# of seats",
                    data: data,
                    borderWidth: 1,
                },
            ],
        },
    });
}
function calculateStatics() {
    let totalEvent = allEvents.length;
    let totalSeat = 0;
    let totalRevenue = 0;
    for (const e of allEvents) {
        totalSeat += e.numberOfSet;
        totalRevenue += e.basePrice;
    }
    return { totalEvent, totalSeat, totalRevenue };
}
function updateStaticsSection() {
    let statics = calculateStatics();
    document.getElementById("stat-total-events").textContent = statics.totalEvent.toString();
    document.getElementById("stat-total-seats").textContent = statics.totalSeat.toString();
    document.getElementById("stat-total-price").textContent = `$${statics.totalRevenue}`;
}
function selectSection(event) {
    const div = document.getElementsByClassName("is-visible")[0];
    if (div) {
        div.classList.remove("is-visible");
        const allBtns = document.getElementsByClassName("sidebar__btn");
        for (let index = 0; index < allBtns.length; index++) {
            allBtns[index].classList.remove("is-active");
        }
        event.currentTarget.classList.add("is-active");
        console.log("erihgsddfrgrdg");
        const data = event.currentTarget.dataset.screen;
        const section = document.querySelector(`section[data-screen="${data}"]`);
        section === null || section === void 0 ? void 0 : section.classList.add("is-visible");
    }
}
function addEvent(e) {
    const form = document.getElementById("event-form");
    e.preventDefault();
    const title = document.getElementById("event-title").value.trim();
    const imageUrl = document.getElementById("event-image").value.trim();
    const description = document.getElementById("event-description").value.trim();
    const numberOfSet = Number(document.getElementById("event-seats").value);
    const basePrice = Number(document.getElementById("event-price").value);
    const isInvalid = HandleInvalidInputs(title, imageUrl, description, numberOfSet, basePrice);
    if (!isInvalid) {
        extractDataFromVar();
        const event = { title, imageUrl, description, numberOfSet, basePrice, variants };
        allEvents.push(event);
        updateStaticsSection();
        chart.destroy();
        renderGraph();
        saveEvent(allEvents);
        variants = [];
        form === null || form === void 0 ? void 0 : form.reset();
    }
}
function addVariant() {
    var _a;
    let div = document.createElement("div");
    div.className = "variant-row";
    div.innerHTML = `
    <input type="text" class="input variant-row__name" placeholder="Variant name (e.g., 'Early Bird')" />
    <input type="number" class="input variant-row__qty" placeholder="Qty" min="1" />
    <input type="number" class="input variant-row__value" placeholder="Value" step="0.01" />
        <select class="select variant-row__type">
            <option value="fixed">Fixed Price</option>
            <option value="percentage">Percentage Off</option>
        </select>
    <button type="button" class="btn btn--danger btn--small variant-row__remove">Remove</button>
    `;
    (_a = document.getElementById("variants-list")) === null || _a === void 0 ? void 0 : _a.appendChild(div);
    console.log(div.children);
    div.children[4].addEventListener("click", () => {
        console.log("click");
        div.remove();
    });
}
function extractDataFromVar() {
    var _a, _b;
    const allVars = (_a = document.getElementById("variants-list")) === null || _a === void 0 ? void 0 : _a.children;
    if ((allVars === null || allVars === void 0 ? void 0 : allVars.length) == 0) {
        return;
    }
    for (let index = 0; index < allVars.length; index++) {
        const element = allVars[index];
        const vName = document.getElementsByClassName("input variant-row__name")[0].value;
        const vQuantity = document.getElementsByClassName("input variant-row__qty")[0].value;
        const vValue = document.getElementsByClassName("input variant-row__value")[0].value;
        const mySelect = document.getElementsByClassName("select variant-row__type")[0];
        const isFixed = (mySelect === null || mySelect === void 0 ? void 0 : mySelect.value) == "fixed";
        variants === null || variants === void 0 ? void 0 : variants.push({ vName, vQuantity: Number(vQuantity), vValue: Number(vValue), isFixed });
        (_b = document.getElementById("variants-list")) === null || _b === void 0 ? void 0 : _b.removeChild(element);
    }
}
function HandleInvalidInputs(title, imageUrl, description, numberOfSet, basePrice) {
    const titleTest = title == "";
    const imageUrlTest = imageUrl == "";
    const descriptionTest = description == "";
    const numberOfSetTest = numberOfSet >= 0;
    const basePriceTest = basePrice >= 0;
    const errorDiv = document.getElementById("form-errors");
    errorDiv.innerHTML = "";
    if (titleTest || imageUrlTest || descriptionTest || !numberOfSetTest || !basePriceTest) {
        // alert("S'il vous plain, saisir valid number")
        errorDiv === null || errorDiv === void 0 ? void 0 : errorDiv.classList.remove("is-hidden");
        const paragraph = document.createElement("p");
        paragraph.style.fontSize = "15px";
        paragraph.style.fontWeight = "bold";
        paragraph.innerHTML = "<p>S'il vous plain, vous avez des error suivant:</p>";
        const ul = document.createElement("ul");
        ul.style.marginLeft = "30px";
        if (titleTest) {
            ul.innerHTML += "<li>Invalid text</li>";
        }
        if (imageUrlTest) {
            ul.innerHTML += "<li>Invalid image</li>";
        }
        if (descriptionTest) {
            ul.innerHTML += "<li>Invalid desc</li>";
        }
        if (numberOfSetTest) {
            ul.innerHTML += "<li>Invalid number of set</li>";
        }
        if (basePriceTest) {
            ul.innerHTML += "<li>Invalid base price</li>";
        }
        errorDiv === null || errorDiv === void 0 ? void 0 : errorDiv.appendChild(paragraph);
        errorDiv === null || errorDiv === void 0 ? void 0 : errorDiv.appendChild(ul);
        return true;
    }
    else {
        errorDiv === null || errorDiv === void 0 ? void 0 : errorDiv.classList.add("is-hidden");
        return false;
    }
}
function saveEvent(events) {
    let strObjs = JSON.stringify(events);
    localStorage.setItem(allEventsKey, strObjs);
}
function getEventsStorage() {
    let savedObjs = localStorage.getItem(allEventsKey) || "";
    if (savedObjs) {
        allEvents = JSON.parse(savedObjs) || [];
        updateStaticsSection();
    }
}
// function handleTable() {
//     const tr = document.createElement("tr");
// }
function init() {
    var _a, _b;
    getEventsStorage();
    renderGraph();
    document.querySelectorAll(".sidebar__btn").forEach(btn => btn.addEventListener("click", selectSection));
    (_a = document.querySelector(".form__actions button.btn--primary")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", addEvent);
    (_b = document.getElementById("btn-add-variant")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", addVariant);
}
init();
