require('dotenv').config();
const express=require('express');
const app= express();
const ejs=require('ejs');
const path=require('path');
const expressLayouts=require('express-ejs-layouts');
const PORT = process.env.PORT || 3000
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('express-flash');
const MongoDBStore=require('connect-mongo')(session);

//Database Connections
const url='mongodb://localhost/cake';
mongoose.connect(url,{ useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify:true });
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log('Database connected...');
}).catch(err=>{
    console.log('Connection failed...');
})

//Session Store
const mongoStore=new MongoDBStore({
    mongooseConnection:connection,
    collection:'sessions'
})

//Session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    store:mongoStore,
    cookie:{maxAge:24*60*60*1000}
}))

app.use(flash());

//Set Template Engine
app.use(expressLayouts);
app.set('views',path.join(__dirname,'resources/views'));
app.set('view engine','ejs');

//Assets
app.use(express.static('public'));
app.use(express.json());

//Global Middlewares
app.use((req,res,next)=>{
    res.locals.session=req.session;
    next();
})

//routes
require('./routes/web')(app);

app.listen(PORT, ()=> {
    console.log('listening on port ' + PORT);
})