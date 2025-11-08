import * as ChartJs from 'chart.js';
const allEventsKey = 'eventsKey';
let allEvents = [];
let subEvents = [];
let variants = [];
let chart;
let currentPage = 1;
const eventPerPage = 3;
let maxPages = 0;
// @ts-ignore
ChartJs.Chart.register.apply(null, Object.values(ChartJs).filter((chartClass) => chartClass.id));
function renderGraph() {
    const labels = Array.from({ length: allEvents.length }, (_, index) => index.toString());
    const data = Array.from({ length: allEvents.length }, (_, index) => allEvents[index].numberOfSet);
    const ctx = document.getElementById('myChart');
    chart = new ChartJs.Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '# of seats',
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
    document.getElementById('stat-total-events').textContent =
        statics.totalEvent.toString();
    document.getElementById('stat-total-seats').textContent =
        statics.totalSeat.toString();
    document.getElementById('stat-total-price').textContent = `$${statics.totalRevenue}`;
}
function selectSection(event) {
    const div = document.getElementsByClassName('is-visible')[0];
    if (div) {
        div.classList.remove('is-visible');
        const allBtns = document.getElementsByClassName('sidebar__btn');
        for (let index = 0; index < allBtns.length; index++) {
            allBtns[index].classList.remove('is-active');
        }
        event.currentTarget.classList.add('is-active');
        const data = event.currentTarget.dataset.screen;
        const section = document.querySelector(`section[data-screen="${data}"]`);
        section === null || section === void 0 ? void 0 : section.classList.add('is-visible');
    }
}
function clearInputs() {
    const form = document.getElementById('event-form');
    const allv = document.getElementsByClassName('variant-row');
    for (let index = 0; index < allv.length; index++) {
        const element = allv[index];
        console.log(element);
        element.remove();
    }
    variants = [];
    form === null || form === void 0 ? void 0 : form.reset();
}
function addEvent(e) {
    const form = document.getElementById('event-form');
    e.preventDefault();
    const title = document.getElementById('event-title').value.trim();
    const imageUrl = document.getElementById('event-image').value.trim();
    const description = document.getElementById('event-description').value.trim();
    const numberOfSet = Number(document.getElementById('event-seats').value);
    const basePrice = Number(document.getElementById('event-price').value);
    const isInvalid = HandleInvalidInputs(title, imageUrl, description, numberOfSet, basePrice);
    if (!isInvalid) {
        extractDataFromVar();
        const event = {
            title,
            imageUrl,
            description,
            numberOfSet,
            basePrice,
            variants,
        };
        allEvents.push(event);
        updateStaticsSection();
        chart.destroy();
        renderGraph();
        handleTable(1);
        //============================
        saveEvent(allEvents);
        variants = [];
        form === null || form === void 0 ? void 0 : form.reset();
    }
}
function addVariant() {
    var _a;
    let div = document.createElement('div');
    div.className = 'variant-row';
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
    (_a = document.getElementById('variants-list')) === null || _a === void 0 ? void 0 : _a.appendChild(div);
    console.log(div.children);
    div.children[4].addEventListener('click', () => {
        div.remove();
    });
}
function extractDataFromVar() {
    const allVars = document.getElementById('variants-list');
    const childs = allVars === null || allVars === void 0 ? void 0 : allVars.children;
    if ((childs === null || childs === void 0 ? void 0 : childs.length) == 0) {
        return;
    }
    console.log('extractDataFromVar: ', childs === null || childs === void 0 ? void 0 : childs.length);
    for (let index = 0; index < childs.length; index++) {
        const vName = document.getElementsByClassName('input variant-row__name')[index].value;
        const vQuantity = document.getElementsByClassName('input variant-row__qty')[index].value;
        const vValue = document.getElementsByClassName('input variant-row__value')[index].value;
        const mySelect = document.getElementsByClassName('select variant-row__type')[index];
        const isFixed = (mySelect === null || mySelect === void 0 ? void 0 : mySelect.value) == 'fixed';
        variants === null || variants === void 0 ? void 0 : variants.push({
            vName,
            vQuantity: Number(vQuantity),
            vValue: Number(vValue),
            isFixed,
        });
    }
    allVars.innerHTML = '';
}
function HandleInvalidInputs(title, imageUrl, description, numberOfSet, basePrice) {
    const titleTest = title == '';
    const imageUrlTest = imageUrl == '';
    const descriptionTest = description == '';
    const numberOfSetTest = numberOfSet >= 0;
    const basePriceTest = basePrice >= 0;
    const errorDiv = document.getElementById('form-errors');
    errorDiv.innerHTML = '';
    if (titleTest ||
        imageUrlTest ||
        descriptionTest ||
        !numberOfSetTest ||
        !basePriceTest) {
        // alert("S'il vous plain, saisir valid number")
        errorDiv === null || errorDiv === void 0 ? void 0 : errorDiv.classList.remove('is-hidden');
        const paragraph = document.createElement('p');
        paragraph.style.fontSize = '15px';
        paragraph.style.fontWeight = 'bold';
        paragraph.innerHTML =
            "<p>S'il vous plain, vous avez des error suivant:</p>";
        const ul = document.createElement('ul');
        ul.style.marginLeft = '30px';
        if (titleTest) {
            ul.innerHTML += '<li>Invalid text</li>';
        }
        if (imageUrlTest) {
            ul.innerHTML += '<li>Invalid image</li>';
        }
        if (descriptionTest) {
            ul.innerHTML += '<li>Invalid desc</li>';
        }
        if (numberOfSetTest) {
            ul.innerHTML += '<li>Invalid number of set</li>';
        }
        if (basePriceTest) {
            ul.innerHTML += '<li>Invalid base price</li>';
        }
        errorDiv === null || errorDiv === void 0 ? void 0 : errorDiv.appendChild(paragraph);
        errorDiv === null || errorDiv === void 0 ? void 0 : errorDiv.appendChild(ul);
        return true;
    }
    else {
        errorDiv === null || errorDiv === void 0 ? void 0 : errorDiv.classList.add('is-hidden');
        return false;
    }
}
function saveEvent(events) {
    let strObjs = JSON.stringify(events);
    localStorage.setItem(allEventsKey, strObjs);
}
function getEventsStorage() {
    let savedObjs = localStorage.getItem(allEventsKey) || '';
    if (savedObjs) {
        allEvents = JSON.parse(savedObjs) || [];
        updateStaticsSection();
        handleTable(1);
    }
}
function initNextPrevBtns() {
    const prev = Array.from(document.querySelectorAll('.pagination__btn')).filter((v) => v.textContent.includes('Prev'))[0];
    const next = Array.from(document.querySelectorAll('.pagination__btn')).filter((v) => v.textContent.includes('Next'))[0];
    prev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            handleTable(currentPage);
        }
    });
    next.addEventListener('click', () => {
        if (currentPage < maxPages) {
            currentPage++;
            handleTable(currentPage);
        }
    });
}
function createPaginationBtns() {
    const navigationBtn = document.getElementById('navigationBtn');
    navigationBtn.innerHTML = '';
    for (let index = 0; index < maxPages; index++) {
        const button = document.createElement('button');
        if (index == currentPage - 1) {
            button.className = 'pagination__btn is-active';
        }
        else {
            button.className = 'pagination__btn';
        }
        button.innerHTML = `${index + 1}`;
        button.addEventListener('click', () => {
            handleTable(index + 1);
        });
        navigationBtn === null || navigationBtn === void 0 ? void 0 : navigationBtn.appendChild(button);
    }
}
function pagination(page = 1, searchList = []) {
    currentPage = page;
    let events = [];
    if (searchList.length === 0) {
        events = allEvents;
    }
    else {
        events = searchList;
    }
    maxPages = events.length % eventPerPage == 0 ? events.length / eventPerPage : Math.ceil(events.length / eventPerPage);
    let skip = (page - 1) * eventPerPage;
    if (eventPerPage > events.length) {
        subEvents = events;
        return;
    }
    for (let i = 0; i < eventPerPage; i++) {
        subEvents[i] = events[i + skip];
    }
    const prev = Array.from(document.querySelectorAll('.pagination__btn')).filter((v) => v.textContent.includes('Prev'))[0];
    const next = Array.from(document.querySelectorAll('.pagination__btn')).filter((v) => v.textContent.includes('Next'))[0];
    if (currentPage == 1) {
        prev.classList.add('is-disabled');
    }
    else {
        prev.classList.remove('is-disabled');
    }
    if (currentPage == maxPages) {
        next.classList.add('is-disabled');
    }
    else {
        next.classList.remove('is-disabled');
    }
}
function varTableHover() {
    const varTable = document.getElementById("varTable");
    varTable.style.position = "absolute";
    varTable === null || varTable === void 0 ? void 0 : varTable.classList.toggle("is-hidden");
}
function handleTable(page, searchList = []) {
    pagination(page, searchList);
    createPaginationBtns();
    const tbody = document.querySelector('.table__body');
    tbody.innerHTML = '';
    for (let i = 0; i < subEvents.length; i++) {
        const ele = subEvents[i];
        let tr = createTableEventRow(ele, i);
        tbody === null || tbody === void 0 ? void 0 : tbody.appendChild(tr);
    }
}
function searchByTitle() {
    let seachList = [];
    const input = document.getElementById('search-events');
    input.addEventListener('input', () => {
        const searchValue = input.value || '';
        console.log('click on it', searchValue);
        for (let i = 0; i < allEvents.length; i++) {
            const element = allEvents[i];
            if (element.title.includes(searchValue)) {
                seachList.push(element);
            }
        }
        handleTable(1, seachList);
        seachList = [];
    });
}
function imageFocusOut() {
    const preview = document.getElementById('preview');
    const imageEvent = document.getElementById('event-image');
    imageEvent === null || imageEvent === void 0 ? void 0 : imageEvent.addEventListener('input', (event) => {
        const value = event.currentTarget.value;
        preview.src = value;
        preview.classList.remove('is-hidden');
    });
}
function imgRadio() {
    const inputRadios = document.querySelectorAll("input[name='imgType']");
    const linkInput = document.querySelector("input[class*='link']");
    const uploadInput = document.querySelector("input[class*='upload']");
    inputRadios.forEach((r) => {
        r.addEventListener("change", () => {
            const value = r.value;
            if (value === "upload") {
                uploadInput === null || uploadInput === void 0 ? void 0 : uploadInput.classList.remove("is-hidden");
                linkInput === null || linkInput === void 0 ? void 0 : linkInput.classList.add("is-hidden");
            }
            else {
                linkInput === null || linkInput === void 0 ? void 0 : linkInput.classList.remove("is-hidden");
                uploadInput === null || uploadInput === void 0 ? void 0 : uploadInput.classList.add("is-hidden");
            }
        });
    });
}
function init() {
    var _a, _b, _c;
    getEventsStorage();
    renderGraph();
    imageFocusOut();
    initNextPrevBtns();
    searchByTitle();
    imgRadio();
    //   uploadImage();
    document
        .querySelectorAll('.sidebar__btn')
        .forEach((btn) => btn.addEventListener('click', selectSection));
    (_a = document
        .querySelector('.form__actions button.btn--primary')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addEvent);
    (_b = document
        .querySelector('button.btn--ghost')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', clearInputs);
    (_c = document
        .getElementById('btn-add-variant')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', addVariant);
}
init();
// function uploadImage() {
//   const imageInput = document.getElementById('imageInput')
//   const preview = document.getElementById('preview') as HTMLImageElement
//   imageInput?.addEventListener('change', (event) => {
//     const target = event.target as HTMLInputElement // cast here
//     const file = target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         preview!.src = e.target?.result as string
//       }
//       reader.readAsDataURL(file)
//     } else {
//       preview.src = ''
//     }
//   },)
// }
function createTableEventRow(ele, i) {
    var _a;
    const tr = document.createElement('tr');
    tr.className = 'table__row';
    tr.dataset.eventId = (i + 1).toString();
    const tdId = document.createElement('td');
    tdId.textContent = `${i + 1}`;
    tr.appendChild(tdId);
    const tdImg = document.createElement('td');
    tdImg.style.width = "100px";
    tdImg.style.height = "100px";
    tdImg.innerHTML = `<img src="${ele.imageUrl}"
  alt="" style="height="100%"; width="100%";  object-fit: fill;">`;
    tr.appendChild(tdImg);
    const tdTitle = document.createElement('td');
    tdTitle.textContent = `${ele.title}`;
    tr.appendChild(tdTitle);
    const tdSeats = document.createElement('td');
    tdSeats.textContent = `${ele.numberOfSet}`;
    tr.appendChild(tdSeats);
    const tdPrice = document.createElement('td');
    tdPrice.textContent = `${ele.basePrice}`;
    tr.appendChild(tdPrice);
    const tdVariants = document.createElement('td');
    tdVariants.style.position = "relative";
    tdVariants.id = `vari-${i + 1}`;
    const button = document.createElement('button');
    button.id = `vari-id-${i + 1}`;
    button.className = `btn btn--small`;
    button.dataset.action = `details`;
    button.textContent = `Variants`;
    button.onmouseover = () => {
        button.classList.toggle("is-hidden");
        varTableHover();
    };
    button.onmouseleave = () => {
        button.classList.toggle("is-hidden");
        varTableHover();
    };
    tdVariants.appendChild(button);
    let content = '';
    (_a = ele.variants) === null || _a === void 0 ? void 0 : _a.forEach((v, i) => {
        content += `<tr class="table__row" data-event="${i + 1}">
        <td>${v.vName}</td>
        <td>${v.vQuantity}</td>
        <td>${v.vValue}</td>
        <td>${v.isFixed ? "fixed" : "percent"}</td>
      </tr>`;
    });
    const table = document.createElement("table");
    table.className = "table is-hidden";
    table.style = "z-index: 100;";
    table.id = "varTable";
    table.style.backgroundColor = "red";
    table.innerHTML = `
     <thead class="table__head">
      <tr class="table__row">
        <th>Title</th>
        <th>Quantity</th>
        <th>Value</th>
        <th>Type</th>
      </tr>
    </thead>
    <tbody class="table__body">
      ${content}
    </tbody>
  `;
    tdVariants.appendChild(table);
    tr.appendChild(tdVariants);
    // =========================================
    const tdControler = document.createElement("td");
    const buttondetails = document.createElement('button');
    buttondetails.className = `btn btn--small`;
    buttondetails.dataset.action = `details`;
    buttondetails.textContent = `Details`;
    buttondetails.onclick = () => {
        console.log("this is details");
    };
    tdControler.appendChild(buttondetails);
    const buttonedit = document.createElement('button');
    buttonedit.className = `btn btn--small`;
    buttonedit.dataset.action = `edit`;
    buttonedit.textContent = `Edit`;
    buttonedit.onclick = () => {
        const eventModel = document.getElementById("event-modal");
        eventModel === null || eventModel === void 0 ? void 0 : eventModel.classList.remove("is-hidden");
        const form = createUpdateForm(ele);
        const closeBtn = document.querySelector("button.modal__close");
        closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener("click", () => {
            eventModel === null || eventModel === void 0 ? void 0 : eventModel.classList.add("is-hidden");
            form.innerHTML = "";
        });
        const mainModelContent = document.getElementById("modal-body");
        mainModelContent === null || mainModelContent === void 0 ? void 0 : mainModelContent.appendChild(form);
    };
    tdControler.appendChild(buttonedit);
    const buttonarchive = document.createElement('button');
    buttonarchive.className = `btn btn--danger btn--small`;
    buttonarchive.dataset.action = `archive`;
    buttonarchive.textContent = `Delete`;
    buttonarchive.onclick = () => {
        console.log("delete");
        // tr.remove();
        // let newArr: IEvent[] = [];
        // for (let index = 0; index < allEvents.length; index++) {
        //   const element = allEvents[index];
        // }
        // handleTable(1)
    };
    tdControler.appendChild(buttonarchive);
    tr.appendChild(tdControler);
    return tr;
}
function createUpdateForm(event) {
    const form = document.createElement("form");
    form.innerHTML = `
  
                <!-- Title -->
                <div class="form__group">
                  <label class="form__label" for="event-title"
                    >Event Title</label
                  >
                  <input
                    type="text"
                    id="edit-event-title"
                    class="input"
                    placeholder="Enter event title"
                    value="${event.title}"
                    required
                  />
                </div>

                <!-- Image URL -->
                <div class="form__group">
                  <label class="form__label" for="event-image">Image URL</label>
                  <p>Please select your image import type:</p>
                  <div class="choose-type">
                    <input
                      type="radio"
                      id="upload"
                      name="imgType"
                      value="upload"
                    />
                    <label for="upload">Upload</label>
                    <input
                      type="radio"
                      id="link"
                      name="imgType"
                      value="link"
                      checked
                    />
                    <label for="link">Link</label><br />
                  </div>

                  <input
                    type="url"
                    id="edit-event-image"
                    class="input link"
                    value="${event.imageUrl}"
                    placeholder="https://example.com/image.jpg"
                  />
                  <input
                    class="is-hidden upload"
                    type="file"
                    id="imageInput"
                    accept="image/*"
                  />

                  <div>
                    <img
                      id="preview"
                      src="${event.imageUrl}"
                      alt="Image Preview"
                     
                    />
                  </div>
                </div>

                <!-- Description -->
                <div class="form__group">
                  <label class="form__label" for="event-description"
                    >Description</label
                  >
                  <textarea
                    id="edit-event-description"
                    class="input"
                    placeholder="Describe the event..."
                    rows="4"
                  >${event.description}</textarea>
                </div>

                <!-- Seats -->
                <div class="form__group">
                  <label class="form__label" for="event-seats"
                    >Number of Seats</label
                  >
                  <input
                    type="number"
                    id="edit-event-seats"
                    class="input"
                    placeholder="100"
                     value="${event.numberOfSet}"
                    min="1"
                    required
                  />
                </div>

                <!-- Base Price -->
                <div class="form__group">
                  <label class="form__label" for="event-price"
                    >Base Price ($)</label
                  >
                  <input
                    type="number"
                    id="edit-event-price"
                    class="input"
                     value="${event.basePrice}"
                    placeholder="50.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>


              
                
  `;
    let fieldset = null;
    // display variants fieldset
    if (event.variants) {
        fieldset = document.createElement("fieldset");
        fieldset.className = "variants";
        const legend = document.createElement("legend");
        legend.className = "variants__title";
        legend.innerHTML = " Pricing Variants (Optional)";
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn--small";
        button.id = "edit-btn-add-variant";
        button.textContent = "+ Add Variant";
        button.addEventListener("click", () => {
            console.log("add variants");
            createVariants(event);
        });
        legend.appendChild(button);
        fieldset.appendChild(legend);
        const variantssDiv = document.createElement("div");
        variantssDiv.className = "variants__list";
        variantssDiv.id = "edit-variants-list";
        // display variants 
        for (let index = 0; index < event.variants.length; index++) {
            const variant = event.variants[index];
            let div = document.createElement('div');
            div.className = 'variant-row';
            div.innerHTML = `
    <input value="${variant.vName}" type="text" class="input edit-variant-row__name" />
    <input value="${variant.vQuantity}" type="number" class="input edit-variant-row__qty" placeholder="Qty" min="1" />
    <input value="${variant.vValue}" type="number" class="input edit-variant-row__value" placeholder="Value" step="0.01" />
    <select class="select edit-variant-row__type">
      <option value="fixed">Fixed Price</option>
      <option value="percentage">Percentage Off</option>
    </select>
    
    `;
            const varBtn = document.createElement("button");
            varBtn.type = "button";
            varBtn.className = "btn btn--danger btn--small variant-row__remove";
            varBtn.textContent = "Remove";
            varBtn.addEventListener("click", () => {
                console.log("remove variant");
            });
            div.appendChild(varBtn);
            variantssDiv.appendChild(div);
        }
        fieldset.appendChild(variantssDiv);
    }
    if (fieldset) {
        form.appendChild(fieldset);
    }
    const formAction = document.createElement("div");
    formAction.className = "form__actions";
    const button = document.createElement("button");
    button.className = "btn btn--primary";
    button.type = "submit";
    button.textContent = "Edit";
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById('edit-event-title').value.trim();
        const imageUrl = document.getElementById('edit-event-image').value.trim();
        const description = document.getElementById('edit-event-description').value.trim();
        const numberOfSet = Number(document.getElementById('edit-event-seats').value);
        const basePrice = Number(document.getElementById('edit-event-price').value);
        const isInvalid = HandleInvalidInputs(title, imageUrl, description, numberOfSet, basePrice);
        if (!isInvalid) {
            // extractDataFromVar()
            const _allvars = extractUpatedDataFromVar();
            const ele = {
                title,
                imageUrl,
                description,
                numberOfSet,
                basePrice,
                variants: _allvars,
            };
            const eventModel = document.getElementById("event-modal");
            if (confirm("are sure")) {
                const eTndex = getEventIndex(event);
                console.log(eTndex);
                allEvents[eTndex] = ele;
                saveEvent(allEvents);
                handleTable(currentPage);
                const closeBtn = document.querySelector("button.modal__close");
                closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener("click", () => {
                    eventModel === null || eventModel === void 0 ? void 0 : eventModel.classList.add("is-hidden");
                });
            }
            else {
            }
            eventModel === null || eventModel === void 0 ? void 0 : eventModel.classList.add("is-hidden");
            form.innerHTML = "";
        }
    });
    formAction.appendChild(button);
    form.appendChild(formAction);
    return form;
}
function getEventIndex(event) {
    for (let index = 0; index < allEvents.length; index++) {
        const element = allEvents[index];
        if (event.title == element.title && event.description == element.description) {
            return index;
        }
    }
    return -1;
}
function createVariants(event) {
    let variant = { vName: "", vQuantity: 0, vValue: 0, isFixed: false };
    // event.variants?.push(variant);
    const variantssDiv = document.getElementById("edit-variants-list");
    let div = document.createElement('div');
    div.className = 'variant-row';
    div.innerHTML = `
    <input value="${variant.vName}" type="text" class="input edit-variant-row__name" placeholder="Variant name (e.g., 'Early Bird')" />
    <input value="${variant.vQuantity}" type="number" class="input edit-variant-row__qty" placeholder="Qty" min="1" />
    <input value="${variant.vValue}" type="number" class="input edit-variant-row__value" placeholder="Value" step="0.01" />
        <select class="select edit-variant-row__type">
            <option value="fixed">Fixed Price</option>
            <option value="percentage">Percentage Off</option>
        </select>
    
    `;
    const varBtn = document.createElement("button");
    varBtn.type = "button";
    varBtn.className = "btn btn--danger btn--small variant-row__remove";
    varBtn.textContent = "Remove";
    varBtn.addEventListener("click", () => {
    });
    div.appendChild(varBtn);
    variantssDiv === null || variantssDiv === void 0 ? void 0 : variantssDiv.appendChild(div);
}
function extractUpatedDataFromVar() {
    const allVars = document.getElementById('edit-variants-list');
    const childs = allVars === null || allVars === void 0 ? void 0 : allVars.children;
    if ((childs === null || childs === void 0 ? void 0 : childs.length) == 0) {
        return;
    }
    let allvars = [];
    for (let index = 0; index < childs.length; index++) {
        const vName = document.getElementsByClassName('input edit-variant-row__name')[index].value;
        const vQuantity = document.getElementsByClassName('input edit-variant-row__qty')[index].value;
        const vValue = document.getElementsByClassName('input edit-variant-row__value')[index].value;
        const mySelect = document.getElementsByClassName('select edit-variant-row__type')[index];
        const isFixed = (mySelect === null || mySelect === void 0 ? void 0 : mySelect.value) == 'fixed';
        console.log({
            vName,
            vQuantity: Number(vQuantity),
            vValue: Number(vValue),
            isFixed,
        });
        allvars.push({
            vName,
            vQuantity: Number(vQuantity),
            vValue: Number(vValue),
            isFixed,
        });
    }
    return allvars;
}
