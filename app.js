const colorSelect = document.getElementById("color");
const statusDiv = document.getElementById("status");

let cart = [];

const cartDiv = document.getElementById("cart");

if (colorSelect) {

  colorSelect.addEventListener("change", () => {

    const color = colorSelect.value;

    if (color === "أخضر") {

      statusDiv.innerHTML = "Non disponible ❌";
      statusDiv.style.color = "#ff4d4d";

    } else {

      statusDiv.innerHTML = "Disponible ✅";
      statusDiv.style.color = "#79ffae";

    }

  });

}

function changeMedia(element) {

  const mainImage = document.getElementById("mainImage");
  const mainVideo = document.getElementById("mainVideo");

  // remove active from all thumbs
  document.querySelectorAll(".thumb")
    .forEach(el => el.classList.remove("active"));

  element.classList.add("active");

  // IMAGE
  if (element.tagName === "IMG") {

    mainVideo.style.display = "none";
    mainImage.style.display = "block";

    mainImage.src = element.src;
  }

  // VIDEO
  else if (element.tagName === "VIDEO") {

    mainImage.style.display = "none";
    mainVideo.style.display = "block";

    mainVideo.load();
  }
}

document
.getElementById("addToCart")
.addEventListener("click", () => {

  const product = {

    name: document.body.dataset.product,

    price: document.body.dataset.price,

    color: document.getElementById("color").value

  };

  cart.push(product);

  displayCart();

});

function displayCart() {

  cartDiv.innerHTML = "";

  cart.forEach((item, index) => {

    cartDiv.innerHTML += `

      <div class="cart-item">

        <h4>${item.name}</h4>

        <p>💰 ${item.price}</p>

        <p>🎨 ${item.color}</p>

        <button
        onclick="removeFromCart(${index})"
        class="remove-btn">

          Supprimer

        </button>

      </div>

    `;

  });

}

function removeFromCart(index) {

  cart.splice(index, 1);

  displayCart();

}


document
.getElementById("orderForm")
.addEventListener("submit", async function (e) {

  e.preventDefault();

  const data = {

    firstName:
    document.getElementById("firstName").value,

    lastName:
    document.getElementById("lastName").value,

    phone:
    document.getElementById("phone").value,

    wilaya:
    document.getElementById("wilaya").value,

    address:
    document.getElementById("address").value,

    cart: cart.length > 0
    ? cart
    : [
        {
          name:
          document.body.dataset.product,

          price:
          document.body.dataset.price,

          color:
          document.getElementById("color").value
        }
      ]

  };

  try {

    fetch("https://icee67.onrender.com/order", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)

    });

    const result = await response.json();

    alert(result.message);

  } catch (error) {

    console.log(error);

    alert("Erreur serveur ❌");

  }

});
