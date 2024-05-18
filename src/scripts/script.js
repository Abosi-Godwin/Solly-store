"use strict";

import { apiCaller } from './modules/model.js';
import { updateTimer, elementCreator, generateCartItem, emptyCartContent } from "./modules/views.js";
import { DATA_BASE_URL, TARGETDATE, CURRENCYFORMATER } from './utilities/config.js';
import { myCart, addToCartEvent, deleteFromCartEvent } from "./cartPageScript/cartPage.js";


const nav = document.querySelector("nav");
const banner = document.querySelector(".banner")
const products = document.querySelector("#products");
const categoryProducts = document.querySelector(".category-products");
const categoryBtn = document.querySelector(".category-tab");
const allReviews = document.querySelectorAll(".review");
const sliderNav = document.querySelector(".slider-navigation");
const cartPage = document.querySelector(".cart-page")
const cartCounterEl = document.querySelector(".cart-icon-section");
const closeCartEl = document.querySelector(".close-cart-page");



let currentSlide = 0;
let slideInterval;
setInterval(() => {

  const countDownTimer = document.querySelector(".countdown-timer");
  const date = new Date();
  const now = date.getTime();
  const gap = TARGETDATE - now;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;


  const theDate = Math.floor(gap / day);
  const theHour = Math.floor((gap % day) / hour)
  const theMinutes = Math.floor((gap % hour) / minute);
  const theSeconds = Math.floor((gap % minute) / second);

  countDownTimer.innerHTML = updateTimer(theDate, theHour, theMinutes, theSeconds);
}, 1000);


/* creating product elements */
const createProducts = async (products, section, divClass) => {
  for (let product of products) {
    let productDiv = elementCreator(product, divClass);
    section.insertAdjacentHTML("beforeend", productDiv);
    //addingToCartSystem();
  }
}
/* IIFE for some generic products */
(async () => {
  try {
    let genericProducts = await apiCaller(`${DATA_BASE_URL}?limit=6`);
    createProducts(genericProducts, products, "product-div");
    //addingToCartSystem();
  } catch (e) {
    throw new Error(e);
  }
})();


/* Handling category products fetching */
const categoryGenerator = async category => {
  const returnedCategory = apiCaller(`${DATA_BASE_URL}category/${category}`);
  return returnedCategory;
}


const defaultCategory = await categoryGenerator("electronics");

createProducts(defaultCategory, categoryProducts, "product-div");


/* Get category function */
const getCategory = e => {
  try {
    let currentActive = document.querySelector(".category-tab button.active");
    currentActive.classList.remove("active");

    if (e.target.classList.contains("tab")) {
      const theCategory = e.target.dataset.category;
      let returnedCategory = apiCaller(`${DATA_BASE_URL}category/${theCategory}`);


      returnedCategory.then(result => {
        categoryProducts.innerHTML = "";

        createProducts(result, categoryProducts, "product-div");
        fadeAnimation();
        addToCartEvent();
      })
      e.target.classList.add("active")
    }

  } catch (error) {
    console.log(error);
  }
};

/* Tabbed components event listener */
categoryBtn.addEventListener("click", getCategory)



//...... Reviews slider ........//
// Sliding feature
const sliding = () => {
  allReviews.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
  })
}
sliding();

// Next slide
const nextSlide = () => {
  if (currentSlide > allReviews.length - 2) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  sliding();
}

// Prev slide
const prevSlide = () => {
  if (currentSlide <= 0) {
    currentSlide = allReviews.length - 1;
  } else {
    currentSlide--;
  }
  sliding();
}

// Detecting which slider button was clicked
const navigate = e => {
  
  const nextArrClicked = e.target.classList.contains("md");
  const nextBtnClicked = e.target.closest("button").classList.contains("btn-right");
  const prevBtnClicked = e.target.closest("button").classList.contains("btn-left");
  
  
  if (nextArrClicked && nextBtnClicked || e.target.classList.contains("btn-right")) {
    nextSlide();
  }
  if (nextArrClicked && prevBtnClicked || e.target.classList.contains("btn-right")) {
    prevSlide();
  }
}

// slider buttons event listener
sliderNav.addEventListener("click", navigate);

// Automatic slider function
const autoSlider = () => {
  setInterval(() => {
    nextSlide();
  }, 5000);

}
autoSlider();


/* Getting collections section */
const warSection = async () => {
  try {
    const warProducts = document.querySelector(".war-products");
    const collections = await apiCaller(`${DATA_BASE_URL}categories`);
    const mensClothings = await apiCaller(`${DATA_BASE_URL}category/${collections.slice(-2).slice(0,1)}`);
    const womensClothings = await apiCaller(`${DATA_BASE_URL}category/${collections.slice(-2).slice(1)}`);
    const wars = mensClothings.slice(-3).flatMap(product => {
      return [product, womensClothings.shift()];
    });
    createProducts(wars, warProducts, "product-div");
  } catch (e) {
    throw new Error(e);
  }
  fadeAnimation();
  addToCartEvent();
  currencyFormater();
}
warSection();


// Map rendering function
function renderMap(lat, long) {
  const myMap = L.map('map', {
    dragging: false,
    attributionControl: false,
    closePopupOnClick: false,
  }).setView([lat, long], 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  L.marker([lat, long]).addTo(myMap)
    .bindPopup(`The physical location of <br> our store on the map`)
    .openPopup();
}
renderMap(52.508, 13.381);




//observe and animate the menu bar
const observeMenuFunc = (entries) => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add("color");
  }
  else {
    nav.classList.remove("color");
  }
}


const observeMenuOpt = {
  root: null,
  threshold: 0.8,
}


const menuObserver = new IntersectionObserver(observeMenuFunc, observeMenuOpt);
menuObserver.observe(banner);


function fadeAnimation() {
  const workImages = document.querySelectorAll(".product-div");
  const fadeOptions = { threshold: 0.3 };
  const fadeIn = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("shown");
        observer.unobserve(entry.target)
      }
      else {
        entry.target.classList.remove("shown")
      }
    })
  }

  const fader = new IntersectionObserver(fadeIn, fadeOptions);
  workImages.forEach(workImage => {
    fader.observe(workImage);
  })
}
fadeAnimation();



// Homepage cart section 
function updateCartSection(allTheProducts) {
//  console.log(allTheProducts)
 // ToDos 
 /* 
 1. count and update the number of items in the cart
 2. calculate the price of all the items in the cart
 3. update the see more section messages 
 */
 
 
 const options  = {
    limit: 4,
    productsLength: allTheProducts.length
  };
  
  const seeMoreEls = {
    seeMoreSection: document.querySelector(".seeMoreSection .seeMoreSectionText"),
    totalPriceEl: document.querySelector(".seeMoreSection .total_price_text"),
  }
  console.log(options.productsLength, options.limit);
  options.productsLength > options.limit ? seeMoreEls.seeMoreSection.innerHTML = `You are seeing <span class="all_products_length">${options.limit}/${options.productsLength} </span> items in your cart, <a href="pages/cart/index.html"> see all.</a>` : seeMoreEls.seeMoreSection.innerHTML = "";
  
  seeMoreEls.totalPriceEl.innerHTML = `The total price of all products is <span class="total_price_value"> ${CURRENCYFORMATER.format(allTheProducts.map(product => product.price).reduce((a,c) => a + c))}</span>` 
  
 
}

function removeSeeMore() {
  
  const totalPriceEl = document.querySelector(".seeMoreSection .total_price_text");
  
  totalPriceEl.closest(".seeMoreSection").style.display = "none";
  
}

const openCartSection = async function() {
 
  const allProducts = await myCart._productsFromDb();
  const isNotZero = allProducts.length !== 0;
  const cartPagePriceEles = document.querySelectorAll(".cartProductPrice");
  isNotZero ? updateCartSection(allProducts) : removeSeeMore();
  isNotZero ? myCart.nonEmptyCart(allProducts,4): myCart.emptyCart() ;
  cartPagePriceEles.forEach(ele =>{
    ele.innerHTML = CURRENCYFORMATER.format(ele.innerHTML.slice(1));
  });
  
  cartPage.classList.add("open");
}


// The close-cart method
const closeCartPage = () => {
  cartPage.classList.remove("open");
  setTimeout(() => {
    myCart.cartItems.innerHTML = "";
  }, 1000);
}

// Calling the add-to-cart method
cartCounterEl.addEventListener("click", openCartSection);

// Calling the close-cart method
closeCartEl.addEventListener("click", closeCartPage);



// Function counting items in the cart
export const countCartItems = async () => {
  const cartCounterEl = document.querySelector(".cart-counter");
  const numberOfItems = await myCart.numberOfItemsInCart();
  cartCounterEl.innerHTML = numberOfItems.length;
}
countCartItems();





// Function formatting the currencies
const currencyFormater = function(param) {
  const priceElements = document.querySelectorAll(".price");
  priceElements.forEach(priceEle => {
    priceEle.textContent = CURRENCYFORMATER.format(priceEle.textContent.slice(1));
  })
}
currencyFormater();



//Imported add to cart method
addToCartEvent();


export {openCartSection};

/*
if ("pushManager" in window) {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Hi")
    }
  })
}*/