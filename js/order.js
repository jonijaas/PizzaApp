'use strict';

//Määritetään funktio Order -painikkeelle
function OrderClicked() {
  alert("Thank you, now you'll redirected to the delivery page.");
  window.location.replace("delivery.html"); //Ohjataan käyttäjä tilauksen jälkeen Delivery-sivulle
}

//Määritetään Order-painikkeen toiminta
document.querySelector(".order").addEventListener("click", OrderClicked);


//Määritetään funktio Choose -painiketta varten, eli kun Choose painiketta painetaan niin otetaan kyseisen täytteen nimi ja hintatieto talteen
//ja syötetään ne ostoskoriin lisäämiseen tarkoitettuun funktioon. Lopuksi myös päivitetään ostoskori.
function ChooseClicked(event) {
  let button = event.target;
  let filling = button.parentElement;
  let title = filling.querySelectorAll(".item-title")[0].innerText;
  let price = filling.querySelectorAll(".item-price")[0].innerText;
  addToCart(title, price);
  CartTotal();
}

//Määritetään Choose -painikkeiden toiminta
let ChooseButton = document.querySelectorAll(".choose-item");
for (let i = 0; i < ChooseButton.length; i++) {
  let button = ChooseButton[i];
  button.addEventListener("click", ChooseClicked);
}

//Määritetään funktio täytteiden lisäämiseen ostoskoriin
function addToCart(title, price) {
  let newrow = document.createElement("div"); //Luodaan uusi elementti ostoskoriin, kun tuote lisätään
  newrow.classList.add("cart-row"); //Määritetään lisätylle elementille luokka
  let cartItems = document.querySelectorAll(".cart-items")[0];
  let cartTitles = document.querySelectorAll(".cart-item-title");
  for (let i = 0; i < cartTitles.length; i++) {
  }
  let content = `<div class ="cart-item cart-column">
                    <p class="cart-item-title">` + title + `</p>
                 </div>
                 <p class="cart-price cart-column">` + price + `</p>
                 <button class="button remove-item" type="button">Remove</button>`
  newrow.innerHTML += content;
  cartItems.append(newrow); //Lisätään uusi koodinpätkä aiemmin valitun elementtiin
  newrow.querySelectorAll(".remove-item")[0].addEventListener("click", removeCart); //Määritetään remove-painikkeen toiminta
}

//Määritetään funktio remove painikkeelle, jolla voidaan poistaa valinta ostoskorista
function removeCart(event) {
  let button = event.target;
  button.parentElement.remove();
  CartTotal();
}

//Määritetään funktio, jolla lasketaan ostoskorin kokonaissaldoa
function CartTotal() {
  let cartItems = document.querySelectorAll(".cart-items")[0];
  let cartRows = cartItems.querySelectorAll(".cart-row");
  let total = 0;
  for (let i = 0; i < cartRows.length; i++) {
    let cartRow = cartRows[i];
    let cartPrice = cartRow.querySelectorAll(".cart-price")[0];
    let price = parseFloat(cartPrice.innerText.replace("€", ""));
    total = total + price;
  }
  document.querySelectorAll(".cart-total-price")[0].innerText = total + " €";
}
