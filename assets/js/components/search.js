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
export function search(myInput) {
   document.querySelector("#search-results").innerHTML = '';
   document.querySelector("#pagination-btns").classList.add('d-none');
   document.querySelector("#no-result-error").classList.add('d-none');
   if (!myInput) { return; }
   document.querySelector("#loading-spinner").classList.remove('d-none');
   document.querySelector("input#search-input").setAttribute("previous-search", myInput);

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
            cardDiv.setAttribute('tabindex', '0');
            cardDiv.id = `${showData.id}`;
            cardDiv.classList.add('card', 'bg-body-tertiary', 'justify-content-center', 'h-100', 'shadow-lg', 'border-0', 'cursor-pointer');
            cardDiv.setAttribute('role', 'button');
            colDiv.appendChild(cardDiv);

            if (showData.poster_path) {
               const img = document.createElement('img');
               img.classList.add('card-img');
               img.src = `https://image.tmdb.org/t/p/w500${showData.poster_path}`;
               img.alt = showData.title || showData.name || showData.original_title || showData.original_name;

               if (searchSettings.infoOnCover) {
                  const overlayDiv = document.createElement('div');
                  overlayDiv.classList.add('position-absolute', 'top-0', 'start-0', 'end-0', 'bottom-0', 'd-flex', 'align-items-center', 'justify-content-center', 'text-white');
                  overlayDiv.style.background = 'rgba(0, 0, 0, 0.5)';
                  overlayDiv.style.backdropFilter = 'blur(3px)';

                  const textDiv = document.createElement('div');
                  textDiv.classList.add('d-flex', 'flex-column', 'align-items-center', 'p-2');

                  const titleText = document.createElement('div');
                  titleText.classList.add('fw-bold', 'fs-5', 'pb-1');
                  titleText.textContent = showData.title || showData.name || showData.original_title || showData.original_name;
                  textDiv.appendChild(titleText);

                  const yearText = document.createElement('div');
                  yearText.classList.add('fs-6', 'text-muted', 'pb-1');
                  yearText.textContent = convertDate(showData.release_date || showData.first_air_date);
                  textDiv.appendChild(yearText);

                  const OverviewText = document.createElement('div');
                  OverviewText.classList.add('fs-6', 'text-muted');
                  if (showData.overview) {
                     OverviewText.textContent = `${showData.overview.substring(0, 150)} ...`;
                  } else {
                     OverviewText.textContent = 'No overview available';
                  }
                  textDiv.appendChild(OverviewText);

                  const ShowMoreText = document.createElement('div');
                  ShowMoreText.classList.add('fs-6', 'text-muted', 'fw-bold', 'pt-1');
                  ShowMoreText.textContent = 'Click to see more';
                  textDiv.appendChild(ShowMoreText);

                  overlayDiv.appendChild(textDiv);

                  cardDiv.appendChild(overlayDiv);

                  const overlayContainer = document.createElement('div');
                  overlayContainer.classList.add('position-relative', 'text-center');

                  overlayContainer.appendChild(img);
                  overlayContainer.appendChild(overlayDiv);
                  cardDiv.appendChild(overlayContainer);
               } else {
                  cardDiv.appendChild(img);
               }
            } else {
               const fillerImgDiv = document.createElement('div');
               fillerImgDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'text-center');

               const img = document.createElement('img');
               img.classList.add('card-img');
               img.src = 'assets/images/FillerImage.webp';
               img.alt = showData.title || showData.name || showData.original_title || showData.original_name;
               fillerImgDiv.appendChild(img);

               const fillerImgText = document.createElement('div');
               fillerImgText.classList.add('position-absolute', 'p-2');

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
               showInfo();
            });

            cardDiv.addEventListener('keypress', (event) => {
               if (event.key === 'Enter' || event.key === ' ') {
                  showInfo();
               }
            });

            function showInfo() {
               document.querySelector("#showData").setAttribute("target-card-id", showData.id);
               document.querySelector("#show-title").textContent = showData.title || showData.name || showData.original_title || showData.original_name;
               document.querySelector("#show-release-date").textContent = convertDate(showData.release_date || showData.first_air_date);
               document.querySelector("#show-description").textContent = showData.overview || 'No overview available';

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
                     document.querySelector("#show-genres").textContent = genres.join(", ") || 'No genres available';
                  })
                  .catch(error => {
                     console.error("Error fetching genres:", error);
                  });

               document.querySelector("#show-rating").textContent = parseFloat(showData.vote_average).toFixed(1) || 'No rating available';

               const similarShowsContainer = document.querySelector("#similar-shows");
               const swiperWrapper = similarShowsContainer.querySelector('.swiper-wrapper');
               swiperWrapper.innerHTML = '';
               fetch(`https://api.themoviedb.org/3/tv/${showData.id}/similar?page=1`, fetchSettings)
                  .then(res => {
                     if (!res.ok) {
                        return Promise.resolve([]);
                     } else {
                        return res.json();
                     }
                  })
                  .then(similarData => {
                     const similarShows = similarData.results;
                     const similarShowsContainer = document.querySelector("#similar-shows");
                     if (similarData.results && similarData.results.length > 0) {
                        similarShowsContainer.classList.remove('d-none');
                        let slidesHTML = '';
                        similarShows.forEach(show => {
                           slidesHTML += `
                              <div tabindex="0" id="${show.id}" class="justify-content-center h-100 border-0 swiper-slide mt-auto mb-auto">
                                 <img class="card-img rounded" src="https://image.tmdb.org/t/p/w400${show.poster_path}" alt="${show.title || show.name}">
                              </div>
                           `;
                        });
                        swiperWrapper.innerHTML = slidesHTML;
                     } else {
                        similarShowsContainer.classList.add('d-none');
                     }
                  })
                  .catch(error => {
                     console.error("Error fetching similar shows:", error);
                  });

               const whereToWatchDiv = document.querySelector("#where-to-watch");
               whereToWatchDiv.classList.add("d-none");

               const buyTab = document.querySelector("#buy-tab");
               buyTab.classList.add("d-none");
               buyTab.classList.add("disabled");
               const buyOutputDiv = document.querySelector("#buy-output");
               buyOutputDiv.innerHTML = '';

               const rentTab = document.querySelector("#rent-tab");
               rentTab.classList.add("d-none");
               rentTab.classList.add("disabled");
               const rentOutputDiv = document.querySelector("#rent-output");
               rentOutputDiv.innerHTML = '';

               const streamTab = document.querySelector("#stream-tab");
               streamTab.classList.add("d-none");
               streamTab.classList.add("disabled");
               const streamOutputDiv = document.querySelector("#stream-output");
               streamOutputDiv.innerHTML = '';

               const freeStreamTab = document.querySelector("#free-stream-tab");
               freeStreamTab.classList.add("d-none");
               freeStreamTab.classList.add("disabled");
               const freeStreamOutputDiv = document.querySelector("#free-stream-output");
               freeStreamOutputDiv.innerHTML = '';

               fetch(searchSettings.movieOrTv == 0 ? `https://api.themoviedb.org/3/movie/${showData.id}/watch/providers` : `https://api.themoviedb.org/3/tv/${showData.id}/watch/providers`, fetchSettings)
                  .then(res => {
                     if (!res.ok) { throw new Error('Network response was not ok'); }
                     else { return res.json(); }
                  })
                  .then(providerData => {
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
                           buyTab.classList.remove("disabled");
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
                           rentTab.classList.remove("disabled");
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
                           streamTab.classList.remove("disabled");
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
                           freeStreamTab.classList.remove("disabled");
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
                  })
                  .catch(err => console.error('error fetching where to watch data:' + err));

               $("#showData").modal("show");
            }
            searchResults.appendChild(colDiv);
         });

         if (searchData.results.length == 0 && document.querySelector("#no-result-error").classList.contains('d-none')) {
            document.querySelector("#no-result-error").classList.remove('d-none');
         }

         document.querySelector("#loading-spinner").classList.add('d-none');

      }).catch(err => console.error('error:' + err));
}
window.search = search;