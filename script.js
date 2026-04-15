
document.addEventListener('DOMContentLoaded', function() {
  setActiveNavLink();
  initializeCart();
  initializeQuiz();
  initializeFilters();
});


function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}


function initializeCart() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productName = this.getAttribute('data-product');
      const productPrice = this.getAttribute('data-price');
      addToCart(productName, productPrice);
      this.textContent = 'Added ✓';
      setTimeout(() => {
        this.textContent = 'Add to Cart';
      }, 2000);
    });
  });

  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', function() {
      removeFromCart(this.getAttribute('data-index'));
    });
  });
}

function addToCart(productName, productPrice) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.name === productName);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: productName,
      price: parseFloat(productPrice),
      quantity: 1
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log('Item added to cart');
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  location.reload();
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function displayCart() {
  const cart = getCart();
  const cartBody = document.getElementById('cart-body');
  const subtotalElem = document.getElementById('subtotal');
  const totalElem = document.getElementById('total');
  
  if (!cartBody) return;
  
  cartBody.innerHTML = '';
  let subtotal = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>
        <input type="number" value="${item.quantity}" class="qty-input" data-index="${index}" min="1">
      </td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${itemTotal.toFixed(2)}</td>
      <td>
        <button class="btn-primary btn-small remove-item" data-index="${index}">Remove</button>
      </td>
    `;
    cartBody.appendChild(row);
  });
  
  if (subtotalElem) subtotalElem.textContent = '$' + subtotal.toFixed(2);
  if (totalElem) totalElem.textContent = '$' + (subtotal * 1.1).toFixed(2);
  
  
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', function() {
      removeFromCart(this.getAttribute('data-index'));
    });
  });
}


function initializeQuiz() {
  const quizForm = document.getElementById('quiz-form');
  if (quizForm) {
    quizForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const quiz = {
        skinType: document.querySelector('input[name="skin-type"]:checked')?.value,
        concern: document.querySelector('input[name="skin-concern"]:checked')?.value,
        age: document.querySelector('input[name="age"]:checked')?.value,
        frequency: document.querySelector('input[name="frequency"]:checked')?.value,
        budget: document.querySelector('input[name="budget"]:checked')?.value
      };
      
      localStorage.setItem('userQuiz', JSON.stringify(quiz));
      window.location.href = 'result.html';
    });
  }
}


function generateRoutine() {
  const quiz = JSON.parse(localStorage.getItem('userQuiz')) || {};
  const routineContainer = document.getElementById('routine-results');
  
  if (!routineContainer) return;
  
  
  const morningProducts = [
    { name: 'Gentle Cleanser', brand: 'Essence Pure', price: 24.99 },
    { name: 'Hydrating Moisturizer', brand: 'Essence Pure', price: 34.99 },
    { name: 'SPF 50 Sunscreen', brand: 'Sun Guard', price: 28.99 }
  ];
  
  const eveningProducts = [
    { name: 'Deep Cleansing Oil', brand: 'Essence Pure', price: 32.99 },
    { name: 'Retinol Night Serum', brand: 'Bio Labs', price: 45.99 },
    { name: 'Night Repair Cream', brand: 'Bio Labs', price: 42.99 }
  ];
  
  const tipsContainer = document.getElementById('skincare-tips');
  const tips = [
    'Always remove makeup before bed',
    'Drink at least 8 glasses of water daily',
    'Avoid touching your face with dirty hands',
    'Use sunscreen every day',
    'Get 7-8 hours of sleep for skin regeneration',
    'Limit screen time before bed'
  ];
  
  if (tipsContainer) {
    tipsContainer.innerHTML = tips.map(tip => `
      <div class="card">
        <h3>💡</h3>
        <p>${tip}</p>
      </div>
    `).join('');
  }
}


function initializeFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      filterProducts(this.getAttribute('data-filter'));
    });
  });
}

function filterProducts(filter) {
  const products = document.querySelectorAll('.product-card');
  products.forEach(product => {
    if (filter === 'all' || product.getAttribute('data-type') === filter) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}


function handleFormSubmit(formId, redirectUrl) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      alert('Form submitted successfully!');
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    });
  }
}


if (document.getElementById('register-form')) {
  handleFormSubmit('register-form', 'login.html');
}
if (document.getElementById('login-form')) {
  handleFormSubmit('login-form', 'index.html');
}
if (document.getElementById('contact-form')) {
  handleFormSubmit('contact-form', 'index.html');
}


window.addEventListener('load', function() {
  if (document.getElementById('cart-body')) {
    displayCart();
  }
  if (document.getElementById('routine-results')) {
    generateRoutine();
  }
});
