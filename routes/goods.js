// /routes/goods.js
const express = require("express");

const router = express.Router();

const goods = [
  {
    goodsId: 4,
    name: "상품 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "상품 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 2,
    name: "상품 2",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "상품 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];

//상품 목록 조회 api
router.get("/goods", (req, res) => {
res.status(200).json({goods})
})


//상품상세조회 api
router.get("/goods/:goodsId",(req,res)=>{
  const {goodsId} = req.params;
  
  // let result = null;
  // for(const good of goods){
  //   if(Number(goodsId) === good.goodsId){
  //     result = good;
  //   }
  // }

  const [result] = goods.filter((good)=> Number(goodsId) === good.goodsId)

  res.status(200).json({detail:result});
})

//장바구니에 상품 넣고, 중복된값있으면 에러메세지 띄우기
const Cart = require("../schemas/cart.js");
router.post("/goods/:goodsId/cart",async(req,res)=>{
  const {goodsId} = req.params;  //{}으로 구조분해 할당형태로 전환, 왜냐면 객채형태로 받기때문에
  const {quantity} = req.body;

  const existsCarts = await Cart.find({goodsId});
  if(existsCarts.length){
    return res.status(400).json({success:false,
    errorMessage:"이미 장바구니에 해당하는 상품이 존재합니다."
  })
  }
await Cart.create({goodsId, quantity});

res.json({result : "success"})
})


//장바구니에서 수정
router.put("/goods/:goodId/cart",async(req,res)=>{
  const {goodsId} = req.params;
  const {quantity} = req.body;
  
  const existsCarts = await Cart.find({goodsId});

  //장바구니에 상품이 있어야 하므로 true
  if(existsCarts.length){
    await Cart.updateOne(
      {goodsId : goodsId}, 
      {$set : {quantity:quantity}} //실제로 값을 수정하는 부분 퀀티티값을 퀀티티값으로 수정
      )
  }

  res.status(200).json({success : true})
})

//카트내 상품 지우기삭제하기

router.delete("/goods/:goodsId/cart", async(req,res)=>{
  const {goodsId} = req.params;
 
  const existsCarts = await Cart.find({goodsId})
  if(existsCarts.length){
    await Cart.deleteOne({goodsId});
  }
    res.json({result:"success"})
  
})


const Goods = require("../schemas/goods.js")//폴더한칸 올라가기
router.post("/goods/",async (req,res)=> {
  const {goodsId, name, thumbnailUrl, category, price} = req.body;

    const goods = await Goods.find({goodsId});

    if(goods.length){
      return res.status(400).json({success : false,
      errorMessage : "이미 존재하는 GoodsId입니다."})
    }
    const createdGoods = await Goods.create({goodsId, name, thumbnailUrl, category, price})

      res.json({goods : createdGoods})


  })


module.exports = router;