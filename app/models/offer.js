const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    couponCode:{type:String , required:true},//store coupon code after hashing 
    description:{type:String , required:true},
    discountPercent:{type:Number , required:true},
    minimumOrderAmt:{type:Number ,default:0},
    maxDiscount:{type:Number , required:true},
    terms:{type:String , required:true}
})
module.exports = mongoose.model('Offer',offerSchema);