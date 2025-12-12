
const shop = document.getElementById('shop1')

let basket =JSON.parse(localStorage.getItem('data')) || []

let generateshop= () =>{
  shop.innerHTML=shopItemsData.map((x) => {
    let {id,name,price,desc,img}=x

    return`
    <div class='shop_item' id=product-id-${id}>
        <img src='${img}' alt=' ' height='400px' />
        <div class='product_info'>
        <span>${name}</span>
        <h5>November 22 - November 28,2023</h5>
        <div class="star">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
         </div>
        <h4>${price}</h4>
        <button class='cart1' onclick="add_to_cart('${id}','${name}','${price}','${img}')"><i class="fas fa-bag-shopping"></i></button>
        </div>
    </div>
    `
  }).join('');
}

let add_to_cart=(id,name,price,img) => {
  let existingItemIndex = basket.findIndex(item => item.id === id);


  if (existingItemIndex !== -1) {
      return;
  }
  basket.push({
    id:id,
    item:1,
    name:name,
    price:price,
    img:img
  })
  localStorage.setItem('data',JSON.stringify(basket))
calculate()
}
let calculate = () => {
  let carticon = document.getElementById('cartAmount');
  carticon.innerHTML = basket.length;
}
calculate()
generateshop()


