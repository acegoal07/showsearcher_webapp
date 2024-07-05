class SearchSettings {
   constructor() {
      this.page = 1;
      this.maxPage = 1;
      this.adultContent = false;
      this.movieOrTv = 0;
   }
}
const searchSettings = new SearchSettings();

window.addEventListener('load', function () {
   let typingTimer;
   const myInput = document.querySelector("#search-input");
   myInput.value = null;

   // Add event listener to the search input type
   myInput.addEventListener('keyup', () => {
      clearTimeout(typingTimer);
      searchSettings.page = 1;
      if (myInput.value) {
         typingTimer = setTimeout(() => search(myInput.value.trim()), 200);
      }
   });

   document.querySelector("#select-movies").addEventListener('click', () => {
      searchSettings.movieOrTv = 0;
      searchSettings.page = 1;
      search(myInput.value.trim());
   });

   document.querySelector("#select-tv-shows").addEventListener('click', () => {
      searchSettings.movieOrTv = 1;
      searchSettings.page = 1;
      search(myInput.value.trim());
   });

   // Add event listener to pagination previous button
   document.querySelector("#pagination-back-btn").addEventListener('click', () => {
      if (searchSettings.maxPage == 1) { return; }
      if (searchSettings.page - 1 < 1) {
         searchSettings.page = searchSettings.maxPage;
      } else {
         searchSettings.page--;
      }
      search(myInput.value.trim());
   });

   // Add event listener to pagination next button
   document.querySelector("#pagination-next-btn").addEventListener('click', () => {
      if (searchSettings.maxPage == 1) { return; }
      if (searchSettings.page + 1 > searchSettings.maxPage) {
         searchSettings.page = 1;
      } else {
         searchSettings.page++;
      }
      search(myInput.value.trim());
   });
});

/**
 * Search's for movies or tv shows depending on the user's input
 * @param {String} myInput The user's search input
 */
function search(myInput) {
   document.querySelector("#search-results").innerHTML = '';
   hidePaginationButtons();
   if (!myInput) { return; }

   const options = {
      method: 'GET',
      headers: {
         accept: 'application/json',
         Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Yzk4MTAxNjk0OTQ2MmE4NmJlNTA2NTc2Yjg1ZjZlNCIsInN1YiI6IjY2MjFkMDY1Y2NkZTA0MDE4ODA2NDA4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xUExDZr1UbIizmXNPNqotICIYYKTQfRltq2uIgq9qjI'
      }
   };

   hideNoResultsError();

   fetch(searchSettings.movieOrTv == 0 ? `https://api.themoviedb.org/3/search/movie?query=${myInput}&include_adult=${searchSettings.adultContent}&page=${searchSettings.page}` : `https://api.themoviedb.org/3/search/tv?query=${myInput}&include_adult=${searchSettings.adultContent}&page=${searchSettings.page}`, options)
      .then(res => {
         if (!res.ok) { throw new Error('Network response was not ok'); }
         else { return res.json(); }
      })
      .then(searchData => {
         const searchResults = document.querySelector("#search-results");
         searchSettings.maxPage = searchData.total_pages;

         if (searchSettings.maxPage > 1) {
            showPaginationButtons();
         }

         searchData.results.forEach(showData => {
            const colDiv = document.createElement('div');
            colDiv.classList.add('col');

            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card', 'bg-body-tertiary', 'justify-content-center', 'h-100', 'shadow-lg', 'border-0');
            colDiv.appendChild(cardDiv);

            if (showData.poster_path) {
               const img = document.createElement('img');
               img.classList.add('card-img');
               img.src = `https://image.tmdb.org/t/p/w500${showData.poster_path}`
               img.alt = showData.title || showData.name || showData.original_title || showData.original_name;
               cardDiv.appendChild(img);
            } else {
               const fillerImgDiv = document.createElement('div');
               fillerImgDiv.classList.add('placeholder-card-img');

               const img = document.createElement('img');
               img.classList.add('card-img');
               img.src = 'assets/images/FillerImage.webp';
               img.alt = showData.title || showData.name || showData.original_title || showData.original_name;
               fillerImgDiv.appendChild(img);

               const fillerImgText = document.createElement('div');
               fillerImgText.classList.add('placeholder-card-img-text');

               const fillerImgTextName = document.createElement('div');
               fillerImgTextName.classList.add('fw-bold', 'fs-5', 'pb-1');
               fillerImgTextName.textContent = showData.title || showData.name || showData.original_title || showData.original_name;
               fillerImgText.appendChild(fillerImgTextName);

               const fillerImgTextYear = document.createElement('div');
               fillerImgTextYear.classList.add('fs-6', 'text-muted', 'pb-1');
               fillerImgTextYear.textContent = showData.release_date || showData.first_air_date || 'No release date available';
               fillerImgText.appendChild(fillerImgTextYear);

               const fillerImgTextOverview = document.createElement('div');
               fillerImgTextOverview.classList.add('fs-6', 'text-muted');
               if (showData.overview) {
                  fillerImgTextOverview.textContent = `${showData.overview.substring(0, 150)} ...`;
               } else {
                  fillerImgTextOverview.textContent = 'No overview available';
               }
               fillerImgText.appendChild(fillerImgTextOverview);

               const fillerImgTextShowMore = document.createElement('div');
               fillerImgTextShowMore.classList.add('fs-6', 'text-muted', 'fw-bold', 'pt-1');
               fillerImgTextShowMore.textContent = 'Click to see more';
               fillerImgText.appendChild(fillerImgTextShowMore);

               fillerImgDiv.appendChild(fillerImgText);
               cardDiv.appendChild(fillerImgDiv);
            }

            cardDiv.addEventListener('click', () => {
               fetch(searchSettings.movieOrTv == 0 ? `https://api.themoviedb.org/3/movie/${showData.id}/watch/providers` : `https://api.themoviedb.org/3/tv/${showData.id}/watch/providers`, options)
                  .then(res => {
                     if (!res.ok) { throw new Error('Network response was not ok'); }
                     else { return res.json(); }
                  })
                  .then(providerData => {
                     fetch(searchSettings.movieOrTv == 0 ? `https://api.themoviedb.org/3/genre/movie/list?language=en` : `https://api.themoviedb.org/3/genre/tv/list?language=en`, options)
                        .then(res => {
                           if (!res.ok) { throw new Error('Network response was not ok'); }
                           else { return res.json(); }
                        })
                        .then(genreData => {
                           const genres = [];
                           showData.genre_ids.forEach(genreId => {
                              const returnGenre = genreData.genres.find(e => e.id === genreId);
                              if (returnGenre) {
                                 genres.push(returnGenre.name);
                              }
                           });

                           document.querySelector("#show-title").textContent = showData.title || showData.name || showData.original_title || showData.original_name;
                           document.querySelector("#show-release-date").textContent = showData.release_date || showData.first_air_date || 'No release date available';
                           document.querySelector("#show-description").textContent = showData.overview || 'No overview available';
                           document.querySelector("#show-genres").textContent = genres.join(", ") || 'No genres available';
                           document.querySelector("#show-rating").textContent = parseFloat(showData.vote_average).toFixed(1) || 'No rating available';

                           $("#showData").modal("show");
                        })
                        .catch(err => console.error('error:' + err));
                  })
                  .catch(err => console.error('error:' + err));
            });

            searchResults.appendChild(colDiv);
         });

         if (searchData.results.length == 0 && document.querySelector("#no-result-error").classList.contains('d-none')) {
            showNoResultsError();
         }

      }).catch(err => console.error('error:' + err));
}

/**
 * Shows the no results error message
 */
function showNoResultsError() {
   document.querySelector("#no-result-error").classList.remove('d-none');
}

/**
 * Hides the no results error message
 */
function hideNoResultsError() {
   document.querySelector("#no-result-error").classList.add('d-none');
}

/**
 * Shows the pagination buttons
 */
function showPaginationButtons() {
   document.querySelector("#pagination-btns").classList.remove('d-none');
}

/**
 * Hides the pagination buttons
 */
function hidePaginationButtons() {
   document.querySelector("#pagination-btns").classList.add('d-none');
}