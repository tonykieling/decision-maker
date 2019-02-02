
$(function() {
  // let count = 0;

  // $(".add_options").on('click', function(event) {

  $('.add').click(function() {
      $('.block:last').before('<div class="block"><input type="text" /><span class="remove">Remove Option</span></div>');
  });
  $('.optionBox').on('click','.remove',function() {
     $(this).parent().remove();
  });

    // count += 1;

    // event.preventDefault();
    // console.log("create poll button");

    // const data = $("#option").val();
    // console.log("data: ", data);

    // // $("#option").clone(true).val("").appendTo(".options");

    // let newItem = $("<div>");

    // $(newItem).val(data);
    // console.log("newItem: ", newItem);
    // $(".options").prepend($(newItem));
    // // $(".options").text($("#option").val());
    // console.log($(".options"));
    // $("#option").val("");

});

