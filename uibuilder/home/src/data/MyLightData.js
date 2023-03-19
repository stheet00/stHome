function getItem(indbData, key) {
    let d = indbData[key];
    
    if (typeof d !== 'undefined')
    {
        return d;
    }

    throw new Error('Item with key='+key+' not found.');
};

function pushToArray_HM(newDataArray, indbData, name, type, key) { 
    try{
        let i = getItem(indbData, key);
        let k = i._value;
        let status = false;
        let level = 0;

        if(type == "dim") {
            if(k > 0) { status = true; level = k*100; }
        } else {
            status = k;
            if(k == true) { level = 0 }
        }

        newDataArray.push({
            key : i.name,
            topic : i.topic,
            name : name,
            type : type,
            status : status,
            level : level
        });
    }
    catch(e) {
        console.warn(e.message);
    }
}

function pushToArray_HUE(newDataArray, indbData, name, type, key) { 
    try{
        let i = getItem(indbData, key);

        newDataArray.push({
            key : i.name,
            topic : i.topic,
            name : name,
            type : type,
            status : i._value,
            level : Math.ceil(i.level),
            color : i.color
        });
    }
    catch(e) {
        console.warn(e.message);
    }
}

export function getMyXlLightData(indbData) {
    let newDataArray = [];

    // Wohnen HUE
    pushToArray_HUE(newDataArray, indbData, "Wohnen HUE", "dim",
    "indb/hue/light/group/00-Wohn");
    // Wohnen Ceiling
    pushToArray_HM(newDataArray, indbData, "Wohnen Decke", "dim",
    "indb/homematic/LEVEL/00-Wohn-Licht");

    // Bad HUE
    pushToArray_HUE(newDataArray, indbData, "Bad HUE", "dim",
    "indb/hue/light/group/01-Bad");
    // Kind 2 HUE
    pushToArray_HUE(newDataArray, indbData, "Kind 2 HUE", "dim",
    "indb/hue/light/group/01-Kind2");

    // Outdoor HUE
    pushToArray_HUE(newDataArray, indbData, "Draussen HUE", "dim",
    "indb/hue/light/group/00-Outdoor");

    // Flur Ceiling
    pushToArray_HM(newDataArray, indbData, "Flur Decke", "onoff",
    "indb/homematic/STATE/00-Flur-Licht");
    // Treppe
    pushToArray_HM(newDataArray, indbData, "Treppe", "onoff",
    "indb/homematic/STATE/00-Treppe-Licht");

    return newDataArray;
}