let addToCartBtn = document.querySelectorAll(".add-to-cart");
let counterContainer1 = document.querySelector("#counter-container1");
let counterContainer2 = document.querySelector("#counter-container2");
let totalResponsive = document.querySelector("#totalResponsive");
let openCartBtn = document.querySelector("#openCart");

var responsive = window.matchMedia("(max-width: 1150px)");

var totalGlobal = 0;
var tmpSwitch = false;

let services = [{
        name: "Invoice 1",
        tag: "invoice1",
        urlImg: "assets/img/search-icon.png",
        price: 99
    },
    {
        name: "Invoice 2",
        tag: "invoice2",
        urlImg: "assets/img/search-icon.png",
        price: 99
    },
    {
        name: "Invoice 3",
        tag: "invoice3",
        urlImg: "assets/img/search-icon.png",
        price: 99
    },
    {
        name: "Invoice 4",
        tag: "invoice4",
        urlImg: "assets/img/search-icon.png",
        price: 99
    }
];

function initialization() {
    let payArea = document.getElementById("payArea");

    for (let i = 0; i < addToCartBtn.length; i++)
        if (localStorage.getItem(services[i].tag + "_selected") == "true" && parseInt(localStorage.getItem("cartNumbers")) > 0) {
            addToCartBtn[i].disabled = true;
            addToCartBtn[i].firstChild.data = "Added";
        } else {
            addToCartBtn[i].firstChild.data = "Add";
            addToCartBtn[i].disabled = false;
        }

    if (localStorage.getItem("cartNumbers") == "0" || localStorage.getItem("cartNumbers") == null) {
        counterContainer1.style.display = "none"
        counterContainer2.style.opacity = "0";
        totalResponsive.style.display = "none";
        payArea.style.display = "none";

        //list.style.display = "none";

        for (let i = 0; i < addToCartBtn.length; i++) {
            addToCartBtn[i].firstChild.data = "Add";
            addToCartBtn[i].disabled = false;
            localStorage.setItem(services[i].tag + "_selected", "false");
        }
    } else {
        counterContainer1.querySelector("span").textContent = localStorage.getItem("cartNumbers");
        counterContainer2.querySelector("span").textContent = localStorage.getItem("cartNumbers");

        if (responsive.matches) {
            counterContainer1.style.display = "none"
            counterContainer2.style.opacity = "1"
            totalResponsive.style.display = "flex";
        } else {
            counterContainer1.style.display = "flex"
            counterContainer2.style.opacity = "0";
            totalResponsive.style.display = "none";
        }

        responsive = window.matchMedia("(max-width: 1150px)");

        //list.style.display = "flex";
    };
}

function addEventToButton() {
    for (let i = 0; i < addToCartBtn.length; i++) {
        initialization();
        addToCartBtn[i].addEventListener("click", () => {
            addToCartBtn[i].firstChild.data = "Added";
            addToCartBtn[i].disabled = true;
            cartNumbers(services[i]);
            totalCost(services[i]);
        });
    }
}

function cartNumbers(service) {
    let serviceNumbers = parseInt(localStorage.getItem("cartNumbers"));

    if (serviceNumbers > 4) localStorage.setItem("cartNumbers", 0);

    if (serviceNumbers) {
        localStorage.setItem("cartNumbers", (serviceNumbers + 1));
        counterContainer1.querySelector("span").textContent = (serviceNumbers + 1);
        counterContainer2.querySelector("span").textContent = (serviceNumbers + 1);
        localStorage.setItem(service.tag + "_selected", "true");
        totalResponsive.style.top = "auto";
        totalResponsive.style.bottom = 0;
    } else {
        localStorage.setItem("cartNumbers", 1);
        counterContainer1.querySelector("span").textContent = 1;
        counterContainer2.querySelector("span").textContent = 1;
        if (responsive.matches) {
            counterContainer1.style.display = "none"
            counterContainer2.style.opacity = "1"
            totalResponsive.style.display = "flex";
            totalResponsive.style.bottom = 0;
        } else {
            counterContainer1.style.display = "flex"
            counterContainer2.style.opacity = "0";
            totalResponsive.style.display = "none";
        }

        responsive = window.matchMedia("(max-width: 1150px)");

        localStorage.setItem(service.tag + "_selected", "true");
    }

    setItem(service);
}

function setItem(service) {
    let cartItems = JSON.parse(localStorage.getItem("servicesInCart"));

    if (cartItems) {
        if (cartItems[service.tag] == undefined)
            cartItems = {
                ...cartItems,
                [service.tag]: service,
            };
    } else {
        cartItems = {
            [service.tag]: service,
        };
    }

    totalGlobal += parseInt(cartItems[service.tag].price);

    localStorage.setItem("servicesInCart", JSON.stringify(cartItems));

    addItemToList(service);
    showTotalCost();
}

function totalCost(service) {
    let cartCost = parseInt(localStorage.getItem("totalCost"));

    if (cartCost) cartCost += service.price;
    else cartCost = service.price;

    localStorage.setItem("totalCost", cartCost);
}

function showItems() {
    let cartItems = JSON.parse(localStorage.getItem("servicesInCart"));
    let total = localStorage.getItem("totalCost");
    let list = document.getElementById("listServices");
    let payArea = document.getElementById("payArea");

    if (cartItems) {
        list.style.display = "flex";
        payArea.style.display = "flex";

        payArea.innerHTML += "<h3>Total: <span id='totalSpan'>$" + total + "</span></h3><button class='btn btn-pay'>Buy</button>";

        Object.values(cartItems).map(service => {
            list.innerHTML += "<div class='item-list' id='" + service.tag + "'><div class='item-icon'><img src='" + service.urlImg + "' alt='Servicio'></div><div class='item-info'><h3>" + service.name + "</h3></div><div class='item-price'><span>$" + service.price + "</span><a class='btn-delete' href='#' onclick=deleteItemOfList('" + service.tag + "');><i class='fa fa-times-circle'></i></a></div></div>";
        });
    } else {
        list.style.display = "none";
        payArea.style.display = "none";
    }
}

function showTotalCost() {
    let payArea = document.getElementById("payArea");

    payArea.style.display = "flex";
    payArea.innerHTML = "<h3>Total: <span id='totalSpan'>$" + totalGlobal + "</span></h3><button class='btn btn-pay'>Buy</button>";
}

function addItemToList(service) {
    let list = document.getElementById("listServices");
    var item = "<div class='item-list' id='" + service.tag + "'><div class='item-icon'><img src='" + service.urlImg + "' alt='Servicio'></div><div class='item-info'><h3>" + service.name + "</h3></div><div class='item-price'><span>$" + service.price + "</span><a class='btn-delete' href='#' onclick=deleteItemOfList('" + service.tag + "');><i class='fa fa-times-circle'></i></a></div></div>";

    list.style.display = "flex";

    list.innerHTML += item;
}

function deleteItemOfStorage(tag) {
    let cartItems = JSON.parse(localStorage.getItem("servicesInCart"));
    let totalCost = parseFloat(localStorage.getItem("totalCost"));
    let cartNumbers = parseInt(localStorage.getItem("cartNumbers"));

    localStorage.setItem("totalCost", (totalCost -= parseFloat(cartItems[tag].price)));
    localStorage.setItem("cartNumbers", (cartNumbers -= 1));

    delete cartItems[tag];

    localStorage.setItem("servicesInCart", JSON.stringify(cartItems));
    localStorage.setItem(tag + "_selected", "false");

    return parseFloat(localStorage.getItem("totalCost"));
}

function deleteItemOfList(tag) {
    var totalCost = deleteItemOfStorage(tag);
    let payArea = document.getElementById("payArea");

    if (totalCost)
        document.getElementById("totalSpan").innerHTML = "$" + totalCost;
    else {
        closeAndHideCart();
        document.getElementById("totalSpan").innerHTML = "$0";
        counterContainer1.style.display = "none";
        payArea.style.display = "none";
    }

    totalGlobal = totalCost;

    counterContainer1.querySelector("span").textContent = localStorage.getItem("cartNumbers");
    counterContainer2.querySelector("span").textContent = localStorage.getItem("cartNumbers");

    for (let i = 0; i < services.length; i++)
        if (services[i].tag == tag) {
            addToCartBtn[i].firstChild.data = "Add";
            addToCartBtn[i].disabled = false;
        }

    document.getElementById(tag).remove();
}

function openCart() {
    openCartBtn.addEventListener("click", () => {
        if (tmpSwitch) {
            document.getElementById("iconOpenButton").classList.toggle("fa-angle-down");
            document.getElementById("iconOpenButton").classList.toggle("fa-angle-up");

            tmpSwitch = false;

            totalResponsive.style.top = "auto";
            totalResponsive.style.bottom = 0;

            document.getElementById("containerRightShopping").style.top = "100%";
        } else  {
            document.getElementById("iconOpenButton").classList.toggle("fa-angle-up");
            document.getElementById("iconOpenButton").classList.toggle("fa-angle-down");

            tmpSwitch = true;

            totalResponsive.style.bottom = "auto";
            totalResponsive.style.top = 0;

            document.getElementById("containerRightShopping").style.top = "0";
        }
    });
}

function closeAndHideCart() {
    document.getElementById("iconOpenButton").classList.toggle("fa-angle-down");
    document.getElementById("iconOpenButton").classList.toggle("fa-angle-up");

    totalResponsive.style.display = "none";
    totalResponsive.style.top = "auto";
    totalResponsive.style.bottom = 0;

    document.getElementById("containerRightShopping").style.top = "100%";

    tmpSwitch = false;
}

initialization();
showItems();
openCart();
addEventToButton();