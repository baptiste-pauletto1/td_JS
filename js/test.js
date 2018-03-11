let MapM;
(function () {
    "use strict";

    MapM = function (h, l, dest, data) {
        this.hauteur = h || 5;
        this.largeur = l || 5;
        let map = $(dest);
        let self = this;
        let timeCheck;

        this.caca = function () {
            return 5000;
        };

        this.isMoving = function () {
            $.ajax({
                url: '/json/isMoving.php',
                type: 'POST',
                data: {TIME : Date.now()}
            })
                .done(function (data) {
                    if(data.result){
                        clearTimeout(timeCheck);
                        timeCheck = setTimeout(self.isMoving,data.timeLeft);
                        console.log("Still moving");
                        console.log("Set isMoving Timeout to : " + data.timeLeft + "ms");
                    } else{
                        console.log("Travel finished !");
                    }
                })
                .fail(function () {
                    $('body').html(data.msg);
                })
            ;
        };

        this.whereAmI = function () {
            $.ajax({
                url: '/json/whereAmI.php',
            })
                .done(function (data) {
                    if(data.result){ // If everything went right we look for the player's position
                        let posTab = [];
                        posTab['POS_X'] = data.pos['POS_X'];
                        posTab['POS_Y'] = data.pos['POS_Y'];
                        console.log(posTab);
                        console.log(Array.isArray(posTab));
                        return posTab;
                    }
                })
                .fail(function () {
                    return -1; // Shouldn't happen but if it happens we will be able to notice it.
                })
        };

        this.positionPlayer = function(pos_x,pos_y){
        };

        this.click_case = function () {
            let x = $(this).data('x');
            let y = $(this).data('y');
            $.ajax({
                url:'/json/isMoving.php',
                type: 'POST',
                data: {TIME : Date.now()}
            })
                .done(function (data) {
                    if(!data.result) { // Si n'est pas en déplacement.
                        $.ajax({
                            url:'/json/startMoving.php',
                            type: 'POST',
                            data: {POS_X_DEST: x, POS_Y_DEST: y, TIME_START: Date.now()}
                        })
                            .done(function (data) {
                                if (data.result){ //Si déplacement commencé
                                    console.log("Travel Started !");
                                    console.log("Set isMoving Timeout to : " + data.timeLength + "ms");
                                    timeCheck = setTimeout(self.isMoving, data.timeLength);
                                } else { // Erreur de déplacement ?
                                    $('body').html(data.msg);
                                }
                            })
                            .fail(function () {
                                $('body').html(data.msg);
                            });
                    } else { // En déplacement, l'utilisateur ne peut pas se déplacer à nouveau, on ne fait RIEN
                        console.log("You are moving Bastard !")
                        //self.isMoving();
                    }
                }).fail(function () {
                $('body').html(data.msg);
            });

        };

        this.create_forest_case = function (x,y) {
            return $('<div />')
                .addClass('forest_case')
                .data('x', x)
                .data('y', y)
                .click(self.click_case);
        };

        this.create_village_case = function (x,y) {
            return $('<div />')
                .addClass('village_case')
                .data('x', x)
                .data('y', y)
                .click(self.click_case);

        };

        this.create_lake_case = function (x,y) {
            return $('<div />')
                .addClass('lake_case')
                .data('x', x)
                .data('y', y)
                .click(self.click_case);
        };

        this.addPlayerCarac = function () {
            $('<div />').attr('id', 'playerPos');
        };


        let actualPlayerPos = [];
        actualPlayerPos = this.whereAmI();
        for (let x = 0;x<data.length;++x){
            let tmpColumn = $('<div />');
            for (let y = 0;y<data.length;++y) {
                switch (data[x][y]) {
                    case 'FOREST' :
                        tmpColumn.append(this.create_forest_case(x,y));
                        break;
                    case 'LAKE':
                        tmpColumn.append(this.create_lake_case(x,y));
                        break;
                    case 'VILLAGE' :
                        tmpColumn.append(this.create_village_case(x,y));
                        break;
                    default:
                        $('body').html("ERRRRREUR");
                        break;
                }
                if (actualPlayerPos['POS_X'] === data[x] && actualPlayerPos['POS_Y'] === data[y]){
                    tmpColumn.append(this.addPlayerCarac());
                }
            }

            map.append(tmpColumn);
        }
    };
}) ();