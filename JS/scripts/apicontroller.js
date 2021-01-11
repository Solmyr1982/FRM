function sendAPIRequest(requestName, action, body) {
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.withCredentials = true;
        var currentUser = appConfig.anonUserName;
        var currentPassword = appConfig.anonUserPass;
        xhttp.open("POST", appConfig.APIURL + requestName, true);
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
                                nightTimeStart = new Date('01-01-1970 ' + nightTimeStartEnd[0]);
                                nightTimeEnd = new Date('01-01-1970 ' + nightTimeStartEnd[1]);
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