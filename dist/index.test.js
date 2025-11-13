import { titleAsc, calculateStatics, titleDesc, priceAsc, priceDesc } from "./indexhelpers";
let testArr = [
    {
        title: "zennane",
        imageUrl: ".png",
        description: "azertyuiop",
        numberOfSet: 2,
        basePrice: 6,
    },
    {
        title: "nouh",
        imageUrl: ".png",
        description: "azertyuiop",
        numberOfSet: 3,
        basePrice: 4,
    },
    {
        title: "oussame",
        imageUrl: ".png",
        description: "azertyuiop",
        numberOfSet: 10,
        basePrice: 5,
    },
];
test('test titleAsec function', () => {
    const newTestArr = titleAsc(testArr);
    expect(newTestArr[0].title).toEqual("nouh");
});
test('test titleDesc function', () => {
    const newTestArr = titleDesc(testArr);
    expect(newTestArr[0].title).toEqual("zennane");
});
test('test priceAsc function', () => {
    const newTestArr = priceAsc(testArr);
    expect(newTestArr[0].basePrice).toEqual(4);
});
test('test priceDesc function', () => {
    const newTestArr = priceDesc(testArr);
    expect(newTestArr[0].basePrice).toEqual(6);
});
test("calculate statics", () => {
    const statics = calculateStatics(testArr);
    expect(statics).toEqual({ totalEvent: 3, totalSeat: 15, totalRevenue: 15 });
});
