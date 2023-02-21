const winningArray = []

// Fill winningArray
// Horiz
for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 4; x++) {
        const result = []
        for (let nr = 0; nr < 4; nr++) {
            result.push(x + y * 7 + nr)
        }
        winningArray.push(result)
    }
}
// Vert
for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 7; x++) {
        const result = []
        for (let nr = 0; nr < 4; nr++) {
            result.push(x + y * 7 + nr * 7)
        }
        winningArray.push(result)
    }
}
// Diag "/"
for (let y = 0; y < 3; y++) {
    for (let x = 3; x < 7; x++) {
        const result = []
        for (let nr = 0; nr < 4; nr++) {
            result.push(x + y * 7 + nr * 6)
        }
        winningArray.push(result)
    }
}
// Diag "\"
for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 4; x++) {
        const result = []
        for (let nr = 0; nr < 4; nr++) {
            result.push(x + y * 7 + nr * 8)
        }
        winningArray.push(result)
    }
}

console.log(winningArray)