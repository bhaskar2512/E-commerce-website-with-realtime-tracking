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
        },
        async addoffer(req,res){
            const {couponCode, description,discountPercent,minimumOrderAmt,maxDiscount,termsandconditions}=req.body;
            if(!couponCode|| !description|| !discountPercent || !minimumOrderAmt || !maxDiscount || !termsandconditions){
                req.flash('error','All fields are required.');
                return res.redirect('/offers');
            }
            Offer.exists({couponCode:couponCode},async (err,result)=>{
                if(result){
                    await Offer.findOneAndDelete({couponCode:couponCode});
                    const offer = new Offer({
                        couponCode:couponCode,
                        description:description,
                        discountPercent:discountPercent,
                        minimumOrderAmt:minimumOrderAmt,
                        maxDiscount:maxDiscount,
                        terms:termsandconditions
                    })
                    await offer.save();
                    req.flash('success','Offer successfully updated!');
                    return res.redirect('/offers');
                }else{
                    const offer = new Offer({
                        couponCode:couponCode,
                        description:description,
                        discountPercent:discountPercent,
                        minimumOrderAmt:minimumOrderAmt,
                        maxDiscount:maxDiscount,
                        terms:termsandconditions
                    })
                    await offer.save();
                    req.flash('success','Offer successfully created!');
                    return res.redirect('/offers');
                }
            })
        },
        async deleteoffer(req,res){
            const { couponCode } =req.body;
            await Offer.findOneAndDelete({couponCode:couponCode});
            return res.redirect('/offers')
        }
    }
}
module.exports = offersController;