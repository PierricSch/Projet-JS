import Cell from './Cell.js';
import { ajouteEcouteurSouris, ajouteEcouteursClavier, inputState, mousePos } from './ecouteur.js';
import { rectsOverlap } from './collision.js';
import Plante from './Plante.js';
import Zombie from './Zombie.js';


let canvas, ctx;
let cell = 100;
let score = 0;
let timer = 0;
//argent pour acheter des plantes
let seed = 500;
let gameState = 'menuStart';

let plants = [];
let zombies = [];
let gameGrid = []; 

// Bonne pratique : on attend que la page soit chargée
// avant de faire quoi que ce soit
window.onload = init;

function init(event) {
    console.log("Page chargée et les éléments HTML sont prêts à être manipulés");
    canvas = document.getElementById('myCanvas');
    //console.log(canvas);
    // pour dessiner, on utilise le contexte 2D
    ctx = canvas.getContext('2d');

    // chargement des assets (musique,  images, sons)
    //loadAssets(assetsToLoadURLs, startGame);

    startGame();
}

function startGame(assetsLoaded) {
    //assets = assetsLoaded;

    // appelée quand tous les assets sont chargés
    //console.log("StartGame : tous les assets sont chargés");
    //assets.backinblack.play();

   // On va prendre en compte le clavier
   ajouteEcouteursClavier();
   ajouteEcouteurSouris();
   createGrid();

    // On va créer un joueur
    //joueur = new Joueur(100, 0, 50, 50, assets.joueur, 3);
    //tableauDesObjetsGraphiques.push(joueur);
    // On crée la sortie
    //sortie = new Sortie(700, 400, 30, 'yellow');
    //tableauDesObjetsGraphiques.push(sortie);
    // et des obstacles
    //creerDesObstaclesLevel1();

    requestAnimationFrame(animationLoop);
}

function animationLoop() {
    // On va exécuter cette fonction 60 fois par seconde
    // pour créer l'illusion d'un mouvement fluide
    //1 - On efface le contenu du canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (gameState) {
        case 'menuStart':
            afficheMenuStart(ctx);
            break;
        case 'gameOver':
            afficheGameOver(ctx);
            break;        
        case 'jeuEnCours':
            // 2 - On dessine le nouveau contenu
            //console.log('jeuEnCours')
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.fillRect(0,0,canvas.width, cell);
            ctx.restore();
            //grid du jeux
            drawGrid();
            plantes();
            gameStatus();
            zombiesHandle();
            peasHandler();

            timer++;
            break;
    }

    //Control bar
    // ctx.save();
    // ctx.fillStyle = 'red';
    // ctx.fillRect(0,0,canvas.width, cell);
    // ctx.restore();
    // //grid du jeux
    // drawGrid();
    // plantes();
    // gameStatus();
    // zombiesHandle();
    // timer++;
    //console.log(timer);
    // 4 - On rappelle la fonction d'animation
    requestAnimationFrame(animationLoop);
}

//Gestion de la grid
function createGrid(){
    for(let x = 0; x < canvas.width; x += cell){
        for(let y = cell; y < canvas.height; y+=cell){
            gameGrid.push(new Cell(x,y,cell));
        }
    }
}
function drawGrid(){
    for(let i = 0;i< gameGrid.length;  i++){
        gameGrid[i].draw(ctx);
    }
}

//Event sur le click souris a deplacer dans ecouteur.js
window.onmousedown = (event2) => {
    //console.log("click souris");
    if(gameState !== 'jeuEnCours'){
        return;
    }
    let PositionX = mousePos.x - (mousePos.x % cell);
    let PositionY = mousePos.y - (mousePos.y % cell);
    if( PositionY < cell)
        return;
    // Test pour ne pas placer plusieur plante sur la meme case
    for (let i = 0; i < plants.length; i++){
        if(plants[i].x === PositionX && plants[i].y === PositionY)
            return;
    }
    let plantCost = 100;
    if( seed >= plantCost){
        plants.push(new Plante(PositionX, PositionY, cell, 100, false, 100))
        seed -= plantCost;
    }
    
}

//Affichage des plantes
function plantes(){
    for(let i = 0; i < plants.length; i++){
        plants[i].draw(ctx);
        plants[i].addPeas();
        for( let x = 0; x < zombies.length; x++){
            if(plants[i] && zombies[i] && rectsOverlap(plants[i], zombies[x])){
                zombies[x].speed = 0;
                plants[i].health -= 0.4;
            }
            if(plants[i] && plants[i].health <= 0){
                //delete plants[i];
                plants.splice(i,1);
                i-- ;
                zombies[x].speed = 0.5;
            }
        }
    }
}

//Affichage des seed en stock
function gameStatus(){
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = "20px Arial";
    ctx.fillText('Score : ' + score, 10,35 );
    ctx.fillText('Seed : ' + seed, 10,60 );    
    ctx.restore();
}

//Affiche zombe et les deplaces 
function zombiesHandle(){
    for(let i = 0 ; i < zombies.length; i++){
        zombies[i].move();
        zombies[i].draw(ctx);
        if(zombies[i].x < 0 ){
            gameState = 'gameOver';
            //console.log('LOSE')
        }
        if(zombies[i].health <= 0){
            zombies.splice(i,1);
            i--
            seed += 100;
            score += 100;
        }
    }
    if(timer % 200 === 0){
        let y = Math.floor(Math.random() * 6 +1) * cell;
        zombies.push( new Zombie(canvas.width, y, cell, 0.5, 100));
    }
}

function peasHandler(){
    //boucle sur toute les plantes pour pouvoir avoir tout les pois tirer
    for(let i = 0; i < plants.length; i++){
        //boucle pour afficher tout les pois tirer par les plantes et les faire se deplacer
        for(let j = 0; j< plants[i].peas.length; j++){

            plants[i].peas[j].move();
            plants[i].peas[j].draw(ctx);
            //boucle pour tester les collicion avec les zombies
            for(let k = 0; k <zombies.length; k++){

                if(plants[i].peas[j] && zombies[k] && rectsOverlap(plants[i].peas[j], zombies[k])){
                    zombies[k].health -= plants[i].peas[j].damage;
                    plants[i].peas.splice(j,1);
                    j--
                }
            }

            if(plants[i].peas[j] && plants[i].peas[j].x > 900){
                plants[i].peas.splice(j,1);
                j-- ;
            }
            //console.log('peas '+ this.peas.length);
        }       
    }
}

// Different ecran
function afficheMenuStart(ctx) {
    ctx.save()
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = "80px Arial";
    ctx.fillText("Press space to start", 190, 100);
    ctx.strokeText("Press space to start", 190, 100);
    if (inputState.space) {
        gameState = 'jeuEnCours';
    }
    ctx.restore();
}
function afficheGameOver(ctx) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = "130px Arial";
    ctx.fillText("GAME OVER", 180, 100);
    ctx.strokeText("GAME OVER", 180, 100);
    ctx.fillText("Score : "+ score, 290, 300);

    if (inputState.space) {
        gameState = 'menuStart';
        plants = [];
        zombies = [];
        cell = 100;
        score = 0;
        timer = 0;
    }
    ctx.restore();
}