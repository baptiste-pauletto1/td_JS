(function () {

    "use strict";
    let css_blanc = {
        'background-color' :'black',
        'color' : 'yellow',
        'display' : 'inline-block',
        'border' : 'solid 1px white',
        'textAlign' : 'center',
        'width' : '30px',
        'height' : '30px',
        'font-weight' : 'bolder'
    };
    let css_noir = {
        'background-color' :'yellow',
        'color' : 'black',
        'display' : 'inline-block',
        'border' : 'solid 1px black',
        'textAlign' : 'center',
        'width' : '30px',
        'height' : '30px',
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

    $(() => {// new version du $(document).ready
        /* on peut travailler sur le DOM */

        new Damier(3,3,'#damier');


        let case_blanche = $(".case-blanche");
        let case_noire = $(".case-noire");

        case_blanche.css(css_blanc).hover(goLight,goWhite); // Chaining + callback de bogoss

        case_noire.css(css_noir).hover(goLight,goBlack);
    })
}) ();
