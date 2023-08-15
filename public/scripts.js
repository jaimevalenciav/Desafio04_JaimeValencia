
const socket = io();
const textarea = document.getElementById('product-area');
const productForm = document.getElementById('product-form');
const productInput = document.getElementById('product');
const descriptionInput = document.getElementById('descripcion');
const products = document.getElementById('products');

socket.on('addText', (text, descripcion) => {
    
    textarea.value += text + descripcion + '\n';
    products.value += text + descripcion
});


productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const product = productInput.value.trim();
    const descripcion = descriptionInput.value.trim();
    if (product) {
        textarea.value = '';
        socket.emit('addText', product, descripcion);
        productInput.value = ''; 
        descripcionInput.value = ''
    }
});
