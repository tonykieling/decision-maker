
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
  })

  $('.vote_submit').on('click', function(event) {

// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       console.log("#### app.js");
//       // $("<div>").text(user.name).appendTo($("body"));
//       $("<div>").text(`${user.email} - ${user.password}`).appendTo($("body"));
//     }
//   });;
// });

console.log("APP.js running here");

$(function() {
  $('#vote_sort').sortable();

  $('#vote_submit').on('click', function(event) {
    console.log("11111111111111111111111111111111");
    event.preventDefault();
    let voteArray = [];
    $(li).each(function(index, li) {
      voteArray.push($li)
    });

    console.log("voteArray: ", voteArray);
  });


});
