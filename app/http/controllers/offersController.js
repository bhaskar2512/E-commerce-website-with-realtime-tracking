const Offer = require('../../models/offer');

function offersController(){
    return {
        async index(req,res){
            const offers=await Offer.find({});
            res.render('customers/offers',{offers});
        },
        async verify(req,res){
            const {discount}=req.body;
            const thatoffer = await Offer.findOne({couponCode:discount});
            if(!thatoffer){
                req.flash('notvalid','COUPON already used or Not Valid.');
                return res.redirect('/cart');
            }
            if(req.session.cart.totalPrice<thatoffer.minimumOrderAmt){
                req.flash('notvalid',`Minimum oder amount is ${thatoffer.minimumOrderAmt}.`);
                return res.redirect('/cart');
            }
            req.flash('valid','Hurray.! Discount applied.!');
            const total = req.session.cart.totalPrice;
            const percent = thatoffer.discountPercent;
            const dis = Math.min( thatoffer.maxDiscount , (total * percent)/100);
            req.session.discount = dis;
            return res.redirect('/cart');
        }
    }
}
module.exports = offersController;