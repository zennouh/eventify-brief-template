import { titleAsc, logP } from "./index";
 

// jest.mock('chart.js', () => ({
//   Chart: jest.fn().mockImplementation(() => ({
//     destroy: jest.fn(),
//     update: jest.fn(),
//   }))
// }));

// beforeAll(() => {
//   document.body.innerHTML = `
//     <canvas id="myChart"></canvas>
//     <button class="prev"></button>
//   `;
// });

test('init runs without crashing', () => {
 logP()
  expect(4).toBe(4);
});