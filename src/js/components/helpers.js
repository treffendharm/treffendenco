// helpers.js

function splitText(elements) {
	const elementsArray = Array.isArray(elements) ? elements : [elements];

	elementsArray.forEach((element) => {
		const words = element.innerHTML.split(" ");
		element.innerHTML = "";
		element.classList.add("split-text");

		words.forEach((word) => {
			const wordWrapper = document.createElement("span");
			wordWrapper.classList.add("word");

			[...word].forEach((letter) => {
				const charWrapper = document.createElement("div");
				charWrapper.classList.add("char");
				charWrapper.textContent = letter;
				wordWrapper.appendChild(charWrapper);
			});

			element.appendChild(wordWrapper);
		});
	});
}

window.splitText = splitText;
export default splitText;
