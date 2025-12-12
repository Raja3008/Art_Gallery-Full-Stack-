let label = document.getElementById('label');

let shoppingcart = document.getElementById('shopping-cart');

let basket = JSON.parse(localStorage.getItem('data')) || [];

let calculate = () => {
  let carticon = document.getElementById('cartAmount');
  carticon.innerHTML = basket.length;
}

let generate_Cart_item = () => {
  if (basket.length !== 0) {
    return (shoppingcart.innerHTML = basket.map((x) => {
      let { id, name, price, item, img } = x;
      return `
        <div class='cart_item'>
          <span>${name}</span>
          <div class='cart_item_img'>
            <img src='${img}' alt='' width='100px' />
          </div>
          <h4>${price}</h4>
          <div class='checkout_area'>
          <button class='checkout'>Checkout</button>
          </div>
          <button class='rmv_btn' onclick="remove_from_cart(${id})"><i class="fa-solid fa-trash"></i></button>
        </div>
    
      `
    }).join(''))
  }else {
    shoppingcart.innerHTML = `<h3>Shopping cart is empty</h3>`;
  }
}
generate_Cart_item()
calculate()


let remove_from_cart = (id) => {
  basket = basket.filter((x) => x.id != id);
  localStorage.setItem('data', JSON.stringify(basket));
  calculate();
  generate_Cart_item();
}

const PayBtn=document.querySelector(".checkout");

PayBtn.addEventListener("click", ()=>{
  fetch("/stripe-checkout",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify({
      items:JSON.parse(localStorage.getItem('data'))
    }),
  })
  .then((res)=>res.json())
  .then((data) =>{
    if(data.url){
      window.location.href=data.url;
    }else{
      console.log("Invalid URL Recieved from the server",data.url);
    }
  })
  .catch((err) =>console.log(err));
})
