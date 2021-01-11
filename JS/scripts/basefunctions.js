function slideShowStart(photosUnparsed) {
    var result = JSON.parse(photosUnparsed);
    var photosAndIDs = result.value.split(',');
    var i;
    for (i = 0; i < 10; i++) {
        createImage(i);
    }
    var photos = new Array;
    var ids = new Array;
    splitPhotosIDs(photosAndIDs, photos, ids);

    for (i = 0; i < 5; i++) {
        $('#img' + i).attr("src", photos[i] + '?' + new Date().getTime());
        $('#img' + i).attr("pid", ids[i]);
    }

    startFetchingEXIFData(0, 5);
    fetchEXIFRunner = setInterval(fetchExifDataWithDelay, 1000);

    currPhotoNumber = 0;
    var firstPhoto = document.getElementById("img" + currPhotoNumber);
    $('#img' + currPhotoNumber).show(1000);

    $("#info").html(photoDescription[$(firstPhoto).attr('pid')]);

    swapPhotosInterval = setInterval(swapPhotos, timeInterval);
    addToHistory(photos[0], ids[0]);

    setInterval(nightModeCheck, 5000);
}

function startFetchingEXIFData(from, to) {
    currEXIFFrom = from;
    currEXIFTo = to;
    fetchingEXIFdata = true;
}

function fetchNextPhotos(photosUnparsed) {
    var result = JSON.parse(photosUnparsed);
    var photosAndIDs = result.value.split(',');

    var photos = new Array;
    var ids = new Array;
    splitPhotosIDs(photosAndIDs, photos, ids);

    if (currPhotoNumber < 5) {
        for (i = 5; i < 10; i++) {
            $('#img' + i).attr("src", photos[i - 5] + '?' + new Date().getTime());
            $('#img' + i).attr("pid", ids[i - 5]);
        }
        startFetchingEXIFData(5, 10);
    }
    else {
        for (i = 0; i < 5; i++) {
            $('#img' + i).attr("src", photos[i] + '?' + new Date().getTime());
            $('#img' + i).attr("pid", ids[i]);
        }
        startFetchingEXIFData(0, 5);
    }
}

function splitPhotosIDs(photosAndIDs, photos, ids) {
    var j = 0;
    for (i = 0; i < 5; i++) {
        ids.push(photosAndIDs[j]);
        photos.push(photosAndIDs[j + 1]);
        j += 2;
    }
}

function createImage(id) {
    var imgID = 'img' + id;
    var img = document.createElement('img');
    $(img).attr('id', imgID);
    $(".inner").append(img);
    $('#' + imgID).addClass("photo");
    $('#' + imgID).on('load', function () {
        var css;
        var ratio = $(this).width() / $(this).height();
        var pratio = $(this).parent().width() / $(this).parent().height();
        if (ratio < pratio) css = { width: 'auto', height: '100%' };
        else css = { width: '100%', height: 'auto' };
        $(this).css(css);

    });

    $('#' + imgID).on('click', function () {
        if (controlPanelVisible) {
            $('#controls').hide();
        }
        else {
            $('#controls').show();
        }
        controlPanelVisible = !controlPanelVisible;
    });
}

function isImage(i) {
    return i instanceof HTMLImageElement;
}

function showProgressBar() {
    $("#loadingPart").show();
}

function hideProgressBar() {
    $("#loadingPart").hide();
}