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

   // Add event listener to switch show type buttons
   document.querySelectorAll("#show-type-switch a").forEach(button => {
      button.addEventListener('click', () => {
         const showType = button.getAttribute('show-type') == 'movies' ? 0 : 1;
         if (searchSettings.movieOrTv == showType) { return; }
         searchSettings.movieOrTv = showType;
         search(myInput.value.trim());
      });
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
   document.querySelectorAll("#where-to-watch-tabs a").forEach(tab => {
      const target = tab.getAttribute('target');
      switch (target) {
         case 'buy':
            tabTriggerList.buy = new bootstrap.Tab(tab);
            document.querySelector("#buy-tab").addEventListener('click', event => {
               event.preventDefault();
               tabTriggerList.buy.show();
            });
            break;
         case 'rent':
            tabTriggerList.rent = new bootstrap.Tab(tab);
            document.querySelector("#rent-tab").addEventListener('click', event => {
               event.preventDefault();
               tabTriggerList.rent.show();
            });
            break;
         case 'stream':
            tabTriggerList.stream = new bootstrap.Tab(tab);
            document.querySelector("#stream-tab").addEventListener('click', event => {
               event.preventDefault();
               tabTriggerList.stream.show();
            });
            break;
         case 'freeStream':
            tabTriggerList.freeStream = new bootstrap.Tab(tab);
            document.querySelector("#free-stream-tab").addEventListener('click', event => {
               event.preventDefault();
               tabTriggerList.freeStream.show();
            });
            break;
         default:
            break;
      }
   })
});