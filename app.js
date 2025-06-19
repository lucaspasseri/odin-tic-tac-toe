const game = (function () {
	let board;
	let interface;

	const type = ["X", "O"];

	function init() {
		board = createBoard();
		board.getNewBoard();
		interface = createInterface();
		interface.init(board);
	}

	function playRound(position) {
		if (typeof position === "object") {
			const target = position.currentTarget;
			position = Number(target.dataset.position);
		}

		const currType = type[Object.keys(board.getReg()).length % 2];

		board.setPosition(position, currType);
		interface.render();

		const stopCondition = verifyStopCondition(position, currType);
		console.log(stopCondition);
		if (!!stopCondition) {
			interface.gameOver(stopCondition);
		}
	}

	function verifyStopCondition(position, type) {
		const arr = board.getBoard();

		const filteredByType = arr
			.map((_v, index) => (arr[index] === type ? index : null))
			.filter(pos => pos !== null);
		const stringByType = filteredByType.join("");

		const stopStrings = [
			"012",
			"345",
			"678",
			"036",
			"147",
			"258",
			"048",
			"246",
		].filter(str => str.includes(position));

		for (let i = 0; i < stopStrings.length; i++) {
			const currString = stopStrings[i];
			if (stringByType.includes(currString)) {
				return currString;
			}
		}

		if (!board.hasFreeSpace()) {
			return "full";
		}

		return false;
	}

	return { init, playRound };
})();

function createInterface() {
	let boardRef;
	const boardContainer = document.querySelector(".boardContainer");

	function init(board) {
		boardRef = board;
		document
			.querySelector("#startBtn")
			.addEventListener("click", startBtnHandler);
		document
			.querySelector("#resetBtn")
			.addEventListener("click", resetBtnHandler);
		document.querySelector("#closeBtn").addEventListener("click", closeDialog);
	}

	function closeDialog() {
		document.querySelector(".dialog").close();
	}

	function startBtnHandler(e) {
		e.currentTarget.disabled = true;
		document.querySelector("#resetBtn").disabled = false;

		render();
	}

	function resetBtnHandler(e) {
		e.currentTarget.disabled = true;
		document.querySelector("#startBtn").disabled = false;

		boardContainer.innerHTML = "";
		game.init();
	}

	function gameOver(stopCondition) {
		document.querySelector("#resetBtn").disabled = false;

		const p = document.createElement("p");
		p.textContent = stopCondition;

		const dialog = document.querySelector(".dialog");
		dialog.appendChild(p);
		dialog.showModal();
	}

	function render() {
		boardContainer.innerHTML = "";
		const board = document.createElement("div");

		boardRef?.getBoard().forEach((position, index) => {
			if (position === null) {
				const positionBtn = document.createElement("button");
				positionBtn.id = index;
				positionBtn.setAttribute("data-position", index);
				positionBtn.addEventListener("click", game.playRound);
				board.appendChild(positionBtn);
				return;
			}
			const positionDiv = document.createElement("div");
			positionDiv.id = index;
			const span = document.createElement("span");
			span.textContent = position;
			positionDiv.appendChild(span);
			board.appendChild(positionDiv);
		});

		boardContainer.appendChild(board);
	}

	return { init, render, gameOver };
}

function createBoard() {
	let boardArray;
	let freeSpace = true;
	const reg = {};

	function getNewBoard() {
		boardArray = new Array(9).fill(null);
		return boardArray;
	}

	function setPosition(position, type) {
		boardArray[position] = type;
		reg[position] = true;
		freeSpace = boardArray.filter(v => v !== null).length === 9 ? false : true;
	}

	function getBoard() {
		return boardArray;
	}

	function hasFreeSpace() {
		return freeSpace;
	}

	function getReg() {
		return reg;
	}

	return { getBoard, getNewBoard, setPosition, hasFreeSpace, getReg };
}

// Clean up the interface to allow players to put in their names, include a button to start/restart
// the game and add a display element that shows the results upon game end!

// function createPlayer(name, type) {
// 	let plays = [];

// 	function play(board) {
// 		const boardReg = board.getReg();

// 		console.log({ boardReg });
// 		let choice;

// 		while (choice === undefined) {
// 			const v = Math.floor(Math.random() * 9);
// 			if (boardReg[v] === undefined) {
// 				choice = v;
// 			}
// 		}

// 		plays.push(choice);
// 		return choice;
// 	}

// 	function getPlays() {
// 		return plays;
// 	}

// 	function getName() {
// 		return name;
// 	}

// 	function getType() {
// 		return type;
// 	}

// 	return {
// 		play,
// 		getPlays,
// 		getName,
// 		getType,
// 	};
// }

game.init();
