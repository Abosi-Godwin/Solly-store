"use strict";
import { database } from '/src/scripts/utilities/database.js';
import { generateCartItem, emptyCartContent } from "../modules/views.js";
import { getProductDetails } from '/src/scripts/modules/model.js';
import { countCartItems, updateCartSection, allReadyInCart } from '../script.js';
//import {  } from '../script.js';

/* The cart page functions */
class CartManagement {
  constructor() {
    this._taxRate = 0.2;
    this._shippingRate = 5.0;
    this._productsFromDb = () => database.getFromDb();
    this.cartItems = document.querySelector(".items");
    this.emptyCart = function() {
      this.cartItems.innerHTML = emptyCartContent();
    };
    this.nonEmptyCart = async function(products, limit = products.length) {
      const firstFourItems = products.slice(0, limit);
      myCart.updateCartPage(firstFourItems);
      deleteFromCartEvent();
      updateCartSection(await this._productsFromDb())
    }
  }

  // count and return items in cart
  async numberOfItemsInCart() {
    return await this._productsFromDb();
  }


  // Function adding products to cart
  async addToCart(e) {

    const productToAdd = e.target.parentNode.previousElementSibling;

    const itemInfos = getProductDetails(productToAdd);


    // check if item already exists before sending to cart
    const checkIfItemExistsInCart = item => database.checkDb(item.id);

    const isItemInCart = await checkIfItemExistsInCart(itemInfos);

    if (!isItemInCart) {
      database.sendToDb(itemInfos);


      e.target.textContent = "Added to cart";
    }
    allReadyInCart(myCart._productsFromDb());
    countCartItems();
  };


  // Update the cart page when it's opened
  async updateCartPage(itemsInCart) {

    itemsInCart.length === 0 ? this.emptyCart() : (() => {

      this.cartItems.innerHTML = "";
      itemsInCart.forEach(item => {
        const cartContent = generateCartItem(item);
        this.cartItems.insertAdjacentHTML("beforeend", cartContent);
      })

    })();
    deleteFromCartEvent();

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
    // updateCartSection(itemsInCart);
  };

  async removeFromCart(itemId) {
    database.removeFromDb(itemId);
    const productsInCart = await this._productsFromDb();
      this.updateCartPage(productsInCart.slice(0,4));
      countCartItems();
    updateCartSection(productsInCart);
  }

}


const myCart = new CartManagement();

/* ___________________$$$$__________________ */

const addToCartEvent = () => {
  const addToCartBtns =
    document.querySelectorAll(".addToCart").forEach(btn => {
      btn.addEventListener("click", myCart.addToCart);
    });
}


const deleteFromCartEvent = () => {
  const deleteCartItemBtns = document.querySelectorAll(".delete-cart-item").forEach(btn => {
    btn.addEventListener("click", e => {
      const itemToRemove = e.target.parentNode.parentNode.parentNode.querySelector(".item-id").innerHTML;
      //console.log(itemToRemove);
      myCart.removeFromCart(itemToRemove)
    })
  })
}

const updateCartQuantity = () => {
  const incrQtyBtns = document.querySelectorAll(".incrQtyBtn");
  incrQtyBtns.forEach(btn =>(
    btn.addEventListener("click", e =>{
      console.log(e.target.textContent);
      alert("Hello");
    })
    ))
}
updateCartQuantity();


/*
.forEach(btn => {
    btn.addEventListener("click", e => {
      console.log(e)
    })})

const updateCartQuantity = (quantityEles) => {
  
  quantityEles.forEach(el => {
    console.log(el)
  });
  
  console.log(quantityEles);
}
*/
export { myCart, deleteFromCartEvent, addToCartEvent, updateCartQuantity };