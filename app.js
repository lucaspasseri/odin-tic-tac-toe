const game = (function () {
	let board;
	let interface;
	let player;

	const type = ["Χ", "Ο"]; // Special characters

	function init() {
		board = createBoard();
		board.getNewBoard();
		player = createPlayer();
		interface = createInterface();
		interface.init(board, player);
	}

	function getPlayer() {
		return player;
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
		if (!!stopCondition) {
			interface.gameOver(stopCondition);
		}
	}

	function verifyStopCondition(position, type) {
		const arr = board.getBoard();

		const stringPositionByType = arr
			.map((_v, index) => (arr[index] === type ? index : null))
			.filter(pos => pos !== null)
			.join("");

		const regexAndEndGame = [
			{ regex: "0[0-9]*1[0-9]*2", endGame: "012" },
			{ regex: "3[0-9]*4[0-9]*5", endGame: "345" },
			{ regex: "6[0-9]*7[0-9]*8", endGame: "678" },
			{ regex: "0[0-9]*3[0-9]*6", endGame: "036" },
			{ regex: "1[0-9]*4[0-9]*7", endGame: "147" },
			{ regex: "2[0-9]*5[0-9]*8", endGame: "258" },
			{ regex: "0[0-9]*4[0-9]*8", endGame: "048" },
			{ regex: "2[0-9]*4[0-9]*6", endGame: "246" },
		].filter(obj => {
			if (obj.endGame.includes(position)) {
				return obj;
			}
		});

		for (let i = 0; i < regexAndEndGame.length; i++) {
			const curr = regexAndEndGame[i];
			const re = new RegExp(curr.regex);

			if (re.test(stringPositionByType)) {
				return { playerType: type, endGame: curr.endGame };
			}
		}

		if (!board.hasFreeSpace()) {
			return { playerType: type, endGame: "draw" };
		}

		return false;
	}

	return { init, playRound, getPlayer };
})();

function createInterface() {
	let boardRef;
	let playerRef;
	const boardContainer = document.querySelector(".boardContainer");

	function init(board, player) {
		boardRef = board;
		playerRef = player;

		boardContainer.classList.add("hidden");
		document
			.querySelector("#playerNameForm")
			.addEventListener("submit", submitPlayerName);
		document
			.querySelector("#resetBtn")
			.addEventListener("click", resetBtnHandler);
		document
			.querySelector("#dialogCloseBtn")
			.addEventListener("click", closeDialog);
	}

	function closeDialog() {
		document.querySelector(".dialog").close();
	}

	function submitPlayerName(e) {
		e.preventDefault();
		console.log(1);

		const startBtn = e.submitter;
		startBtn.disabled = true;
		document.querySelector("#resetBtn").disabled = false;

		const playerXName = new FormData(e.target).get("playerXName");
		const player0Name = new FormData(e.target).get("player0Name");
		playerRef.setXName(playerXName);
		playerRef.set0Name(player0Name);

		document.querySelector(".inputsContainer").classList.add("hidden");
		boardContainer.classList.remove("hidden");
		render();
	}

	function resetBtnHandler(e) {
		e.currentTarget.disabled = true;
		document.querySelector("#startBtn").disabled = false;

		document.querySelector(".boardContainer").classList.add("hidden");
		document.querySelector(".inputsContainer").classList.remove("hidden");
		boardContainer.innerHTML = "";

		const playerNameForm = document.querySelector("#playerNameForm");
		playerNameForm.reset();
		playerNameForm.removeEventListener("submit", submitPlayerName);
		game.init();
	}

	function gameOver(stopCondition) {
		document.querySelector("#resetBtn").disabled = false;
		document.querySelector("#dialogContent").innerHTML = "";
		const nameSpan = document.createElement("span");
		const typeSpan = document.createElement("span");
		// Special characters
		if (stopCondition.playerType === "Χ") {
			nameSpan.textContent = playerRef.getXName();
			typeSpan.textContent = "Χ";
		} else {
			nameSpan.textContent = playerRef.get0Name();
			typeSpan.textContent = "Ο";
		}

		const p0 = document.createElement("p");
		const p1 = document.createElement("p");
		p1.textContent = "with ";
		const dialog = document.querySelector(".dialog");
		const content = document.querySelector("#dialogContent");
		content.classList.add("scoreStyle");
		p0.append(nameSpan, " won!!!");
		p1.appendChild(typeSpan);
		content.appendChild(p0);
		content.appendChild(p1);

		if (stopCondition.endGame === "draw") {
			const cells = document.querySelectorAll(".cell");

			cells.forEach(cell => cell.classList.add("draw"));
		} else {
			const cells = document.querySelectorAll(".cell");
			cells.forEach(cell => cell.removeEventListener("click", game.playRound));

			const highlightIndexArr = stopCondition.endGame.split("");

			for (let i = 0; i < highlightIndexArr.length; i++) {
				const currIndex = highlightIndexArr[i];

				const cell = document.querySelector(
					`div.boardContainer div#cell-${currIndex}`
				);
				cell.classList.add("victory");
			}
		}

		dialog.showModal();
	}

	function render() {
		boardContainer.innerHTML = "";
		const board = document.createElement("div");

		boardRef?.getBoard().forEach((position, index) => {
			if (position === null) {
				const positionBtn = document.createElement("button");
				positionBtn.id = `cell-${index}`;
				positionBtn.classList.add("cell");
				positionBtn.setAttribute("data-position", index);
				positionBtn.addEventListener("click", game.playRound);
				board.appendChild(positionBtn);
				return;
			}
			const positionDiv = document.createElement("div");
			positionDiv.id = `cell-${index}`;
			positionDiv.classList.add("cell");
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

function createPlayer() {
	let playerXName;
	let player0Name;

	function getXName() {
		return playerXName;
	}
	function setXName(name = "Player 1") {
		playerXName = name.length === 0 ? "Player 1" : name;
	}

	function get0Name() {
		return player0Name;
	}

	function set0Name(name = "Player 2") {
		player0Name = name.length === 0 ? "Player 2" : name;
	}

	return {
		getXName,
		setXName,
		get0Name,
		set0Name,
	};
}

game.init();
