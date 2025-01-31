const menu = document.getElementById("menu")

const cartBtn = document.getElementById("cart-btn")

const cartModal = document.getElementById("cart-modal")

const cartItemsContainer = document.getElementById("cart-itens")

const cartTotal = document.getElementById("cart-total")

const checkoutBtn = document.getElementById("checkout-btn")

const closeModelBtn = document.getElementById("close-model-btn")

const cartCount = document.getElementById("cart-count")

const addressWarn = document.getElementById("address-warn")

const addressInput = document.getElementById("address")

let cart = [];

//abrir o carrinho
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
    updateCartModal()
})

//fechar o carrinho
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModelBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//add itens no carrinho

menu.addEventListener("click", function(event){
    let buttonAddCarrinho = event.target.closest(".add-to-cart-btn")

    if(buttonAddCarrinho){
        const name = buttonAddCarrinho.getAttribute("data-name")
        const price = parseFloat(buttonAddCarrinho.getAttribute("data-price"))

        addToCart(name, price)
       
    }
})

function addToCart (name, price){
    const itenExistente = cart.find(item => item.name === name)

    if(itenExistente){
        itenExistente.quantity += 1;
    }
    else{
        cart.push({ 
            name,      
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

//Atualizando carrinho

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("display:flex", "justify-between", "margin-bottom:4px")
        cartItemElement.innerHTML = `
        <div style="display:flex; align-items: center; justify-content: space-between;">
            <div>
                <p style=" font-weight: bold; font-size: 20px; margin-bottom: 15px;">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p>R$ ${item.price.toFixed(2)}</p>
            </div>

            <div>
                <button class="remover-btn" data-name="${item.name}">Remover</button>
            </div>
        </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
    cartCount.innerHTML= cart.length
}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remover-btn")){
    const name = event.target.getAttribute("data-name")
    removeItemCart(name);

}
})
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal()
       
    }
}

// Endereço...
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressInput.classList.add("hidden")
    }

})
    // Finalizar Pedido
checkoutBtn.addEventListener("click", function() {
    const isOpen = checkRestaurantOpen();
    if(!isOpen){

        Toastify({
            text: "Ops! Restaurante está Fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "red",
            },
          }).showToast();

        return;
   }

    if(cart.length === 0)return;
    if(addressInput.value === ""){
    
        Toastify({
            text: "Por Favor! Digite Seu Endereço Completo",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "red",
            },
          }).showToast();

        return;
      
}

//Enviar o pedido para api whats
const cartItens = cart.map((item) => {
    return (
        ` ${item.name} Quantidade: (${item.quantity}) preço: R$${item.price} | `
    )
}).join("")

const message = encodeURIComponent(cartItens)
const phone = "5581987925408"

window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value} ` ,"_blank")

cart = [];
updateCartModal();

})

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();


