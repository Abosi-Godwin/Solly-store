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
 const db = getDatabase(app);
 const productsInDb = ref(db, "products");

 // Initialize Firebase
 const init = {
   sendToDb(theProduct) {
     push(productsInDb, theProduct)
   },

   removeFromDb() {
     let exactLocation = ref(database, `products/${currentItemId}`);
     remove(exactLocation);

   },
   async getFromDb() {
  const allProductsArr = [];
  try {
    const snapshot = await get(child(ref(db), "products"));
    
    snapshot.forEach(childSnapShot => {
      console.log(childSnapShot)
      allProductsArr.push(childSnapShot.val());
    });
    
    return allProductsArr;
  } catch (error) {
    throw error;
  }
}
 }
 export { init as database };