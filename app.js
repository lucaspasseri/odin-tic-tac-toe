function createGame() {
	let board;
	let playBtn;
	let startBtn;
	let p1;
	let p2;

	function init() {
		startBtn = document.querySelector("#startBtn");
		startBtn.addEventListener("click", start);
	}

	function start() {
		board = createBoard();
		board.getNewBoard();

		p1 = createPlayer("José", "X");
		p2 = createPlayer("Maria", "O");

		playBtn = document.querySelector("#playBtn");
		playBtn.addEventListener("click", playRound);
		playBtn.disabled = false;
		startBtn.disabled = true;

		console.log(board.getBoard());
	}

	function playRound() {
		const position = p1.play(board);
		const type = p1.getType();
		board.setPosition(position, type);
		console.log(board.getBoard());

		if (stopCondition(type)) {
			alert("Game over!");
		}
	}

	function stopCondition(type) {
		const arr = board.getBoard();

		const row1 = arr[0] === type && arr[1] === type && arr[2] === type;
		const row2 = arr[3] === type && arr[4] === type && arr[5] === type;
		const row3 = arr[6] === type && arr[7] === type && arr[8] === type;

		const col1 = arr[0] === type && arr[3] === type && arr[6] === type;
		const col2 = arr[1] === type && arr[4] === type && arr[7] === type;
		const col3 = arr[2] === type && arr[5] === type && arr[8] === type;

		const diag1 = arr[0] === type && arr[4] === type && arr[8] === type;
		const diag2 = arr[2] === type && arr[4] === type && arr[6] === type;

		const notHaveFreeSpace = !board.hasFreeSpace();

		if (
			row1 ||
			row2 ||
			row3 ||
			col1 ||
			col2 ||
			col3 ||
			diag1 ||
			diag2 ||
			notHaveFreeSpace
		) {
			return true;
		}

		return false;
	}

	return { init, start, playRound };
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

function createPlayer(name, type) {
	let plays = [];

	function play(board) {
		const boardReg = board.getReg();

		console.log({ boardReg });
		let choice;

		while (choice === undefined) {
			const v = Math.floor(Math.random() * 9);
			if (boardReg[v] === undefined) {
				choice = v;
			}
		}

		plays.push(choice);
		return choice;
	}

	function getPlays() {
		return plays;
	}

	function getName() {
		return name;
	}

	function getType() {
		return type;
	}

	return {
		play,
		getPlays,
		getName,
		getType,
	};
}

const game = createGame();
game.init();
