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
 
