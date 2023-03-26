function getItem(indbData, key) {
    let d = indbData[key];
    
    if (typeof d !== 'undefined')
    {
        return d;
    }

    throw new Error('Item with key='+key+' not found.');
};

function pushToArray(newDataArray, indbData, key, name , req, blends) { 
    try{
        let level = 0;
        blends.forEach(e => {
            let val = getItem(indbData, e)._value;
            level += val;
        })

        level = round(level / blends.length *100, 0);
       
        newDataArray.push({
            key : key,
            name : name,
            topic : "indb/homematic",
            level : level,
        });
    }
    catch(e) {
        console.warn(e.message);
    }
}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
} 

export function getMyXlWndDoorData(indbData) {
    let newDataArray = [];

    pushToArray(newDataArray, indbData, "All", "Alle",
    "indb/homematic/DIRECTION/00-All-Shutter.Req",
    ["indb/homematic/LEVEL/00-Wohn-Shutter-01", "indb/homematic/LEVEL/00-Wohn-Shutter-02",
    "indb/homematic/LEVEL/00-Wohn-Shutter-03", "indb/homematic/LEVEL/00-Wohn-Shutter-04",
    "indb/homematic/LEVEL/00-Wohn-Shutter-05", "indb/homematic/LEVEL/01-Kind1-Shutter-01",
    "indb/homematic/LEVEL/01-Kind1-Shutter-02", "indb/homematic/LEVEL/01-Kind1-Shutter-03",
    "indb/homematic/LEVEL/01-Kind2-Shutter-01", "indb/homematic/LEVEL/01-Kind2-Shutter-02",
    "indb/homematic/LEVEL/01-Kind2-Shutter-03", "indb/homematic/LEVEL/01-Bad-Shutter",
     "indb/homematic/LEVEL/02-Schlaf-Shutter-01"]);
   
    pushToArray(newDataArray, indbData, "00-Wohn-Shutter", "Wohnen",
    "indb/homematic/DIRECTION/00-Wohn-Shutter.Req",
    ["indb/homematic/LEVEL/00-Wohn-Shutter-01", "indb/homematic/LEVEL/00-Wohn-Shutter-02",
    "indb/homematic/LEVEL/00-Wohn-Shutter-03", "indb/homematic/LEVEL/00-Wohn-Shutter-04",
    "indb/homematic/LEVEL/00-Wohn-Shutter-05"]);

    pushToArray(newDataArray, indbData, "01-Kind1-Shutter", "Kind 1",
    "indb/homematic/DIRECTION/01-Kind1-Shutter.Req",
    ["indb/homematic/LEVEL/01-Kind1-Shutter-01", "indb/homematic/LEVEL/01-Kind1-Shutter-02",
    "indb/homematic/LEVEL/01-Kind1-Shutter-03"]);

    pushToArray(newDataArray, indbData, "01-Kind1-Shutter", "Kind 2",
    "indb/homematic/DIRECTION/01-Kind2-Shutter.Req",
    ["indb/homematic/LEVEL/01-Kind2-Shutter-01", "indb/homematic/LEVEL/01-Kind2-Shutter-02",
    "indb/homematic/LEVEL/01-Kind2-Shutter-03"]);

    pushToArray(newDataArray, indbData, "01-Bad-Shutter", "Bad",
    "indb/homematic/DIRECTION/01-Bad-Shutter.Req",
    ["indb/homematic/LEVEL/01-Bad-Shutter"]);

    pushToArray(newDataArray, indbData, "02-Schlaf-Shutter", "Schlafen",
    "indb/homematic/DIRECTION/02-Schlaf-Shutter.Req",
    ["indb/homematic/LEVEL/02-Schlaf-Shutter-01"]);

    return newDataArray;
}