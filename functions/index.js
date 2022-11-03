const functions = require("firebase-functions");
const regions = "asia-southeast2";
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");
admin.initializeApp();
const category_collection = admin.firestore().collection("categoy");
const product_collection = admin.firestore().collection("product");

exports.example = functions.region(regions).https.onRequest((req, res) => {
  cors(req, res, () => {
    cors(req, res, () => {
      const method = req.method;
      if (method === "GET") {
        // Get all category
        category_collection
          .get()
          .then((snapshot) => {
            const category = [];
            snapshot.forEach((doc) => {
              category.push({
                id: doc.id,
                ...doc.data(),
              });
            });
            return res.status(200).json(category);
          })
          .catch((error) => {
            return res.status(500).json({ error: error.message });
          });
      } else if (method === "POST") {
        // Create new category
        const { name } = req.body;
        const d = new Date();
        category_collection
          .doc(`${d.getTime()}`)
          .set({
            ...req.body,
            created_at: d.getTime(),
          })
          .then((doc) => {
            return res.status(200).json({ id: doc.id });
          })
          .catch((error) => {
            return res.status(500).json({ error: error.message });
          });
      } else if (method === "PUT") {
        // Update category
        const { id } = req.body;
        category_collection
          .doc(id)
          .update(req.body)
          .then(() => {
            return res.status(200).json({ id });
          })
          .catch((error) => {
            return res.status(500).json({ error: error.message });
          });
      } else if (method === "DELETE") {
        // Delete category
        const { id } = req.query;
        category_collection
          .doc(id)
          .delete()
          .then(() => {
            return res.status(200).json({ id });
          })
          .catch((error) => {
            return res.status(500).json({ error: error.message });
          });
      } else {
        res.status(405).send("Method Not Allowed");
      }
    });
  });
});

exports.manage_category = functions
  .region(regions)
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      const method = req.method;
      if (method === "GET") {
        category_collection.get().then((snapshot) => {
          const data = [];
          snapshot.forEach((doc) => {
            data.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          res.status(200).send(data);
        });
      } else if (method === "POST") {
        const { category_name } = req.body;
        const d = new Date();
        category_collection
          .doc(`${d.getTime()}`)
          .set({
            category_name,
          })
          .then((doc) => {
            res.status(200).send(doc.id);
          });
      } else if (method === "PUT") {
        const { category_name, id } = req.body;
        console.log(req.body);
        category_collection
          .doc(`${id}`)
          .update({
            category_name,
          })
          .then((doc) => {
            res.status(200).send(doc.id);
          });
      } else if (method === "DELETE") {
        const { id } = req.query;
        category_collection
          .doc(id)
          .delete()
          .then((doc) => {
            res.status(200).send(doc.id);
          });
      } else {
        res.status(405).send("Method Not Allowed");
      }
    });
  });

exports.product_manage = functions
  .region(regions)
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      cors(req, res, () => {
        const method = req.method;
        if (method === "GET") {
          // Get all category
          product_collection
            .get()
            .then((snapshot) => {
              const category = [];
              snapshot.forEach((doc) => {
                category.push({
                  id: doc.id,
                  ...doc.data(),
                });
              });
              return res.status(200).json(category);
            })
            .catch((error) => {
              return res.status(500).json({ error: error.message });
            });
        } else if (method === "POST") {
          // Create new category
          const { name } = req.body;
          const d = new Date();
          product_collection
            .doc(`${d.getTime()}`)
            .set({
              ...req.body,
              created_at: d.getTime(),
            })
            .then((doc) => {
              return res.status(200).json({ id: doc.id });
            })
            .catch((error) => {
              return res.status(500).json({ error: error.message });
            });
        } else if (method === "PUT") {
          // Update category
          const { id } = req.body;
          let newData = req.body;
          delete newData.id;
          product_collection
            .doc(id)
            .update(newData)
            .then(() => {
              return res.status(200).json({ id });
            })
            .catch((error) => {
              return res.status(500).json({ error: error.message });
            });
        } else if (method === "DELETE") {
          // Delete category
          const { id } = req.query;
          product_collection
            .doc(id)
            .delete()
            .then(() => {
              return res.status(200).json({ id });
            })
            .catch((error) => {
              return res.status(500).json({ error: error.message });
            });
        } else {
          res.status(405).send("Method Not Allowed");
        }
      });
    });
  });
