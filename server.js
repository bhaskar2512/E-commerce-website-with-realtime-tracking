const express=require('express');
const app= express();
const ejs=require('ejs');
const path=require('path');
const expressLayouts=require('express-ejs-layouts');

const PORT = process.env.PORT || 3000

app.use(expressLayouts);
app.set('views',path.join(__dirname,'resources/views'));
app.set('view engine','ejs');

//Assets
app.use(express.static('public'));

//routes
app.get('/',(req,res)=>{
    res.render('home');
    //express ignores
    //error resolved https://stackoverflow.com/questions/21907526/express-ignoring-views-directory
})

app.get('/cart',(req,res)=>{
    res.render('customers/cart');
})

app.get('/login',(req,res)=>{
    res.render('auth/login');
})

app.get('/register',(req,res)=>{
    res.render('auth/register');
})

app.listen(PORT, ()=> {
    console.log('listening on port ' + PORT);
})