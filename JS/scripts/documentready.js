$(document).ready(function () {
    try {        
        sendAPIRequest('FrameProcessor(00000000-0000-0000-0000-000000000000)/Microsoft.NAV.returnTimeInerval', 'timeInterval');
        sendAPIRequest('FrameProcessor(00000000-0000-0000-0000-000000000000)/Microsoft.NAV.returnNightTimeStartEnd', 'nightTimeStartEnd');
    }
    catch (err) {

        alert(err.message);
    }
});

