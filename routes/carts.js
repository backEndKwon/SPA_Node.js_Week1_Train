const express = require("express");
const router = express.Router();

const Cart = require("../schemas/cart.js");
const Goods = require("../schemas/goods.js");


//localhost:3000/api/carts GET method로 호출할떄임

router.get("/carts", async (req, res) => {
  const carts = await Cart.find({});//cart안에있는 정보값을 모두 가져와서 carts에 넣는다
  //그러면 [{goodsId, quantity}]를 가져오게됨

  const goodsIds = carts.map((cart) => {
    return cart.goodsId //cart에있는 goodsId만 가져옴
  }) //[2,11,1]등등

  //요기있는 find는 몽고구스의 find기능이고 밑에 find는 배열의 find
  const goods = await Goods.find({goodsId : goodsIds});
  //Goods에 해당하는 모든정보를 가져올건데,
  //만약 goodsIds 변수안에 존재하는 값일 때에만 조회하라

  //notion에 보면 답은 객체 두개
  const results = carts.map((cart)=>{
    return {
      "quantity": cart.quantity,
      //이 find는 배열찾기의 find임
      "goods" : goods.find((item)=> item.goodsId === cart.goodsId),
    }
  })

  res.json({
    "carts" : results,
  })


});




module.exports = router;