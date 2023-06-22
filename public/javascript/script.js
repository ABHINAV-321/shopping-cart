
function addCart(proId){
    console.log('function ok')
 $.ajax({
    url:"/add/"+proId, 
    method:"get",
    success:(response)=>{
      if(response.status){
      
        let count=$('#count-'+proId).html()
        count=parseInt(count)+1
        $('#count-'+proId).html(count)
     //   alert(response.total)
       // document.getElementById(total).innerHTML=response.total
        $('#total').html(response.total)
    //   alert("hi"+price)
        

      }else{
  
      }
    }
 }) 
  }
function subCart(proId){
    console.log('function ok')
let Qty=$('#count-'+proId).html()
        Qty=parseInt(Qty)-1
 $.ajax({
    url:"/sub/?id="+proId+"&Qty="+Qty, 
    method:"get", 
    success:(response)=>{
  
      if(response.status){
        
        let count=$('#count-'+proId).html()
        if(count==1){
          alert('item removed from cart')
          location.reload()
        }
        else{
        count=parseInt(count)-1
   //   alert(count)
        $('#count-'+proId).html(count)
        $('#total').html(response.total)
        }
//alert("count"+count)
      }else{
    //    alert(response)
      }
    }
 }) 
  }
function addToCart(proId){
 //   console.log('function ok')
 $.ajax({
    url:"/add-to-cart/"+proId, 
    method:"get", 
    success:(response)=>{
  //    alert(response)
      if(response.status){
        let count=$('#cart-count').html()
        count=parseInt(count)+1
        $('#cart-count').html(count)
//alert("count"+count)
      }
    }
  })
}




$("#checkout-form").submit((e)=>{
    e.preventDefault()
 /*   alert('hi')*/
    $.ajax({
      url:'/place-order', 
      method:'post', 
      data:$('#checkout-form').serialize(), 
      success:(response)=>{
        alert(response)
        if(response.status){
          location.href='/place-order/success/'
        }else{
          razorPay(response)
        }
      }
    })
  })
function razorPay(order){
 // console.log(order)
 // alert(order.response.amount)
    var options = {
    "key": "rzp_test_1j9NAXYvf2fWEB", // Enter the Key ID generated from the Dashboard
    "amount": order.response.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "pack of peer",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id":order.response.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response){
    //    alert(response.razorpay_payment_id);
  //      alert(response.razorpay_order_id);
     //   alert(response.razorpay_signature)

        verifyPayment(response, order)
    },
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9000090000"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
rzp1.open();
}
  
function verifyPayment(payment, order){
    let details=[{payment}, {order}]
    alert(details)
    alert(payment.razorpay_payment_id)
    console.log(payment.razorpay_payment_id)
    $.ajax({
      url:'/verify-payment',
      method:'post',
      data:{
           paymentDetails:payment,
           orderDetails:order
           
      }
    })
  }
