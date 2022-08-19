'use strict';

const results = document.querySelector("#results"); //Valitaan haluttu kohta koodista, johon tiedot tulostetaan

//* Käytetään leaflet.js -kirjastoa näyttämään sijainti kartalla (https://leafletjs.com/)
const map = L.map('map').setView([60.213521, 24.810750], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

//Määritetään merkki lähtöpisteeseen eli omaan sijaintiimme, joka on keksitty sijainti Leppävaarassa
const homemarker = L.marker([60.213521, 24.810750]).addTo(map);
const homecoordinates = ({ latitude: 60.213521, longitude: 24.810750 });
homemarker.bindPopup("Our location");


// Käyttäjän paikannusta varten funktio
function success(pos) {
  const coordinates = pos.coords;
  let locationcoordinates = ({ latitude: coordinates.latitude, longitude: coordinates.longitude });
  L.marker([coordinates.latitude, coordinates.longitude]).addTo(map).bindPopup("Your location").openPopup(); //Merkitään paikannettu sijainti kartalle markeriksi ja sille popup teksti
  searchRoute(homecoordinates, locationcoordinates); //Ajetaan reititysfunktio tähän saatuun sijaintiin

}
// Funktio jos paikannuksessa tapahtuu virhe
function error(err) {
  console.warn("Error " + err.code + ":" + err.message); //Konsoliin tuleva errorikoodi, jos paikannuksessa tapahtuu virhe
  alert("Locating failed, please input your address manually."); //Viesti, joka tulee ruutuun jos paikannus ei onnistu tai käyttäjä ei anna lupaa paikannukselle.
}
// Asetukset paikkatiedon hakuun
const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};
// Käyttäjän paikannus
navigator.geolocation.getCurrentPosition(success, error, options);


//Funktio osoitteen perusteella paikantamiseen, joka luo merkin valittuun osoitteeseen ja ajaa reititysfunktion saatuun pisteeseen.
//Käytetään openstreetmapin rajapintaa hyödyksi XML:n avulla.
function address_search() {
  let myArr = "";
  let lat = 0;
  let lon = 0;
  let input = document.querySelector("#address"); //Luetaan käyttäjän syöte osoitekentästä
  let xmlhttp = new XMLHttpRequest();
  let url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + input.value; //Osoite XML kutsua varten
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      myArr = JSON.parse(xmlhttp.response);
      if (myArr[0] === undefined) { //Jos annettu osoite ei tuota hakutuloksia, niin tulostetaan ilmoitus käyttäjälle virheellisestä hausta
        results.innerHTML = "<p>Something went wrong, please try again with proper address within maximum distance.</p>"
      }
      lat = myArr[0].lat;
      lon = myArr[0].lon;
      let locationmarker = L.marker([lat, lon]).bindPopup("Given location").addTo(map); //Sijoitetaan saatu lokaatio kartalle markerina
      let locationcoordinates = ({ latitude: lat, longitude: lon });
      searchRoute(homecoordinates, locationcoordinates); //Ajetaan reititysfunktio saatuun pisteeseen
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

//Locate painikkeen toiminta, eli painettaeessa ajetaan address_search funktio
document.querySelector("#locatebutton").addEventListener("click", address_search);



// Reititysominaisuuden tekoon käytetty apuna esimerkkiä: https://github.com/ilkkamtk/WebTekniikatJaDigitaalinenMedia/blob/master/JavaScript/api-esimerkit/js/esim4.js
// Reititystä varten käytetään Digitransitin apia hyödyksi: https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/
// Reittipisteiden encodausta varten Leafletiin sopivaan muotoon on käytetty seuraavaa tukea: https://github.com/jieter/Leaflet.encoded
const apiAdress = "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql";
function searchRoute(start, end) {
  // Syötetään hakuehdot ja tiedot vakion search taakse, joka sitten myöhemmin syötetään API:n.
  // Määritetään kulkemisvaihtoehdoiksi auto tai kävellen, jos on paikkoja joihin ei autolla pääse perille asti
  const search = `{
  plan(
    from: {lat: ` + start.latitude + `, lon: ` + start.longitude + `}
    to: {lat: ` + end.latitude + `, lon: ` + end.longitude + `}
    transportModes: [{mode: CAR}, {mode: WALK}]
    numItineraries: 1
  ) {
    itineraries {
      legs {
        startTime
        endTime
        mode
        duration
        distance
        legGeometry {
          points
        }
      }
    }
  }
  }`;
  //Määritetään vaaditut asetukset kyseiselle API:lle
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: search }),
  };
  //Kutsutaan apia aiemmin määrityillä asetuksilla ja osoitteella
  fetch(apiAdress, fetchOptions)
    .then(function (answer) {
      return answer.json();
    })
    .then(function (json) {
      const legs = json.data.plan.itineraries[0].legs; //Haetaan oikea kohta API:sta haetusta tiedosta
      let length = 0;
      let time = 0;
      for (let i = 0; i < legs.length; i++) { //Jos saatu matka koostuu useammasta pätkästä, eli esimerkiksi kävelymatkasta, niin lasketaan kaikki matkat ja ajat mukaan for-loopilla
        length += legs[i].distance;
        time += legs[i].duration;
      }
      //Tarkastetaan toimitusmatkan pituus, ja ilmoitetaan käyttäjälle jos toimitusmatka on liian pitkä ja funktion toiminta keskeytetään
      if (length > 10000) {
        results.innerHTML = "<p>Distance is too long, maximum distance to our delivery is 10km.</p>";
        return;
      }
      let deliverylength = Number((Math.floor((length / 1000) * 100) / 100).toFixed(2)); //Pyöristetään matkan kilometrit kahden desimaalin tarkkuudella
      let deliverytime = Number((Math.floor(((time / 60) * 100) / 100).toFixed(0))) + 10; //Pyöristetään matkaan menevä aika täysiksi minuuteiksi ja lisätään valmistukseen menevä aika 10min arvioon
      results.innerHTML = "<p>Delivery distance " + deliverylength + " km and estimated delivery time " + deliverytime + " minutes.</p>" //Syötetään saadut lukemat haluttuun kohtaan koodissa
      const googleCodedRoute = json.data.plan.itineraries[0].legs;
      for (let i = 0; i < googleCodedRoute.length; i++) {
        //Määritetään värikoodi eri kulkumuodoille, jotka tässä tapauksessa ovat autolla tai kävellen
        let color = "";
        if (googleCodedRoute[i].mode === "WALK") {
          color = "green";
        }
        else {
          color = "blue";
        }
        //Piirretään reitti kartalle
        const route = (googleCodedRoute[i].legGeometry.points);
        const markerObjects = L.Polyline.fromEncoded(route).getLatLngs(); //Muutetaan saatu Googlekooduas Leafletiin sopivaan mutooon
        L.polyline(markerObjects).setStyle({
          color
        }).addTo(map);
      }
      map.fitBounds([[start.latitude, start.longitude], [end.latitude, end.longitude]]);
    })
    .catch(function (e) {
      console.error(e.message); //Jos reitityksessä tulee virhe, niin tulostetaan error koodi consoleen
      results.innerHTML = "<p>Something went wrong, please try again with proper address within maximum distance.</p>";//Virhetilanteessa ilmoitetaan myös käyttäjälle virheestä
    });
}

//Määritetään Finish order painikkeen toiminta ja alla sille funktio
document.querySelector("#finishorder").addEventListener("click", FinishOrder);

function FinishOrder() {
  alert("Thank you for your order!");
}