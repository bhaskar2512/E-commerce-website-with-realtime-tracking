function authController(){
    return {
        login(req,res){
            res.render('auth/login');
            //express ignores
            //error resolved https://stackoverflow.com/questions/21907526/express-ignoring-views-directory
        },
        register(req,res){
            res.render('auth/register');
        }
    }
}

module.exports=authController;