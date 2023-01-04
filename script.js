const productDom=document.querySelector('.products-center')
const cartTotalPrice=document.querySelector('.cart-total')
const cartTotalItems=document.querySelector('.cart-items')
const cartDom=document.querySelector('.cart-content')
const cartOverlay=document.querySelector('.cart-overlay')
const cartMain=document.querySelector('.cart')
const cartClose=document.querySelector('.close-cart')
const cartBtn=document.querySelector('.cart-btn')
const clearCartBtn=document.querySelector('.btn-clear')
const buyContent=document.querySelector('.buy-content')
const totalBuyPrice=document.querySelector('.total-buy-price')
const buyBtn=document.querySelector('.btn-buy')
const closeBuyModalBtn=document.querySelector('.close-buy-modal')
const buyModal = document.querySelector(".buy-modal")
const searchInput = document.querySelector(".search-input")
const searchBtn = document.querySelector(".search-btn")
const home = document.querySelector(".home")
const viewContent=document.querySelector('.view-content')
// const totalBuyPrice=document.querySelector('.total-buy-price')

const closeViewModalBtn=document.querySelector('.close-view-modal')
const viewModal = document.querySelector(".view-modal")



const renderProductsInDom=(products)=>{
    // console.log(products);
    let showInDom='';

    products.forEach((product) => {
        // console.log(product);
        let star="";
        for(let i=0;i<5;i++){
            if(i<product.rating){
                star+=`<i class="fas fa-star"></i>`
            }else{
                star+=`<i class="far fa-star"></i>`
            }
        }
        showInDom+=
        `<article class='product' data-id=${product.id}>
            <div class="img-container" data-id=${product.id}>
                <img src="${product.url}" alt="product" class="product-img" data-id=${product.id}>
                <button class="bag-btn" data-id=${product.id}><i class="fas fa-shopping-cart"></i>Add To Cart</button>
                <p>${product.title}</p>
            </div>
            <div>
                <h4 class="light">${product.type}</h4>
                <h4 class="price"><i class="fa-solid fa-indian-rupee-sign"></i> ${product.price}</h4>
            </div>
            <div class="star">
                ${star}
            </div>

            
        </article>`
    });

    productDom.innerHTML=showInDom

}


const getProducts=async()=>{
    let result=await fetch("Data/data.json")
    let products=await result.json()
    let data=products.items.map((item)=>{
        let {title,price,rating,type}=item.fields
        let id=item.sys.id;
        let url=item.fields.image.fields.file.url
        return {title,price,rating,type,id,url}
    })
    // console.log(data);
    return data
}

let cart=[];

// store in localStorage
const storeProductsInLocalStorage=(products)=>{
    localStorage.setItem("Products",JSON.stringify(products))
}
const getProductsFromLocalStorage=()=>{
    return JSON.parse(localStorage.getItem("Products"))
}
const getItemFromLocalStorage=(id)=>{
    return JSON.parse(localStorage.getItem("Products")).find((product)=>{return product.id==id})
}
const setCartItemInLocalStorageCart=(cart)=>{
    localStorage.setItem("Cart",JSON.stringify(cart))
}


// setting cart
const setCartTotalPrice=(cart)=>{
    let totalPrice=0;
    let totalItems=0;

    cart.forEach((cartItem)=>{
        totalPrice+=cartItem.price*cartItem.amount
        totalItems+=cartItem.amount
    })
    cartTotalPrice.innerHTML=parseFloat(totalPrice.toFixed(2))
    cartTotalItems.innerHTML=totalItems

}
const addCartItems=(cart)=>{
    let cartHtml=""

    cart.forEach((cartItem)=>{
        cartHtml+=`<div class="cart-item">
                        <img src="${cartItem.url}" alt="cart">
                        <div>
                            <h4>${cartItem.title}</h4>
                            <h5>${cartItem.price}</h5>
                            <span class="remove-item" data-id=${cartItem.id}>remove</span>
                        </div>
                        <div class="addremove" data-id=${cartItem.id}>
                            <i class="fas fa-plus-circle"></i>
                            <p class="itemNo">${cartItem.amount}</p>
                            <i class="fas fa-minus-circle"></i>
                        </div>
                   </div>`;
    })

    cartDom.innerHTML=cartHtml;
}

const resetButtons=()=>{
    let buttons=document.querySelectorAll(".bag-btn")
    buttons.forEach((btn)=>{
        let inCart=cart.find((item)=>{return item.id===btn.dataset.id})
        if(inCart){
            
            btn.innerHTML=='In Cart'
            btn.disabled=true
        }else{
            viewItem={};
            btn.disabled=false
            btn.innerHTML='Add to Cart'
        }
    })

}

const showCart=()=>{
    cartOverlay.classList.add("show-cart")
    cartMain.classList.add("transparentbg")
}
const closeCart=()=>{
    cartOverlay.classList.remove("show-cart")
    cartMain.classList.remove("transparentbg")
}
const clearCart=()=>{
    cart=[];
    viewItem={};
    setCartItemInLocalStorageCart(cart)
    setCartTotalPrice(cart)
    addCartItems(cart)
    closeCart();
    resetButtons()
}


// view details of product
const addItemsToViewModel=(cart)=>{
    let cartHtml=''
    // let totalPrice=0;
    cart.forEach((cartItem)=>{
        // totalPrice+=cartItem.price*cartItem.amount
        cartHtml+=`<div class=view-item>
                        <img src="${cartItem.url}" alt="cart">
                       
                        <div class="addremove" data-id=${cartItem.id}>
                            <div class="cart-footer">
                               <h3>${cartItem.title}<br><i class="fa-solid fa-indian-rupee-sign"></i>
                               <span class="total-buy-price">${cartItem.price}</span></h3>
                               <button onclick="viewAddToCartBtnFunctionality(event)" class="view-addToCartBtn" data-id=${cartItem.id}><i class="fas fa-shopping-cart"></i>Add To Cart</button>
                            </div>
                        </div>
                  </div>`;

    })
    viewContent.innerHTML=cartHtml;
    // totalBuyPrice.innerHTML=totalPrice;
}
const viewAddToCartBtnFunctionality=(e)=>{
    let domAddtoCartBtn=[...document.querySelectorAll(".bag-btn")]
    domAddtoCartBtn.forEach((btn)=>{
        // console.log(e.target.id);
        if(btn.dataset.id===e.target.dataset.id){
            console.log(btn)
            btn.innerHTML="IN CART";
            btn.disabled=true;
    }})
        let btn =e.target;
        btn.innerText='In cart'
        btn.disabled=true
        let selectedProduct=getItemFromLocalStorage(btn.dataset.id)
        selectedProduct={...selectedProduct,amount:1}
        cart=[...cart,selectedProduct]
        setCartItemInLocalStorageCart(cart)
        // console.log(selectedProduct);
        setCartTotalPrice(cart)
        addCartItems(cart)
        viewModal.style.display='none';
        showCart()

    
}

closeViewModalBtn.onclick=()=>{
    viewModal.style.display='none';
}
// show view modal
let viewItem={};
productDom.addEventListener('click',(e)=>{
    if(e.target.classList.contains('img-container')||(e.target.classList.contains('product-img')) ||(e.target.classList.contains('product'))){
        // viewItem=getItemFromLocalStorage(e.target.dataset.id);
        // console.log(viewItem.id);
        if(!(viewItem.id===e.target.dataset.id)){
        viewItem=getItemFromLocalStorage(e.target.dataset.id);
        let view=[viewItem]
        addItemsToViewModel(view)
        viewModal.style.display='block';
        }else{
            viewModal.style.display='block';
        }
        
    }
})

const cartFunctionality=()=>{
    cartDom.addEventListener("click",(event)=>{
        if(event.target.classList.contains('remove-item')){
            let indexToRemove=cart.findIndex((item)=>item.id===event.target.dataset.id)
            cart.splice(indexToRemove,1);
            setCartItemInLocalStorageCart(cart)
            setCartTotalPrice(cart)
            addCartItems(cart)
            resetButtons()
        }
        if(event.target.classList.contains("fa-plus-circle")){
            let tempItem=cart.find((item)=>item.id===event.target.parentElement.dataset.id)
            tempItem.amount+=1
            setCartItemInLocalStorageCart(cart)
            setCartTotalPrice(cart)
            addCartItems(cart)
        }
        if(event.target.classList.contains("fa-minus-circle")){
            let tempItem=cart.find((item)=>item.id===event.target.parentElement.dataset.id)
            if(tempItem.amount===1){
                let indexToRemove=cart.findIndex((item)=>item.id===event.target.parentElement.dataset.id)
                cart.splice(indexToRemove,1);
                setCartItemInLocalStorageCart(cart)
                setCartTotalPrice(cart)
                addCartItems(cart)
                resetButtons()
            }else{
                tempItem.amount-=1
                setCartItemInLocalStorageCart(cart)
                setCartTotalPrice(cart)
                addCartItems(cart)
            }

        }
    })
}

cartBtn.addEventListener("click",showCart)
clearCartBtn.addEventListener("click",clearCart)
cartClose.addEventListener("click",closeCart)

const addEventListerToAddToCartBtns=()=>{
   let btns= document.querySelectorAll('.bag-btn')
//    console.log(btns);
   btns.forEach((btn)=>{
    btn.addEventListener('click',()=>{
        
        if(!viewItem.id){
            console.log(viewItem);
            viewItem=getItemFromLocalStorage(btn.dataset.id);
            let view=[viewItem]
            addItemsToViewModel(view)
            // let viewCartBtn= document.querySelector('.view-addToCartBtn')
            // viewCartBtn.innerText='In cart'
            // viewCartBtn.disabled=true
        }
        if(viewItem.id===btn.dataset.id){
           let viewCartBtn= document.querySelector('.view-addToCartBtn')
           viewCartBtn.innerText='In cart'
           viewCartBtn.disabled=true
        }
        btn.innerText='In cart'
        btn.disabled=true
        let selectedProduct=getItemFromLocalStorage(btn.dataset.id)
        selectedProduct={...selectedProduct,amount:1}
        cart=[...cart,selectedProduct]
        setCartItemInLocalStorageCart(cart)
        console.log(selectedProduct);
        setCartTotalPrice(cart)
        addCartItems(cart)
        showCart()

    })
   })
}

// buy section
const addItemsToBuyModel=(cart)=>{
    let cartHtml=''
    let totalPrice=0;
    cart.forEach((cartItem)=>{
        totalPrice+=cartItem.price*cartItem.amount
        cartHtml+=`<div class=cart-item>
                        <img src="${cartItem.url}" alt="cart">
                        <div>
                            <h4>${cartItem.title}</h4>
                            <h5><i class="fa-solid fa-indian-rupee-sign"></i>${cartItem.price}</h5>
                        </div>
                        <div class="addremove" data-id=${cartItem.id}>
                            <p class="itemNo">Qty:${cartItem.amount}</p>
                        </div>
                  </div>`;

    })
    buyContent.innerHTML=cartHtml;
    totalBuyPrice.innerHTML=totalPrice;
}

closeBuyModalBtn.addEventListener('click',()=>{
    buyModal.style.display='none';
})

buyBtn.addEventListener("click",()=>{
    if(viewItem){
        viewItem={}
    }
    addItemsToBuyModel(cart)
    clearCart()
    closeCart()
    buyModal.style.display='block';
})

// Search
searchBtn.addEventListener('click',()=>{
    let inputValue=searchInput.value.toLowerCase();
    if(inputValue){
    let products=getProductsFromLocalStorage()
    products=products.filter((item)=>item.title.toLowerCase().includes(inputValue))
    renderProductsInDom(products)
    console.log(products);
    }



})
home.onclick=()=>{
    let products=getProductsFromLocalStorage()
    renderProductsInDom(products)
    searchInput.value=""
}


let data=getProducts()
data.then((products)=>{
    // console.log(res);
    renderProductsInDom(products)
    storeProductsInLocalStorage(products)
    addEventListerToAddToCartBtns();
    cartFunctionality();

})