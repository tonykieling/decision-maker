
$(function() {
  // let count = 0;
  var count = 1;


  // $(".add_options").on('click', function(event) {

  $('.add').click(function() {
      count = count+1;
      $('.block:last').before('<div class="block"><input type="text" name=option'+count+' /><span class="remove">Remove Option</span></div>');

      $("#countoptions").val(count);

  });
  $('.optionBox').on('click','.remove',function() {
     $(this).parent().remove();
     count = count -1;
     $("#countoptions").val(count);
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

