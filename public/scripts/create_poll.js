
$(function() {
  let count = 0;

  $("#send_options").on('click', function(event) {
    count += 1;

    event.preventDefault();
    console.log("create poll button");

    const data = $("#option").val();
    console.log("data: ", data);

    // $("#option").clone(true).val("").appendTo(".options");

    let newItem = $("<div>");

    $(newItem).val(data);
    console.log("newItem: ", newItem);
    $(".options").prepend($(newItem));
    // $(".options").text($("#option").val());
    console.log($(".options"));
    $("#option").val("");

  });
});


// $("#add-item").click(function() {
//   var text = $("#text").val();
//   jQuery.post('http://127.0.0.1:5000/api/v2/item', { text: text } , function(data) {
//       console.log(data);
//       if (data["error"]) {
//           $("#msg").html('Error: ' + data["error"]);
//       }
//       if (data["ok"]) {
//           $("#msg").html('Item ' + data["text"] + ' added');
//       }
//       show_items();

//   });
//  return false;
// });
