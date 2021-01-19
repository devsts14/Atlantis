const express =require('express');
const router=express.Router()
const {authCheck,adminCheck} =require("../middlewares/auth")


const {orders,orderStatus,getSingleAdminOrder} = require('../controllers/admin')

router.get('/admin/orders',authCheck,adminCheck,orders)
router.put('/admin/order-status',authCheck,adminCheck,orderStatus)
router.get('/admin/order/:orderId',authCheck,adminCheck,getSingleAdminOrder)

module.exports = router;