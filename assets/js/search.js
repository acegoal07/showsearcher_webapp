const fetchSettings = {
   method: 'GET',
   headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Yzk4MTAxNjk0OTQ2MmE4NmJlNTA2NTc2Yjg1ZjZlNCIsInN1YiI6IjY2MjFkMDY1Y2NkZTA0MDE4ODA2NDA4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xUExDZr1UbIizmXNPNqotICIYYKTQfRltq2uIgq9qjI'
   }
}

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