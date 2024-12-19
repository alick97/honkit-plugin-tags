require(['jquery'], function($) {
function vShow(element, condition) {
    if (condition) {
        $(element).show();
    } else {
        $(element).hide();
    }
}

function handleHide(showOrHide) {
  vShow("#tags-container", showOrHide);
  vShow("#original-search-result", !showOrHide);
} 

$(document).ready(function() {
    handleHide(false);
  $("#tags-link").on("click", function() {
      showOrHide = true;
      handleHide(true)
  });
  $searchInput = $('#book-search-input input');
  $searchInput.on('input', function() {
    handleHide(false)
  });
 });
});
