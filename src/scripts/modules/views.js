
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
        <div class="${elementClass}">
        <div class="fave">
        <ion-icon class="heart" name="heart"></ion-icon>
        </div>
        <div class="product-info">
          <img src="${product.image}" alt="" class="product-img">
          <p class="category">${product.category}</p>
          <h3 class="product-title">${product.title}</h3>
          <h2 class="price">$${product.price.toFixed(2)}</h2>
        </div>
        <div class="cart">
       <!-- <ion-icon name="add-circle" class="heart addToCart"></ion-icon>-->
        <button class="addToCart"> add to cart </dutton>
        </div>
        </div>`;
  return productsDiv;
}

export const cartCounter = cart => cart.length;