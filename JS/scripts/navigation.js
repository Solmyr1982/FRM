function hide() {
    var body = { photoID: $('#img' + currPhotoNumber).attr("pid"), photoPath: $('#img' + currPhotoNumber).attr("src") }
    sendAPIRequest('FrameProcessor(00000000-0000-0000-0000-000000000000)/Microsoft.NAV.hide', 'hide', body);
}

function addToHistory(path, id) {
    if (prevPhotos.length == 30) {
        delete photoDescription[prevPhotoIDs[30]];
        prevPhotos.pop();
        prevPhotoIDs.pop();
    }
    prevPhotos.unshift(path);
    prevPhotoIDs.unshift(id);
}

function next() {
    if (currhistoryIndex == 0) {
        return;
    }

    currhistoryIndex -= 1;
    $('#img' + currPhotoNumber).attr("src", prevPhotos[currhistoryIndex] + '?' + new Date().getTime());
    $('#img' + currPhotoNumber).attr("pid", prevPhotoIDs[currhistoryIndex]);
    $("#info").html(photoDescription[$('#img' + currPhotoNumber).attr('pid')]);
}

function prev() {
    if (prevPhotos.length < 2) {
        return;
    }

    if (!pauseMode) {
        playPause()
    }
    if (currhistoryIndex == 0) {
        currhistoryIndex = 1;
        $('#img' + currPhotoNumber).attr("src", prevPhotos[currhistoryIndex] + '?' + new Date().getTime());
        $('#img' + currPhotoNumber).attr("pid", prevPhotoIDs[currhistoryIndex]);
    }
    else {
        if (currhistoryIndex < prevPhotos.length - 1) {
            currhistoryIndex += 1;
            $('#img' + currPhotoNumber).attr("src", prevPhotos[currhistoryIndex] + '?' + new Date().getTime());
            $('#img' + currPhotoNumber).attr("pid", prevPhotoIDs[currhistoryIndex]);
        }
    }
    $("#info").html(photoDescription[$('#img' + currPhotoNumber).attr('pid')]);
}

function tableClick(event) {
    if (!isImage(event.target) && controlPanelVisible) {
        $('#controls').hide();
        controlPanelVisible = false;
    }
}

function playPause() {
    if (pauseMode) {
        $('#buttonPlayPause').attr("src", 'images/pause.png');
        swapPhotosInterval = setInterval(swapPhotos, timeInterval);
        currhistoryIndex = 0;
    }
    else {
        $('#buttonPlayPause').attr("src", 'images/play.png');
        clearInterval(swapPhotosInterval);
    }
    pauseMode = !pauseMode;
}

function bookmarkT() {
    var body = { photoID: $('#img' + currPhotoNumber).attr("pid"), photoPath: $('#img' + currPhotoNumber).attr("src"), userLetter: "T" }
    sendAPIRequest('FrameProcessor(00000000-0000-0000-0000-000000000000)/Microsoft.NAV.addToLog', 'bookmark', body);
}


function bookmarkO() {
    var body = { photoID: $('#img' + currPhotoNumber).attr("pid"), photoPath: $('#img' + currPhotoNumber).attr("src"), userLetter: "O" }
    sendAPIRequest('FrameProcessor(00000000-0000-0000-0000-000000000000)/Microsoft.NAV.addToLog', 'bookmark', body);
}