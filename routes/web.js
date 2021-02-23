const homeController=require('../app/http/controllers/homeCantroller');
const authController=require('../app/http/controllers/authController');
const cartController=require('../app/http/controllers/customers/cartController');
const guest=require('../app/http/middleware/guest');

function initRoutes(app){

    app.get('/',homeController().index);

    app.get('/login',guest,authController().login);

    app.post('/login',authController().postLogin);

    app.post('/logout',authController().logout);

    app.get('/register',guest,authController().register);

    app.post('/register',authController().postRegister);

    app.get('/cart',cartController().cart);

    app.post('/update-cart',cartController().update);
};
module.exports=initRoutes;