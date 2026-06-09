const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Environment Variables (Render)
const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

console.log("TOKEN:", TOKEN);
console.log("CHAT_ID:", CHAT_ID);

// 🔵 Home page
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

// 🔵 Order API
app.post("/order", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      wilaya,
      address,
      cart
    } = req.body;

    let productsText = "";

    if (cart && cart.length > 0) {
      cart.forEach((item, index) => {
        productsText += `
📦 Produit ${index + 1}: ${item.name}
💰 Prix: ${item.price}
🎨 Couleur: ${item.color}
`;
      });
    }

    const message = `
🛒 Nouvelle commande

${productsText}

👤 Nom: ${firstName}
👤 Prénom: ${lastName}
📞 Téléphone: ${phone}
📍 Wilaya: ${wilaya}
🏠 Adresse: ${address}
`;

    await axios.post(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: message
      }
    );

    res.json({ message: "Commande envoyée ✅" });

  } catch (error) {
    console.log(error.response?.data || error);

    res.status(500).json({
      message: "Erreur serveur ❌"
    });
  }
});

// 🔵 Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});
