class SearchSettings {
   constructor() {
      this.page = 1;
      this.maxPage = 1;
      this.adultContent = false;
      this.region = 'GB';
      this.language = 'EN';
      this.movieOrTv = 0;
      this.infoOnCover = false;
   }
}

export const searchSettings = new SearchSettings();
globalThis.searchSettings = searchSettings;

export const tabTriggerList = {
   buy: null,
   rent: null,
   stream: null,
   freeStream: null
};
globalThis.tabTriggerList = tabTriggerList;

// Add event listener to the load event
window.addEventListener('load', function () {
   searchSettings.language = this.navigator.language.split('-')[0].toUpperCase() || 'EN';
   const myInput = document.querySelector("#search-input");
   myInput.value = null;
   resetSettings();

   // Add event listener to adult items settings
   document.querySelector("#adult-items-settings").addEventListener('change', () => {
      searchSettings.adultContent = document.querySelector("#adult-items-settings").value === "true";
      search(myInput.value.trim());
   });

   // Add event listener to region settings
   searchSettings.region = getRegion();
   document.querySelector("#region-settings").value = searchSettings.region;
   document.querySelector("#region-settings").addEventListener('change', () => {
      searchSettings.region = document.querySelector("#region-settings").value;
      search(myInput.value.trim());
   });

   // Add event listener to info on cover settings
   document.querySelector("#info-on-cover").addEventListener('change', () => {
      searchSettings.infoOnCover = document.querySelector("#info-on-cover").value === "true";
      for (const child of Array.from(document.querySelector("#search-results").children)) {
         const item = child.querySelector(".overlay-background");
         if (child.querySelector("img").src.includes('FillerImage.webp')) { return; }
         if (searchSettings.infoOnCover) {
            item.classList.remove("d-none");
         } else {
            item.classList.add("d-none");
         }
      }
      for (const slide of Array.from(document.querySelectorAll(".swiper-slide"))) {
         const item = slide.querySelector(".overlay-background");
         if (slide.querySelector("img").src.includes('FillerImage.webp')) { return; }
         if (searchSettings.infoOnCover) {
            item.classList.remove("d-none");
         } else {
            item.classList.add("d-none");
         }
      }
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
      if (myInput.value.trim() === document.querySelector("input#search-input").getAttribute("previous-search")) { return; }
      searchSettings.page = 1;
      typingTimer = setTimeout(() => search(myInput.value.trim()), 200);
   });

   // Add event listener to switch show type buttons and keyboard navigation
   const showTypeButtons = document.querySelectorAll("#show-type-switch button");
   for (const [idx, button] of showTypeButtons.entries()) {
      button.addEventListener('click', () => {
         updateShowTypeTab(button, idx);
      });
      for (const [idx, button] of showTypeButtons.entries()) {
         button.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
               const nextIdx = idx === 0 ? 1 : 0;
               updateShowTypeTab(button, nextIdx);
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
               const prevIdx = idx === 0 ? 1 : 0;
               updateShowTypeTab(button, prevIdx);
            }
         });
      }
   }

   function updateShowTypeTab(button, activeIdx) {
      console.log(button);
      if (button.idx === activeIdx && button.classList.contains('active')) { return; }
      const showType = showTypeButtons[activeIdx].getAttribute('show-type') == 'movies' ? 0 : 1;
      if (searchSettings.movieOrTv == showType) { return; }
      searchSettings.movieOrTv = showType;
      search(myInput.value.trim());
   }

   // Add event listener to pagination previous button
   document.querySelector("#pagination-back-btn").addEventListener('click', () => {
      if (searchSettings.maxPage == 1) { return; }
      if (searchSettings.page - 1 < 1) {
         searchSettings.page = searchSettings.maxPage;
      } else {
         searchSettings.page--;
      }
      document.querySelector("input#search-input").focus();
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
      document.querySelector("input#search-input").focus();
      search(myInput.value.trim());
   });

   // Add event listener to where to watch tabs
   const whereTabs = document.querySelectorAll("#where-to-watch-tabs a");
   for (const tab of whereTabs) {
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
   }

   // Ensure tabindex=0 is always set after tab change (Bootstrap may remove it)
   document.getElementById('where-to-watch-tabs').addEventListener('shown.bs.tab', function () {
      for (const tab of whereTabs) { if (tab.classList.contains('active')) { tab.setAttribute('tabindex', '0'); } }
   });

   // Add event listener to search settings modal close
   document.getElementById('searchSettings').addEventListener('hidden.bs.modal', () => {
      document.querySelector("button#search-settings-btn").focus();
   });

   // Initialize Swiper for similar shows
   const swiper = new Swiper('.swiper', {
      slidesPerView: 1,
      breakpoints: {
         768: {
            slidesPerView: 2,
            spaceBetween: 20
         },
         1024: {
            slidesPerView: 3,
            spaceBetween: 30
         }
      },
      spaceBetween: 30,
      slidesPerGroup: 1,
      loop: false,
      navigation: {
         nextEl: '.swiper-button-next',
         prevEl: '.swiper-button-prev'
      },
      pagination: {
         el: ".swiper-pagination",
         clickable: true
      },
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      coverflowEffect: {
         rotate: 50,
         stretch: 0,
         depth: 100,
         modifier: 1,
         slideShadows: true
      }
   });

   // Add event listener to when show data modal is closed
   document.querySelector("#showData").addEventListener('hidden.bs.modal', () => {
      swiper.setProgress(0, 0);
      document.getElementById(document.querySelector("#showData").getAttribute("target-card-id")).focus();
   });
});