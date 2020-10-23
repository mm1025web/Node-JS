$(window).on("load", function () {
  getValues();
});
function store() {
  window.localStorage.myitems = "dark-theme";
}

function getValues() {
  var storedValues = window.localStorage.myitems;
  // alert(storedValues)
  if (storedValues) {
    if (!$("body").hasClass("dark-mode")) {
      // alert("Stored");
      $("body,.box").toggleClass("dark-mode");
      $(".field input,.setemail").toggleClass("dark-mode-input");
      $(".action").toggleClass("dark-mode-button");
      $(".switchBtn").toggleClass("switchBtn2");
      $(".switchBtn").attr("checked", "checked");
    } else {
      $("body,.box").removeClass("dark-mode");
      $(".field input,.setemail").removeClass("dark-mode-input");
      $(".action").removeClass("dark-mode-button");
      $(".switchBtn").removeClass("switchBtn2");
    }
  } else {
    // $(".switchBtn").attr("checked", "checked");
  }
}
$(document).ready(function () {
  $("#main .signup").hide();
  $("#main .fa-eye").hide();
  $("#main .forgot").hide();
  $("#main .delete").hide();
  $("#main .val-pass").hide();
  $("#main .signin").show();

  // dark theme toggler
  $(".switchBtn").click(function () {
    localStorage.clear();
    $("body,.box").toggleClass("dark-mode");
    $(".field input,.setemail").toggleClass("dark-mode-input");
    $(".action").toggleClass("dark-mode-button");
    $(".switchBtn").toggleClass("switchBtn2");
    store();
  });
});

$("#main .forgot-pass").click(function () {
  $("#main .forgot").show();
  $("#main .signin").hide();
});

$("#main #delete").click(function () {
  $("#main .delete").show();
  $("#main .signin").hide();
});

$("#main .goback").click(function () {
  $("#main .delete").hide();
  $("#main .forgot").hide();
  $("#main .signin").show();
});

$("#main #sign").click(function () {
  $("#main .signup").show();
  $("#main .signin").hide();
});
$("#main #login").click(function () {
  $("#main .signup").hide();
  $("#main .signin").show();
});
$("#main .pwd").click(function () {
  $("#main .fa-eye").show();
});
$("#main .required").click(function () {
  $("#main .val-pass").show();
});

$("#main .fa-eye").click(function () {
  $(this).toggleClass("fa-eye fa-eye-slash");
  // var input = $($(this).attr("toggle"));
  var input = $("#main .pwd");
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});

function validateEmail(email) {
  var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

  return $.trim(email).match(pattern) ? true : false;
}
function validateRno(num) {
  var upperCase = new RegExp("[A,R]");
  var lowerCase = new RegExp("[a-z]");
  var numbers = new RegExp("[0-9]");
  if (num.match(upperCase) && num.match(numbers) && !num.match(lowerCase)) {
    // alert("yes")
    return true;
  } else return false;
}
$("#main .valid").hide();
$("#main .validrno").hide();

var emailInput, rno;

$("#main #email").on("change", function () {
  emailInput = $(this).val();

  if (validateEmail(emailInput)) {
    $("#main .valid").hide();
    $(this).css({
      color: "#595959",
      border: "none",
    });
  } else {
    $("#main .valid").show();
    $(this).css({
      color: "red",
      border: "2px solid red",
    });

    // alert("not a valid email address");
  }
});

$("#main #rno").on("change", function () {
  rno = $(this).val();
  //  alert(rno[0])
  // alert(rno)
  if (validateRno(rno)) {
    $("#main .validrno").hide();
    $(this).css({
      color: "#595959",
      border: "none",
    });
  } else {
    $("#main .validrno").show();
    $(this).css({
      color: "red",
      border: "2px solid red",
    });

    // alert("not a valid email address");
  }
});

$("#main #submit-button").on("click", function (e) {
  if (validateEmail(emailInput) && validateRno(rno)) {
    return true;
  } else {
    return false;
  }
});

$("#main #submit-button").attr("disabled", true);
$("#main #submit-button2").attr("disabled", true);

$("#main #form1 .required").keyup(function () {
  var txt = $(this).val(),
    flag = 1;
  if (txt.length < 8) {
    ++flag;
    $(".password_length").css({
      color: "red",
    });
  } else {
    $(".password_length").css({
      color: "green",
    });
  }
  var upperCase = new RegExp("[A-Z]");
  var lowerCase = new RegExp("[a-z]");
  if ($(this).val().match(upperCase) && $(this).val().match(lowerCase)) {
    ++flag;
    $(".password_case").css({
      color: "green",
    });
  } else {
    $(".password_case").css({
      color: "red",
    });
  }
  var numbers = new RegExp("[0-9]");
  if ($(this).val().match(numbers)) {
    ++flag;
    $(".password_number").css({
      color: "green",
    });
  } else {
    $(".password_number").css({
      color: "red",
    });
  }
  if (flag >= 3) {
    $("#main #submit-button").attr("disabled", false);
    $("#main #submit-button2").attr("disabled", false);
  }
});

//home page
$(document).ready(function () {
  $("#home .fa-eye").hide();
});
$("#home .pwd").click(function () {
  $("#home .fa-eye").show();
});
$("#home .fa-eye").click(function () {
  $(this).toggleClass("fa-eye fa-eye-slash");
  // var input = $($(this).attr("toggle"));
  var input = $("#home .pwd");
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});

var EmailInput;
$("#home .valid").hide();

$("#home #email").on("change", function () {
  EmailInput = $(this).val();

  if (ValidateEmail(EmailInput)) {
    $("#home .valid").hide();
    $(this).css({
      color: "#595959",
      border: "none",
    });
  } else {
    $("#home .valid").show();
    $(this).css({
      color: "red",
      border: "2px solid red",
    });

    // alert("not a valid email address");
  }
});
$("#home #submitBtn").on("click", function (e) {
  // $('.val-pass').hide();

  // e.preventDefault();
  if (ValidateEmail(EmailInput)) {
    return true;
  } else {
    return false;
  }
});

function ValidateEmail(email) {
  var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

  return $.trim(email).match(pattern) ? true : false;
}

// alert($('body').attr('id'))
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#imagePreview").css(
        "background-image",
        "url(" + e.target.result + ")"
      );
      $("#imagePreview").hide();
      $("#imagePreview").fadeIn(650);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
$("#imageUpload").change(function () {
  readURL(this);
});
