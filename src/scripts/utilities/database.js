 "use strict";

 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";

 import { getDatabase, ref, query, equalTo, set, get, child, push, onValue, remove, onChildAdded } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyAzFhyF1bLfRqHug3Jtl9KM5CDmxX719vs",
   authDomain: "solly-store-2.firebaseapp.com",
   databaseURL: "https://solly-store-2-default-rtdb.firebaseio.com",
   projectId: "solly-store-2",
   storageBucket: "solly-store-2.appspot.com",
   messagingSenderId: "136352921295",
   appId: "1:136352921295:web:67770261fa6cc2c7c0e9ba"
 };

 const app = initializeApp(firebaseConfig);
 const db = getDatabase();
 const productsInDb = ref(db, "products");


 const checkTheId = (theId, allProducts) => {

   return allProducts.some(product => product.id === theId);
 }


 // Initialize Firebase

 const init = {

   sendToDb(theProduct) {
     set(ref(db, `Products/${theProduct.id}`), {
       id: theProduct.id,
       category: theProduct.category,
       price: theProduct.price,
       title: theProduct.title,
       imgUrl: theProduct.imgUrl
     })/*.then(() => {
       console.log("Successfully added.")
     }).catch(e => {
       console.log("Can`t add to cart.")
     })*/
   },
   
   

   removeFromDb(itemId) {
   remove(ref(db,`Products/${itemId}`))/*.then(() =>{
     console.log("Successfully remove from Db.")
   }).catch(err => {
     console.log("Product is not removed.")
   })*/
   },



   async getFromDb() {
     const dbRef = ref(db);

     try {
       const fetchedProducts = [];
       const snapShot = await get(child(dbRef, "Products"))

       snapShot.forEach(childSnapShot => {
         fetchedProducts.push(childSnapShot.val());
       });

       return fetchedProducts;
     } catch (error) {
       throw error;
     }

     return fetchedProducts;
   },


   async checkDb(productId) {
     
     const existingProducts = await this.getFromDb();
     
     return checkTheId(productId, existingProducts);
   }
 }
 export { init as database };