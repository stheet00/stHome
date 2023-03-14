function getItemValue(indbData, key) {
    let d = indbData[key];
    
    if (typeof d !== 'undefined')
    {
        return d._value;
    }

    throw new Error('Item with key='+key+' not found.');
};

function pushToArray(newDataArray, indbData, name , keyTemp, keyHumi) { 
    try{
        let t = getItemValue(indbData, keyTemp);
        let h = getItemValue(indbData, keyHumi);

        newDataArray.push({
            name : name,
            temp : t,
            humi : h
        });
    }
    catch(e) {
        console.warn(e.message);
    }
}

export function getMyXlClimateData(indbData) {
    let newDataArray = [];

    pushToArray(newDataArray, indbData, "Outdoor",
    "indb/homematic/TEMPERATURE/00-Outdoor-Temp.vNorth", "indb/homematic/HUMIDITY/00-Outdoor-Temp.vNorth");
    pushToArray(newDataArray, indbData, "Wohnen",
    "indb/homematic/ACTUAL_TEMPERATURE/00-Wohn-Temp", "indb/homematic/HUMIDITY/00-Wohn-Temp");
    pushToArray(newDataArray, indbData, "Kind 1",
    "indb/homematic/ACTUAL_TEMPERATURE/01-Kind1-Temp", "indb/homematic/HUMIDITY/01-Kind1-Temp");
    pushToArray(newDataArray, indbData, "Kind 2",
    "indb/homematic/ACTUAL_TEMPERATURE/01-Kind2-Temp", "indb/homematic/HUMIDITY/01-Kind2-Temp");
    pushToArray(newDataArray, indbData, "Bad",
    "indb/homematic/ACTUAL_TEMPERATURE/01-Bad-Temp", "indb/homematic/HUMIDITY/01-Bad-Temp");
    pushToArray(newDataArray, indbData, "Schlafen",
    "indb/homematic/TEMPERATURE/02-Schlaf-Temp", "indb/homematic/HUMIDITY/02-Schlaf-Temp");
    pushToArray(newDataArray, indbData, "Keller",
    "indb/homematic/TEMPERATURE/-01-Keller-Temp", "indb/homematic/HUMIDITY/-01-Keller-Temp");

    return newDataArray;
}