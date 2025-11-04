interface IEvent {
    title: string,
    imageUrl: string,
    description: string,
    numberOfSet: number,
    basePrice: number,
}


let allEvents: IEvent[] = [];


function selectSection(event: any) {

    const div = document.getElementsByClassName("is-visible")[0];
    if (div) {
        div.classList.remove("is-visible");

        const allBtns = document.getElementsByClassName("sidebar__btn");
        for (let index = 0; index < allBtns.length; index++) {
            allBtns[index]!.classList.remove("is-active")
        }
        event.currentTarget!.classList.add("is-active");


        const data = event.currentTarget!.dataset.screen;
        const section = document.querySelector(`section[data-screen="${data}"]`)
        section?.classList.add("is-visible")

    }


}

function addEvent(e: Event) {
    const form = document.getElementById("event-form") as HTMLFormElement;

    e.preventDefault();


    const title = (document.getElementById("event-title")! as HTMLInputElement).value;
    const imageUrl = (document.getElementById("event-image") as HTMLInputElement).value;
    const description = (document.getElementById("event-description") as HTMLInputElement).value;
    const numberOfSet = Number((document.getElementById("event-seats") as HTMLInputElement).value);
    const basePrice = Number((document.getElementById("event-price") as HTMLInputElement).value);

    allEvents.push({ title, imageUrl, description, numberOfSet, basePrice });
    form?.reset();


    console.log(title, description, imageUrl, numberOfSet, basePrice);



}