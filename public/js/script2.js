$( document ).ready(function() {
  $('#home .fa-eye').hide();
});
$('#home .pwd').click(function(){
  $('#home .fa-eye').show();
});
$("#home .fa-eye").click(function() {
  $(this).toggleClass("fa-eye fa-eye-slash");
  // var input = $($(this).attr("toggle"));
  var input = $('#home .pwd');
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});


var emailInput;
 $("#home .valid").hide(); 

 $("#email").on("change", function() {
   emailInput = $(this).val();
 
   if (validateEmail(emailInput)) {
     $("#home .valid").hide(); 
     $(this).css({
       color: "#595959",
       border: "none"
     });
   } else {
     $("#home .valid").show(); 
     $(this).css({
       color: "red",
       border: "2px solid red"
     });
 
     // alert("not a valid email address");
   }
 });
$("#home #submitBtn").on("click", function(e) {
    // $('.val-pass').hide();
 
    // e.preventDefault();
    if (validateEmail(emailInput)) {
      return true;
    } else {
      return false;
    }
  });

  function validateEmail(email) {
    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  
    return $.trim(email).match(pattern) ? true : false;
  }

  $(document).ready(function() {
    $(".switchBtn").click(function() {
        $("body,.box,.action").toggleClass("dark-mode") 
        $(".field input").toggleClass("dark-mode-button") 
        $(".switchBtn").toggleClass("switchBtn2") 
    });
 });
//   var rno;
//   $(".validrno").hide(); 
 
//   $("#rno").on("change", function() {
//     rno = $(this).val();
//     // alert(rno[0])
//     // alert(rno)
//     if (validateRno(rno)) {
//       $(".validrno").hide(); 
//       $(this).css({
//         color: "#595959",
//         border: "none"
//       });
//     } else {
//       $(".validrno").show(); 
//       $(this).css({
//         color: "red",
//         border: "2px solid red"
//       });
  
//       // alert("not a valid email address");
//     }
//   });
  
//   $("#submitBtn").on("click", function(e) {
//     if (validateRno(rno)) {
//       return true;
//     } else {
//       return false;
//     }
//   });

//   function validateRno(num) {
//     var upperCase= new RegExp('[A,R]');
//     var numbers= new RegExp('[0-9]');
//     if(num.match(upperCase) && num.match(numbers)){
//         // alert("yes")
//         return true;
//     }
//     else
//         return false;
// }