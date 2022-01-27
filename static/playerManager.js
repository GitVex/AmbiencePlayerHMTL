function getPlayerCount() {

	var PlayersCount = document.getElementsByClassName('LocalMixerBoxGridItem').length;
	return PlayersCount;
}

function getNextPlayerPosition(nextID) {

	let nextPosition = "";
	switch(nextID) {
	case 0:
		nextPosition = "topleft";
		break;
	case 1:
		nextPosition = "topmid";
		break;
	case 2:
		nextPosition = "topright";
		break;
	case 3:
		nextPosition = "midleft";
		break;
	case 4:
		nextPosition = "midmid";
		break;
	case 5:
		nextPosition = "midright";
		break;
	case 6:
		nextPosition = "bottomleft";
		break;
	case 7:
		nextPosition = "bottommid";
		break;
	case 8:
		nextPosition = "bottomright";
		break;
	case 9:
		nextPosition = "none";
		break;
	}


	return nextPosition;
}

function addPlayer() {

	let i = 0;
	while (i < PlayerHolder.length) {
		if (PlayerHolder[i].isAvailable == true) {
			console.log(PlayerHolder[i], i + ' was avilable')
			break;
		}
		console.log('not available ' + i);
		i++;
	}

	//Loading HTML Template
	var temp = document.getElementById("LocalMixerBoxGridItemTEMPLATE").content;
	var toImport = document.importNode(temp, true);

	if(getNextPlayerPosition(i) == "none") {

		alert("No more Player Slots available");

	} else {

		//Placing HTML element;
		var PlayerItem = toImport.firstElementChild;
		PlayerItem.setAttribute('id', 'slot' + i);
		PlayerItem.setAttribute('style', '')
		PlayerItem.style.setProperty('grid-area', getNextPlayerPosition(i));
		document.getElementById("LocalMixerBoxGrid").appendChild(toImport);

		//Assigning PlayerID
		var newLocalMixer = document.getElementById('slot' + i);
		var playerSlot = newLocalMixer.querySelector('#LocalPlayer');
		var playerSlotID = "playerSlot" + playerSlot.parentElement.getAttribute('id');
		playerSlot.setAttribute('id', playerSlotID);

		//Pickping & Replacing player from PlayerHolder
		console.log(document.getElementById('PlayerHolderContainer'));
		console.log("#player" + i);
		console.log(document.getElementById('PlayerHolderContainer').querySelector("#player" + i));
		var newChild = document.getElementById('PlayerHolderContainer').querySelector("#player" + i);
		newChild.setAttribute('class', 'LocalPlayer');

		document.getElementById(playerSlotID).parentElement.appendChild(newChild);
		document.getElementById(playerSlotID).remove();
		    
	  	PlayerHolder[i].isAvailable = false;
	}
}

function removePlayer() {

	let PHreversed = Array.from(PlayerHolder.reverse());
	PlayerHolder.reverse()
	let i = 0;
	while (PHreversed[i].isAvailable != false) {
		i++;
	}
	let lastPlayer = PHreversed[i];
	console.log(lastPlayer);
	let toRemove = getCurrentMixer(lastPlayer.div['h'])[0];

	document.getElementById('PlayerHolderContainer').appendChild(lastPlayer.div['h']);

	lastPlayer.isAvailable = true;
	toRemove.remove();
}

function deletePlayer() {

	let removeID = getCurrentMixer(event.srcElement);
	let toRemove = removeID[0];
	console.log(removeID);
	console.log(toRemove);
		 
	try {
		document.getElementById('PlayerHolderContainer').appendChild(toRemove.children[toRemove.children.length - 1]);
	} catch (e) {
		alert(e);
		return;
	}
	 
	PlayerHolder[removeID[1]].isAvailable = true;
	toRemove.remove();
}

function getCurrentMixer(eventOrigin) {

	let currentMixer = eventOrigin;

	let compToken = eventOrigin.getAttribute('id');
	while (compToken != 'slot') {

		currentMixer = currentMixer.parentElement;
		compToken = currentMixer.getAttribute('id');
		compToken = compToken.slice(0, -1);
	}

	let currentMixerId = currentMixer.getAttribute('id').charAt(currentMixer.getAttribute('id').length - 1);
	return [currentMixer, currentMixerId];
}

function updateVideo() {

	let currentMixer = getCurrentMixer(event.srcElement);
	let videoIdContainer = currentMixer[0].children[2].firstElementChild;
	let videoID;
	if (videoIdContainer.value.includes("youtube")) {
		videoID = videoIdContainer.value.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/)[1];
	} else {
		videoID = videoIdContainer.value;
	}
		 
	try {
		PlayerHolder[currentMixer[1]].div.loadVideoById(videoID);
	} catch (e) {
		alert(e);
	}
}

function updateVolume() {

	let currentMixer = getCurrentMixer(event.srcElement);
	let volSlider = currentMixer[0].children[0].firstElementChild;

	try {
		PlayerHolder[currentMixer[1]].div.setVolume(parseInt(volSlider.value));
	} catch (e) {
		alert(e);
	}
}

function fadeIn() {

	let currentMixer = getCurrentMixer(event.srcElement);
	let volSlider = currentMixer[0].children[0].firstElementChild;
	let endValue = parseInt(volSlider.value);
	if(endValue == 0) {endValue = 30;}
	volSlider.value = '0';
	let playerState = PlayerHolder[currentMixer[1]].div.getPlayerState();
	PlayerHolder[currentMixer[1]].div.setVolume(0);

	if(playerState == 2) {

		PlayerHolder[currentMixer[1]].div.playVideo();
	}
	
	var handler;
	function increase(){

		if (parseInt(volSlider.value) >= endValue) {
	
			window.clearInterval(handler);
		}

		volSlider.value = parseInt(volSlider.value) + .5;			
		PlayerHolder[currentMixer[1]].div.setVolume(parseInt(volSlider.value));
	}


	handler = window.setInterval(increase, 50);
}

function fadeOut() {

	let currentMixer = getCurrentMixer(event.srcElement);
	let volSlider = currentMixer[0].children[0].firstElementChild;
	let endValue = 0;

	var handler;

	function decrease(){

		if (parseInt(volSlider.value) <= endValue) {

			window.clearInterval(handler);
			PlayerHolder[currentMixer[1]].div.pauseVideo();
		}
		volSlider.value = parseInt(volSlider.value) - 1;
		PlayerHolder[currentMixer[1]].div.setVolume(parseInt(volSlider.value));
	}
	handler = window.setInterval(decrease, 50);
}

function openLib() {
	document.getElementById('libraryBox').style.setProperty('display', 'flex');
	setTimeout(() => document.getElementById('libraryBox').style.setProperty('opacity', '1'), 5);
}

function closeLib() {
	setTimeout(() => document.getElementById('libraryBox').style.setProperty('display', 'none'), 500)
	document.getElementById('libraryBox').style.setProperty('opacity', '0');
}