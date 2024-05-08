"use strict";
const taxRate = 0.2;
const shippingRate = 5.0;
let totalPrice;
let productsInCart;
const countDownTimer = document.querySelector(".countdown-timer");
const warProducts = document.querySelector(".war-products");
const cartCounterSection = document.querySelector(".cart-icon-section");
const cartCounterEl = document.querySelector(".cart-counter");
//const cartPage = document.querySelector(".cart-page");

//const closeCartPage = document.querySelector(".close-cart-page");
const cartItems = document.querySelector(".items")
const pricesTotalSection = document.querySelector(".cart-total-section");


/* The cart page functions */

 class CartManagement {
  constructor() {
    //this.emptyCartContent :;
  }

  // count items in cart and display it
  cartItemsCounter = async () => {
    const allProducts = await database.getFromDb();
    cartCounterEl.textContent = allProducts.length;
  }


  // Function adding products to cart
  addToCartFunc = async e => {

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

    // check if item already exists before sending to cart
    const checkIfItemExistsInCart = item => database.checkDb(item.id);

    const productToAdd = e.target.parentNode.previousElementSibling;

    const itemInfos = getProductDetails(productToAdd);

    const isItemInCart = await checkIfItemExistsInCart(itemInfos);

    if (!isItemInCart) {
      database.sendToDb(itemInfos);
      this.cartItemsCounter();
      e.target.textContent = "Added to cart";
    }
  }

  // open cart page when the button is clicked

  emptyCart = () => {
    cartItems.innerHTML = emptyCartContent();
  }

  // Update the cart page when it's opened
  updateCartPage = itemsInCart => {

    itemsInCart.length === 0 ? this.emptyCart() : (() => {

      cartItems.innerHTML = "";
      itemsInCart.forEach(item => {
        const cartContent = generateCartItem(item);
        cartItems.insertAdjacentHTML("beforeend", cartContent);
      })

    })();
    
    
    const calculations = products => {

      // function selecting price elements
      const selector = sectionClass => pricesTotalSection.querySelector(sectionClass);
      


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
        
        const cartTotalPrice = selector(".cart-total").innerHTML = getProductsNumber(products) !== 0 ? `$${calculateItemsPrice(products)}` : `$0.00`;

        const taxPrice = selector(".cart-tax").innerHTML = getProductsNumber(products) !== 0 ? `$${calculateItemsTax(cartTotalPrice.slice(1))}` : `$0.00`;

        const deliveryPrice = selector(".cart-delivery").innerHTML = getProductsNumber(products) !== 0 ? `$${calculateDelivery(cartTotalPrice.slice(1))}` : `$0.00`;

        const totalCharges = selector(".cart-sub-total").innerHTML = getProductsNumber(products) !== 0 ? `$${calculateSubTotal([+cartTotalPrice.slice(1), +taxPrice.slice(1), +deliveryPrice.slice(1)])}` : "$0.00";
      }
    calculateTotalProductPrices(products);
    }
    calculations(itemsInCart);
  }
  
removeFromCartFunc = e =>{
const itemToRemove = e.target.closest(".item-row").querySelector(".item-id").textContent;

console.log(itemToRemove);


}

  openCartPage = async () => {
    const productsFromDb = await database.getFromDb();
    // console.log(productsFromDb);
    this.updateCartPage(productsFromDb);
    cartPage.classList.add("open");
    removingFromCartSystem();
  }

  closeCartPageFunc = () => {
    cartPage.classList.remove("open");
    setTimeout(() => {
      cartItems.innerHTML = "";
    }, 1000);
  }

}


const myCart = new CartManagement();

/* _____________________$$$$__________________ */


//count products in cart and update the cart icon on page load.
myCart.cartItemsCounter();



// opening the cart page 
cartCounterSection.addEventListener("click", myCart.openCartPage);

// closing the cart page 
closeCartPage.addEventListener("click", myCart.closeCartPageFunc);


// Attaching add to cart function to all products
const addingToCartSystem = () => {
  const addToCartBtns =
    document.querySelectorAll(".addToCart").forEach(btn => {
      btn.addEventListener("click", myCart.addToCartFunc);
    })
}
addingToCartSystem();


const removingFromCartSystem = () => {
  const deleteCartItemBtns = document.querySelectorAll(".delete-cart-item").forEach(btn => {
    btn.addEventListener("click", myCart.removeFromCartFunc);
  })
}
removingFromCartSystem();

export {myCart, addingToCartSystem, removingFromCartSystem}

/*
// Removing elements in cart
const deleteItem = e => {
  const itemToRemove = e.target.parentNode.parentNode.parentNode;
  database.removeFromDb(itemToRemove);
  const productsInCart = [...cart];
  updateCartPage(productsInCart);
  cartItemsCounter(productsInCart);
}*/