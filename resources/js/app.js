import Noty from "noty";
import axios from 'axios';

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