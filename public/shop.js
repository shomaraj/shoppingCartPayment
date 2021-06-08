// alert("hi");

var addButtons=document.getElementsByClassName("cartBtn");
for(var i=0;i<addButtons.length;i++){
  var button=addButtons[i];
  button.addEventListener('click', onAddToCartClicked);
}

var quantityInputs = document.getElementsByClassName('cart-input');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', onQuantityChanged);
    }

var removeCartItemButtons = document.getElementsByClassName('btn-danger');
console.log(removeCartItemButtons);
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var removeButton = removeCartItemButtons[i];
        removeButton.addEventListener('click', removeCartItem);
    }
    document.getElementsByClassName('btn-buynow')[0].addEventListener('click', buynowClicked);

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'en',
    token: function(token) {
      console.log("tokenid   "+token.id);
        var items = [];
        var cartItemContainer = document.getElementsByClassName('cart-items')[0];
        var cartRows = cartItemContainer.getElementsByClassName('cart-row');
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i];
            console.log("cartrow=  "+cartRow);

            var quantityElement = document.getElementsByClassName('cart-input')[0];
            var quantity = quantityElement.value;
            console.log("quan elemvalue", +quantity);
            var id = cartRow.dataset.itemId;
            console.log(" cartrow id is" +id );
            items.push({
                id: id,
                quantity: quantity
            });
        }

        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items: items
            })
        }).then(function(res) {
            return res.json()
        }).then(function(data) {
            alert(data.message);
            var cartItems = document.getElementsByClassName('cart-items')[0];
            while (cartItems.hasChildNodes()) {
                cartItems.removeChild(cartItems.firstChild);
            }
            updateCartTotal();
        }).catch(function(error) {
            console.log(error)
        });
      }
});
    function buynowClicked() {
      var priceElement = document.getElementById('cartTotalPrice');
          var price = (priceElement.innerText.replace('$', '')) * 100;
            alert("Proceeding to checkout...You have to pay $ "+ price/100);
            console.log("price is",+price);
          stripeHandler.open({
              amount: price
          });
    }


  function onAddToCartClicked(event) {
    var clickedButton=event.target;
    var product=clickedButton.parentElement.parentElement;
    var product_title=product.getElementsByClassName("product_title")[0].innerText;
    var product_price=product.getElementsByClassName("product_price")[0].innerText;
    var product_imgsrc=product.getElementsByClassName("product_img")[0].src;
    var id= product.dataset.itemId;

console.log(product_title,product_price,id);
addItemToCart(product_title, product_price, product_imgsrc, id);
}

function addItemToCart(product_title, product_price, product_imgsrc, id) {
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = document.getElementsByClassName('cart-item-title');

    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == product_title) {
            alert('This item is already in your cart');
            return;
        }
    }
    var cartRow = document.createElement('div');
    cartRow.dataset.itemId=id;
    cartRow.classList.add('cart-row');

    cartRow.innerHTML = `

    <div class="cart-item cart-column col-lg-4 col-md-4 col-sm-4">
      <img class="cart-item-image" src="${product_imgsrc}" width="100" height="100">
      <span class="cart-item-title">${product_title}</span>
    </div>
     <span class="cart-item-price cart-column col-lg-4 col-md-4 col-sm-4">${product_price}</span>
    <div class="cart-quantity cart-column col-lg-4 col-md-4 col-sm-4">
      <input class="cart-input" type="number" value="1">
      <button class="btn btn-danger" type="button">REMOVE</button>
    </div> <br>
    `
    cartItems.append(cartRow);
  cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
  cartRow.getElementsByClassName('cart-input')[0].addEventListener('change', onQuantityChanged);

  updateCartTotal();
  document.getElementsByClassName("btn-buynow")[0].addEventListener("click", buynowClicked);
  }

  function onQuantityChanged(event) {

      var quantityInput = event.target;
      if (isNaN(quantityInput.value) || quantityInput.value <= 0) {
          quantityInput.value = 1;
        }
      updateCartTotal();
  }

      function removeCartItem(event) {
          var buttonClicked = event.target;
          buttonClicked.parentElement.parentElement.remove();
          updateCartTotal();
      }

function updateCartTotal() {
     var cartRows = document.getElementsByClassName('cart-row');
     var total = 0;
     var cartCount=0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-item-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-input')[0];
        if (priceElement == null || quantityElement == null) continue;
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var quantity = parseInt(quantityElement.value);
        cartCount=cartCount+quantity;
        total = total + (price * quantity);
    }
    console.log(cartCount);
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + Math.round(total * 100) / 100;
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;
    document.getElementsByClassName('cartCount')[0].innerText =" "+ cartCount+" ";
}
