/**
 * Resets the settings to their default values
 */
export function resetSettings() {
   searchSettings.adultContent = false;
   document.querySelector("#adult-items-settings").value = false;
   searchSettings.region = getRegion();
   document.querySelector("#region-settings").value = searchSettings.region;
   document.querySelector("#showData").setAttribute("data-region", searchSettings.region);
   searchSettings.infoOnCover = false;
   document.querySelector("#info-on-cover").value = false;
}
window.resetSettings = resetSettings;

/**
 * Returns the region of the user
 * @returns {String} The region of the user
 */
export function getRegion() {
   const re = /^(?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wy-z](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i;
   const region = navigator.language;
   if (!re.test(region)) { return 'GB'; }
   return re.exec(region)[5];
}
window.getRegion = getRegion;

/**
 * Converts the date to a readable format
 * @param {String} date The date to convert
 * @returns {String} The date in a readable format
 */
export function convertDate(date) {
   const dateObj = new Date(date);
   if (dateObj == 'Invalid Date') { return 'No release date available'; }
   return dateObj.toLocaleDateString(new Intl.DateTimeFormat(navigator.language).resolvedOptions().locale);
}
window.convertDate = convertDate;