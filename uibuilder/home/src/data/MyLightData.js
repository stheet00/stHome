function getItemValue(indbData, key) {
    let d = indbData[key];
    
    if (typeof d !== 'undefined')
    {
        return d._value;
    }

    throw new Error('Item with key='+key+' not found.');
};

function pushToArray(newDataArray, indbData, name, type, key) { 
    try{
        let k = getItemValue(indbData, key);
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


export function getMyXlLightData(indbData) {
    let newDataArray = [];

    // Wohnen Ceiling
    pushToArray(newDataArray, indbData, "Wohnen Decke", "dim",
    "indb/homematic/LEVEL/00-Wohn-Licht");
    // Flur Ceiling
    pushToArray(newDataArray, indbData, "Flur Decke", "onoff",
    "indb/homematic/STATE/00-Flur-Licht");
    // Treppe
    pushToArray(newDataArray, indbData, "Treppe", "onoff",
    "indb/homematic/STATE/00-Treppe-Licht");

    return newDataArray;
}