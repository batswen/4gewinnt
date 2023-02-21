"use strict"

const gameEl = document.getElementById("game")
const playerEl = document.getElementById("player")
const evaluationEl = document.getElementById("evaluation")

const winningArray = [
    // Horizontal
    [0, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6],
    [7, 8, 9, 10], [8, 9, 10, 11], [9, 10, 11, 12], [10, 11, 12, 13],
    [14, 15, 16, 17], [15, 16, 17, 18], [16, 17, 18, 19], [17, 18, 19, 20],
    [21, 22, 23, 24], [22, 23, 24, 25], [23, 24, 25, 26], [24, 25, 26, 27],
    [28, 29, 30, 31], [29, 30, 31, 32], [30, 31, 32, 33], [31, 32, 33, 34],
    [35, 36, 37, 38], [36, 37, 38, 39], [37, 38, 39, 40], [38, 39, 40, 41],
    // Vertical
    [0, 7, 14, 21], [1, 8, 15, 22], [2, 9, 16, 23], [3, 10, 17, 24], [4, 11, 18, 25], [5, 12, 19, 26], [6, 13, 20, 27],
    [7, 14, 21, 28], [8, 15, 22, 29], [9, 16, 23, 30], [10, 17, 24, 31], [11, 18, 25, 32], [12, 19, 26, 33], [13, 20, 27, 34],
    [14, 21, 28, 35], [15, 22, 29, 36], [16, 23, 30, 37], [17, 24, 31, 38], [18, 25, 32, 39], [19, 26, 33, 40], [20, 27, 34, 41],
    // Diag "/"
    [3, 9, 15, 21], [4, 10, 16, 22], [5, 11, 17, 23], [6, 12, 18, 24],
    [10, 16, 22, 28], [11, 17, 23, 29], [12, 18, 24, 30], [13, 19, 25, 31],
    [17, 23, 29, 35], [18, 24, 30, 36], [19, 25, 31, 37], [20, 26, 32, 38],
    // Diag "\"
    [0, 8, 16, 24], [1, 9, 17, 25], [2, 10, 18, 26], [3, 11, 19, 27],
    [7, 15, 23, 31], [8, 16, 24, 32], [9, 17, 25, 33], [10, 18, 26, 34],
    [14, 22, 30, 38], [15, 23, 31, 39], [16, 24, 32, 40], [17, 25, 33, 41]
]

function reset() {
    gameEl.innerHTML = null
    for (let row = 0; row < 7; row++) {
        const div = document.createElement("div")
        div.classList.add("flex-col")
        div.classList.add("row")
        div.id = `row-${row}`
        div.addEventListener("click", clickedOnRow)
        for (let col = 0; col < 6; col++) {
            const colDiv = document.createElement("div")
            colDiv.classList.add("circle")
            colDiv.id = `row-${row}-col-${col}`
            // colDiv.textContent = `${row + 7 * col}`
            div.append(colDiv)
        }
        gameEl.append(div)
    }
    const winEl = document.createElement("div")
    winEl.id = "win"
    gameEl.append(winEl)
}

function clickedOnRow(event) {
    if (isGameOver()) {
        return
    }
    if (!set(event.currentTarget.id.substring(4, 5), 1)) {
        return
    }
    if (isGameOver()) {
        return
    } 
    const best_index = minimax(2, 3)[1]
    set(best_index)
    isGameOver()
}

function minimax(player, depth) {
    let best_index = 0, best_value = player === 2? -999999999 : 999999999, value
    if (depth === 0 || !movesLeft()) {
        best_value = evaluate()
    } else {
        for (let index = 0; index < 7; index++) {
            if (set(index, player)) {
                if (player === 2) { // max - Computer
                    value = minimax(1, depth - 1)[0]
                    if (value > best_value) {
                        best_value = value
                        best_index = index
                    }
                } else { // min - Player
                    value = minimax(2, depth - 1)[0]
                    if (value < best_value) {
                        best_value = value
                        best_index = index
                    }
                }
                unset(index)
            }
        }
    }
    return [best_value, best_index]
}

function set(row, player) {
    // Set "coin" on lowest position
    for (let col = 5; col >= 0; col--) {
        const el = document.getElementById(`row-${row}-col-${col}`)
        if (el.classList.contains("player-one") || el.classList.contains("player-two")) {
            continue
        } else {
            el.classList.add(player === 1? "player-one" : "player-two")
            return true
        }
    }
    return false
}
function unset(row) {
    // Remove "coin" on highest position
    for (let col = 0; col < 6; col++) {
        const el = document.getElementById(`row-${row}-col-${col}`)
        if (el.classList.contains("player-one")) {
            el.classList.remove("player-one")
            return
        } else if (el.classList.contains("player-two")) {
            el.classList.remove("player-two")
            return
        }
    }
}
// Game über?
function isGameOver() {
    for (const win of winningArray) {
        const player = get(win[0])
        if (player === 0) {
            continue
        }
        // Winner?
        if (get(win[1]) === player && get(win[2]) === player && get(win[3]) === player) {
            document.getElementById("win").textContent = `${player === 1? "Yellow" : "Red"} wins`
            document.getElementById("win").style.display = "flex"
            return true
        }
    }
    // Continue game?
    for (let index = 0; index < 7; index++) {
        if (get(index) === 0) {
            return false
        }
    }
    // Draw!
    document.getElementById("win").textContent = `Draw`
    document.getElementById("win").style.display = "flex"
    return true
}

// Read div array, return player or zero
function get(index) {
    const x = index % 7
    const y = Math.floor(index / 7)
    if (document.getElementById(`row-${x}-col-${y}`).classList.contains("player-one")) {
        return 1
    }
    if (document.getElementById(`row-${x}-col-${y}`).classList.contains("player-two")) {
        return 2
    }
    return 0
}
function movesLeft() {
    for (let index = 0; index < 7; index++) {
        if (get(index) === 0) {
            return true
        }
    }
    return false
}
function evaluate() {
    let result = 0
    for (const win of winningArray) {
        let player1 = 0, player2 = 0
        for (let index = 0; index < 4; index++) {
            if (get(win[index]) === 1) {
                player1++
            } else if (get(win[index]) === 2) {
                player2++
            }
        }
        if (player1 > 0 && player2 === 0) {
            result -= 100 ** (player1 - 1)
        } else if (player2 > 0 && player1 === 0) {
            result += 100 ** (player2 - 1)
        }
    }
    return result
}
reset()