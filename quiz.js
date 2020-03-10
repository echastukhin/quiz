//
// quiz.js
//

const readlineSync = require('readline-sync');
const path = require('path');
const fs = require('fs');

const questionsFolderPath = 'files';
const turnsNumber = 5;

play();

function play() {
	let questionFiles = getFilesList();
	checkQuestionFilesAmount(questionFiles.length);
	let questionFileIndex;
	let usedQuestionFileIndices = [];
	let rightAnswerCount = 0;

	printInitialMessage();
	for(let i=0; i<turnsNumber; i++) {
		questionFileIndex = getRandomFileIndex(questionFiles, usedQuestionFileIndices);
		let quizData = getQuizData(questionFiles[questionFileIndex]);
		checkQuizDataLength(quizData, questionFiles[i]);
		if (askQuestion(quizData, i+1)) {
			rightAnswerCount += 1;
		}
	}
	printQuizResult(rightAnswerCount);
}

function getFilesList() {
	let filesList = [];
	fs.readdirSync(questionsFolderPath).forEach(fileName => {
  		filesList.push(fileName);
	});
	return filesList;
}

function checkQuestionFilesAmount(questionFilesAmount) {
	if (questionFilesAmount < turnsNumber) {
		console.log(`[ОШИБКА] Не достаточно файлов с вопросами, чтобы продолжить игру. Для старта необходимо ${turnsNumber} файлов`);
		process.exit(1);
	}
}

function printInitialMessage() {
    console.log('======================================================================');
    console.log('                            Викторина');
    console.log('======================================================================');
}

function getRandomFileIndex(questionFiles, usedQuestionFileIndices) {
	let randomFileIndex = Math.floor(Math.random() * questionFiles.length);
	while(true) {
		if(usedQuestionFileIndices.includes(randomFileIndex)) {
			randomFileIndex  = (randomFileIndex + 1) % questionFiles.length; //Зацикливание индекса в пределах размера доступных элементов массива
		} else {
			usedQuestionFileIndices.push(randomFileIndex);
			break;
		}
	}
	return randomFileIndex;
}

function getQuizData(fileName) {
	let fileContent;
	try {
		fileContent = fs.readFileSync(questionsFolderPath + path.sep + fileName, "utf8");
	} catch (err) {
		console.log(`[ОШИБКА] Не удалось прочитать файл ${fileName}`);
		process.exit(1);
	}
	let quizData = fileContent.split("\n");
	return quizData;
}

function checkQuizDataLength(quizData, fileName) {
	let quizDataLength = quizData.length;
	if(quizDataLength < 3) {
		console.log(`[ОШИБКА] Не достаточно строк в файле ${fileName}`);
		process.exit(1);
	}
}


function askQuestion(quizData, questionIndex) {
	let question = quizData[0];
	let answerIndex = quizData[1];
	let ansverVariants = quizData.slice(2);
	console.log(`\nВопрос №${questionIndex}:`);
	console.log(question);
	
	for(let answer of ansverVariants) {
		console.log(`[${ansverVariants.indexOf(answer) + 1}] ${answer}`);
	}

	let userAnswer = readlineSync.question('Ваш ответ: ');
	let result = false;
	if (userAnswer == answerIndex) {
		result = true;
	}
	return result;
}

function printQuizResult(rightAnswerCount) {
    console.log('======================================================================');
    console.log('                            Викторина завершена');
    console.log('--------------------------------------------------------------------\n');
    console.log(`Результат: правильных ответов: ${rightAnswerCount} из ${turnsNumber}`);
    console.log('======================================================================\n');
}