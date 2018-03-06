(function () {

    "use strict";
    // let css_blanc = {
    //     'background-color' :'black',
    //     'color' : 'yellow',
    //     'display' : 'inline-block',
    //     'width' : '50px',
    //     'height' : '50px',
    //     'border' : 'solid 1px white'
    // };
    // let css_noir = {
    //     'background-color' :'yellow',
    //     'color' : 'black',
    //     'width' : '50px',
    //     'height' : '50px',
    //     'display' : 'inline-block',
    //     'border' : 'solid 1px black'
    // };
    // let css_surbrillance = {
    //     'background-color' : 'red',
    //     'color' : 'white'
    // };
    //
    // let goLight = function () {
    //     $(this).css(css_surbrillance);
    // };
    //
    // let goWhite = function () {
    //     $(this).css(css_blanc);
    // };
    //
    // let goBlack = function () {
    //     $(this).css(css_noir);
    // };

    let css_lake = {
        'background-image' :"url('../sprites/lake50.png')",
        'width' : '50px',
        'height' : '50px',
        'display' : 'inline-block'
    };

    let css_village = {
        'background-image' :"url('/sprites/village50.png')",
        'width' : '50px',
        'height' : '50px',
        'display' : 'inline-block'
    };

    let css_forest = {
        'background-image' :"url('/sprites/forest50.png')",
        'width' : '50px',
        'height' : '50px',
        'display' : 'inline-block'
    };

    $(() => {// new version du $(document).ready
        /* on peut travailler sur le DOM */



        $('#form-genmapTest').submit(function () {
            $.ajax({
                url: $(this).attr('action'),
                method: $(this).attr('method'),
                data: $(this).serialize(),
            })
                .done(function (data) {
                    new MapM(5,5,'#map',data);

                    $(".lake_case").css(css_lake);
                    $(".village_case").css(css_village);
                    $(".forest_case").css(css_forest);
                })
                .fail(function () {
                    $("body").html(erreurCritique);
                });
            return false;
        });


        //ajouter result du json en dernier param


        //let case_blanche = $(".case-blanche");
        //let case_noire = $(".case-noire");

        // case_blanche.css(css_blanc).hover(goLight,goWhite); // Chaining + callback de bogoss
        //
        // case_noire.css(css_noir).hover(goLight,goBlack);
    })
}) ();
