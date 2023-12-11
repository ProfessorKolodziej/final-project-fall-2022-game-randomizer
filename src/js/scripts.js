// This is where you should write all JavaScript
// for your project. Remember a few things as you start!
// - Use let or const for all variables
// - Do not use jQuery - use JavaScript instead
// - Do not use onclick - use addEventListener instead
// - Run npm run test regularly to check autograding
// - You'll need to link this file to your HTML :)


document.addEventListener('DOMContentLoaded', function () {
	let plugInButton = document.querySelector(".plug-in-button");

	plugInButton.addEventListener('click', function () {
		changeMainTitle();
		changeBackgroundImage();
		fetchAndDisplayRandomGame();
	});

	function changeMainTitle() {
		let mainTitle = document.getElementById("main-title");
		mainTitle.innerHTML = "New Main Title";
	}

	function changeBackgroundImage() {
		const backgroundDiv = document.querySelector(".background-img");
		const newImage = "images/Game.jpg";
		backgroundDiv.style.backgroundImage = "url('" + newImage + "')";
	}

	function fetchAndDisplayRandomGame() {
		fetchGamesInRange()
			.then(games => {
				const randomIndex = Math.floor(Math.random() * games.length);
				const gameId = games[randomIndex].id;

				// Fetch game info, screenshots, and YouTube video
				Promise.all([fetchGameInfo(gameId), fetchGameScreenshots(gameId), fetchYouTubeLink(games[randomIndex].name)])
					.then(([gameInfo, screenshots, youtubeLink]) => {
						updateGameInfo(gameInfo);
						displayScreenshots(screenshots);
						displayYouTubeLink(youtubeLink);
					})
					.catch(error => {
						console.error('Error fetching game info, screenshots, or YouTube link', error);
					});
			})
			.catch(error => {
				console.error('Error fetching games', error);
			});
	}

	function fetchGamesInRange() {
		const apiKey = '0dbaf15d67754afb9ebd39ec9e27b5f1';
		const startDate = '2015-01-01';
		const endDate = '2023-10-31';
		const tags = 'exclusive';
		const gamesUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=${startDate},${endDate}&ordering=-added&page_size=50&tags=${tags}`;

		return fetch(gamesUrl)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				// Filter the results to include only games with the "exclusive" tag
				const exclusiveGames = data.results.filter(game => game.tags.some(tag => tag.slug === 'exclusive'));

				return exclusiveGames;
			});
	}

	function fetchGameInfo(gameId) {
		const apiKey = '0dbaf15d67754afb9ebd39ec9e27b5f1';
		const gameDetailsUrl = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;

		return fetch(gameDetailsUrl)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			});
	}

	function fetchGameScreenshots(gameId) {
		const apiKey = '0dbaf15d67754afb9ebd39ec9e27b5f1';
		const gameScreenshotsUrl = `https://api.rawg.io/api/games/${gameId}/screenshots?key=${apiKey}`;

		return fetch(gameScreenshotsUrl)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				// Assuming the screenshots are available in the data
				if (data.results && data.results.length > 0) {
					return data.results.map(screenshot => screenshot.image);
				} else {
					return null; // Return null when no screenshots are found
				}
			});
	}

	function fetchYouTubeLink(gameName) {
		// Create a link to YouTube search
		return Promise.resolve(`https://www.youtube.com/results?search_query=${encodeURIComponent(gameName + ' trailer')}`);
	}

	function updateGameInfo(data) {
		let mainTitle = document.getElementById("main-title");
		let paragraph = document.getElementById("paragraph");

		const game = data;
		mainTitle.innerHTML = game.name;
		paragraph.innerHTML = `Release Date: ${game.released}, Rating: ${game.rating}, Description: ${game.description}`;
	}

	function displayScreenshots(screenshots) {
		// Assuming you have an element with id "screenshots-container" to display screenshots
		let screenshotsContainer = document.getElementById("screenshots-container");
		screenshotsContainer.innerHTML = ""; // Clear previous content

		if (screenshots && screenshots.length > 0) {
			// Create an image element for the first screenshot
			let screenshotImage = document.createElement('img');
			screenshotImage.src = screenshots[0];
			screenshotImage.alt = "Game Screenshot";

			// Set the maximum width for the image
			screenshotImage.style.maxWidth = "80%";
			// Set the maximum height for the image
			screenshotImage.style.maxHeight = "200px"; // Adjust the height as needed

			// Append the image to the screenshots container
			screenshotsContainer.appendChild(screenshotImage);
		} else {
			// Display a message or handle the case when no screenshots are found
			console.error('No screenshots found for the game.');
		}
	}

	function displayYouTubeLink(youtubeLink) {
		// Assuming you have an element with id "youtube-link-container" to append the link
		let linkContainer = document.getElementById("youtube-link-container");
		linkContainer.innerHTML = ""; // Clear previous content

		if (youtubeLink) {
			// Create a link to YouTube search
			let youtubeLinkElement = document.createElement('a');
			youtubeLinkElement.href = youtubeLink;
			youtubeLinkElement.target = "_blank"; // Open in a new tab
			youtubeLinkElement.textContent = "Search on YouTube";

			// Append the link to the link container
			linkContainer.appendChild(youtubeLinkElement);
		} else {
			// Display a message or handle the case when no YouTube link is available
			console.error('No YouTube link available for the game.');
		}
	}
});
