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

function formgenerator(){
    return `
        <section class="login flex pt-24 justify-center">
            <div class="w-full max-w-xs md:max-w-md lg:max-w-lg">
                
                <h1 class="font bold text-lg mb-4">Enter the offer details.</h1>
                <form action="/addoffers" method="POST" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                 
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="couponCode">
                    COUPON
                    </label>
                    <input name="couponCode" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="couponCode" type="text" placeholder="Enter the Coupon Code.">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
                    Description
                    </label>
                    <input name="description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" type="text" placeholder="Enter the description.">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="discountPercent">
                    Percent Discount
                    </label>
                    <input name="discountPercent" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="discountPercent" type="text" placeholder="Enter the discount Percent">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="minimumOrderAmt">
                    Min. Order Amount
                    </label>
                    <input name="minimumOrderAmt" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="minimumOrderAmt" type="text" placeholder="Enter the minimum order amount">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="maxDiscount">
                    Max Discount
                    </label>
                    <input name="maxDiscount" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="maxDiscount" type="text" placeholder="Enter the maximum discount">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="termsandconditions">
                    Terms and Conditions
                    </label>
                    <input name="termsandconditions" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="termsandconditions" type="text" placeholder="Enter the Terms and Conditions">
                </div>
                <div class="flex items-center justify-between">
                    <button type="submit" class="btn-primary rounded-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                    Add
                    </button>
                </div>
                </form>
                <p class="text-center text-gray-500 text-xs">
                &copy;2020 Cake Wave. All rights reserved.
                </p>
            </div>
        </section>
    `
}

function formopener(){
    document.querySelector('.offer-adder').innerHTML=formgenerator();
}
const formbtn=document.getElementById('formadder');
if(formbtn){
    formbtn.addEventListener('click',(e)=>{
        formopener();
    })
}