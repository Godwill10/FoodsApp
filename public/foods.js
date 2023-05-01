/*  
 * foods.js
 * Functions to run the web app which gets its data from the foods
 * server. The server (node express) runs at 45.79.21.82:3002
 */

/*
 * Our only global code: calling main when the DOM loading is complete.
 */
$(pageLoadedMain);

/*
 * Once the DOM has loaded, load food names into nav
 * and add listeners.
 */
function pageLoadedMain() {
    loadFoodNamesIntoNav();
    addBooksNameListeners();
    addButtonListeners();

    //disable the edit button when the page loads
    $("#editbutton").prop("disabled", true).css("background-color", "lightgray");
    $("#deletebutton").prop("disabled", true).css("background-color", "lightgray");
}

/*
 * Adds a click event listener to each book title in navigation, calling
 * the onSelect method.
 */ 
function addBooksNameListeners() {
    $("li").each(function() {
        $(this).on("click", onSelect);
    });
}

/*
 * Adds a click event listener to each of the buttons in navigation, calling
 * the onEdit, onAdd, and onDeletes method.
 */ 
function addButtonListeners() {
    let editButton = $("#editbutton");
    editButton.click(onEdit);
    let addButton = $("#addbutton");
    addButton.click(onAdd);
    let deleteButton = $("#deletebutton");
    deleteButton.click(onDelete);
}

/*
 * Creates an unordered list of food names from the foods in the database,
 * and places it in the navigation section of the page.
 */
function loadFoodNamesIntoNav() {
    console.log("Sending request to names");
    let xhr = new XMLHttpRequest();
    xhr.addEventListener( "load", function() {
        console.log("Names callback");
        console.log("Response is " + this.response);
        let rows = JSON.parse( this.response);
        var $foodListing = $("<ul>"); // jQuery node for an unordered list
        rows.forEach( function( row) {
            $aNameItem = $("<li>");   // jQuery node for a list item
            $aNameItem.html( row.name);
            $aNameItem.click( onSelect);
            $foodListing.prepend($aNameItem);
        });
        $("nav").append( $foodListing);
    }
    
    );
    xhr.open( "GET", "http://augwebapps.com:3022/names");
    xhr.send();   
    console.log("Done sending request to names");
}

/*
 * Fills in the information in the main section given the selected food.
 * Called from a click on one of the food names in navigation.
 */
function onSelect() {
    $("#editbutton").prop("disabled", false).css("background-color", "");
    $("#deletebutton").prop("disabled", false).css("background-color", "");
    $("#addbutton").prop("disabled", false).css("background-color", "");

    let foodName = $(this).html();
    console.log("onSelect(" + foodName + ")" );
    let xhr = new XMLHttpRequest();
    xhr.addEventListener( "load", function() {
        console.log("Select callback");
        console.log("Response is " + this.response);
        let foodInfos = JSON.parse( this.response);
        let foodInfo = foodInfos[0]; // only get the first row
        $("#itemname").val( foodInfo.name);
        $("#serv").val( foodInfo.size);
        $("#units").html(foodInfo.sizeunit);
        $("#kcal").val( foodInfo.cal);
        $("#sodium").val( foodInfo.sodium);
    });
    xhr.open( "GET", "http://augwebapps.com:3022/data?food=" + foodName);
    xhr.send();   
    console.log("Done sending request to data?food=" + foodName);
}

/*
 * Edits the information in the main section and in the database given the information of the selected food.
 * Called from a click on the delete button
 */
function onEdit() {
    console.log("onEdit called");
    if ($(this).text() == "Edit") {
        // Enter edit mode
        $(this).text("Save");
        $("#itemname").prop("readonly", true);
        $("#serv").prop("readonly", false);
        $("#kcal").prop("readonly", false);
        $("#sodium").prop("readonly", false);
        // Disable the delete button
        $("#deletebutton").prop("disabled", true).css("background-color", "lightgray");
    } else {
        // Exit edit mode
        $(this).text("Edit");
        var updatedFood = {};
        updatedFood.name = $("#itemname").val();
        updatedFood.size = $("#serv").val();
        $("#serv").prop("readonly", true);
        updatedFood.sizeunit = $("#units").html();
        $("#units").prop("readonly", true);
        updatedFood.cal = $("#kcal").val();
        $("#kcal").prop("readonly", true);
        updatedFood.sodium = $("#sodium").val();
        $("#sodium").prop("readonly", true);

        // Save the data to the server
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function () {
            console.log("Edit callback");
            console.log("Response is " + this.response);
        });
        xhr.open("GET", "http://augwebapps.com:3022/data/edit?food=" + encodeURIComponent(updatedFood.name) + "&size=" + encodeURIComponent(updatedFood.size) + "&sizeUnit=" + encodeURIComponent(updatedFood.sizeunit) + "&cal=" + encodeURIComponent(updatedFood.cal) + "&sodium=" + encodeURIComponent(updatedFood.sodium));
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        let data = {
            name: updatedFood.name,
            size: $("#serv").val(),
            sizeunit: $("#units").html(),
            cal: $("#kcal").val(),
            sodium: $("#sodium").val()
        };
        xhr.send(JSON.stringify(data));

        // Enable the add and delete button
        $("#deletebutton").prop("disabled", false).css("background-color", "");
        $("#addbutton").prop("disabled", false).css("background-color", "");

    }
}

/*
 * Add the information in the main section and in the database given the information of the new food.
 * Called from a click on the delete button
 */
function onAdd() {
    $("#editbutton").prop("disabled", true).css("background-color", "lightgray");
    console.log("Called onAdd");
    if ($(this).text() == "Add") {
        // Enter add mode
        $(this).text("Save");
        $("#itemname").val("").prop("readonly", false);
        $("#serv").val("").prop("readonly", false);
        $("#units").html("").prop("readonly", false);
        $("#kcal").val("").prop("readonly", false);
        $("#sodium").val("").prop("readonly", false);
        // Disable the edit and delete buttons
        $("#editbutton").prop("disabled", true).css("background-color", "lightgray");
        $("#deletebutton").prop("disabled", true).css("background-color", "lightgray");

    } else {
        // Leave add mode, save food info into a new object in the database
        $(this).text("Add");
        var newFood = {};
        newFood.name = $("#itemname").val();
        $("#itemname").prop("readonly", true);
        newFood.size = $("#serv").val();
        $("#serv").prop("readonly", true);
        newFood.sizeunit = $("#units").html();
        $("#units").prop("readonly", true);
        newFood.cal = $("#kcal").val();
        $("#kcal").prop("readonly", true);
        newFood.sodium = $("#sodium").val();
        $("#sodium").prop("readonly", true);

        // send the new food info to the server and recreate the food list
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://augwebapps.com:3022/data/add?size=" + newFood.size + "&units=" + newFood.sizeunit + "&cal=" + newFood.cal + "&sodium=" + newFood.sodium);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {
            console.log("Add callback");
            console.log("Response is " + this.response);
        };
        xhr.send(JSON.stringify(newFood));
    }
}

/*
 * Deletes the information in the main section and the database given the selected food.
 * Called from a click on the delete button
 */
function onDelete() {
    var itemName = $("#itemname").val();
    if (confirm("Are you sure you want to delete " + itemName + "?")) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function () {
            console.log("Delete callback");
            console.log("Response is " + this.response);
        });
        xhr.open("GET", "http://augwebapps.com:3022/delete?food=" + itemName);
        xhr.send();
        $("#itemname").val("");
        $("#serv").val("");
        $("#kcal").val("");
        $("#sodium").val("");
        $("#deletebutton").prop("disabled", true).css("background-color", "lightgray");
    }
    location.reload();

    // enables add button and disable the edit button
    $("#addbutton").prop("disabled", false).css("background-color", "");
    $("#editbutton").prop("disabled", true).css("background-color", "lightgray");
}
