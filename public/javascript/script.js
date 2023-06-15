
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
      }
    })
  })
