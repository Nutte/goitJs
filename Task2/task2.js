const userInput = document.querySelector('.js-input');
const boxesContainer = document.querySelector('#boxes');
const createBoxButton = document.querySelector('[data-action="create"]');
const destroyButton = document.querySelector('[data-action="destroy"]');

createBoxButton.addEventListener('click', createBoxes);
destroyButton.addEventListener('click', destroyBoxes);

function $cel(tag, props = {}, text = '') {
	const elem = document.createElement(tag);
	Object.entries(props).forEach(([key, value]) => (elem[key] = value));
	elem.textContent = text;
	return elem;
}

function getRandomColor() {
	const color = () => Math.floor(Math.random() * 255);
	const rgb = `rgb(${color()}, ${color()}, ${color()}`;
	return rgb;
}

function createBoxes() {
	const inputAmount = userInput.valueAsNumber;

	if (isNaN(inputAmount)) return null;

	const boxes = createBoxesElemenets(inputAmount);

	boxesContainer.append(...boxes);
}

function createBoxesElemenets(boxesNumber) {
	const boxes = [];

	const startFromNumberElement = 1;
	const initialSize = 30;
	const increaseSize = 10;
	const stepCount = 1;

	for (let i = startFromNumberElement, size = initialSize; i <= boxesNumber; i += stepCount, size += increaseSize) {
		const item = $cel('div', { className: 'box' });
		item.style.width = `${size}px`;
		item.style.height = `${size}px`;
		item.style.background = getRandomColor();

		boxes.push(item);
	}

	return boxes;
}

function destroyBoxes() {
	boxesContainer.innerHTML = '';
}
