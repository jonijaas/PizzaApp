'use strict';

//Hampurilaisvalikon funktio

$(function () {
  $(".toggle").on("click", function (tog) { //lisätään .toggleen on-click eventti
    tog.stopPropagation();                 //Estetään tällä metodilla alempien eventtien "päällekkäisyys"
    if ($(".item").hasClass("active")) {   //Eventit valikolle
      $(".item").removeClass("active");
    } else {
      $(".item").addClass("active");
    }
  });
  $("body").on("click", function () {        //Sulkee valikon, jos käyttäjä painaa sen ulkopuolelta mistä tahansa kohtaa bodya
    $(".item").removeClass("active");
  });
});

//tehdään sama vielä kotisivun "main" -sectionille (lisää top-paddingia)

$(function () {
  $(".toggle").on("click", function (tog) {
    tog.stopPropagation();
    if ($(".home").hasClass("active")) {
      $(".home").removeClass("active");
    } else {
      $(".home").addClass("active");
    }
  });
  $("body").on("click", function () {
    $(".home").removeClass("active");
  });
});

//ja vielä kerran delivery-sivulle (sama kuin ylempänä)

$(function () {
  $(".toggle").on("click", function (tog) {
    tog.stopPropagation();
    if ($(".delivery-main").hasClass("active")) {
      $(".delivery-main").removeClass("active");
    } else {
      $(".delivery-main").addClass("active");
    }
  });
  $("body").on("click", function () {
    $(".delivery-main").removeClass("active");
  });
});

//video 25% volumelle on-start
$("video").prop("volume", 0.25);