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
      .then(res => res.json())
      .then(json => {
         const searchResults = document.querySelector("#search-results");
         searchResults.innerHTML = '';
         console.log(json)
         json.results.forEach(result => {
            if (result.media_type === 'person') { return; }
            const colDiv = document.createElement('div');
            colDiv.classList.add('col');

            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card', 'bg-body-tertiary', 'justify-content-center', 'h-100', 'shadow-lg', 'border-0');
            colDiv.appendChild(cardDiv);

            if (result.poster_path) {
               const img = document.createElement('img');
               img.classList.add('card-img');
               img.src = `https://image.tmdb.org/t/p/w500${result.poster_path}`
               img.alt = result.title || result.name || result.original_title || result.original_name;
               cardDiv.appendChild(img);
            } else {
               const fillerImgDiv = document.createElement('div');
               fillerImgDiv.classList.add('placeholder-card-img');

               const img = document.createElement('img');
               img.classList.add('card-img');
               img.src = 'assets/images/FillerImage.webp';
               img.alt = result.title || result.name || result.original_title || result.original_name;
               fillerImgDiv.appendChild(img);

               const fillerImgText = document.createElement('div');
               fillerImgText.classList.add('placeholder-card-img-text');

               const fillerImgTextName = document.createElement('div');
               fillerImgTextName.classList.add('fw-bold', 'fs-5', 'pb-1');
               fillerImgTextName.textContent = result.title || result.name || result.original_title || result.original_name;
               fillerImgText.appendChild(fillerImgTextName);

               const fillerImgTextYear = document.createElement('div');
               fillerImgTextYear.classList.add('fs-6', 'text-muted', 'pb-1');
               fillerImgTextYear.textContent = result.release_date || result.first_air_date || 'No release date available';
               fillerImgText.appendChild(fillerImgTextYear);

               const fillerImgTextOverview = document.createElement('div');
               fillerImgTextOverview.classList.add('fs-6', 'text-muted');
               if (result.overview) {
                  fillerImgTextOverview.textContent = `${result.overview.substring(0, 150)} ...`;
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
               if (result.media_type === 'movie' || searchSettings.movieOrTv == 1) {
                  url = `https://api.themoviedb.org/3/movie/${result.id}/watch/providers`;
               } else if (result.media_type === 'tv' || searchSettings.movieOrTv == 2) {
                  url = `https://api.themoviedb.org/3/tv/${result.id}/watch/providers`;
               } else { return; }
               const options = {
                  method: 'GET',
                  headers: {
                     accept: 'application/json',
                     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Yzk4MTAxNjk0OTQ2MmE4NmJlNTA2NTc2Yjg1ZjZlNCIsInN1YiI6IjY2MjFkMDY1Y2NkZTA0MDE4ODA2NDA4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xUExDZr1UbIizmXNPNqotICIYYKTQfRltq2uIgq9qjI'
                  }
               };
               fetch(url, options)
                  .then(res => res.json())
                  .then(json => {
                     document.querySelector("#show-title").textContent = result.title || result.name || result.original_title || result.original_name;
                     document.querySelector("#show-release-date").textContent = result.release_date || result.first_air_date || 'No release date available';
                     document.querySelector("#show-description").textContent = result.overview || 'No overview available';
                     document.querySelector("#show-genres").textContent = result.genre_ids || 'No genres available';
                     document.querySelector("#show-rating").textContent = result.vote_average || 'No rating available';

                     console.log(json);
                     console.log(result);

                     $("#showData").modal("show");
                  })
                  .catch(err => console.error('error:' + err));
            });

            searchResults.appendChild(colDiv);
         });
      }).catch(err => console.error('error:' + err));
}