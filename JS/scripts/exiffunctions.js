function populateExifData(id) {
    var photo = document.getElementById(id);
    var temp_img = document.getElementById("temp_img");
    if (temp_img !== null) {
        temp_img.remove();
    }

    var img = document.createElement('img');
    $(img).attr('id', 'temp_img');
    $(img).attr('src', photo.src.substring(0, photo.src.indexOf("?")));


    EXIF.getData(img, function () {
        var photoDate = EXIF.getTag(this, "DateTimeOriginal");
        if (!photoDate) {
            photoDate = EXIF.getTag(this, "DateTimeDigitized");
        }
        if (photoDate) {
            photoDate = photoDate.substring(0, 11);
            photoDate = photoDate.replace(/:/g, "-");
            photoDescription[$(photo).attr('pid')] = photoDate;
        }
        var GPSLatitude = EXIF.getTag(this, "GPSLatitude") + '';
        var GPSLongitude = EXIF.getTag(this, "GPSLongitude") + '';
        if (GPSLatitude !== 'NaN,NaN,NaN' && GPSLatitude !== undefined && GPSLatitude !== null && GPSLatitude !== 'NaN' && isNaN(GPSLatitude) && GPSLatitude !== 'undefined') {
            var latArray = GPSLatitude.split(',');
            var longArray = GPSLongitude.split(',');
            var latDec = parseInt(latArray[0]) + parseInt(latArray[1]) / 60 + parseInt(latArray[2]) / (60 * 60);
            var longDec = parseInt(longArray[0]) + parseInt(longArray[1]) / 60 + parseInt(longArray[2]) / (60 * 60);
            latDec = round(latDec, 6)
            longDec = round(longDec, 6)
            getCity(latDec, longDec, $(photo).attr('pid'));
        }
        else {
            var albumName = photo.src.substring(0, photo.src.indexOf("?"));
            var galEndPos = albumName.indexOf("galleries") + 10;
            albumName = albumName.substring(galEndPos);
            var slashPos = albumName.indexOf('/');
            albumName = albumName.substring(0, slashPos);
            albumName = albumName.replace(/%20/g, " ");
            photoDescription[$(photo).attr('pid')] = albumName;
        }
    });
}

function round(x, digits) {
    return parseFloat(x.toFixed(digits))
}

function getCity(lat, lng, pid) {
    var body = { latitude: lat, longitude: lng }
    sendAPIRequest('GeonameProcessor(00000000-0000-0000-0000-000000000000)/Microsoft.NAV.getGeodata', 'getGeodata', body, pid);    
    /*
    var $ = jQuery;
    var def = $.Deferred();
    //$.getJSON('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lng)
    $.getJSON('http://api.positionstack.com/v1/reverse?access_key=2a1c36cdd40e24621f4a6723b0f0a801&query=' + lat + ',' + lng)
        .done(function (data) {
            var result;
            if (data.data[0].region) {
                result = data.data[0].country + ', ' + data.data[0].region;
            }
            else {
                if (data.data[0].locality) {
                    result = data.data[0].country + ', ' + data.data[0].locality;
                }
                else {
                    if (data.data[0].country) {
                        result = data.data[0].country;
                    }
                }
            }
            result = result.replace("Kiev", "Kyiv");
            photoDescription[pid] = photoDescription[pid] + ' ' + result;

        })
        .fail(function () {
            def.reject();
        });
    return def.promise();
    */
}