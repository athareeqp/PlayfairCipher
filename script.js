let keyMatrix = [];
const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";

function generateKeyMatrix(key) {
  // Validate key to ensure it contains only alphabetic characters
  if (!/^[A-Za-z]+$/.test(key)) {
    alert("Key should only contain alphabetic characters.");
    return;
  }

  key = key.toUpperCase().replace(/J/g, "I");
  const keySet = new Set();
  const remainingChars = Array.from(alphabet);

  keyMatrix = [];

  for (let i = 0; i < 5; i++) {
    keyMatrix[i] = [];
    for (let j = 0; j < 5; j++) {
      if (key.length > 0) {
        const char = key[0];
        key = key.substring(1);

        // Skip huruf yang sama dalam kunci
        if (!keySet.has(char)) {
          keyMatrix[i][j] = char;
          keySet.add(char);
        } else {
          j--; // Fill in the current column to fill in the blank space
        }
      } else {
        // After finishing the key, fill in the blank spaces with the rest of the alphabets
        while (remainingChars.length > 0) {
          const char = remainingChars.shift();
          if (!keySet.has(char)) {
            keyMatrix[i][j] = char;
            keySet.add(char);
            break;
          }
        }
      }
    }
  }

  // Display Playfair Square on the table
  const table = document.getElementById("playfair-square");
  table.innerHTML = ""; // Clear existing content

  for (let i = 0; i < 5; i++) {
    const row = table.insertRow();
    for (let j = 0; j < 5; j++) {
      const cell = row.insertCell();
      const char = keyMatrix[i][j];
      cell.textContent = char ? char : ""; // Set to null when there is no character present
    }
  }
}

function findPosition(char) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (keyMatrix[i] && keyMatrix[i][j] === char) {
        return { row: i, col: j };
      }
    }
  }
  return { row: -1, col: -1 };
}

function encrypt() {
  const key = document.getElementById("key").value;
  let inputText = document.getElementById("inputText").value.toUpperCase().replace(/J/g, "I");

  // Filter out character input: A-Z only
  inputText = inputText.replace(/[^A-Z]/g, "");

  const keyWarning = generateKeyMatrix(key);

  if (keyWarning) {
    alert(keyWarning);
    return;
  }

  let outputText = "";

  for (let i = 0; i < inputText.length; i += 2) {
    let pair1 = inputText[i];
    let pair2 = i + 1 < inputText.length ? inputText[i + 1] : "X";

    if (pair1 === pair2) {
      pair2 = "X";
      i--;
    }

    const pos1 = findPosition(pair1);
    const pos2 = findPosition(pair2);

    if (pos1.row === pos2.row) {
      outputText += keyMatrix[pos1.row][(pos1.col + 1) % 5];
      outputText += keyMatrix[pos2.row][(pos2.col + 1) % 5];
    } else if (pos1.col === pos2.col) {
      outputText += keyMatrix[(pos1.row + 1) % 5][pos1.col];
      outputText += keyMatrix[(pos2.row + 1) % 5][pos2.col];
    } else {
      outputText += keyMatrix[pos1.row][pos2.col];
      outputText += keyMatrix[pos2.row][pos1.col];
    }
  }

  document.getElementById("outputText").value = outputText;
}

function decrypt() {
  const key = document.getElementById("key").value;
  let inputText = document.getElementById("inputText").value.toUpperCase().replace(/J/g, "I");

  // Filter out character input: A-Z only
  inputText = inputText.replace(/[^A-Z]/g, "");

  const keyWarning = generateKeyMatrix(key);

  if (keyWarning) {
    alert(keyWarning);
    return;
  }

  // Ensure the length of input for decryption is even
  if (inputText.length % 2 !== 0) {
    alert("For decryption, the number of characters to decrypt must be even.");
    return;
  }

  let outputText = "";

  for (let i = 0; i < inputText.length; i += 2) {
    const pair1 = inputText[i];
    const pair2 = inputText[i + 1];

    const pos1 = findPosition(pair1);
    const pos2 = findPosition(pair2);

    if (pos1.row === pos2.row) {
      outputText += keyMatrix[pos1.row][(pos1.col - 1 + 5) % 5];
      outputText += keyMatrix[pos2.row][(pos2.col - 1 + 5) % 5];
    } else if (pos1.col === pos2.col) {
      outputText += keyMatrix[(pos1.row - 1 + 5) % 5][pos1.col];
      outputText += keyMatrix[(pos2.row - 1 + 5) % 5][pos2.col];
    } else {
      outputText += keyMatrix[pos1.row][pos2.col];
      outputText += keyMatrix[pos2.row][pos1.col];
    }
  }

  document.getElementById("outputText").value = outputText;
}
