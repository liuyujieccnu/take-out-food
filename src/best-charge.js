//创建一个新的商品对象
function item(id, name, price, count, promotion, total) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.count = count;
  this.promotion = promotion;
  this.total = total;
}

//累计节省的金额 哈希数组，优惠形式哈希数组保存
let promotionPrice = [];
promotionPrice['指定菜品半价'] = 0;
promotionPrice['最终'] = 0;
promotionPrice['全局'] = 0;
//累计总金额
let totalPrice = 0;

function initialize() {
  //累计节省的金额 哈希数组，优惠形式哈希数组保存
  promotionPrice['指定菜品半价'] = 0;
  promotionPrice['最终'] = 0;
  promotionPrice['全局'] = 0;
  //累计总金额
  totalPrice = 0;
}

//生成购买商品详情列表并计算价格（原价）并计算总价
function selecteditems(allItems, input) {
  let selecteditems = [];
  let select0 = [];//哈希数组用来保存barcode：count；
  for (let i = 0; i < input.length; i++) {
    let tag = input[i].split(' x ');
    //判断count是需要加的数量
    let con = Number(tag[1]);
    //生成barcode：count；
    if (typeof (select0[tag[0]]) === "undefined") {
      select0[tag[0]] = con;
    } else {
      select0[tag[0]] += con;
    }
  }
  //生成购买商品的列表
  for (let i in select0) {
    for (let j = 0; j < allItems.length; j++) {
      if (i === allItems[j].id) {
        selecteditems.push(new item(allItems[j].id, allItems[j].name, allItems[j].price, select0[i], '', allItems[j].price * select0[i]));
      }
    }
  }
  for (let item of selecteditems) {
    totalPrice += item.total;
  }
  return selecteditems;
}

//查询是否有单个优惠信息
function checkPromotions(Promotions, items) {
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < Promotions.length; j++) {
      if (typeof (Promotions[j].items) === "undefined") {
      } else if (Promotions[j].items.indexOf(items[i].id) !== -1) {
        items[i].promotion = Promotions[j].type;
      }
    }
  }
  return items;
}

//执行指定菜品半价
function halfPrice(item) {
  promotionPrice['指定菜品半价'] += item.total / 2;
  console.log(promotionPrice['指定菜品半价']);
}

//执行全局优惠
function thirtyMinusSix() {
  if(totalPrice>=30){
    promotionPrice['全局'] = Math.floor(totalPrice / 30) * 6;
  }else{
    promotionPrice['全局']=0;
  }
  console.log(promotionPrice['全局']);
}

//实现优惠
function prompt(items) {
  //执行全局优惠信息
  console.log(items);
  thirtyMinusSix();
  //查询单个优惠信息调用相关函数
  for (let i = 0; i < items.length; i++) {
    if (items[i].promotion === '指定菜品半价') {
      console.log(items[i]);
      halfPrice(items[i]);
    }

  }
  //比较确定优惠，生成总价
  if (promotionPrice['指定菜品半价'] > promotionPrice['全局']) {
    totalPrice = totalPrice - promotionPrice['指定菜品半价'];
    promotionPrice['最终'] = promotionPrice['指定菜品半价'];
  } else {
    totalPrice = totalPrice - promotionPrice['全局'];
    promotionPrice['最终'] = promotionPrice['全局'];
  }
}

//打印小票
function print(items) {
  let str = '============= 订餐明细 =============\n';
  for (let item of items) {
    str = str + item.name + ' x ' + item.count + ' = ' + item.total + '元\n';
  }
  if (promotionPrice['最终'] === 0) {
    str = str + '-----------------------------------\n总计：' + totalPrice + '元\n===================================';
  } else if (promotionPrice['最终'] === promotionPrice['全局']) {
    str = str + '-----------------------------------\n使用优惠:\n满30减6元，省' + promotionPrice['最终'] + '元\n-----------------------------------\n总计：' + +totalPrice + '元\n===================================';
  } else if (promotionPrice['最终'] === promotionPrice['指定菜品半价']) {
    str = str + '-----------------------------------\n使用优惠:\n指定菜品半价(';
    let halfGoods = [];
    for (let item of items) {
      if (item.promotion === '指定菜品半价') {
        halfGoods.push(item.name);
      }
    }
    // for (let i = 0; i < halfGoods.length; i++) {
    //   if (i !== halfGoods.length ) {
    //     str = str + halfGoods[i] + '，';
    //   }
    //   if (i === halfGoods.length ){
    //     str = str + halfGoods[i] + ')';
    //   }
    //   console.log(i);
    //   console.log(halfGoods.length);
    // }
    str = str + halfGoods.join("，");
    str = str + ')，省' + promotionPrice['最终'] + '元\n-----------------------------------\n总计：' + totalPrice + '元\n===================================';
  }
  console.log(str);
  return str;
}


function bestCharge(selectedItems) {
  initialize();
  let selected_items = selecteditems(loadAllItems(), selectedItems);
  selected_items = checkPromotions(loadPromotions(), selected_items);
  prompt(selected_items);
  return print(selected_items);
}
