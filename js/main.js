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

    $(".case-blanche").css(css_blanc);

    $(".case-noire").css(css_noir);


}) ();
