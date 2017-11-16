////MERCHANTS/////



//////////////////////
// GLOBAL VARIABLES //
//////////////////////


//main content arrays
var zones = [];
var professions = [];
var craftedItems = [];
var structures = [];
var researches = [];
var resources = [];
var cityRanks = ["Tent", "Campsite", "Hamlet", "Village", "Town", "City", 
				"Metropolis", "Megalopolis", "Ecumenopolis"];
var professionRanks = ["Apprentice", "Adept", "Expert", "Master", "Grandmaster", 
				"Champion", "Legendary"];
var playerStats =[];


/////////////
// CLASSES //
/////////////


function PlayerStats(cityRank,totalPopulation, unassignedPopulation) {
	this.cityRank = cityRank;
	this.totalPopulation = totalPopulation;
	this.unassignedPopulation = unassignedPopulation;
}

function Zone(name, order, multiplier) {
	this.order = order;
	this.name = name;
	this.multiplier = multiplier;
}

function Profession(order, name, rank, multiplier, workersAssigned){
	this.order = order;
	this.name = name;
	this.rank = rank;
	this.multiplier = multiplier;
	this.workersAssigned = workersAssigned;
	this.income = function incomeCalc(){
			return this.multiplier * this.workersAssigned;
	};
}

function CraftedItem(order,name,tier,cost,value) {
	this.order = order;
	this.name = name;
	this.tier = tier;
	this.cost = cost;
	this.value = value;
}

function Structure(order,name,tier,cost,value,amount) {
	this.order = order;
	this.name = name;
	this.tier = tier;
	this.cost = cost;
	this.value = value;
	this.amount = amount;
}

function Research(order,name,description,cost,multiplier,level) {
	this.order = order;
	this.name = name;
	this.description = description;
	this.cost = cost;
	this.multiplier = multiplier;
	this.level = level;
}

function Resource(order, name, amount) {
	this.order = order;
	this.name = name;
	this.amount = amount;
}
//////////////////////////
// POPULATING GAME DATA //
//////////////////////////

resources.push(new Resource(0,  "Wood", 10));
resources.push(new Resource(1,  "Ore", 00));
resources.push(new Resource(2,  "Herbs", 0));
resources.push(new Resource(3,  "Skins", 0));
resources.push(new Resource(4,  "Wool", 0));
resources.push(new Resource(5,  "RawGems", 0));
resources.push(new Resource(6,  "Essence", 0));
resources.push(new Resource(7,  "Science", 0));
resources.push(new Resource(8,  "Planks", 0));
resources.push(new Resource(9,  "Metal", 0));
resources.push(new Resource(10, "Scrolls", 0));
resources.push(new Resource(11, "Leather", 0));
resources.push(new Resource(12, "Thread", 0));
resources.push(new Resource(13, "CutGems", 0));
resources.push(new Resource(14, "Magic", 0));
resources.push(new Resource(15, "Population", 0));

//Gathering professions
professions.push(new Profession(0, "Lumberjack", 0, 1, 0));
professions.push(new Profession(1, "Miner", 0, 1, 0));
professions.push(new Profession(2, "Herbalist", 0, 1, 0));
professions.push(new Profession(3, "Hunter", 0, 1, 0));
professions.push(new Profession(4, "Shepherd", 0, 1, 0));
professions.push(new Profession(5, "Priest", 0, 1, 0, 0));
professions.push(new Profession(6, "Treasure Hunter", 0, 1, 0));
professions.push(new Profession(7, "Scientist", 0, 1, 0));
//Refining professions
professions.push(new Profession(8, "Miller", 0, 1, 0));
professions.push(new Profession(9, "Smelter", 0, 1, 0));
professions.push(new Profession(10, "Scribe", 0, 1, 0));
professions.push(new Profession(11, "Gemcutter", 0, 1, 0));
professions.push(new Profession(12, "Tanner", 0, 1, 0));
professions.push(new Profession(13, "Weaver", 0, 1, 0));
professions.push(new Profession(14, "Mystic", 0, 1, 0));

//Crafting professions
professions.push(new Profession(15, "Weaponsmithing", 0, 1, 0));
professions.push(new Profession(16, "Armorsmithing", 0, 1, 0));
professions.push(new Profession(17, "Alchemy", 0, 1));
professions.push(new Profession(18, "Leatherworking", 0, 1, 0));
professions.push(new Profession(19, "Carpentry", 0, 1, 0));
professions.push(new Profession(20, "Tailoring", 0, 1, 0));
professions.push(new Profession(21, "Enchanting", 0, 1, 0));
professions.push(new Profession(22, "Jewelcrafting", 0, 1, 0));

//Upgrade professions
professions.push(new Profession(23, "Research", 0, 1, 0));
professions.push(new Profession(24, "Construction", 0, 1, 0));
professions.push(new Profession(25, "Engineering", 0, 1, 0));

//CraftedItem(order,name,tier,cost,value) 
//weaponsmithing
craftedItems.push(new CraftedItem(0,"Axe",1,10,10));
craftedItems.push(new CraftedItem(1,"Sword",1,10,10));
craftedItems.push(new CraftedItem(2,"Polearm",1,10,10));
craftedItems.push(new CraftedItem(3,"Dagger",1,10,10));
//armorsmithing
craftedItems.push(new CraftedItem(4,"Chestplate",1,10,10));
craftedItems.push(new CraftedItem(5,"Helm",1,10,10));
craftedItems.push(new CraftedItem(6,"Bracer",1,10,10));
//alchemy
craftedItems.push(new CraftedItem(7,"Poison",1,10,10));
craftedItems.push(new CraftedItem(8,"Health Potion",1,10,10));
craftedItems.push(new CraftedItem(9,"Mana Potion",1,10,10));
craftedItems.push(new CraftedItem(10,"Enhancement Potion",1,10,10));
//leatherworking
craftedItems.push(new CraftedItem(11,"Boots",1,10,10));
craftedItems.push(new CraftedItem(12,"Gloves",1,10,10));
//carpentry
craftedItems.push(new CraftedItem(13,"Bow",1,10,10));
craftedItems.push(new CraftedItem(14,"Arrow",1,10,10));
craftedItems.push(new CraftedItem(15,"Staff",1,10,10));
craftedItems.push(new CraftedItem(16,"Catapult",1,10,10));
craftedItems.push(new CraftedItem(17,"Battering Ram",1,10,10));
craftedItems.push(new CraftedItem(18,"Siege Tower",1,10,10));
//tailoring
craftedItems.push(new CraftedItem(19,"Socks",1,10,10));
craftedItems.push(new CraftedItem(20,"Robes",1,10,10));
craftedItems.push(new CraftedItem(21,"Shirts",1,10,10));
craftedItems.push(new CraftedItem(22,"Pants",1,10,10));
//
craftedItems.push(new CraftedItem(23,"Magical Scroll",1,10,10));
//
craftedItems.push(new CraftedItem(24,"Magical Ingot",1,10,10));
//
craftedItems.push(new CraftedItem(25,"Amulet",1,10,10));
craftedItems.push(new CraftedItem(26,"Ring",1,10,10));
craftedItems.push(new CraftedItem(27,"Earring",1,10,10));



//Structure(order,name,tier,cost,value,amount) 
structures.push(new Structure());


//Research(order,name,description,cost,multiplier,level)
researches.push(new Research());




//////////////////////////
// MAIN PAGE GENERATION //
//////////////////////////



////////////////////
// GAME FUNCTIONS //
////////////////////

function assignWorker (order) {
	if (playerStats[0].unassignedPopulation >= multiplierButtonState) {
		professions[order].workersAssigned  += multiplierButtonState;
		playerStats[0].unassignedPopulation -= multiplierButtonState;
		updatePane2(order);
	}
}


function unassignWorker (order) {
	if (professions[order].workersAssigned >= multiplierButtonState) {
		professions[order].workersAssigned -= multiplierButtonState;
		playerStats[0].unassignedPopulation += multiplierButtonState;
		updatePane2(order);
	}
}

var multiplierButtonState = 1;

function updateMultiplierButton() {
	if (multiplierButtonState === 1) {
		document.getElementById("multiplierButton").innerHTML = "10x";
		multiplierButtonState+= 9;
	}
	else if (multiplierButtonState === 10) {
		document.getElementById("multiplierButton").innerHTML = "100x";
		multiplierButtonState+= 90;
	}
	else if (multiplierButtonState === 100) {
		document.getElementById("multiplierButton").innerHTML = "1000x";
		multiplierButtonState+= 900;
	}
	else if (multiplierButtonState = 1000) {
		document.getElementById("multiplierButton").innerHTML = "1x";
		multiplierButtonState -= 999;
	}

}


//////////////////////
// UPDATE FUNCTIONS //
//////////////////////

function updateScreen(){
	//Populate Resource Display Bar
	woodCount.innerHTML =       resources[0].name  + ": " + resources[0].amount;
	oreCount.innerHTML =        resources[1].name  + " : " + resources[1].amount;
	herbCount.innerHTML =       resources[2].name  + ": " + resources[2].amount;
	skinCount.innerHTML =       resources[3].name  + ": " + resources[3].amount;
	woolCount.innerHTML =       resources[4].name  + ": " + resources[4].amount;
	rawGemCount.innerHTML =     resources[5].name  + ": " + resources[5].amount;
	essenceCount.innerHTML =    resources[6].name  + ": " + resources[6].amount;
	scienceCount.innerHTML =    resources[7].name  + ": " + resources[7].amount;
	plankCount.innerHTML =      resources[8].name  + ": " + resources[8].amount;
	metalCount.innerHTML =      resources[9].name  + ": " + resources[9].amount;
	scrollCount.innerHTML =     resources[10].name + ": " + resources[10].amount;
	leatherCount.innerHTML =    resources[11].name + ": " + resources[11].amount;
	threadCount.innerHTML =     resources[12].name + ": " + resources[12].amount;
	cutGemCount.innerHTML =     resources[13].name + ": " + resources[13].amount;
	magicCount.innerHTML =      resources[14].name + ": " + resources[14].amount;
	populationCount.innerHTML = resources[15].name + ": " + "(" + playerStats[0].unassignedPopulation + "/" +playerStats[0].totalPopulation + ")";

	//update current city rank
	cityRank.innerHTML =        playerStats[0].cityRank;

	//Update profession worker counts
	lumberjackingButton.innerHTML = professions[0].name + " (" + professions[0].workersAssigned + ")";
	miningButton.innerHTML = professions[1].name + " (" + professions[1].workersAssigned + ")";
	herbalismButton.innerHTML = professions[2].name + " (" + professions[2].workersAssigned + ")";
	huntingButton.innerHTML = professions[3].name + " (" + professions[3].workersAssigned + ")";
	shepherdingButton.innerHTML = professions[4].name + " (" + professions[4].workersAssigned + ")";
	priestButton.innerHTML = professions[5].name + " (" + professions[5].workersAssigned + ")";
	treasureHunterButton.innerHTML = professions[6].name + " (" + professions[6].workersAssigned + ")";
	scientistButton.innerHTML = professions[7].name + " (" + professions[7].workersAssigned + ")";
	millingButton.innerHTML = professions[8].name + " (" + professions[8].workersAssigned + ")";
	smeltingButton.innerHTML = professions[9].name + " (" + professions[9].workersAssigned + ")";
	scribingButton.innerHTML = professions[10].name + " (" + professions[10].workersAssigned + ")";
	gemcuttingButton.innerHTML = professions[11].name + " (" + professions[11].workersAssigned + ")";
	tanningButton.innerHTML = professions[12].name + " (" + professions[12].workersAssigned + ")";
	weavingButton.innerHTML = professions[13].name + " (" + professions[13].workersAssigned + ")";
	mystweavingButton.innerHTML = professions[14].name + " (" + professions[14].workersAssigned + ")";



}

//Update Resource counts
function updateResources() {
	//loop for unrefined resources
	for (i=0; i<8; i++) {
		resources[i].amount += professions[i].income();
	}

	//refined resource checking.
	//planks
	if (resources[0].amount >= professions[8].income()) {
		resources[8].amount += professions[8].income();
		resources[0].amount -= professions[8].income();
	}
	else if (resources[0].amount < professions[8].income()) {
		resources[8].amount += resources[0].amount;
		resources[0].amount -= resources[0].amount;
	}
	//metal
	if (resources[1].amount >= professions[9].income()) {
		resources[9].amount += professions[9].income();
		resources[1].amount -= professions[9].income();
	}
	else if (resources[1].amount < professions[9].income()) {
		resources[9].amount += resources[1].amount;
		resources[1].amount -= resources[1].amount;
	}
	//scrolls
		if (resources[2].amount >= professions[10].income()) {
		resources[10].amount += professions[10].income();
		resources[2].amount -= professions[10].income();
	}
	else if (resources[2].amount < professions[10].income()) {
		resources[10].amount += resources[2].amount;
		resources[2].amount -= resources[2].amount;
	}
	//leather
	if (resources[3].amount >= professions[12].income()) {
		resources[11].amount += professions[12].income();
		resources[3].amount -= professions[12].income();
	}
	else if (resources[3].amount < professions[12].income()) {
		resources[11].amount += resources[3].amount;
		resources[3].amount -= resources[3].amount;
	}
	//thread
	if (resources[4].amount >= professions[13].income()) {
		resources[12].amount += professions[13].income();
		resources[4].amount -= professions[13].income();
	}
	else if (resources[4].amount < professions[13].income()) {
		resources[12].amount += resources[4].amount;
		resources[4].amount -= resources[4].amount;
	}
	//cut gems
	if (resources[5].amount >= professions[11].income()) {
		resources[13].amount += professions[11].income();
		resources[5].amount -= professions[11].income();
	}
	else if (resources[5].amount < professions[11].income()) {
		resources[13].amount += resources[5].amount;
		resources[5].amount -= resources[5].amount;
	}
	//magic
	if (resources[6].amount >= professions[14].income()) {
		resources[14].amount += professions[14].income();
		resources[6].amount -= professions[14].income();
	}
	else if (resources[6].amount < professions[14].income()) {
		resources[14].amount += resources[6].amount;
		resources[6].amount -= resources[6].amount;
	}
}



//defaullt pane2
document.getElementById("PANE2").innerHTML = "<center>" + professions[0].name + "</center>"  + "<center>" + professionRanks[professions[0].rank] + "</center>" + "<center>" + professions[0].income() + "</center>";
//Update PANE 2
function updatePane2(order) {
	document.getElementById("PANE2").innerHTML = "<center>" + professions[order].name + "</center>"  + "<center>" + professionRanks[professions[order].rank] + "</center>" + "<center>" + professions[order].income() + "</center>";
}
//default pane 4
document.getElementById("PANE4").innerHTML = "<center>" + professions[15].name + "</center>" + "<center>" + professionRanks[professions[15].rank] + "</center>";

//Update PANE 4
function updatePane4(order) {
	if (professions[order].order < 23) {
	document.getElementById("PANE4").innerHTML = "<center>" + professions[order].name + "</center>" + "<center>" + professionRanks[professions[order].rank] + "</center>";
	}
	else {
		document.getElementById("PANE4").innerHTML = "<center>" + professions[order].name + "</center>";
	}
}

///////////////
// INTERVALS //
///////////////

window.setInterval(updateScreen,30);
window.setInterval(updateResources,1000);

////////////////////////////////////////////////////
// STARTUP SCRIPT (FOR DEVELOPMENT PURPOSES ONLY) //
////////////////////////////////////////////////////
playerStats.push(new PlayerStats(cityRanks[0],100,100));

//Display buttons even though their default is to be invisible
document.getElementById("miningButton").style="display: true"
document.getElementById("herbalismButton").style="display: true"
document.getElementById("huntingButton").style="display: true"
document.getElementById("shepherdingButton").style="display: true"
document.getElementById("priestButton").style="display: true"
document.getElementById("treasureHunterButton").style="display: true"
document.getElementById("scientistButton").style="display: true"

document.getElementById("millingButton").style="display: true"
document.getElementById("smeltingButton").style="display: true"
document.getElementById("scribingButton").style="display: true"
document.getElementById("gemcuttingButton").style="display: true"
document.getElementById("tanningButton").style="display: true"
document.getElementById("weavingButton").style="display: true"
document.getElementById("mystweavingButton").style="display: true"


document.getElementById("miningButtonPlus").style="display: true"
document.getElementById("miningButtonMinus").style="display: true"
document.getElementById("herbalismButtonPlus").style="display: true"
document.getElementById("herbalismButtonMinus").style="display: true"
document.getElementById("huntingButtonPlus").style="display: true"
document.getElementById("huntingButtonMinus").style="display: true"
document.getElementById("shepherdingButtonPlus").style="display: true"
document.getElementById("shepherdingButtonMinus").style="display: true"
document.getElementById("priestButtonPlus").style="display: true"
document.getElementById("priestButtonMinus").style="display: true"
document.getElementById("treasureHunterButtonPlus").style="display: true"
document.getElementById("treasureHunterButtonMinus").style="display: true"
document.getElementById("scientistButtonPlus").style="display: true"
document.getElementById("scientistButtonMinus").style="display: true"

document.getElementById("millingButtonPlus").style="display: true"
document.getElementById("millingButtonMinus").style="display: true"
document.getElementById("smeltingButtonPlus").style="display: true"
document.getElementById("smeltingButtonMinus").style="display: true"
document.getElementById("scribingButtonPlus").style="display: true"
document.getElementById("scribingButtonMinus").style="display: true"
document.getElementById("gemcuttingButtonPlus").style="display: true"
document.getElementById("gemcuttingButtonMinus").style="display: true"
document.getElementById("tanningButtonPlus").style="display: true"
document.getElementById("tanningButtonMinus").style="display: true"
document.getElementById("weavingButtonPlus").style="display: true"
document.getElementById("weavingButtonMinus").style="display: true"
document.getElementById("mystweavingButtonPlus").style="display: true"
document.getElementById("mystweavingButtonMinus").style="display: true"

document.getElementById("weaponsmithingButton").style="display: true"
document.getElementById("armorsmithingButton").style="display: true"
document.getElementById("leatherworkingButton").style="display: true"
document.getElementById("carpentryButton").style="display: true"
document.getElementById("tailoringButton").style="display: true"
document.getElementById("enchantingButton").style="display: true"
document.getElementById("jewelcraftingButton").style="display: true"

document.getElementById("researchButton").style="display: true"
document.getElementById("constructionButton").style="display: true"
document.getElementById("engineeringButton").style="display: true"