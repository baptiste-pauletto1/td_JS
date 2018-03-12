let mapM;
(function () {
    "use strict";

    mapM = class mapM {

        constructor(height,width,dest,data){
            this.height = height;
            this.width = width;
            this.map = $(dest);
            this.data = data;
            this.tab = [];
            this.timeCheck = null;
        }

        isMoving () {
            let self = this;
            $.ajax({
                url: '/json/isMoving.php',
                type: 'POST',
                data: {TIME : Date.now()}
            })
                .done(function (data) {
                    if(data.result){ // If the player is still traveling
                        clearTimeout(self.timeCheck);
                        self.timeCheck = setTimeout(self.isMoving,data.timeLeft);
                        console.log("Still moving");
                        console.log("Set isMoving Timeout to : " + data.timeLeft + "ms");
                    } else { //When traveling will be done
                        console.log("Travel finished !");
                        self.tab[data.pos['POS_X_INIT']][data.pos['POS_Y_INIT']].removeAttr("id");
                        self.tab[data.pos['POS_X_DEST']][data.pos['POS_Y_DEST']].attr("id","posPlayer");
                    }
                })
                .fail(function () {
                    $('body').html(data.msg);
                })
            ;
        };

        initPosition () {
            let self = this;
            $.ajax({
                url: '/json/whereAmI.php',
            })
                .done(function (data) {
                    if(data.result){ // If everything went right we look for the player's position
                        self.tab[data.pos['POS_X']][data.pos['POS_Y']].attr("id","posPlayer");
                    }
                })
                .fail(function () {
                    return -1; // Shouldn't happen but if it happens we will be able to notice it.
                })
        };


        click_case () {
            let self = this;
            let x = $(this).data('x');
            let y = $(this).data('y');
            $.ajax({
                url:'/json/isMoving.php',
                type: 'POST',
                data: {TIME : Date.now()}
            })
                .done(function (data) {
                    if(!data.result) { // If the player isn't moving
                        $.ajax({
                            url:'/json/startMoving.php',
                            type: 'POST',
                            data: {POS_X_DEST: x, POS_Y_DEST: y, TIME_START: Date.now()}
                        })
                            .done(function (data) {
                                if (data.result){ // If the player starts moving
                                    console.log("Travel Started !");
                                    console.log("Set isMoving Timeout to : " + data.timeLength + "ms");
                                    self.timeCheck = setTimeout(self.isMoving, data.timeLength);
                                } else { // Erreur de déplacement ?
                                    $('body').html(data.msg);
                                }
                            })
                            .fail(function () {
                                $('body').html(data.msg);
                            });
                    } else { // When the player is moving, we just wait and do nothing else.
                        console.log("You are already moving !")
                    }
                }).fail(function () {
                $('body').html(data.msg);
            });

        };

        create_forest_case (x,y) {
            return $('<div />')
                .addClass('forest_case')
                .data('x', x)
                .data('y', y)
                .click(self.click_case);
        };

        create_village_case (x,y) {
            return $('<div />')
                .addClass('village_case')
                .data('x', x)
                .data('y', y)
                .click(self.click_case);

        };

        create_lake_case (x,y) {
            return $('<div />')
                .addClass('lake_case')
                .data('x', x)
                .data('y', y)
                .click(self.click_case);
        };

        createMap() {
            let landTypes = {
                'FOREST': this.create_forest_case,
                'LAKE': this.create_lake_case,
                'VILLAGE': this.create_village_case
            };

            let fnAjouteCase = (self, fn, x, y, col) => {
                let slot = fn(x,y);
                col.append(slot);
                self.tab[x].push(slot);
            };

            for (let x = 0;x<this.data.length;++x){
                let tmpColumn = $('<div />');
                this.tab[x] = [];
                for (let y = 0;y<this.data.length;++y) {
                    let land = landTypes [ this.data[x][y] ];
                    if (typeof(land) !== 'undefined') {
                        fnAjouteCase(this, land, x,y, tmpColumn);
                    } else {
                        $('body').html("Something strange happened");
                    }
                }
                this.map.append(tmpColumn);
            }
            console.log(this.tab);
            this.initPosition();
        }
    };
}) ();