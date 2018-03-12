let MapM;
(function () {
    "use strict";

    MapM = function (h, l, dest, data) {
        this.hauteur = h || 5;
        this.largeur = l || 5;
        let map = $(dest);
        let self = this;
        let timeCheck;
        this.tab = [];

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

        this.initPosition = function (cb) {
            /*
            let self = this;
            this.cb = cb;
             */
            // Merci https://stackoverflow.com/questions/1833588/javascript-clone-a-function
            let cbCloned = cb.bind({});
            $.ajax({
                url: '/json/whereAmI.php',
            })
                .done(function (data) {
                    if(data.result){ // If everything went right we look for the player's position
                        // self.cb(data.pos['POS_X'], data.pos['POS_Y']);
                        // cbCloned(data.pos['POS_X'], data.pos['POS_Y']);
                        self.drawPlayer(data.pos['POS_X'],data.pos['POS_Y'])
                    }
                })
                .fail(function () {
                    return -1; // Shouldn't happen but if it happens we will be able to notice it.
                })
        };

        this.drawPlayer = function(pos_x,pos_y){
            //$('div').data[] = this.tab[pos_x];
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

        this.create_village_case =  (x,y) => {
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

        self.initPosition(function (x, y) {
           console.log(x,y);
           console.log(x,y);
           console.log(x,y);
           console.log(x,y);
           console.log(x,y);
           console.log(x,y);
           console.log(x,y);
        });

        let fnAjouteCase = function (self, fn, x, y, col) {
            let slot = fn(x,y);
            col.append(slot);
            self.tab[x].push(slot);
        };

        let landTypes = {
            'FOREST': this.create_forest_case,
            'LAKE': this.create_lake_case,
            'VILLAGE': this.create_village_case
        };

        for (let x = 0;x<data.length;++x){
            let tmpColumn = $('<div />');
            this.tab[x] = [];
            for (let y = 0;y<data.length;++y) {
                let land = landTypes [ data[x][y] ];
                if (typeof(land) !== 'undefined') {
                    fnAjouteCase(this, land, x,y, tmpColumn);
                } else {
                    $('body').html("Something strange happened");
                }
            }
            map.append(tmpColumn);
        }
        console.log(this.tab);

    };
}) ();