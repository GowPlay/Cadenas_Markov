document.getElementById('markov-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const cantUsuarios = parseInt(document.getElementById('cant_usuarios').value);
    const matrizTrancision = calcularMatriz(cantUsuarios);
    mostrarMatriz(matrizTrancision);
    mostrarGrafico(matrizTrancision);
});

function disBinomial(n, x, p) {
    const combinatoria = factorial(n) / (factorial(x) * factorial(n - x));
    const probabilidadBinomial = Math.pow(p, x) * Math.pow(1 - p, n - x);
    return combinatoria * probabilidadBinomial;
}

function factorial(num) {
    if (num <= 1) return 1;
    return num * factorial(num - 1);
}

function calcularMatriz(cantU) {
    const pConectarse = 0.4;
    const pDesconectarse = 0.3;
    const matrizTrancision = Array.from({ length: cantU + 1 }, () => Array(cantU + 1).fill(0));

    for (let i = 0; i <= cantU; i++) {
        for (let j = 0; j <= cantU; j++) {
            let probabilidad = 0;
            const nConectados = cantU - i;
            const nDesconectados = i;

            if (i === 0) {
                probabilidad = disBinomial(cantU, j, pConectarse);
            } else if (i === cantU) {
                probabilidad = disBinomial(cantU, i - j, pDesconectarse);
            } else if (j >= i) {
                let Xconectados = j - i;
                let Xdesconectados = 0;

                while (Xconectados <= nConectados && Xdesconectados <= nDesconectados) {
                    probabilidad += disBinomial(nConectados, Xconectados, pConectarse) * disBinomial(nDesconectados, Xdesconectados, pDesconectarse);
                    Xconectados++;
                    Xdesconectados++;
                }
            } else {
                let Xconectados = 0;
                let Xdesconectados = i - j;

                while (Xconectados <= nConectados && Xdesconectados <= nDesconectados) {
                    probabilidad += disBinomial(nConectados, Xconectados, pConectarse) * disBinomial(nDesconectados, Xdesconectados, pDesconectarse);
                    Xconectados++;
                    Xdesconectados++;
                }
            }

            matrizTrancision[i][j] = parseFloat(probabilidad.toFixed(3));
        }
    }

    return matrizTrancision;
}

function mostrarMatriz(matrizTrancision) {
    const resultMatrix = document.getElementById('result-matrix');
    resultMatrix.innerHTML = '';

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th></th>' + matrizTrancision[0].map((_, index) => `<th>${index}</th>`).join('');
    resultMatrix.appendChild(headerRow);

    matrizTrancision.forEach((row, i) => {
        const rowElement = document.createElement('tr');
        rowElement.innerHTML = `<th>${i}</th>` + row.map(value => `<td>${value}</td>`).join('');
        resultMatrix.appendChild(rowElement);
    });
}

function mostrarGrafico(matrizTrancision) {
    const canvas = document.getElementById('result-chart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cellWidth = width / matrizTrancision.length;
    const cellHeight = height / matrizTrancision.length;

    for (let i = 0; i < matrizTrancision.length; i++) {
        for (let j = 0; j < matrizTrancision[i].length; j++) {
            const value = matrizTrancision[i][j];
            const colorValue = Math.floor((1 - value) * 255);
            ctx.fillStyle = `rgb(${colorValue}, ${colorValue}, ${255})`;
            ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
            ctx.strokeRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        }
    }
}