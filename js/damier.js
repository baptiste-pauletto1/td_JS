let Damier;
(function () {
    "use strict";

    Damier = function (h,l,dest) {
        this.hauteur = h || 8;
        this.largeur = l || 8;
        let damier = $(dest);
        let self = this;
        this.joueur_un = true;
        this.tab = [];

        this.test_victoire = function () {
            for(let i = 0;i<self.hauteur-2;++i){
                for(let y = 0;y<self.largeur-2;++y) {
                    let e1 = self.tab[i][y];
                    let el2 = self.tab[i][y+1];
                    let el3 = self.tab[i][y+2];
                    if ( e1 !== null && el2 === e1 && el3 === e1) {
                        return 'LIGNE';
                    }
                    let ec2 = self.tab[i+1][y+1] ;
                    let ec3 = self.tab[i + 2][y + 2];
                    if(e1 !== null && ec2 === e1 && ec3 === e1){
                        return 'DIAGONALE';
                    }
                    let ed2 = self.tab[i+1][y];
                    let ed3 = self.tab[i+2][y];
                    if(e1 !== null && ed2 === e1 && ed3 === e1) {
                        return 'COLONNE';
                    }
                }
            }
        };

        this.get_carac_joueur = function () {
            return (this.joueur_un ? '\u2718' : '\u2B24');
        };

        this.nb_elems_identiques = function (x_start,y_start,addx,addy) {
            let x = x_start;
            let y = y_start;
            let e = self.tab[x_start][y_start];
            let retour = 0;
            if(e === null){
                return 0;
            }
            while (
                ((x + addx) < self.largeur) && ((y + addy) < self.hauteur)) {
                if (self.tab[x + addx][y + addy] !== e) {
                    break;
                }
                retour++;
                x = x + addx;
                y = y + addy;
            }
            return (retour > 0 ? retour+1 : 0);
        };

        this.ligne_faite = function () {
            for (let x=0; x<self.hauteur; ++x){
                for (let y=0; y<self.largeur-2; y++){
                    if(self.nb_elems_identiques(x,y,1,0)>=3){
                        return true;
                    }
                }
            }
            for (let x=0; x<self.hauteur; ++x){
                for (let y=0; y<self.largeur-2; y++){
                    if(self.nb_elems_identiques(x,y,0,1)>=3){
                        return true;
                    }
                }
            }
            for (let x=0; x<self.hauteur; ++x){
                for (let y=0; y<self.largeur-2; y++){
                    if(self.nb_elems_identiques(x,y,1,1)>=3){
                        return true;
                    }
                }
            }
            return false;
        };

        this.click_case = function () {
                let x = $(this).data('x');
                let y = $(this).data('y');
                $(this).html(self.get_carac_joueur());
                self.tab[x][y] = self.joueur_un;
                if (self.ligne_faite()) {
                    $(this).html("salut à tous les dragons");
                } else {
                    self.joueur_un = !self.joueur_un;
                }
        };

        this.creer_case_noire = function (x,y) {
            return $('<div />')
                .addClass('case-noire')
                .data('x', x)
                .data('y', y)
                .click(self.click_case);
        };

        this.creer_case_blanche = function (x,y) {
            return $('<div />')
                .addClass('case-blanche')
                .data('x',x)
                .data('y',y)
                .click(self.click_case);
        };

        for (let x = 0;x<this.hauteur;++x){
            let tmpColumn = $('<div />'),fn1 ,fn2;
            if(x%2){
                fn1 = this.creer_case_blanche;
                fn2 = this.creer_case_noire;
            } else {
                fn1 = this.creer_case_noire;
                fn2 = this.creer_case_blanche;
            }
            this.tab[x] = [];
            for (let y = 0;y<this.largeur;++y) {
                this.tab[x].push(null);
                y%2 ? tmpColumn.append(fn1(x, y))
                    : tmpColumn.append(fn2(x, y));
            }
            damier.append(tmpColumn);
        }

    };
}) ();