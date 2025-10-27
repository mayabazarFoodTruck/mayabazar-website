import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// ---- SUBMIT ORDER TO CLOVER ----
app.post("/api/order", async (req, res) => {
  const { items, phone } = req.body;

  const cloverUrl = `https://api.clover.com/v3/merchants/${process.env.CLOVER_MERCHANT_ID}/orders`;

  const orderBody = {
    state: "open",
    manualTransaction: true,
    note: `Order from website - Phone: ${phone}`,
    lineItems: items.map(item => ({
      name: item.name,
      price: Math.round(item.price * 100), // in cents
      printed: true
    }))
  };

  try {
    const response = await fetch(cloverUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CLOVER_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderBody)
    });
    const data = await response.json();
    res.json({ success: true, order: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
