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
const passport=require('passport');
const Emitter=require('events');

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

//Event Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter);

//Session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    store:mongoStore,
    cookie:{maxAge:24*60*60*1000}
})) 

//Passport Config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

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
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Global Middlewares
app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.user=req.user;
    next();
})

//routes
require('./routes/web')(app);

const server =  app.listen(PORT, ()=> {
                    console.log('listening on port ' + PORT);
                })

//Socket Connection
const io = require('socket.io')(server);

io.on('connection',(socket)=>{
    //Join
    //console.log(socket.id);
    socket.on('join',(orderId)=>{
        socket.join(orderId);
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)    
})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)    
})