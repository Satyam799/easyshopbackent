const express = require("express");
const Order = require("../Modals/order");
const OrderItem = require("../Modals/order-items");
const router = express.Router();

router.get("/", async (req, res) => {
  const alldata = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  res.status(200).json({
    data: alldata,
  });
});

router.get("/:id", async (req, res) => {
  const alldata = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  res.status(200).json({
    data: alldata,
  });
});

router.post("/", async (req, res) => {
  const OrderItems = Promise.all(
    req.body.orderItems.map(async (element) => {
      const datastore = await OrderItem.create({
        quantity: element.quantity,
        product: element.product,
      });

      return datastore._id;
    })
  );

  const orderids = await OrderItems;

  const totalproice = await Promise.all(orderids.map(async (el) => {
    const dataorderitem = await OrderItem.findById(el).populate('product')
    console.log(dataorderitem)
    const totalpriceofeach = +dataorderitem.product.price * dataorderitem.quantity;
    return totalpriceofeach;
  }))
  const totaltotalprice=totalproice.reduce((acc,crr)=>acc+crr,0)
  const product = await Order.create({
    orderItems: orderids,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totaltotalprice,
    user: req.body.user,
    dateOrdered: req.body.dateOrdered,
  });

  if (!product) res.status(500).json("Unable to create the product");
  res.status(200).json({
    data: product,
  });
});

router.put("/:id", async (req, res) => {
  try {
    const alldata = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.status(200).json({
      data: alldata,
    });
  } catch (err) {
    res.status(400).json({
      message: "unable to update the data",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const dataid = await Order.findById(req.params.id);
    if (dataid) {
      const alldata = await Order.findByIdAndDelete(req.params.id);

      const datadeletefromorderitem = await Promise.all(
        dataid.orderItems.map(async (el) => {
          return await OrderItem.findByIdAndDelete(el);
        })
      );
    }
    res.status(200).json({
      message: "Deleted successfuly",
    });
  } catch (err) {
    res.status(400).json({
      message: "unable to update the data",
    });
  }
});

router.delete("/", async (req, res) => {
  await OrderItem.deleteMany();
  res.send("done");
});

router.get('/get/totalsales',async(req,res)=>{

  const totalsales=await Order.aggregate([

    {$group:{_id:null,totalsales:{$sum:'$totalPrice'}}}
  ])

  if(!totalsales)return res.status(400).send("Unable to find toal sales")
  return res.status(200).send(totalsales)
})

router.get('/get/ordercount',async(req,res)=>{
 const ordercount=await Order.countDocuments()

 res.status(200).json({orderstotal:ordercount})
})

router.get('/get/orders/:userid',async(req,res)=>{
try{
const data=await Order.find({user:req.params.userid}).populate({path:'orderItems',populate:{path:'product',populate:'category'}})
return res.send(data)
}catch(err){
 res.status(400).json({error:err})
}




})


module.exports = router;

/*
{
  "orderItems": [
   {
    "quantity":2,
    "product":"66425fec332b7ed71b8c01e5"
   },{
    "quantity":5,
    "product":"6643a5efa1e8849cc0bc72b5"
   }
  ],
  "shippingAddress1": "123 Main St",
  "shippingAddress2": "Apt 101",
  "city": "New York",
  "zip": "10001",
  "country": "USA",
  "phone": "123-456-7890",
  "status": "Pending",
  "totalPrice": 150.99,
  "user": "6644fc10c0c6446d980d23ca",  // Sample User ObjectId
  "dateOrdered": "2024-05-18T12:00:00Z"
}
*/
