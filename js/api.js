'use strict';

//Funktio Nutrition info -painikkeelle
function openPopup(id, name) {
  return function () {
    document.querySelector(".popuptext").style.display = "block";
    GetNutritions(id, name);
  }
}
//Funktio cancel painikkeelle, joka tulee nutrition info ruutuun
function closePopup() {
  document.querySelector(".popuptext").style.display = "none";
}
//Cancel painikkeen toiminta
document.querySelector(".cancel").addEventListener("click", closePopup);

//Tehdään jokaiselle täytevaihtoehdon Nutrition info-painikkeelle oma määritelmä, jotta saadaan halutut tiedot näkyviin juuri kyseisestä täytteestä
document.querySelector("#bluecheese").addEventListener("click", openPopup(1004, "BLUE CHEESE")); //Bluecheese, täytteen id=1004
document.querySelector("#chicken").addEventListener("click", openPopup(1015006, "CHICKEN")); //Chicken, täytteen id=1015006
document.querySelector("#ham").addEventListener("click", openPopup(10151, "HAM")); //Ham, täytteen id = 10151
document.querySelector("#meat").addEventListener("click", openPopup(10023618, "MEAT(BEEF)")); //Meat, täytteen id = 10023618
document.querySelector("#mushroom").addEventListener("click", openPopup(11260, "MUSHROOM")); //Mushroom, täytteen id = 11260
document.querySelector("#pineapple").addEventListener("click", openPopup(9266, "PINEAPPLE")); //Pineapple, täytteen id = 9266
document.querySelector("#salami").addEventListener("click", openPopup(7071, "SALAMI")); //Salami, täytteen id = 7071
document.querySelector("#shrimp").addEventListener("click", openPopup(15152, "SHRIMP")); //Shrimp, täytteen id = 15152
document.querySelector("#tomato").addEventListener("click", openPopup(11529, "TOMATO")); //Tomato, täytteen id = 11529
document.querySelector("#tuna").addEventListener("click", openPopup(10015121, "TUNA")); //Tuna, täytteen id  = 10015121

//Määritetään paikka, jonne API:sta haettavat tiedot halutaan laittaa queryselectorilla
const nutritions = document.querySelector(".nutritions");

//Määritetään funktio, jolla kutsutaan API:a ja haetaan ravintotietoja API:sta ja tulostetaan ne listaksi haluttuun paikkaan
function GetNutritions(id, name) {
  nutritions.innerHTML = `<h3>` + name + `</h3>
                         Nutrition information (/100g):`; //Alkuteksti halutulle tulosteelle haluttuun paikkaan

  fetch("https://api.spoonacular.com/food/ingredients/" + id + "/information?amount=100&unit=gram&apiKey=") //apiKey removed, need your own apiKey
    .then(function (answer) {
      return answer.json();
    })
    .then(function (json) {
      console.log(json);
      let result = "";
      let calories = 0;
      let fiber = 0;
      let fat = 0;
      let carbs = 0;
      let protein = 0;
      let sodium = 0;
      let sugar = 0;
      let sfat = 0;
      //Koska API:n antamat tiedot eivät testien perusteella olleet aina samassa järjestyksessä,
      //niin käydään tulokset läpi nimen perusteella jotta saadaan halutut tiedot
      for (let i = 0; i < json.nutrition.nutrients.length; i++) {
        let name = json.nutrition.nutrients[i].name
        if (name === "Calories") {
          calories = json.nutrition.nutrients[i].amount;
        }
        else if (name === "Carbohydrates") {
          carbs = json.nutrition.nutrients[i].amount;
        }
        else if (name === "Fat") {
          fat = json.nutrition.nutrients[i].amount;
        }
        else if (name === "Fiber") {
          fiber = json.nutrition.nutrients[i].amount;
        }
        else if (name === "Protein") {
          protein = json.nutrition.nutrients[i].amount;
        }
        else if (name === "Sodium") {
          sodium = json.nutrition.nutrients[i].amount;
        }
        else if (name === "Sugar") {
          sugar = json.nutrition.nutrients[i].amount;
        }
        else if (name === "Saturated Fat") {
          sfat = json.nutrition.nutrients[i].amount;
        }
      }
      //Syötetään saadut tiedot aiemmin valittuun paikkaan halutussa muodossa innerHTML toiminnon avulla
      result = `<li>Calories: ` + calories + ` kcal</li>
                  <li>Carbohydrates: ` + carbs + ` g</li>              
                  <li>Fat: ` + fat + ` g</li>
                  <li>Fiber: ` + fiber + ` g</li>
                  <li>Protein: ` + protein + ` g</li>
                  <li>Saturated fat: ` + sfat + ` g</li>
                  <li>Sodium: ` + sodium + ` mg</li>
                  <li>Sugar: ` + sugar + ` g</li>`;
      nutritions.innerHTML += result;
    })
}



//Määritetään funktio loppusumman vaihtamisesta bitcoineihin ja takaisin euroiksi
function Bitcoin() {
  let bitcoins = 0;
  let euros = document.querySelector(".cart-total-price"); //Valitaan haluttu kohta koodista querySelectorilla
  fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
    .then(function (answer) {
      return answer.json();
    })
    .then(function (json) {
      if (euros.innerText.includes("€")) {
        let euro = parseFloat(euros.innerText.replace("€", "")); //Poistetaan valuuttamerkki laskutoimitusta varten
        bitcoins = euro / json.bpi.EUR.rate_float; //Laskutoimitus
        document.querySelectorAll(".cart-total-price")[0].innerText = bitcoins + " ₿"; //Syötetään saatu tulos haluttuun kohtaan ja lisätään valuuttamerkki
      }
      else {
        let euro = parseFloat(euros.innerText.replace("₿", "")); //Poistetaan valuuttamerkki laskutoimitusta varten
        bitcoins = euro * json.bpi.EUR.rate_float; //Laskutoimitus
        let result = Math.round(bitcoins * 100) / 100 //Pyöristetään lukemaa
        document.querySelectorAll(".cart-total-price")[0].innerText = result + " €"; //Syötetään saatu tulos haluttuun kohtaan ja lisätäävn valuutta
      }
    })
}
//Määritetään Euros/Bitcoins -painikkeen toiminta
document.querySelector(".exchange").addEventListener("click", Bitcoin);
