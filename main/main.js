'use strict';


function tagsAddsCountAttribute(tags) {
  var newTags = [];
  var Tags = [];
  tags = tags.sort();
  for (var i = 0; i < tags.length; i++) {
    Tags[i] = tags[i].split('-');
    if (Tags[i].length == 1) {
      newTags.push(Tags[i]);
      newTags[i].push(1);
    } else {
      newTags.push(Tags[i]);
    }
  }
  return newTags;
}

function newTagstoBrandnewTags(newTags) {
  var j=0;
  var brandnewTags = [newTags[0]];
  var tag = newTags[0][0];
  for(var m=1; m<newTags.length; m++){
    if(newTags[m][0]==tag){
      brandnewTags[j][1]+=parseInt(newTags[m][1]);
    }else{
      tag = newTags[m][0];
      brandnewTags.push(newTags[m]);
      j++;
    }
  }
  return brandnewTags;
}

function newTagstoGoodsInfo(brandnewTags,initGoodsInfo) {
  var goodsInfo =[];
    for(var i=0; i<brandnewTags.length; i++)
      for(var j=0; j<initGoodsInfo.length; j++){
      if(brandnewTags[i][0]==initGoodsInfo[j].barcode){
        initGoodsInfo[j].count = brandnewTags[i][1];
        goodsInfo.push(initGoodsInfo[j]);
      }
    }
  return goodsInfo;
  }

function computeDiscount(goodsInfo,discountItems) {
  var discountArr = [];
  for(var i=0; i<goodsInfo.length; i++)
    for(var j=0; j<discountItems[0].barcodes.length; j++){
      if(goodsInfo[i].barcode==discountItems[0].barcodes[j]&&goodsInfo[i].count>2){
          discountArr.push({barcode:goodsInfo[i].barcode,discount:goodsInfo[i].price});
        }
      }

  return discountArr;
}

function computePerSum(goodsInfo,discountArr) {
  var perSum = [];
  for(var m=0; m<goodsInfo.length; m++){
    perSum[m]=goodsInfo[m].count*goodsInfo[m].price;
  }

  for(var i=0; i<goodsInfo.length; i++)
    for(var j=0; j<discountArr.length; j++) {
      if (goodsInfo[i].barcode == discountArr[j].barcode) {
        perSum[i] -= discountArr[j].discount;
      }
    }
  return perSum;
}

function computeTotalPrice(perSum){
  var totalPrice = 0;
  for(var i=0; i<perSum.length; i++){
    totalPrice+=perSum[i];
  }
  return totalPrice;
}

function computeToalDiscount(discountArr) {
  var totalDiscount = 0;
  for(var i=0; i<discountArr.length; i++){
    totalDiscount+=discountArr[i].discount;
  }
  return totalDiscount;
}

function printstr (goodsInfo,perSum,totalPrice,totalDiscount){
  var str ="***<没钱赚商店>收据***"+'\n';
  for(var i=0; i<goodsInfo.length;i++)
    str+=("名称："+goodsInfo[i].name+"，数量："+goodsInfo[i].count+goodsInfo[i].unit+"，单价："
    +(goodsInfo[i].price).toFixed(2)+"(元)，小计："+perSum[i].toFixed(2)+"(元)"+'\n');
  str+= ("----------------------"+'\n'+"总计："+totalPrice.toFixed(2)+"(元)"+'\n'+
    "节省："+totalDiscount.toFixed(2)+"(元)"+'\n'+"**********************");
  return str;
}

function printReceipt(tags){
  var initGoodsInfo = loadAllItems();
  var discountItems = loadPromotions();
  var newTags = tagsAddsCountAttribute(tags);
  var brandnewTags=newTagstoBrandnewTags(newTags);
  var goodsInfo = newTagstoGoodsInfo(brandnewTags,initGoodsInfo);
  var discountArr = computeDiscount(goodsInfo,discountItems);
  var perSum = computePerSum(goodsInfo,discountArr);
  var totalPrice = computeTotalPrice(perSum);
  var totalDiscount = computeToalDiscount(discountArr);
  var str = printstr (goodsInfo,perSum,totalPrice,totalDiscount);
  console.log(str);
}
