class SearchSettings {
   constructor() {
      this.page = 1;
      this.adultContent = false;
      this.movieOrTv = "0";
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
      if (myInput.value) {
         typingTimer = setTimeout(() => search(myInput.value.trim()), 200);
      }
   });

   // Add event listener to adult items settings
   searchSettings.adultContent = document.querySelector("#adult-items-settings").value;
   document.querySelector("#adult-items-settings").addEventListener('change', () => {
      searchSettings.adultContent = document.querySelector("#adult-items-settings").value;
      search(myInput.value.trim());
   });

   // Add event listener to movie or tv settings
   searchSettings.movieOrTv = document.querySelector("#movie-or-tv-settings").value;
   document.querySelector("#movie-or-tv-settings").addEventListener('change', () => {
      searchSettings.movieOrTv = document.querySelector("#movie-or-tv-settings").value;
      search(myInput.value.trim());
   });
});

/**
 * Search's for movies or tv shows depending on the user's input
 * @param {String} myInput The user's search input
 */
function search(myInput) {
   let url;
   if (searchSettings.movieOrTv == 1) {
      url = `https://api.themoviedb.org/3/search/movie?query=${myInput}&include_adult=${searchSettings.adultContent}&page=${searchSettings.page}`;
   } else if (searchSettings.movieOrTv == 2) {
      url = `https://api.themoviedb.org/3/search/tv?query=${myInput}&include_adult=${searchSettings.adultContent}&page=${searchSettings.page}`;
   } else {
      url = `https://api.themoviedb.org/3/search/multi?query=${myInput}&include_adult=${searchSettings.adultContent}&page=${searchSettings.page}`;
   }
   const options = {
      method: 'GET',
      headers: {
         accept: 'application/json',
         Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Yzk4MTAxNjk0OTQ2MmE4NmJlNTA2NTc2Yjg1ZjZlNCIsInN1YiI6IjY2MjFkMDY1Y2NkZTA0MDE4ODA2NDA4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xUExDZr1UbIizmXNPNqotICIYYKTQfRltq2uIgq9qjI'
      }
   };
   fetch(url, options)
      .then(res => {
         if (!res.ok) {
            throw new Error('Network response was not ok');
         } else {
            return res.json();
         }
      })
      .then(searchData => {
         const searchResults = document.querySelector("#search-results");
         searchResults.innerHTML = '';
         // console.log(searchData);
         searchData.results.forEach(showData => {
            if (showData.media_type === 'person') { return; }
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
               let url;
               if (showData.media_type === 'movie' || searchSettings.movieOrTv == 1) {
                  url = `https://api.themoviedb.org/3/movie/${showData.id}/watch/providers`;
               } else if (showData.media_type === 'tv' || searchSettings.movieOrTv == 2) {
                  url = `https://api.themoviedb.org/3/tv/${showData.id}/watch/providers`;
               } else { return; }
               fetch(url, options)
                  .then(res => {
                     if (!res.ok) {
                        throw new Error('Network response was not ok');
                     } else {
                        return res.json();
                     }
                  })
                  .then(providerData => {
                     let url;
                     if (showData.media_type === 'movie' || searchSettings.movieOrTv == 1) {
                        url = `https://api.themoviedb.org/3/genre/movie/list?language=en`;
                     } else if (showData.media_type === 'tv' || searchSettings.movieOrTv == 2) {
                        url = `https://api.themoviedb.org/3/genre/tv/list?language=en`;
                     } else { return; }
                     fetch(url, options)
                        .then(res => {
                           if (!res.ok) {
                              throw new Error('Network response was not ok');
                           } else {
                              return res.json();
                           }
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
                           document.querySelector("#show-rating").textContent = showData.vote_average || 'No rating available';

                           // console.log(providerData);
                           // console.log(showData);

                           $("#showData").modal("show");
                        })
                        .catch(err => console.error('error:' + err));
                  })
                  .catch(err => console.error('error:' + err));
            });
            searchResults.appendChild(colDiv);
         });
      }).catch(err => console.error('error:' + err));
}