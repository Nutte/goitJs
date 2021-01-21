// CONTSTANS
const API_KEY = '13120715-c4ae604e5b6e9cdc75efef6da';
const ORIGIN = 'https://pixabay.com';

const OBSERVER_OPTIONS = {
	rootMargin: '-10px',
	threshold: 0.5,
};

const INITIAL_QUERY_TEXT = '';
const INITIAL_PAGE_NUMBER = 1;
const INITIAL_RESULTS_LIST = '';
const NEXT_PAGE_STEP = 1;

// STATE
let PAGE_NUMBER = 1;
let LAZY_LOADING_QUERY_TEXT = '';

// GET DOM ELEMENTS
const searchForm = document.querySelector('#search-form');
const searchResults = document.querySelector('#search-results');

// ADD EVENT LISTENERS
searchForm.addEventListener('submit', handleSearchFormSubmit);

function handleSearchFormSubmit(event) {
	event.preventDefault();

	const inputQueryText = searchForm.elements.query.value;
	const isStartFecth = inputQueryText !== LAZY_LOADING_QUERY_TEXT;

	if (!isStartFecth) return;

	resetListAndState();
	LAZY_LOADING_QUERY_TEXT = inputQueryText;
	onInitFetchAndRenderList(inputQueryText);
}

// SETUP IntersectionObserver API
const observerImage = new IntersectionObserver((entries, observer) => {
	entries.forEach(async (entry) => {
		if (entry.isIntersecting) {
			PAGE_NUMBER += NEXT_PAGE_STEP;
			await onInitFetchAndRenderList(LAZY_LOADING_QUERY_TEXT);
			observer.unobserve(entry.target);
		}
	});
}, OBSERVER_OPTIONS);

function setObserveElement(elements) {
	const lastElement = elements[elements.length - 1];
	observerImage.observe(lastElement);
}

// HELPER FUNCTIONS
function $cel(tag, props = {}, text = '') {
	const elem = document.createElement(tag);
	Object.entries(props).forEach(([key, value]) => (elem[key] = value));
	elem.textContent = text;
	return elem;
}

function createUrl(query, page) {
	const QUERY_STRING = `/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&page=${page}`;
	const URL = `${ORIGIN}${QUERY_STRING}`;
	return URL;
}

function resetListAndState() {
	PAGE_NUMBER = INITIAL_PAGE_NUMBER;
	searchResults.innerHTML = INITIAL_RESULTS_LIST;
	LAZY_LOADING_QUERY_TEXT = INITIAL_QUERY_TEXT;
}

//NETWORK REST SERVICES
async function loadImages(query, page) {
	const URL = createUrl(query, page);
	let response = [];
	try {
		const { hits } = await fetch(URL).then((response) => response.json());
		response = hits;
	} catch (error) {
		console.warn('Error fetch: ', { error });
	}
	return response;
}

//IMAGES LIST CREATING
function createListItem({ id, webformatURL, previewURL, previewWidth, previewHeight, largeImageURL, tags }) {
	const listItem = $cel('li', { className: 'lazy-item' });
	// const imageLink = $cel('a', { href: webformatURL });
	const image = $cel('img', { src: previewURL, alt: tags, width: previewWidth, height: previewHeight });
	listItem.setAttribute('data-id', id);
	listItem.addEventListener('click', () => onOpenModal(largeImageURL));
	image.setAttribute('data-source', largeImageURL);
	// imageLink.appendChild(image);
	listItem.appendChild(image);

	return listItem;
}

function createItemsList(items) {
	const itemsList = [];

	items.forEach((item) => {
		const listItem = createListItem(item);
		itemsList.push(listItem);
	});

	return itemsList;
}

function renderItemsList(items) {
	searchResults.append(...items);
}

// MODAL WINDOW SETUP
function onOpenModal(imgUrl) {
	const targetElement = createModalImage(imgUrl);
	const instance = basicLightbox.create(targetElement, {
		onClose: handleOnCloseModal,
		onShow: handleOnShowModal,
	});
	instance.show();
}

function createModalImage(imgUrl) {
	const modalElement = $cel('div');
	const modalImage = $cel('img');
	modalImage.className = 'modalImage';
	modalImage.src = imgUrl;
	modalElement.appendChild(modalImage);
	return modalElement;
}

function handleOnCloseModal() {
	document.body.style.position = 'relative';
}

function handleOnShowModal() {
	document.body.style.position = 'fixed';
}

//INITIALIZE PROJECT
async function onInitFetchAndRenderList(queryText) {
	const retrievedImages = await loadImages(queryText, PAGE_NUMBER);
	const isHasContents = retrievedImages.length > 0;

	if (!isHasContents) return;

	const imagesList = createItemsList(retrievedImages);
	setObserveElement(imagesList);
	renderItemsList(imagesList);
}
