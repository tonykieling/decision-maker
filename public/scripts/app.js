$(() => {
  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done((users) => {
  //   for(user of users) {
  //     console.log("#### app.js");
  //     // $("<div>").text(user.name).appendTo($("body"));
  //     $("<div>").text(`${user.email} - ${user.password}`).appendTo($("body"));
  //   }s
  // });
  $(function() {
    $('.vote_sort').sortable();
  });
  $('.vote_submit').on('click', function(event) {
    event.preventDefault();
    let voteArray = [];
    $('.ranked_item').each(function(index, value) {
      voteArray.push$('.ranked_item');
    });
  });
});
