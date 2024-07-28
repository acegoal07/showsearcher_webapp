class SearchSettings {
   constructor() {
      this.page = 1;
      this.maxPage = 1;
      this.adultContent = false;
      this.region = 'GB';
      this.movieOrTv = 0;
   }
}
const searchSettings = new SearchSettings();

const tabTriggerList = {
   buy: null,
   rent: null,
   stream: null,
   freeStream: null
}

const fetchSettings = {
   method: 'GET',
   headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Yzk4MTAxNjk0OTQ2MmE4NmJlNTA2NTc2Yjg1ZjZlNCIsInN1YiI6IjY2MjFkMDY1Y2NkZTA0MDE4ODA2NDA4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xUExDZr1UbIizmXNPNqotICIYYKTQfRltq2uIgq9qjI'
   }
}

// Add event listener to the load event
window.addEventListener('load', function () {
   const myInput = document.querySelector("#search-input");
   myInput.value = null;
   resetSettings();

   // Add event listener to adult items settings
   document.querySelector("#adult-items-settings").addEventListener('change', () => {
      searchSettings.adultContent = document.querySelector("#adult-items-settings").value;
      search(myInput.value.trim());
   });

   // Add event listener to region settings
   searchSettings.region = getRegion();
   document.querySelector("#region-settings").value = searchSettings.region;
   document.querySelector("#region-settings").addEventListener('change', () => {
      searchSettings.region = document.querySelector("#region-settings").value;
   });

   // Add event listener to reset settings button
   document.querySelector("#reset-settings").addEventListener('click', () => {
      resetSettings();
      search(myInput.value.trim());
   });

   // Add event listener to the search input type
   let typingTimer;
   myInput.addEventListener('keyup', () => {
      clearTimeout(typingTimer);
      searchSettings.page = 1;
      typingTimer = setTimeout(() => search(myInput.value.trim()), 200);
   });

   // Add event listener to switch to movies button
   document.querySelector("#select-movies").addEventListener('click', () => {
      searchSettings.movieOrTv = 0;
      searchSettings.page = 1;
      search(myInput.value);
   });

   // Add event listener to switch to tv shows button
   document.querySelector("#select-tv-shows").addEventListener('click', () => {
      searchSettings.movieOrTv = 1;
      searchSettings.page = 1;
      search(myInput.value);
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

   // Add event listener to where to watch tabs
   const buyTab = document.querySelector("#buy-tab");
   tabTriggerList.buy = new bootstrap.Tab(buyTab);
   buyTab.addEventListener('click', event => {
      event.preventDefault();
      tabTriggerList.buy.show();
   });

   const rentTab = document.querySelector("#rent-tab");
   tabTriggerList.rent = new bootstrap.Tab(rentTab);
   rentTab.addEventListener('click', event => {
      event.preventDefault();
      tabTriggerList.rent.show();
   });

   const streamTab = document.querySelector("#stream-tab");
   tabTriggerList.stream = new bootstrap.Tab(streamTab);
   streamTab.addEventListener('click', event => {
      event.preventDefault();
      tabTriggerList.stream.show();
   });

   const freeStreamTab = document.querySelector("#free-stream-tab");
   tabTriggerList.freeStream = new bootstrap.Tab(freeStreamTab);
   freeStreamTab.addEventListener('click', event => {
      event.preventDefault();
      tabTriggerList.freeStream.show();
   });
});

/**
 * Search's for movies or tv shows depending on the user's input
 * @param {String} myInput The user's search input
 */
function search(myInput) {
   document.querySelector("#search-results").innerHTML = '';
   document.querySelector("#pagination-btns").classList.add('d-none');
   document.querySelector("#no-result-error").classList.add('d-none');
   if (!myInput) { return; }
   document.querySelector("#loading-spinner").classList.remove('d-none');

   fetch(searchSettings.movieOrTv == 0 ? `https://api.themoviedb.org/3/search/movie?query=${myInput}&include_adult=${searchSettings.adultContent}&page=${searchSettings.page}` : `https://api.themoviedb.org/3/search/tv?query=${myInput}&include_adult=${searchSettings.adultContent}&page=${searchSettings.page}`, fetchSettings)
      .then(res => {
         if (!res.ok) { throw new Error('Network response was not ok'); }
         else { return res.json(); }
      })
      .then(searchData => {
         const searchResults = document.querySelector("#search-results");
         searchSettings.maxPage = searchData.total_pages;

         if (searchSettings.maxPage > 1) {
            document.querySelector("#current-page-number").textContent = searchSettings.page;
            document.querySelector("#total-pages-number").textContent = searchSettings.maxPage;
            document.querySelector("#pagination-btns").classList.remove('d-none');
         }

         searchData.results.forEach(showData => {
            const colDiv = document.createElement('div');
            colDiv.classList.add('col');

            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card', 'bg-body-tertiary', 'justify-content-center', 'h-100', 'shadow-lg', 'border-0', 'clickable');
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
               fillerImgTextYear.textContent = convertDate(showData.release_date || showData.first_air_date);
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
               fetch(searchSettings.movieOrTv == 0 ? `https://api.themoviedb.org/3/movie/${showData.id}/watch/providers` : `https://api.themoviedb.org/3/tv/${showData.id}/watch/providers`, fetchSettings)
                  .then(res => {
                     if (!res.ok) { throw new Error('Network response was not ok'); }
                     else { return res.json(); }
                  })
                  .then(providerData => {
                     fetch(searchSettings.movieOrTv == 0 ? `https://api.themoviedb.org/3/genre/movie/list?language=en` : `https://api.themoviedb.org/3/genre/tv/list?language=en`, fetchSettings)
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
                           document.querySelector("#show-release-date").textContent = convertDate(showData.release_date || showData.first_air_date);
                           document.querySelector("#show-description").textContent = showData.overview || 'No overview available';
                           document.querySelector("#show-genres").textContent = genres.join(", ") || 'No genres available';
                           document.querySelector("#show-rating").textContent = parseFloat(showData.vote_average).toFixed(1) || 'No rating available';

                           const whereToWatchDiv = document.querySelector("#where-to-watch");
                           whereToWatchDiv.classList.add("d-none");

                           const buyTab = document.querySelector("#buy-tab");
                           buyTab.classList.add("d-none");
                           const buyOutputDiv = document.querySelector("#buy-output");
                           buyOutputDiv.innerHTML = '';

                           const rentTab = document.querySelector("#rent-tab");
                           rentTab.classList.add("d-none");
                           const rentOutputDiv = document.querySelector("#rent-output");
                           rentOutputDiv.innerHTML = '';

                           const streamTab = document.querySelector("#stream-tab");
                           streamTab.classList.add("d-none");
                           const streamOutputDiv = document.querySelector("#stream-output");
                           streamOutputDiv.innerHTML = '';

                           const freeStreamTab = document.querySelector("#free-stream-tab");
                           freeStreamTab.classList.add("d-none");
                           const freeStreamOutputDiv = document.querySelector("#free-stream-output");
                           freeStreamOutputDiv.innerHTML = '';

                           const regionProviderData = providerData.results[searchSettings.region];
                           if (regionProviderData) {
                              document.querySelector("#region-display").textContent = searchSettings.region;
                              const availableSections = {
                                 buy: false,
                                 rent: false,
                                 stream: false,
                                 freeStream: false
                              }

                              if (regionProviderData.buy) {
                                 for (const provider of regionProviderData.buy) {
                                    const itemContainer = document.createElement('div');
                                    itemContainer.classList.add('bg-dark-subtle', 'p-2', 'rounded-3', 'mt-2', 'text-center');
                                    const name = document.createElement('p');
                                    name.classList.add('m-0', 'fw-bold');
                                    name.textContent = provider.provider_name;
                                    itemContainer.appendChild(name);
                                    buyOutputDiv.appendChild(itemContainer);
                                 }
                                 buyTab.classList.remove("d-none");
                                 availableSections.buy = true;
                              }

                              if (regionProviderData.rent) {
                                 for (const provider of regionProviderData.rent) {
                                    const itemContainer = document.createElement('div');
                                    itemContainer.classList.add('bg-dark-subtle', 'p-2', 'rounded-3', 'mt-2', 'text-center');
                                    const name = document.createElement('p');
                                    name.classList.add('m-0', 'fw-bold');
                                    name.textContent = provider.provider_name;
                                    itemContainer.appendChild(name);
                                    rentOutputDiv.appendChild(itemContainer);
                                 }
                                 rentTab.classList.remove("d-none");
                                 availableSections.rent = true;
                              }

                              if (regionProviderData.flatrate) {
                                 for (const provider of regionProviderData.flatrate) {
                                    const itemContainer = document.createElement('div');
                                    itemContainer.classList.add('bg-dark-subtle', 'p-2', 'rounded-3', 'mt-2', 'text-center');
                                    const name = document.createElement('p');
                                    name.classList.add('m-0', 'fw-bold');
                                    name.textContent = provider.provider_name;
                                    itemContainer.appendChild(name);
                                    streamOutputDiv.appendChild(itemContainer);
                                 }
                                 streamTab.classList.remove("d-none");
                                 availableSections.stream = true;
                              }

                              if (regionProviderData.free) {
                                 for (const provider of regionProviderData.free) {
                                    const itemContainer = document.createElement('div');
                                    itemContainer.classList.add('bg-dark-subtle', 'p-2', 'rounded-3', 'mt-2', 'text-center');
                                    const name = document.createElement('p');
                                    name.classList.add('m-0', 'fw-bold');
                                    name.textContent = provider.provider_name;
                                    itemContainer.appendChild(name);
                                    freeStreamOutputDiv.appendChild(itemContainer);
                                 }
                                 freeStreamTab.classList.remove("d-none");
                                 availableSections.freeStream = true;
                              }

                              if (availableSections.buy) {
                                 tabTriggerList.buy.show();
                              } else if (availableSections.rent) {
                                 tabTriggerList.rent.show();
                              } else if (availableSections.stream) {
                                 tabTriggerList.stream.show();
                              } else if (availableSections.freeStream) {
                                 tabTriggerList.freeStream.show();
                              } else { return; }

                              whereToWatchDiv.classList.remove("d-none");
                           }
                           $("#showData").modal("show");
                        })
                        .catch(err => console.error('error:' + err));
                  })
                  .catch(err => console.error('error:' + err));
            });

            searchResults.appendChild(colDiv);
         });

         if (searchData.results.length == 0 && document.querySelector("#no-result-error").classList.contains('d-none')) {
            document.querySelector("#no-result-error").classList.remove('d-none');
         }

         document.querySelector("#loading-spinner").classList.add('d-none');

      }).catch(err => console.error('error:' + err));
}
/**
 * Resets the settings to their default values
 */
function resetSettings() {
   searchSettings.adultContent = false;
   document.querySelector("#adult-items-settings").value = false;
   searchSettings.region = getRegion();
   document.querySelector("#region-settings").value = searchSettings.region;
}

/**
 * Returns the region of the user
 * @returns {String} The region of the user
 */
function getRegion() {
   const re = /^(?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wy-z](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i;
   const region = navigator.language;
   if (!re.test(region)) { return 'GB'; }
   return re.exec(region)[5];
}

/**
 * Converts the date to a readable format
 * @param {String} date The date to convert
 * @returns {String} The date in a readable format 
 */
function convertDate(date) {
   const dateObj = new Date(date);
   if (dateObj == 'Invalid Date') { return 'No release date available'; }
   return dateObj.toLocaleDateString(new Intl.DateTimeFormat(navigator.language).resolvedOptions().locale);
}