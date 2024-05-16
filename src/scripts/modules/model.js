/* Generic function for API call*/
const apiCaller = async url => {
  try {
    const fetchedData = await fetch(url);

    const response = await fetchedData.json();

    return response;

  } catch (error) {
    console.log(`Error making api call ${error}`);
  }
}


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


export { apiCaller, getProductDetails };