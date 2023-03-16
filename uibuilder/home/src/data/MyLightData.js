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
        let k = getItemValue(indbData, key)._value;
        let status = false;
        let level = 0;

        if(type == "dim") {
            if(k > 0) { status = true; level = k*100; }
        } else {
            status = k;
            if(k == true) { level = 0 }
        }

        newDataArray.push({
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
        let i = getItemValue(indbData, key);

        newDataArray.push({
            name : name,
            type : type,
            status : i._value,
            level : i.level,
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
    "indb/hue/LEVEL/00-Wohn-L02");

    // Wohnen Ceiling
    pushToArray_HM(newDataArray, indbData, "Wohnen Decke", "dim",
    "indb/homematic/LEVEL/00-Wohn-Licht");
    // Flur Ceiling
    pushToArray_HM(newDataArray, indbData, "Flur Decke", "onoff",
    "indb/homematic/STATE/00-Flur-Licht");
    // Treppe
    pushToArray_HM(newDataArray, indbData, "Treppe", "onoff",
    "indb/homematic/STATE/00-Treppe-Licht");

   


    return newDataArray;
}