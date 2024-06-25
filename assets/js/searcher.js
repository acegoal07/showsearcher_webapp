window.addEventListener('load', function () {
   let typingTimer;
   const myInput = document.querySelector("#search-input");

   myInput.addEventListener('keyup', () => {
      clearTimeout(typingTimer);
      if (myInput.value) {
         typingTimer = setTimeout(async () => {
            const url = `https://api.themoviedb.org/3/search/multi?query=${myInput.value}&include_adult=false`;
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
                  console.log(json);
                  const searchResults = document.querySelector("#search-results");
                  searchResults.innerHTML = '';
                  json.results.forEach(result => {
                     const colDiv = document.createElement('div');
                     colDiv.classList.add('col');

                     const cardDiv = document.createElement('div');
                     cardDiv.classList.add('card');
                     cardDiv.classList.add('bg-body-tertiary');
                     cardDiv.classList.add('justify-content-center');
                     cardDiv.classList.add('h-100');
                     cardDiv.classList.add('shadow-lg');
                     cardDiv.classList.add('border-0');
                     colDiv.appendChild(cardDiv);

                     if (result.poster_path) {
                        const img = document.createElement('img');
                        img.classList.add('card-img');
                        img.src = `https://image.tmdb.org/t/p/w500${result.poster_path}`
                        img.alt = result.title || result.name || result.original_title || result.original_name;
                        cardDiv.appendChild(img);
                     } else {
                        const header = document.createElement('h5');
                        header.classList.add('text-center');
                        cardDiv.classList.add("p-4")
                        header.textContent = result.title || result.name || result.original_title || result.original_name;
                        cardDiv.appendChild(header);
                     }

                     cardDiv.addEventListener('click', () => {
                        const url = `https://api.themoviedb.org/3/movie/${result.id}/watch/providers`;
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
                              console.log(json);
                              console.log(result);
                           })
                           .catch(err => console.error('error:' + err));
                     });

                     searchResults.appendChild(colDiv);

                  });
               }).catch(err => console.error('error:' + err));
         }, 200);
      }
   });
});