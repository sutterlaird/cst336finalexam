// clearPage clears the content area of the page
function clearPage() {
    $("#content").html("");
}








function buildRaceList() {
    var userData = {
        requestType: "getRaces",
    };
    $.ajax({
            url: "api.php",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(userData)
        })
        .done(function(data) {
            data.forEach(function(race) {
                var raceDate = new Date(race.date);
                if (Date.now() < raceDate && race.hidden != 1) {
                    console.log(race);
                    var row = "<tr><th scope='row'>" + race.id + "</th>";
                    row += "<td>" + race.date + "</td>";
                    row += "<td>" + race.time + "</td>";
                    row += "<td>" + race["location"] + "</td>";
                    row += "<td><img class='raceButton' src='img/edit.png' onclick='openEditModal(" + race.id + ")'>  <img class='raceButton' src='img/archive.png' onclick='cancelButtonClicked(" + race.id +")'></td>";
                    row += "</tr>";
                    $("#racesListInner").append(row);
                }
            });
        })
        .fail(function(xhr, status, errorThrown) {
            console.log("error", xhr.responseText);
        });
    $("#content").html($("#racesList").html());
}








function init() {
    buildRaceList();
}








function openEditModal(raceId) {
    var userData = {
        requestType: "getOneRace",
        raceId: raceId
    };
    $.ajax({
            url: "api.php",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(userData)
        })
        .done(function(data) {
            console.log(data);
            var form = "<form>";
            form += "ID:  <input type='text' readonly value=" + data.id + "><br/><br/>";
            form += "Date:  <input id='editRaceDate' type='text'><br/><br/>";
            form += "Time:  <input id='editRaceTime' type='text'><br/><br/>";
            form += "Location:  <input id='editRaceLocation' type='text'><br/><br/>";
            form += "Password:  <input id='editRacePassword' type='text'><br/>";
            form += "</form>";
            
            $("#addRaceButton").addClass("d-none");
            $("#editModal .modal-body").html(form);
            $("#editRaceDate").val(data.date);
            $("#editRaceTime").val(data.time);
            $("#editRaceLocation").val(data['location']);
            $("#editRacePassword").val(data.password);
            
            $("#editModal").modal("show");
        })
        .fail(function(xhr, status, errorThrown) {
            console.log("error", xhr.responseText);
        });
}







function newRaceModal() {
    var form = "<form>";
    form += "Date:  <input type='text' id='newRaceDate'><br/><br/>";
    form += "Time:  <input type='text' id='newRaceTime'><br/><br/>";
    form += "Location:  <input type='text' id='newRaceLocation'><br/><br/>";
    form += "Password:  <input type='text' id='newRacePassword'><br/>";
    form += "</form>";
    
    $("#editModal .modal-body").html(form);
    $("#addRaceButton").removeClass("d-none");
    // $("#editModal .modal-footer").append("<button type='button' class='btn btn-primary' onclick='addRace()'>Add Race</button>");
    $("#editModal").modal("show");
}
    
    
    
    
    
    
    
    
function addRace() {
    var userData = {
        requestType: "createRace",
        newDate: $("#newRaceDate").val(),
        newTime: $("#newRaceTime").val(),
        newLocation: $("#newRaceLocation").val(),
        newPassword: $("#newRacePassword").val()
    }
    $.ajax({
            url: "api.php",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(userData)
        })
        .done(function(data) {
            alert("Race added successfully.");
            clearPage();
            buildRaceList();
            $("#editModal").modal("hide");
        })
        .fail(function(xhr, status, errorThrown) {
            console.log("error", xhr.responseText);
        });
}








function cancelButtonClicked(raceId) {
    $("#cancelConfirmModal").modal("show");
    $("#cancelConfirmation").click(function() {
        var userData = {
            requestType: "cancelRace",
            deleteId: raceId
        }
        $.ajax({
                url: "api.php",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(userData)
            })
            .done(function(data) {
                alert("Race cancelled successfully.");
                clearPage();
                buildRaceList();
                $("#cancelConfirmModal").modal("hide");
            })
            .fail(function(xhr, status, errorThrown) {
                console.log("error", xhr.responseText);
            });
    });
}