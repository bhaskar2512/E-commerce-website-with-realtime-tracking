const Menu=require('../../models/menu');

function homeController(){
    return {
        async index(req,res){
            const cakes=await Menu.find();
            res.render('home',{cakes:cakes});
            //express ignores
            //error resolved https://stackoverflow.com/questions/21907526/express-ignoring-views-directory
        }
    }
}

module.exports=homeController;