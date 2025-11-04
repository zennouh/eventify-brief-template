"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let allEvents = [];
function selectSection(event) {
    const div = document.getElementsByClassName("is-visible")[0];
    if (div) {
        div.classList.remove("is-visible");
        const allBtns = document.getElementsByClassName("sidebar__btn");
        for (let index = 0; index < allBtns.length; index++) {
            allBtns[index].classList.remove("is-active");
        }
        event.currentTarget.classList.add("is-active");
        const data = event.currentTarget.dataset.screen;
        const section = document.querySelector(`section[data-screen="${data}"]`);
        section?.classList.add("is-visible");
    }
}
function addEvent(e) {
    const form = document.getElementById("event-form");
    e.preventDefault();
    const title = document.getElementById("event-title").value;
    const imageUrl = document.getElementById("event-image").value;
    const description = document.getElementById("event-description").value;
    const numberOfSet = Number(document.getElementById("event-seats").value);
    const basePrice = Number(document.getElementById("event-price").value);
    allEvents.push({ title, imageUrl, description, numberOfSet, basePrice });
    form?.reset();
    console.log(title, description, imageUrl, numberOfSet, basePrice);
}
