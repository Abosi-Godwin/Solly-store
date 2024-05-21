/* countdown timer function*/

const updateTimerElement = (time, unit) => {
  return `<h1><span class="${unit.toLowerCase()}">${time}</span><br> ${time <= 1 ? unit.slice(0,-1) : unit}</h1>`;
}

export const updateTimer = (theDate, theHour, theMinutes, theSeconds) => {

  const dayHtml = updateTimerElement(theDate, "Days");
  const hourHtml = updateTimerElement(theHour, "Hours");
  const minsHtml = updateTimerElement(theMinutes, "Minutes");
  const secsHtml = updateTimerElement(theSeconds, "Seconds");


  return `${dayHtml} ${hourHtml} ${minsHtml} ${secsHtml}`

}


/* Function creating product elements */
export const elementCreator = (product, elementClass) => {
  const productsDiv = `
        <div class="${elementClass} pdt">
        <div class="fave">
        <ion-icon class="heart" name="heart"></ion-icon>
        </div>
        <div class="product-info">
          <img src="${product.image}" alt="" class="product-img">
          <p class="category">${product.category}</p>
          <span class="item-id">${product.id}</span>
          <h3 class="product-title">${product.title}</h3>
          <h2 class="price">$${product.price.toFixed(2)}</h2>
        </div>
        
        <div class="cart">
        
        <button class="addToCart"> add to cart </dutton>
        
        </div>
        </div>`;
  return productsDiv;
}

//export const cartCounter = cart => cart.length;

export const generateCartItem = item => {

  return ` <div class="item-row">
            <div class="cart-quantity">
              <input type="button" value="+" />
              <input type="number" name="quantity" value="1" id="quantity-number" />
              <input type="button" value="-" />
            </div>
            
            <div class="item-details">
              <div class="cart-product-image">
                <img src="${item.imgUrl}" alt="">
              </div>
              <div>
          <span class="item-id">${item.id}</span>
                <h4 class="item-title">${item.title.slice(0,35).concat("....")}</h4>
                <p>${item.category.toUpperCase()}</p>
                <p><b class="cartProductPrice">$${item.price.toFixed(2)}</b></p>
              </div>
            </div>
            <div class="row-action">
              <button class="delete-cart-item">
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </div>
          </div>
        `
}


export const seeMoreMessageFunc = {
  seeMoreMessage(options){
    return `You are seeing <span class="all_products_length">${options.limit}/${options.productsLength} </span> items in your cart, <a href="pages/cart/index.html"> see all.</a>`
  },
  
  seeMoreMessagePrices(CURRENCYFORMATER, allTheProducts){
    return  `The total price of all products is <span class="total_price_value"> ${CURRENCYFORMATER.format(allTheProducts.map(product => product?.price).reduce((a,c) => a + c))}</span>`
  }
};

export const emptyCartContent = () =>{
  return  `<div class="cart-notification"><h2>Your cart is currently empty, <br/> start adding things now!</h2></div>`;
}