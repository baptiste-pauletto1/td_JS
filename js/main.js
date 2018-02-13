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

    let creer_case_noire = function () {
        return $('<td />').addClass('case-noire').html('N');
    };
    let creer_case_blanche = function () {
        return $('<td />').addClass('case-blanche').html('B');
    };

    function Damier(h,l,dest) {
        this.hauteur = h || 8;
        this.largeur = l || 8;
        let damier = $(dest);

        for (let i = 0;i<this.hauteur;++i){
            let tmpColumn = $('<tr />'),fn1 ,fn2;
            if(i%2){
                fn1 = creer_case_blanche;
                fn2 = creer_case_noire;
            } else {
                fn1 = creer_case_noire;
                fn2 = creer_case_blanche;
            }
            for (let j = 0;j<this.largeur;j++) {
                j%2 ? tmpColumn.append(fn1)
                    : tmpColumn.append(fn2);
            }
            damier.append(tmpColumn);
        }
    }

    $(() => {// new version du $(document).ready
        /* on peut travailler sur le DOM */


/*        for (let i = 0;i<8;i++) {
            let tmpColumn = $('<tr />'), fn1, fn2;
            if(i%2){
                fn1 = creer_case_blanche;
                fn2 = creer_case_noire;
            } else {
                fn1 = creer_case_noire;
                fn2 = creer_case_blanche;
            }
            for (let j = 0;j<8;j++) {
                j%2 ? tmpColumn.append(fn1)
                    : tmpColumn.append(fn2);
            }
            $("#damier").append(tmpColumn);
        }*/

        new Damier(15,15,'#damier')

        let case_blanche = $(".case-blanche");
        let case_noire = $(".case-noire");

        case_blanche.css(css_blanc).hover(goLight,goWhite); // Chaining + callback de bogoss

        case_noire.css(css_noir).hover(goLight,goBlack);
    })



}) ();
