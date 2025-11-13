import { IStatics } from "./index";

export function titleAsc(allEvents: any[]) {
    let newArr: any[] = allEvents;
    for (let i = 0; i < newArr.length; i++) {
        for (let j = i + 1; j < newArr.length; j++) {
            if (newArr[i].title > newArr[j].title) {
                const container = newArr[i] // 8
                newArr[i] = newArr[j]
                newArr[j] = container
            }
        }
    }
    return newArr;

}
export function titleDesc(allEvents: any[]) {
    let newArr: any[] = allEvents;
    for (let i = 0; i < newArr.length; i++) {
        for (let j = i + 1; j < newArr.length; j++) {
            if (newArr[i].title < newArr[j].title) {
                const container = newArr[i]
                newArr[i] = newArr[j]
                newArr[j] = container
            }
        }
    }
    return newArr
}
export function priceAsc(allEvents: any[]) {
    let newArr: any[] = allEvents;
    for (let i = 0; i < newArr.length; i++) {
        for (let j = i + 1; j < newArr.length; j++) {
            if (newArr[i].basePrice > newArr[j].basePrice) {
                const container = newArr[i] // 8
                newArr[i] = newArr[j]
                newArr[j] = container
            }
        }
    }
    return newArr
}
export function priceDesc(allEvents: any[]) {
    let newArr: any[] = allEvents;
    for (let i = 0; i < newArr.length; i++) {
        for (let j = i + 1; j < newArr.length; j++) {
            if (newArr[i].basePrice < newArr[j].basePrice) {
                const container = newArr[i]
                newArr[i] = newArr[j]
                newArr[j] = container
            }
        }
    }
    return newArr
}
export function seatsAsc(allEvents: any[]) {
    let newArr: any[] = allEvents;
    for (let i = 0; i < newArr.length; i++) {
        for (let j = i + 1; j < newArr.length; j++) {
            if (newArr[i].numberOfSet > newArr[j].numberOfSet) {
                const container = newArr[i] // 8
                newArr[i] = newArr[j]
                newArr[j] = container
            }
        }
    }
    return newArr;
}

export function calculateStatics(allEvents: any[]): IStatics {
    let totalEvent = allEvents.length
    let totalSeat = 0
    let totalRevenue = 0
    for (const e of allEvents) {
        totalSeat += e.numberOfSet
        totalRevenue += e.basePrice
    }
    return { totalEvent, totalSeat, totalRevenue }
}