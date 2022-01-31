function sendAPIRequest(requestName, action, body, parameter) {
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.withCredentials = true;
        var currentUser = appConfig.anonUserName;
        var currentPassword = appConfig.anonUserPass;
        if (action === 'getGeodata') {
            xhttp.open("POST", appConfig.GEOAPIURL + requestName, true);
        }
        else {
            xhttp.open("POST", appConfig.APIURL + requestName, true);
        }
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Authorization", "Basic " + btoa(currentUser + ":" + currentPassword));
        xhttp.send(JSON.stringify(body));

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                if (xhttp.status === 200) {
                    switch (action) {
                        case 'slideShowStart':
                            {
                                slideShowStart(xhttp.responseText);
                                break;
                            }
                        case 'fetchNextPhotos':
                            {
                                fetchNextPhotos(xhttp.responseText);
                                break;
                            }
                        case 'getGeodata':
                            {
                                var result = JSON.parse(xhttp.responseText);
                                photoDescription[parameter] = photoDescription[parameter] + ' ' + result.value;
                                break;
                            }
                        case 'bookmark': case 'hide':
                            {
                                // do nothing
                                break;
                            }
                        case 'timeInterval':
                            {
                                var result = JSON.parse(xhttp.responseText);
                                timeInterval = result.value;
                                var body = { appVersion: navigator.appVersion }
                                sendAPIRequest('FrameProcessor(00000000-0000-0000-0000-000000000000)/Microsoft.NAV.returnFiveRandomPhotos', 'slideShowStart', body);
                                break;
                            }
                        case 'nightTimeStartEnd':
                            {
                                var result = JSON.parse(xhttp.responseText);
                                var nightTimeStartEnd = result.value.split(';');
                                if (iOS) {
                                    nightTimeStartEnd[0] = timeConversionSlicker(nightTimeStartEnd[0]);
                                    nightTimeStartEnd[1] = timeConversionSlicker(nightTimeStartEnd[1]);
                                    nightTimeStartEnd[0] = nightTimeStartEnd[0].trim();
                                    nightTimeStartEnd[1] = nightTimeStartEnd[1].trim();
                                    if (nightTimeStartEnd[1].length == 7) {
                                        nightTimeStartEnd[1] = '0' + nightTimeStartEnd[1];
                                    }
                                    nightTimeStart = new Date('1900-01-01T' + nightTimeStartEnd[0]);
                                    nightTimeEnd = new Date('1900-01-01T' + nightTimeStartEnd[1]);
                                }
                                else {
                                    nightTimeStart = new Date('01-01-1970 ' + nightTimeStartEnd[0]);
                                    nightTimeEnd = new Date('01-01-1970 ' + nightTimeStartEnd[1]);
                                }
                                break;
                            }
                        default:
                            {
                                alert('Error ' + 'Uknown case (sendAPIRequest): ' + action);
                            }
                    }
                }
                else {
                    alert('Error ' + xhttp.status + ': ' + xhttp.statusText + '; Request: ' + requestName);
                }
                hideProgressBar();
            }
        };
        if (action === 'bookmark' | action === 'hide')
            showProgressBar();
    }
    catch (err) {
        alert('sendAPIRequest ' + err.message);
    }
}

