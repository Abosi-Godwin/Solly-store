"use strict";
import { database } from '/src/scripts/utilities/database.js';
import {generateCartItem, emptyCartContent} from "../modules/views.js";
import {countCartItems} from '../script.js';

//const taxRate = 0.2;
//const shippingRate = 5.0;
let totalPrice;
let productsInCart;

//const cartCounterSection = document.querySelector(".cart-icon-section");


//const cartCounterEl = document.querySelector(".cart-counter");

/*
const cartItems = document.querySelector(".items")
const pricesTotalSection = document.querySelector(".cart-total-section");
console.log(pricesTotalSection)
*/


/* The cart page functions */

 class CartManagement {
  constructor() {
    this._taxRate = 0.2;
    this._shippingRate = 5.0;
    this._productsFromDb = () => database.getFromDb();
    this.cartItems = document.querySelector(".items");
    
  }

  // count and return items in cart
   numberOfItemsInCart (){
    return this._productsFromDb();
  }


  // Function adding products to cart
async addToCart(e){

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

    const productToAdd = e.target.parentNode.previousElementSibling;

    const itemInfos = getProductDetails(productToAdd);


    // check if item already exists before sending to cart
    const checkIfItemExistsInCart = item => database.checkDb(item.id);
    
    const isItemInCart = await checkIfItemExistsInCart(itemInfos);
    if (!isItemInCart) {
      database.sendToDb(itemInfos);

    
      e.target.textContent = "Added to cart";
    }
    countCartItems();
  };



  // open cart page when the button is clicked



  // Update the cart page when it's opened
  updateCartPage(itemsInCart) {
   
const emptyCart = function(){
    this.cartItems.innerHTML = emptyCartContent();
  }
  
    itemsInCart.length === 0 ? emptyCart() : (() => {

      this.cartItems.innerHTML = "";
      itemsInCart.forEach(item => {
        const cartContent = generateCartItem(item);
        this.cartItems.insertAdjacentHTML("beforeend", cartContent);
      })

    })();
    
    
    
    /*
    const calculations = products => {


      // function calculating and updating prices
      const calculateTotalProductPrices = cartProducts => {
 
      // calculating the price
      const calculateItemsPrice = productsInCart => productsInCart.map(item => item.price).reduce((a, c) => a + c).toFixed(2);


      // calculating the tax
      const calculateItemsTax = theTotalPrice => ((theTotalPrice * taxRate) / 100).toFixed(2);

      // calculating the delivery price
      const calculateDelivery = theTotalPrice => ((theTotalPrice * shippingRate) / 100).toFixed(2);


      // calculating the total prices
      const calculateSubTotal = allCharges => allCharges.reduce((a, c) => a + c).toFixed(2);

        const getProductsNumber =  productsLength => productsLength.length;
        
      // function selecting price elements
      const selector = sectionClass => pricesTotalSection.querySelector(sectionClass);
      
        const cartTotalPrice = selector(".cart-total").innerHTML = getProductsNumber(products) !== 0 ? `$${calculateItemsPrice(products)}` : `$0.00`;

        const taxPrice = selector(".cart-tax").innerHTML = getProductsNumber(products) !== 0 ? `$${calculateItemsTax(cartTotalPrice.slice(1))}` : `$0.00`;

        const deliveryPrice = selector(".cart-delivery").innerHTML = getProductsNumber(products) !== 0 ? `$${calculateDelivery(cartTotalPrice.slice(1))}` : `$0.00`;

        const totalCharges = selector(".cart-sub-total").innerHTML = getProductsNumber(products) !== 0 ? `$${calculateSubTotal([+cartTotalPrice.slice(1), +taxPrice.slice(1), +deliveryPrice.slice(1)])}` : "$0.00";
      }
    calculateTotalProductPrices(products);
    }
    */
    //calculations(itemsInCart);
  };
  
 removeFromCart(e){
   const itemToRemove = e.target.parentNode.parentNode.parentNode.querySelector(".item-id").innerHTML;
   console.log(itemToRemove);
  database.removeFromDb(itemToRemove);
  
  /*const productsInCart = [...cart];
  updateCartPage(productsInCart);
  cartItemsCounter(productsInCart);*/
 }
  
//}
/*
  openCartPage(){
   // const productsFromDb = await database.getFromDb();
    // console.log(productsFromDb);
    this.updateCartPage(this._productsFromDb);
    cartPage.classList.add("open");
    this._addRemovingFromCartEvent();
    //removingFromCartSystem();
  }
  

  
*/
}


const myCart = new CartManagement();

/* ___________________$$$$__________________ */

const addToCartEvent = () => {
  const addToCartBtns =
    document.querySelectorAll(".addToCart").forEach(btn => {
      btn.addEventListener("click", myCart.addToCart);
    });
    
    //myCart.numberOfItemsInCart();
  
}

const deleteFromCartEvent = () => {
  const deleteCartItemBtns = document.querySelectorAll(".delete-cart-item").forEach(btn => {
    btn.addEventListener("click", myCart.removeFromCart);
  })
}

//count products in cart and update the cart icon on page load.
//myCart.cartItemsCounter();



// opening the cart page 
//cartCounterSection.addEventListener("click", myCart.openCartPage);

// closing the cart page 
//console.log(closeCartPage);
//closeCartPage.addEventListener("click", myCart.closeCartPageFunc);


// Attaching add to cart function to all products
/*
const addingToCartSystem = () => {
}
addingToCartSystem();
*/
/*

removingFromCartSystem();
*/
export { myCart, deleteFromCartEvent, addToCartEvent}

/*
// Removing elements in cart
const deleteItem = e => {
  const itemToRemove = e.target.parentNode.parentNode.parentNode;
  database.removeFromDb(itemToRemove);
  const productsInCart = [...cart];
  updateCartPage(productsInCart);
  cartItemsCounter(productsInCart);
}*/