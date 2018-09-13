//open_closeNav

function openNav() {
    window.addEventListener('scroll', noscroll);
    if (screen.width < 600) {
        document.getElementById("co2").classList.add = "contt";
        document.getElementById("mySidenav").style.width = "100%";
    } else {
        document.getElementById("mySidenav").style.width = "50%";
        document.getElementById("mySidenav0").style.width = "0";
    }
}

function closeNav() {
    window.removeEventListener('scroll', noscroll);
    document.getElementById("mySidenav").style.width = "0";
}


function noscroll() {
    window.scrollTo(0, 0);
}



function openNav0() {
    window.addEventListener('scroll', noscroll);
    if (screen.width < 600) {
        document.getElementById("mySidenav0").style.width = "100%";
    } else {
        document.getElementById("mySidenav0").style.width = "50%";
        document.getElementById("mySidenav").style.width = "0";
    }
}

function closeNav0() {
    window.removeEventListener('scroll', noscroll);
    document.getElementById("mySidenav0").style.width = "0";
}
//open_closeNav
//Navigation bar
function myFunction() {
    var x = document.getElementById("demo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}
//Navigation bar
//Slideshow
var myIndex = 0;
carousel();

function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) {
        myIndex = 1
    }
    x[myIndex - 1].style.display = "block";
    setTimeout(carousel, 3000);
}
//Slideshow
// slow scroll
$(".menu").on("click", "a", function (event) {
    event.preventDefault();
    var id = $(this).attr('href'),
        top = $(id).offset().top;
    $('body,html').animate({
        scrollTop: top
    }, 1000);
});
// slow scroll