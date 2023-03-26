function getItemValue(indbData, key) {
    let d = indbData[key];
    
    if (typeof d !== 'undefined')
    {
        return d._value;
    }

    throw new Error('Item with key='+key+' not found.');
};

function pushToArray(newDataArray, indbData, key, name , acPower, acPower2) { 
    try{
        let acp = getItemValue(indbData, acPower);
        if(key == "Pv") {
            let acp2 = getItemValue(indbData, acPower2);
            acp = acp + acp2;
        }
        
        let dir = " ";
        let power = acp;
        let unit = "kW";
        
        if(acp < 1 && acp > -1) {
            power = acp*1000;
            unit = "W";
        } else {
            power = round(acp,1);
        }

        if(key == "Feed-In") {
            if(acp < 0) { dir = "Export"}
            else { dir = "Import"}
        }
   
        if(power < 0) {power = power * (-1)}

        if(key == "Battery") {
            if(acp < 0) { dir = "Laden " + power + " "+ unit }
            else { dir = "Entladen " + power + " "+ unit }

            let acp2 = getItemValue(indbData, acPower2);
            power = acp2;
            unit = "%";
        }

        power = round(power, 2);
        
        newDataArray.push({
            key : key,
            name : name,
            direction : dir,
            power : power,
            unit : unit
        });
    }
    catch(e) {
        console.warn(e.message);
    }
}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
} 

export function getMyXlPowerManData(indbData) {
    let newDataArray = [];

    pushToArray(newDataArray, indbData, "Home", "Haus",
    "indb/powerman/ac_Power/house/1");
    pushToArray(newDataArray, indbData, "Feed-In", "Netz",
    "indb/powerman/ac_Power/evu-meter/1");
    pushToArray(newDataArray, indbData, "Pv", "Solar",
    "indb/powerman/ac_Power/inverter/1", "indb/powerman/ac_Power/inverter/2");
    pushToArray(newDataArray, indbData, "Battery", "Batterie",
    "indb/powerman/ac_Power/battery/1","indb/powerman/soc/battery/1");


    return newDataArray;
}