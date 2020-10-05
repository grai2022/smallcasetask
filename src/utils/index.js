module.exports.groupBy = function (list , keyGetter ) {
    if(!list.length) return {};
    const result = {};
    list.forEach(element => {
        let key = keyGetter(element);
        let collection = result[key];
        if(!collection){
            result[key] = [element];
        }else{
            collection.push(element);
        }
    });
    return result;
}

module.exports.isEmptyObject = function(object) {
    if(object && object.constructor == 'Object'){
        for(let i in object) return false;
    }
    return true;
    
}

module.exports._getUpdateQuantity = async(tradedQuantity, prevQuantity, type, deleteOption)=>{
    if(type == 'SELL'){
        return !deleteOption ? prevQuantity - tradedQuantity : prevQuantity + tradedQuantity;
    }else{
        return !deleteOption ? parseInt(prevQuantity) + parseInt(tradedQuantity) : parseInt(prevQuantity)- parseInt(tradedQuantity) ;
    }
}

module.exports._getUpdateAvg = async(tradedRate, tradedQuantity, prevAvgRate, prevQuantity, type, deleteOption)=>{
    if(type == 'SELL'){
        return prevQuantity == tradedQuantity ?  0.00 : prevAvgRate ;
    }else{
        if(deleteOption){
            return weightedAvg([prevQuantity, (-1)*tradedQuantity],[prevAvgRate, tradedRate])
        }
        return weightedAvg([prevQuantity,tradedQuantity],[prevAvgRate, tradedRate])
    }
}


weightedAvg = function(inputArr, weightAbsolute) {
    let weightSum   = 0;
    let weightedSum = 0;
    for(let i = 0; i<inputArr.length; i++){
        weightedSum += inputArr[i]*weightAbsolute[i];
        weightSum += inputArr[i];
    }
    return weightSum ? weightedSum/weightSum:0;
}