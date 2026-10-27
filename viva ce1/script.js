// Product information
const products = [
  { id: 1, name: "iPhone", category: "Electronics", price: 149999, image: "iphone.jpeg" },
  { id: 2, name: "MacBook", category: "Electronics", price: 129999, image: "mac.jpeg" },
  { id: 3, name: "Running Shoes", category: "Footwear", price: 2499, image: "shoes.jpeg" },
  { id: 4, name: "Premium T-Shirt", category: "Clothing", price: 999, image: "t-shirt.jpeg" },
  { id: 5, name: "Classic Hoodie", category: "Clothing", price: 1499, image: "hoodie.jpeg" },
];

// Shopping cart information
let cart = [];
let couponApplied = false;

function getElement(id) {
  return document.getElementById(id);
}

function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Show products that match the search and filters
function showProducts() {
  const searchText = getElement("search").value.toLowerCase();
  const selectedCategory = getElement("category").value;
  const sortOrder = getElement("sort").value;
  let matchingProducts = [];

  for (const product of products) {
    const matchesSearch = product.name.toLowerCase().includes(searchText);
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    if (matchesSearch && matchesCategory) {
      matchingProducts.push(product);
    }
  }

  if (sortOrder === "low") {
    matchingProducts.sort((first, second) => first.price - second.price);
  } else if (sortOrder === "high") {
    matchingProducts.sort((first, second) => second.price - first.price);
  }

  const resultCount = matchingProducts.length;
  let productText = resultCount === 1 ? " product" : " products";
  getElement("resultCount").textContent = resultCount + productText;

  let productHTML = "";
  for (const product of matchingProducts) {
    productHTML += `
      <div class="product-card">
        <img src="images/${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${formatPrice(product.price)}</p>
        <button onclick="addCart(${product.id}, this)">Add to Cart</button>
      </div>`;
  }

  if (matchingProducts.length === 0) {
    productHTML = "<p>No products found.</p>";
  }

  getElement("productGrid").innerHTML = productHTML;
}

// Add a product to the cart
function addCart(id, button) {
  let cartItem = null;

  for (const item of cart) {
    if (item.id === id) {
      cartItem = item;
      break;
    }
  }

  if (cartItem) {
    cartItem.qty++;
  } else {
    cart.push({ id: id, qty: 1 });
  }

  button.textContent = "Added ✓";
  setTimeout(function () {
    if (button.isConnected) {
      button.textContent = "Add to Cart";
    }
  }, 1000);

  showCart();
}

// Show cart items and update totals
function showCart() {
  let cartHTML = "";
  let subtotal = 0;
  let itemCount = 0;

  for (const cartItem of cart) {
    let product = products.find(function (item) {
      return item.id === cartItem.id;
    });

    subtotal += product.price * cartItem.qty;
    itemCount += cartItem.qty;
    cartHTML += `
      <div class="cart-item">
        <div>
          <strong>${product.name}</strong>
          <p>${formatPrice(product.price)} × ${cartItem.qty}</p>
          <button onclick="changeQty(${product.id}, -1)">−</button>
          <button onclick="changeQty(${product.id}, 1)">+</button>
        </div>
        <button onclick="removeCart(${product.id})">Remove</button>
      </div>`;
  }

  if (cart.length === 0) {
    cartHTML = "<p>Your cart is empty.</p>";
    couponApplied = false;
    getElement("message").textContent = "";
  }

  let discount = 0;
  if (couponApplied) {
    discount = Math.round(subtotal * 0.1);
  }

  getElement("cartItems").innerHTML = cartHTML;
  getElement("count").textContent = itemCount;
  getElement("subtotal").textContent = formatPrice(subtotal);
  getElement("discount").textContent = formatPrice(discount);
  getElement("total").textContent = formatPrice(subtotal - discount);
}

// Increase or decrease the quantity of a cart item
function changeQty(id, amount) {
  for (const item of cart) {
    if (item.id === id) {
      item.qty += amount;

      if (item.qty <= 0) {
        removeCart(id);
      } else {
        showCart();
      }
      return;
    }
  }
}

// Remove a product from the cart
function removeCart(id) {
  let updatedCart = [];

  for (const item of cart) {
    if (item.id !== id) {
      updatedCart.push(item);
    }
  }

  cart = updatedCart;
  showCart();
}

function toggleCart() {
  getElement("cartPanel").classList.toggle("open");
}

// Apply the SAVE10 coupon code
function applyCoupon() {
  const code = getElement("coupon").value.trim().toUpperCase();
  const message = getElement("message");

  if (cart.length === 0) {
    couponApplied = false;
    message.textContent = "Add products to your cart first.";
  } else if (code === "SUPER10") {
    couponApplied = true;
    message.textContent = "10% discount applied!";
  } else {
    couponApplied = false;
    message.textContent = "Invalid code. Try SUPER10.";
  }

  showCart();
}

// Place an order and empty the cart
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Order placed successfully! Thank you for shopping.");
  cart = [];
  couponApplied = false;
  getElement("coupon").value = "";
  showCart();
  toggleCart();
}

// Update products when the search or filters change
getElement("search").addEventListener("input", showProducts);
getElement("category").addEventListener("change", showProducts);
getElement("sort").addEventListener("change", showProducts);

showProducts();
showCart();
