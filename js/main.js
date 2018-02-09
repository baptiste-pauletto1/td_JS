(function () {
    "use strict";
    let css_blanc = {
        'background-color' :'black',
        'color' : 'white',
        'border' : 'solid 1px white',
        'font-weight' : 'bolder'
    };
    let css_noir = {
        'background-color' :'white',
        'color' : 'black',
        'border' : 'solid 1px black',
        'font-weight' : 'bolder'
    };
    let css_surbrillance = {
        'background-color' : 'red',
        'color' : 'white'
    };

    let goLight = function () {
        $(this).css(css_surbrillance);
    };

    let goWhite = function () {
        $(this).css(css_blanc);
    };

    let goBlack = function () {
        $(this).css(css_noir);
    };

    $(document).ready(function () {
        /* on peut travailler sur le DOM */

        $(".case-blanche").css(css_blanc).hover(goLight,goWhite); // Chaining + callback de bogoss

        $(".case-noire").css(css_noir).hover(goLight,goBlack);
    })



}) ();
