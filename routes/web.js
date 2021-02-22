const homeController=require('../app/http/controllers/homeCantroller');
const authController=require('../app/http/controllers/authController');
const cartController=require('../app/http/controllers/customers/cartController');

function initRoutes(app){

    app.get('/',homeController().index);

    app.get('/login',authController().login);

    app.get('/register',authController().register);

    app.get('/cart',cartController().cart);

    app.post('/update-cart',cartController().update);
};
module.exports=initRoutes;