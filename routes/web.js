const homeController=require('../app/http/controllers/homeCantroller');
const authController=require('../app/http/controllers/authController');
const cartController=require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');
const offersController = require('../app/http/controllers/offersController');
const addController = require('../app/http/controllers/admin/addController');
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/img/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.png') 
    }
})
const upload = multer({storage:storage});  
//Middlewares
const guest=require('../app/http/middleware/guest');
const auth=require('../app/http/middleware/auth');
const admin=require('../app/http/middleware/admin'); 
function initRoutes(app){

    app.get('/',homeController().index);

    app.get('/login',guest,authController().login);

    app.post('/login',authController().postLogin);

    app.post('/logout',authController().logout);

    app.get('/register',guest,authController().register);

    app.post('/register',authController().postRegister);

    app.get('/cart',cartController().cart);

    app.post('/update-cart',cartController().update);

    app.get('/offers',offersController().index);

    app.post('/verify',offersController().verify);

    //customer Routes
    app.post('/orders',auth ,orderController().store);

    app.get('/customers/orders',auth ,orderController().index);

    app.get('/customers/orders/:id',auth ,orderController().status);

    //Admin Controllers
    app.get('/addcakes',admin, addController().index);

    app.post('/addcakes',admin, upload.single('image'), addController().addCake);

    app.post('/addoffers',admin ,offersController().addoffer);

    app.post('/deleteoffer',admin ,offersController().deleteoffer);

    app.post('/deletecake',admin,addController().deleteCake);

    app.get('/admin/orders',admin,adminOrderController().index);

    app.post('/admin/order/status', admin, statusController().update);


};
module.exports=initRoutes;