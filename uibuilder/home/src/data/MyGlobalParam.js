function pushAllToArray(newDataArray, indbData) { 
    
        var keys = Object.keys(indbData);
        var results = keys.filter(e => e.startsWith("indb/globalParam/") == true);
        
        results.forEach(e => {
            let ee = indbData[e]

            try{

                let unit = ee.orig.unit != undefined ? ee.orig.unit : "";
                let dscLong = ee.orig.dscLong != undefined ? ee.orig.dscLong : "";

                newDataArray.push({
                    key : ee._measurement,
                    name : ee.orig.dsc,
                    value : ee.orig._value,
                    dscLong : dscLong,
                    unit : unit,
                    uiType : ee.orig.uiType,
                });
            }
            catch(e) {
                console.warn(e.message);
            }
        })
}

export function getMyGlobalParamData(indbData) {
    let newDataArray = [];

    pushAllToArray(newDataArray, indbData);

    return newDataArray;
}