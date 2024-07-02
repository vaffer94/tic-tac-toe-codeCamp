const App = {
    // all of our selected HTML elements

    $: {
        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        resetBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="square"]'),
        modal: document.querySelector('[data-id="modal"]'),
        modalText: document.querySelector('[data-id="modal-text"]'),
        modalBtn: document.querySelector('[data-id="modal-btn"]'),
        turn: document.querySelector('[data-id="turn"]'),
    },

    state: {
        // currentPlayer: 1,K
        moves: [],
    },

    getGameStatus(moves) {
        const p1Moves = moves
            .filter((move) => move.playerId === 1)
            .map((move) => +move.squareId);
        const p2Moves = moves
            .filter((move) => move.playerId === 2)
            .map((move) => +move.squareId);

        const winningPatterns = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
        ];

        let winner = null;

        winningPatterns.forEach((pattern) => {
            const p1Wins = pattern.every((v) => p1Moves.includes(v));
            const p2Wins = pattern.every((v) => p2Moves.includes(v));

            if (p1Wins) winner = 1;
            if (p2Wins) winner = 2;
        });

        return {
            status:
                moves.length === 9 || winner != null
                    ? "complete"
                    : "in-progress",
            winner,
        };
    },

    init() {
        App.registerEventListeners();
    },

    registerEventListeners() {
        App.$.menu.addEventListener("click", (event) => {
            App.$.menuItems.classList.toggle("hidden");
        });

        App.$.resetBtn.addEventListener("click", (event) => {
            console.log("Reset game");
        });

        App.$.newRoundBtn.addEventListener("click", (event) => {
            console.log("New Round");
        });

        App.$.modalBtn.addEventListener("click", (event) => {
            App.state.moves = [];
            App.$.squares.forEach((square) => square.replaceChildren());
            App.$.modal.classList.add("hidden");
        });

        App.$.squares.forEach((square) => {
            square.addEventListener("click", (event) => {
                // console.log(`Square with id ${event.target.id} was clicked`);
                // console.log(`Current player is ${App.state.currentPlayer}`);

                // check if there is already a play, if so, return early
                const hasMove = (squareId) => {
                    const existingMove = App.state.moves.find(
                        (move) => move.squareId === squareId
                    );

                    return existingMove !== undefined;
                };

                // if (square.hasChildNodes()) {
                //     return;
                // }

                if (hasMove(+square.id)) {
                    return;
                }

                const lastMove = App.state.moves.at(-1);
                const getOppositePlayer = (playerId) =>
                    playerId === 1 ? 2 : 1;
                const currentPlayer =
                    App.state.moves.length === 0
                        ? 1
                        : getOppositePlayer(lastMove.playerId);
                const nextPlayer = getOppositePlayer(currentPlayer);

                // const currentPlayer = App.state.currentPlayer;
                const icon = document.createElement("i");
                const turnIcon = document.createElement("i");
                const turnLabel = document.createElement("p");
                turnLabel.innerText = `Player ${nextPlayer}, you are up!`;

                if (currentPlayer === 1) {
                    icon.classList.add("fa-solid", "fa-x", "yellow");
                    turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
                    turnLabel.classList = "turquoise";
                } else {
                    icon.classList.add("fa-solid", "fa-o", "turquoise");
                    turnIcon.classList.add("fa-solid", "fa-x", "yellow");
                    turnLabel.classList = "yellow";
                }

                App.$.turn.replaceChildren(turnIcon, turnLabel);

                App.state.moves.push({
                    squareId: +square.id,
                    playerId: currentPlayer,
                });

                // App.state.currentPlayer = currentPlayer === 1 ? 2 : 1;

                square.replaceChildren(icon);

                // check if there is a winner or tie game
                const game = App.getGameStatus(App.state.moves);
                // console.log(status);

                if (game.status === "complete") {
                    App.$.modal.classList.remove("hidden");
                    let message = "";

                    if (game.winner) {
                        message = `Player ${game.winner} wins!`;
                    } else {
                        message = "Tie game!";
                    }

                    App.$.modalText.textContent = message;

                    // if (game.winner) {
                    //     alert(`Player ${game.winner} wins!`);
                    // } else {
                    //     alert("Tie!");
                    // }
                }
            });
        });
    },
};

window.addEventListener("load", App.init);
