function fetchExifDataWithDelay() {
    if (fetchingEXIFdata) {
        populateExifData("img" + currEXIFFrom);
        currEXIFFrom++;
        if (currEXIFFrom == currEXIFTo) {
            currEXIFFrom = 0;
            currEXIFTo = 0;
            fetchingEXIFdata = false;
        }
    }
}

function swapPhotos() {
    if (nightMode) {
        return;
    }

    if ($("#info").is(":hidden")) {
        $("#info").show();
    }
    if ($('#img' + currPhotoNumber).is(":hidden")) {
        $('#img' + currPhotoNumber).show();
    }

    if ((currPhotoNumber == 0) | (currPhotoNumber == 5)) {
        var body = { appVersion: navigator.appVersion }
        sendAPIRequest('FrameProcessor(00000000-0000-0000-0000-000000000000)/Microsoft.NAV.returnFiveRandomPhotos', 'fetchNextPhotos', body);
    }

    $('#img' + currPhotoNumber).hide(1000);

    if (currPhotoNumber == 9) {
        currPhotoNumber = 0;
    }
    else {
        currPhotoNumber += 1;
    }

    var nextPhoto = document.getElementById("img" + currPhotoNumber);
    $("#info").html(photoDescription[$(nextPhoto).attr('pid')]);

    $('#img' + currPhotoNumber).show(1000);

    addToHistory(nextPhoto.src.substring(0, nextPhoto.src.indexOf("?")), $('#img' + currPhotoNumber).attr("pid"));

    $('#controls').hide();
    controlPanelVisible = false;
    window.scrollBy(0, 1000);
}

function nightModeCheck() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (iOS) {
        var dateToCompare = new Date('1900-01-01T' + time);
    }
    else {
        var dateToCompare = new Date('01-01-1970 ' + time);
    }

    if ((dateToCompare > nightTimeStart) & (dateToCompare < nightTimeEnd)) {
        nightMode = true;
        $('#controls').hide();
        controlPanelVisible = false;
        $("#info").hide();
        $('#img' + currPhotoNumber).hide();
    }
    else {
        nightMode = false;
    }
}