const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 🔵 ENV (Render)
const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

console.log("TOKEN LOADED:", !!TOKEN);
console.log("CHAT_ID LOADED:", CHAT_ID);

// 🔵 static files
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

// 🔥 ORDER ROUTE
app.post("/order", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    if (!TOKEN || !CHAT_ID) {
      throw new Error("TOKEN or CHAT_ID is missing in ENV");
    }

    const { firstName, lastName, phone, wilaya, address, cart } = req.body;

    let productsText = "";

    if (Array.isArray(cart)) {
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

    const telegramResponse = await axios.post(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: message
      }
    );

    console.log("TELEGRAM RESPONSE:", telegramResponse.data);

    res.json({ ok: true, message: "Commande envoyée ✅" });

  } catch (error) {
    console.log("ERROR FULL:", error.response?.data || error.message);

    res.status(500).json({
      ok: false,
      message: "Erreur serveur ❌",
      error: error.response?.data || error.message
    });
  }
});

// 🔵 start server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});
