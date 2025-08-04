var gamePiece;
var petSprite;
var feed;
var lights; 
var timer;
var optionsArray = ["default", "feed", "lights", "time"];
var selectedOption; 
var selector; 
var hungryTxt;
var foodOfChoice;
var fullnessGauge;
var currentActivity; 

var snackOption;
var mealOption; 
var foodSelector;
var foodSelection; 

var food;
var foodEaten = false;
var foodLeft; 
var eatingInstr; 
var finishTxt;

var lightsAreOn = true, lightsOn, lightsOff, lightSelector, lightSelection;

var timeText;

var container = document.getElementsByClassName("container")[0]; 
var btnA = document.getElementById("A");
var btnB = document.getElementById("B");
var btnC = document.getElementById("C");
var btns = [btnA, btnB, btnC];
var manualBtn = document.getElementById("manual-button");
var manual = document.getElementById("manual"); 
manual.style.visibility = "hidden";
var startBtn = document.getElementById("start-button");
var instructionsShown = false; 

var fullness; 
var timeElapsedBtwnSessions;
var timeAtLoad;
var timeOfSave; 

var clicks; 
var testVar;

//localStorage.removeItem("saveTime");
//localStorage.removeItem("fullness");

const fullDeplRate = (1/360000); 
const updateRate = 20;

function toggleInstructions() {
	if (!instructionsShown) {
		manual.innerHTML = "A: SCROLL &#13;&#10;B: CONFIRM &#13;&#10;C: CANCEL";
		instructionsShown = true;
		manual.style.visibility = "visible";
	}
	else {
		manual.innerHTML = "";
		instructionsShown = false;
		manual.style.visibility = "hidden";
	}
} 

function isStorageNull(item) {
	return (localStorage.getItem(item) == null);
}

if (localStorage.getItem("clicks") != null) {
	localStorage.removeItem("clicks");
	clicks = 0;
}
else {
	clicks = 0;
}

//var clickButton = document.getElementById("click-button");
var clicksTxt = document.getElementById("click-counter"); 

function countClicks() {
	clicks++;
	clicksTxt.innerHTML = `NO. OF CLICKS: ${clicks}`;
}

function changeToRed(btn) {
	
}

startBtn.onclick = function() {
	startBtn.remove();
	startGame();
}

function startGame() {
	
	load(); 

	if (fullness > 0) {
		if (fullDeplRate*timeElapsedBtwnSessions <= fullness) {
			fullness -= fullDeplRate*timeElapsedBtwnSessions;
		}
		else {
			fullness = 0.0;
		}
	} 
	
	if (!isStorageNull("saveTime")) {
		clicksTxt.innerHTML = `Fullness: ${fullness} | Been ${timeElapsedBtwnSessions}ms since you last logged in | Last saved at ${localStorage.getItem("saveTime")}`;
	}
	
	//lightsAreOn = true;
	//gamePiece = new component(30, 30, "orange", 10, 120); 
	//fullness = 39; 
	petSprite = new sprite(70, 70, "sprites/Chickpea.gif", 100, 100);
	//mealOption = new canvasTxt("success", 0, 30);
	feed = new sprite(30, 30, "sprites/feed.png", 30, 20);
	lights = new sprite(30, 30, "sprites/lights.png", 90, 20); 
	timer = new sprite(30, 30, "sprites/clock.png", 150, 20); 
	selector = new component(feed.width+10, feed.height+10, "red", -200, -200); 
	hungryTxt = new canvasTxt("", 40, "Arial", "black", 420, 260, true, 4); 
	fullnessGauge = new canvasTxt(`${Math.round(fullness)}% full`, 20, "Arial", "black", 200, 140, false, 0);
	//myGameArea.start();
	mainActivity(); 
	
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 270;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        container.insertBefore(this.canvas, container.childNodes[0]);
		this.interval = setInterval(updateGameArea, updateRate);
    },
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function component(width, height, color, x, y) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = myGameArea.context;
		ctx.strokeStyle = color;
		ctx.strokeRect(this.x, this.y, this.width, this.height);
	}
	this.newPos = function(x, y) {
		this.x = x;
		this.y = y;
	}
} 

function sprite(width, height, src, x, y) {
	this.x = x;
	this.y = y;
	this.img = new Image();
	this.img.src = src; 
	this.width = width;
	this.height = height;
	this.update = function() {
		ctx = myGameArea.context;
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}
} 

function food(width, height, src, x, y) {
	this.sprt = new sprite(width, height, src, x, y);
}

function feed() {
	if (foodSelection == "snack") {
		fullness += 50.0; 
		if (fullness > 100.0) {
			fullness = 100.0;
		}
	}
	else {
		fullness = 100.0;
	}
}

function canvasTxt(txt, size, font, color, x, y, scrolls, speed) {
	this.txt = txt;
	this.size = size;
	this.font = font;
	this.color = color;
	this.scrolls = scrolls; 
	this.speed = speed;
	this.x = x;
	this.xInit = x;
	this.y = y;
	this.update = function() {
		ctx = myGameArea.context;
		ctx.font = `${this.size}px ${this.font}`;
		ctx.fillStyle = this.color;
		ctx.fillText(this.txt, this.x, this.y);
	}
	this.newPos = function() {
		if (scrolls) {
			if (this.x > -myGameArea.canvas.width*2) {
				this.x -= this.speed;
			}
			else {
				this.x = this.xInit;
			}
		}
	}
} 

function scrollOptions() {
	if (selectedOption < optionsArray.length-1) {
		selectedOption += 1;
		switch (optionsArray[selectedOption]) {
			case "feed":
				selector.x = feed.x-2;
				selector.y = feed.y-2;
				break;
			case "lights":
				selector.x = lights.x-2;
				selector.y = lights.y-2;
				break;
			case "time":
				selector.x = timer.x-2;
				selector.y = timer.y-2;
				break;
		}
	}
	else {
		selectedOption = 0;
		selector.x = -200;
		selector.y = -200;
	}
} 

function selectMain() {
	if (selectedOption != 0) {
		changeActivity(optionsArray[selectedOption])
	}
} 

function changeActivity(txt) {
	myGameArea.clear();
	switch (txt) {
		case "feed":
			feedActivity();
			break;
		case "eat":
			eatingActivity();
			break;
		case "lights":
			lightsActivity();
			break;
		case "time":
			timeActivity();
			break;
		case "main":
			mainActivity();
			break;
	}
} 

function checkLights() {
	if (lightsAreOn) {
		myGameArea.canvas.style.backgroundColor = "#f1f1f1"; 
		petSprite.img.src = "sprites/Chickpea.gif";
		fullnessGauge.color = "black";
		lights.img.src = "sprites/lights.png"
	}
	else {
		myGameArea.canvas.style.backgroundColor = "#1f1f1f"; 
		petSprite.img.src = "sprites/Sleepy Chickpea.png";
		fullnessGauge.color = "white";
		lights.img.src = "sprites/lights_off.png";
	}
}

function mainActivity() { 
	
	currentActivity = "main";
	
	selectedOption = 0; 
	
	checkLights();
	

	
	if (fullness < 30.0) {
		hungryTxt.txt = "Chickpea wants a meal!";
		hungryTxt.color = "#FF0000";
		foodOfChoice = "meal";
	}
	else if (fullness < 70.0) {
		hungryTxt.txt = "Chickpea wants a snack!";
		hungryTxt.color = "#FF4500";
		foodOfChoice = "snack"
	}
	else {
		hungryTxt.txt = "";
		foodOfChoice = null;
	}
	//snackOption = new canvasTxt("Snack", 30, "Arial", "black", 60, 30, false);
	//currentActivity = "main"; 
	
	btnA.onclick = scrollOptions;
	btnA.onmousedown = function() {
		btnA.style.backgroundColor = "red";
	}
	btnA.onmouseup = function() {
		btnA.style.backgroundColor = "#FF6A7A";
	}
	
	btnB.onclick = selectMain;
	btnB.onmousedown = function() {
		btnB.style.backgroundColor = "red";
	}
	btnB.onmouseup = function() {
		btnB.style.backgroundColor = "#FF6A7A";
	}
	
	btnC.onclick = function() {
		selector.x = -200;
		selector.y = -200;
		selectedOption = 0;
	} 
	btnC.onmousedown = function() {
		btnC.style.backgroundColor = "red";
	}
	btnC.onmouseup = function() {
		btnC.style.backgroundColor = "#FF6A7A";
	}
	
	myGameArea.start();
}

function feedActivity() {
	currentActivity = "feed";
	snackOption = new canvasTxt("Snack", 30, "Arial", "black", 60, 30, false);
	mealOption = new canvasTxt("Meal", 30, "Arial", "black", 60, 90, false);
	foodSelector = new sprite(40, snackOption.size, "sprites/arrow.png", 0, snackOption.y-24);
	foodSelection = "snack";
	btnA.onclick = function() {
		if (foodSelection == "snack") {
			foodSelection = "meal";
			foodSelector.y = mealOption.y-24;
		}
		else {
			foodSelection = "snack";
			foodSelector.y = snackOption.y-24;
		}
	}
	btnB.onclick = function() {
		if (foodSelection == foodOfChoice) {
			changeActivity("eat");
		}
		
	}
	btnC.onclick = function() {
		changeActivity("main");
	}
	myGameArea.start();
} 

function eatingActivity() { 
	currentActivity = "eat"; 
	//myGameArea.canvas.style.backgroundColor = "#f1f1f1";
	foodEaten = false;
	food = new sprite(120, 120, `sprites/${foodSelection}.png`, 40, 40);
	foodLeft = 100; 
	eatingInstr = new canvasTxt("Press B to eat", 25, "Arial", "red", 30, 200, false, 0);
	btnB.onclick = function() {
		if (!foodEaten) {
			foodLeft -= 25;
			if (foodLeft > 0) {
				food.img.src = `sprites/${foodSelection}_${foodLeft}%.png`;
			}
			else {
				myGameArea.context.clearRect(food.x, food.y, food.width, food.height); 
				foodEaten = true; 
				if (foodSelection == "snack") {
					if ((100.0-fullness) >= 50.0) {
						fullness += 50.0;
					}
					else {
						fullness = 100.0;
					}
				}
				else {
					fullness = 100.0;
				}
				finishTxt = new canvasTxt(`Fullness is now ${Math.ceil(fullness)}%!`, 25, "Arial", "red", 30, 60, false);
				foodOfChoice = null;
			}
		} 
		else {
			changeActivity("main");
		}
	}
	myGameArea.start();
}

function lightsActivity() {
	currentActivity = "lights"; 
	
	lightsOn = new canvasTxt("Lights On", 30, "Arial", "black", 60, 30, false);
	lightsOff = new canvasTxt("Lights Off", 30, "Arial", "black", 60, 90, false);
	lightSelector = new sprite(40, lightsOn.size, "sprites/arrow.png", 0, lightsOn.y-24);
	lightSelection = "on";
	btnA.onclick = function() {
		if (lightSelection == "on") {
			lightSelection = "off";
			lightSelector.y = lightsOff.y-24;
		}
		else {
			lightSelection = "on";
			lightSelector.y = lightsOn.y-24;
		}
	}
	
	btnB.onclick = function() {
		if (lightSelection == "on") {
			lightsAreOn = true;
		}
		else {
			lightsAreOn = false;
		}
		changeActivity("main");
		//startGame();
	}
	btnC.onclick = function() {
		changeActivity("main");
	}
	myGameArea.start();
}

function timeActivity() {
	
}

function updateGameArea() {
	
	if (currentActivity == "main") {
		myGameArea.clear();
		//gamePiece.update();
		checkLights();
		petSprite.update();
		feed.update();
		lights.update();
		timer.update();
		selector.update(); 
		hungryTxt.newPos();
		hungryTxt.update();
		fullnessGauge.update(); 
		fullness -= fullDeplRate*updateRate;
		fullnessGauge.txt = `${Math.ceil(fullness)}% full`;
	}
	else if (currentActivity == "feed") {
		myGameArea.clear();
		snackOption.update();
		mealOption.update();
		foodSelector.update();
	} 
	else if (currentActivity == "lights") {
		myGameArea.clear();
		lightsOn.update();
		lightsOff.update();
		lightSelector.update();
	}
	else if (currentActivity == "eat") {
		myGameArea.clear();
		if (!foodEaten) {
			food.update();
			eatingInstr.update();
		}
		finishTxt.update();
	}
	else {
		myGameArea.clear();
	}
}

function save() {
	localStorage.setItem("saveTime", new Date());
	//localStorage.setItem("fullness", fullness);
	//window.alert("Game saved");
}

function load() {
	if (localStorage.getItem("saveTime") != null) {
		timeOfSave = localStorage.getItem("saveTime");
	}
	else {
		timeOfSave = new Date();
	}
	if (localStorage.getItem("fullness") != null) {
		fullness = localStorage.getItem("fullness"); 
	}
	else {
		fullness = 100.0;
	}
	timeAtLoad = new Date();
	timeElapsedBtwnSessions = Date.parse(timeAtLoad) - Date.parse(timeOfSave); 
} 

window.addEventListener(
			"beforeunload", function (event) {
			event.returnValue = "This document is ready to load"; 
			localStorage.setItem("clicks", clicks);
			localStorage.setItem("saveTime", new Date());
			if (fullness >= 0) {
				localStorage.setItem("fullness", fullness);
			}
		});