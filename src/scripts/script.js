"use strict";


import { apiCaller } from './modules/model.js';
import { updateTimer, elementCreator, generateCartItem, emptyCartContent } from "./modules/views.js";
import {cart, sendToCart } from './utilities/cart.js';
import { DATA_BASE_URL, TARGETDATE } from './utilities/config.js';
import { database } from '/src/scripts/utilities/database.js';

//database();
const nav = document.querySelector("nav");
const banner = document.querySelector(".banner")
const products = document.querySelector("#products");
const categoryProducts = document.querySelector(".category-products");
const categoryBtn = document.querySelector(".category-tab");
const allReviews = document.querySelectorAll(".review");
const sliderNav = document.querySelector(".slider-navigation");
const taxRate = 0.2;
const shippingRate = 5.0;
let currentSlide = 0;
let slideInterval;
let addToCartBtns;
let totalPrice;
const countDownTimer = document.querySelector(".countdown-timer");
const warProducts = document.querySelector(".war-products");
const cartCounterSection = document.querySelector(".cart-icon-section");
const cartCounterEl = document.querySelector(".cart-counter");
const cartPage = document.querySelector(".cart-page");
const closeCartPage = document.querySelector(".close-cart-page");
const cartItems = document.querySelector(".items")
const pricesTotalSection = document.querySelector(".cart-total-section");


/* Time interval function */
setInterval(() => {

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


/* creating product elements*/
const createProducts = async (products, section, divClass) => {
  for (let product of products) {
    let productDiv = elementCreator(product, divClass);
    section.insertAdjacentHTML("beforeend", productDiv);
  }
}


/* IIFE for some generic products */
(async () => {
  try {
    let genericProducts = await apiCaller(`${DATA_BASE_URL}?limit=6`);
    createProducts(genericProducts, products, "product-div");
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
        cartSystem();
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
  cartSystem();
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

/* The cart page functions */

//count products in cart and update the cart icon
const cartItemsCounter = () => {
  cartCounterEl.textContent = cart.length;
}
cartItemsCounter();

// function getting product details
const getProductDetails = theProduct => {
  return {
    id: +theProduct.querySelector(".item-id").textContent,
    imgUrl: theProduct.querySelector("img").src,
    category: theProduct.querySelector(".category").textContent,
    title: theProduct.querySelector(".product-title").textContent,
    price: +theProduct.querySelector(".price").textContent.replace("$", "")
  }
}

// function facilitating the add to cart feature
const addToCartFunc = e => {
  const productToAdd = e.target.parentNode.previousElementSibling;

  const itemInfos = getProductDetails(productToAdd);

  // checking if item is in cart already
  const isItemInCart = cart.find((item) => item?.title === itemInfos?.title);

  if (!isItemInCart) {
    database.sendToDb(itemInfos);
    sendToCart(itemInfos);
    cartItemsCounter();
    e.target.textContent = "Added to cart";
  }

}


// Update the cart page when it's opened
const updateCartPage = itemsInCart => {

  if (itemsInCart.length !== 0) {

    cartItems.innerHTML = "";

    itemsInCart.forEach(item => {
      const cartContent = generateCartItem(item);
      cartItems.insertAdjacentHTML("beforeend", cartContent);

    })

  }
  if (itemsInCart.length === 0) {
    emptyCart();
  }

  calculateTotalProductPrices(itemsInCart);
}


// check if cart is empty and display a message
const emptyCart = () => {
  cartItems.innerHTML = emptyCartContent();
}

// open cart page when the button is clicked
const openCartPage = async () => {
  const productsFromCart = [...cart];
  const productsFromDb = await database.getFromDb();
  
 //cart = cart.length === 0 ? productsFromDb : productsFromCart;
 cartItemsCounter();
  
  const productsInCart = /*productsFromCart ||*/ productsFromDb;

  
  updateCartPage(productsInCart);
  cartPage.classList.add("open");
}

// Attaching event listener on cart image
cartCounterSection.addEventListener("click", openCartPage);

// close cart page when the button is clicked
const closeCartPageFunc = () => {
  cartPage.classList.remove("open");
  setTimeout(() => {
    cartItems.innerHTML = "";
  }, 1000);
}

closeCartPage.addEventListener("click", closeCartPageFunc);

// Attaching add to cart function to all products
const cartSystem = () => {
  addToCartBtns =
    document.querySelectorAll(".addToCart");
  addToCartBtns.forEach(btn => {
    btn.addEventListener("click", addToCartFunc);
  })
}
cartSystem();


/* calculating items in cart */

// calculating the price
const calculateItemsPrice = productsInCart => {
  const prices = productsInCart.map(item => item.price);
  if (prices.length !== 0) {
    totalPrice = prices.reduce((a, c) => a + c).toFixed(2);
  }
  return totalPrice;
}

// calculating the tax
const calculateItemsTax = theTotalPrice => ((theTotalPrice * taxRate) / 100).toFixed(2);

// calculating the delivery price
const calculateDelivery = theTotalPrice => ((theTotalPrice * shippingRate) / 100).toFixed(2);


// calculating the total prices
const calculateSubTotal = allCharges => {
  return allCharges.reduce((a, c) => a + c).toFixed(2);
}

// function selecting price elements
const selector = sectionClass => pricesTotalSection.querySelector(sectionClass);


// function calculating and updating prices
const calculateTotalProductPrices = cartProducts => {

  const totalPrice = selector(".cart-total").innerHTML = cartProducts.length !== 0 ? `$${calculateItemsPrice(cartProducts)}` : `$0.00`;

  const taxPrice = selector(".cart-tax").innerHTML = cartProducts.length !== 0 ? `$${calculateItemsTax(totalPrice.slice(1))}` : `$0.00`;

  const deliveryPrice = selector(".cart-delivery").innerHTML = cartProducts.length !== 0 ? `$${calculateDelivery(totalPrice.slice(1))}` : `$0.00`;

  const totalCharges = selector(".cart-sub-total").innerHTML = cartProducts.length !== 0 ? `$${calculateSubTotal([+totalPrice.slice(1), +taxPrice.slice(1), +deliveryPrice.slice(1)])}` : "$0.00";

  deleteCartItemsFunc();
}


// Removing elements in cart
const deleteItem = e => {
  const itemToRemove = e.target.parentNode.parentNode.parentNode;
  const itemId = itemToRemove.querySelector(".item-id").textContent;
  const itemIndex = cart.findIndex(item => item.id === itemId);

  cart.splice(itemIndex, 1);

  itemToRemove.remove();

  const productsInCart = [...cart];
  updateCartPage(productsInCart);
  cartItemsCounter(productsInCart);
}


// function deleting elements in cart
const deleteCartItemsFunc = () => {
  const deleteCartItemBtns = document.querySelectorAll(".delete-cart-item");
  deleteCartItemBtns.forEach(btn => {
    btn.addEventListener("click", deleteItem)
  });
}