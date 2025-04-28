// import express from "express";
// import cors from "cors";
// import fetch from "node-fetch";

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// app.post("/proxy", async (req, res) => {
//   const url = req.query.url;

//   if (!url) {
//     return res.status(400).json({ error: "manque param url" });
//   }

//   try {
//     const response = await fetch(url, {
//       method: req.method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(req.body),
//     });

//     const data = await response.text();

//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Content-Type", "application/json");
//     res.status(response.status).send(data);
//   } catch (error) {
//     console.error("❌ Erreur proxy :", error);
//     res.status(500).json({ error: error.toString() });
//   }
// });

// app.listen(port, () => {
//   console.log(`✅ Allez là le proxy sur http://localhost:${port}`);
// });
