$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      console.log("#### app.js");
      // $("<div>").text(user.name).appendTo($("body"));
      $("<div>").text(`${user.email} - ${user.password}`).appendTo($("body"));
    }
  });;
});
