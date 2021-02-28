import Noty from "noty";
import axios from 'axios';
import {initAdmin} from './admin';
import moment from 'moment';

//Update Cart
let addtocart=document.querySelectorAll('.add-to-cart')
const cartCounter=document.querySelector('#cartCounter');

function updatecart(cake){
    axios.post('/update-cart',cake).then(res=>{
        cartCounter.innerText=res.data.totalQty;
        new Noty({
            type:'success',
            timeout:1000,
            text: "Item added to cart",
            progressBar:false
          }).show();
    }).catch(err=>{
        new Noty({
            type:'error',
            timeout:1000,
            text: "Something went wrong!",
            progressBar:false
          }).show();
    })
}

addtocart.forEach((btn) => {
    btn.addEventListener('click',(e)=>{
        let cake= JSON.parse(btn.dataset.cake);
        updatecart(cake);
    })
});



const successAlert = document.querySelector('#success-alert');

if(successAlert){
    setTimeout(()=>{
        successAlert.remove()
    },2000)
}


//Order status
const hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
let time = document.createElement('small');

order = JSON.parse(order);
function updateStatus(order){
    let x=true;
    const allStatus=document.querySelectorAll('.status-line');
    for(let status of allStatus){
        status.classList.remove('step-completed');
        status.classList.remove('current');
    }
    for(let status of allStatus){
        if(x){
            status.classList.add('step-completed');
        }
        if(status.dataset.status===order.status){
            x=false;
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current');
            }
        }
    }
}

updateStatus(order);

//Socket
let socket = io();

//Join
if(order){
    socket.emit('join',`order_${order._id}`)
}

let adminAreaPath=window.location.pathname
if(adminAreaPath.includes('admin')){
    initAdmin(socket)
    socket.emit('join','adminRoom');
}

socket.on('orderUpdated',(data)=>{
    const updatedOrder = {...order};
    updatedOrder.updatedAt=moment().format();
    updatedOrder.status=data.status;
    updateStatus(updatedOrder);
    new Noty({
        type:'success',
        timeout:1000,
        text: "Order Updated",
        progressBar:false
      }).show();
})