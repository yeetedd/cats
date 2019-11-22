var taustakuva;
var kissakuva;
var lautta_y = 300;
var lautan_leveys = 100;
var lautan_korkeus1 =20;
var painovoima = 0.05;
var kissalista = [];
var elamat = 9;
var luku = 50;
var pisteet = 0;
var tekstinKoko = 25;
var minAika = 1500;
var maxAika = 2500;
var poweUps = [];
var kissaTimer;

function alaPelaamaan() {
  clearTimeout(kissaTimer);
  kissalista = [];
  elamat = 9;
  pisteet = 0;
  luo_kissoja();
  makePowerUps();
  noCursor();
  loop();
}

function preload() {
  taustakuva = loadImage('images/pilvet1.jpg');
  kissakuva = loadImage('https://igno.cc/opetus/kuvat/cat.png');
  //ekaTahti =
  //tokaTahti =
  kolmasTahti = loadImage('images/keltainen_tahti.png');
}



function setup() {
  var canvas = createCanvas(windowWidth, windowWidth/4);
  canvas.parent('kissapeli')
  angleMode(DEGREES);
  textSize(tekstinKoko);
}

function windowrezised(){
  resizeCanvas(windowWidth, windowWidth/4);

}

function draw() {
   var pelin_korkeus = windowWidth/4;
   image(taustakuva, 0, 0, windowWidth, pelin_korkeus);
   lautta(pelin_korkeus);

   kissalista.forEach(function(kissa_olio, monesko){
     kissa_olio.liikuta(pelin_korkeus);
     if(kissa_olio.kissa_y > pelin_korkeus){
       kissalista.splice(monesko,1);
       elamat -= 1;
     }
     if(kissa_olio.kissa_x > windowWidth){
       kissalista.splice(monesko,1);
       pisteet += 1;
       if(pisteet % 10 === 0){
         elamat += 1;
         if (maxAika > minAika + 500 && minAika > 400){
          maxAika -= 100;
          minAika -= 100;
        }

     }
     }

  });
  if (elamat <= 0){
    gameover(pelin_korkeus);
  }

  poweUps.forEach(function(powerup, monesko){
    powerup.myDraw();
  });


  text("Lives: " + elamat, windowWidth - windowWidth/8, pelin_korkeus/6)
  text("Points: " + pisteet, windowWidth- windowWidth/8, pelin_korkeus/3)

}

function gameover(pelin_korkeus){
  push();
  textSize(50);
  textAlign(CENTER);
  text('GAME OVER', windowWidth / 2 , pelin_korkeus/2);
  pop();
  let i;
  for(i in kissalista ){
    i.kissa_x = windowWidth + i.kissan_leveys;
  }
  cursor();
  noLoop();
};

function lautta(pelin_korkeus){
    fill('#ffe6e6');
    var lautan_korkeus2 = pelin_korkeus-luku;
    rect(mouseX, lautan_korkeus2, lautan_leveys, lautan_korkeus1, 20, 20, 0, 0);
}

function luo_kissoja(){
  kissa_olio = new Kissa();
  var boost = random(-1, 2);
  kissa_olio.kissan_nopeusX += boost;
  boost = random(-1, 2);
  kissa_olio.kissan_nopeusY += boost;
  kissalista.push(kissa_olio);
  var aika = random(1500, 2500);
  kissaTimer = setTimeout(luo_kissoja, aika);
}

function makePowerUps(kissan_leveys){
  powerup = new PowerUp();
  powerup.x = random(kissalista.kissa_x, windowWidth);
  poweUps.push(powerup);
  let time = 10000;
  setTimeout(makePowerUps, time);
}

class PowerUp {
  constructor(){

  this.x = random(0.1, 100);
  this.y = 0;
  this.speedX = 0;
  this.speedY = 0;
  this.kulma = 0;
  this.tahti = kolmasTahti;
  this.width = 20;
  this.height = 20;
  }

  myDraw(){
    this.y += 1;

    image(this.tahti, this.x, this.y, this.width, this.height)
  }
}

class Kissa {
  constructor() {
    this.kissa_x = -10;
    this.kissa_y = 100;
    this.kissan_korkeus = 50;
    this.kissan_leveys = 50;
    this.kissan_nopeusY = -2;
    this.kissan_nopeusX = 2;
    this.kulma=0;
  }
  liikuta(pelin_korkeus){

    this.kissa_x = this.kissa_x + this.kissan_nopeusX;
    this.kissan_nopeusY = this.kissan_nopeusY + painovoima;

    if(this.kissa_y + this.kissan_korkeus / 2> pelin_korkeus-luku){
      if(this.kissa_x > mouseX && this.kissa_x < mouseX + lautan_leveys){
          this.kissan_nopeusY = -abs(this.kissan_nopeusY)
      }
    }

    this.kissa_y = this.kissa_y + this.kissan_nopeusY;

    this.kulma = this.kulma + 10;

    push();       // tallentaa koordinaatiston origon ja kulman
    translate(this.kissa_x, this.kissa_y); //siirtää koordinaatiston origon kissan kohdalle
    rotate(this.kulma);
    imageMode(CENTER);         //asetaa kuvan origon kuvan keskelle
    image(kissakuva, 0 ,0 ,this.kissan_leveys, this.kissan_korkeus);
    pop();        // palauttaa koordinaatiston asetuksen alkuperäiseen

  }
}
