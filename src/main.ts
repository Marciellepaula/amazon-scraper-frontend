import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
const keywordInput = document.getElementById("keyword") as HTMLInputElement;
const resultsDiv = document.getElementById("results") as HTMLDivElement;

interface Product {
  image: string;
  name: string;
  rating: string;
  reviewCount: string;
}

function getStarRating(rating: string) {
  let numericRating = parseFloat(rating); 
  let starsFull = Math.floor(numericRating); 
  let starsHalf = numericRating % 1 >= 0.5 ? 1 : 0; 
  let starsEmpty = 5 - starsFull - starsHalf; 
  return '★'.repeat(starsFull) + '✰'.repeat(starsHalf) + '☆'.repeat(starsEmpty); 
}

searchBtn.addEventListener("click", async () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    alert("Please enter a keyword");
    return;
  }





  resultsDiv.innerHTML = "Loading...";

  try {
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);

    const data: { success: boolean, data: Product[] } = await res.json();

    console.log(data);



    if (Array.isArray(data.data)) {
      resultsDiv.innerHTML = data.data.map((product: Product) => `
        <div class="product">
          <img src="${product.image}" alt="Product image">
          <div class="product-info">
            <h3>${product.name}</h3>
           <p>Rating: ${getStarRating((product.rating))}</p>
            <p>Reviews: ${product.reviewCount}</p>
          </div>
        </div>
      `).join("");
    } else {
      resultsDiv.innerHTML = `<p>Error: ${data}</p>`;
    }
  } catch (err) {
    resultsDiv.innerHTML = `<p>Failed to fetch data</p> `;
    console.error(err);
  }
});


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
