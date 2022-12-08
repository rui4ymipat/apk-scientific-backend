const functions = require("firebase-functions");
const regions = "asia-southeast2";
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL:
    "https://apk-scientific-default-rtdb.asia-southeast1.firebasedatabase.app/",
});
const category_collection = admin.firestore().collection("categoy");
const product_collection = admin.firestore().collection("product");
const brand_collection = admin
  .firestore()
  .collection("masterData")
  .doc("brand");
const category_list = admin
  .firestore()
  .collection("masterData")
  .doc("category");

exports.example = functions.region(regions).https.onRequest((req, res) => {
  cors(req, res, () => {
    cors(req, res, () => {
      const method = req.method;
      if (method === "GET") {
      } else if (method === "POST") {
      } else if (method === "PUT") {
      } else if (method === "DELETE") {
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

exports.list_category = functions
  .region(regions)
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      cors(req, res, () => {
        const method = req.method;
        if (method === "GET") {
          category_list.get().then((snapshot) => {
            res.status(200).send(snapshot.data().category);
          });
        } else if (method === "POST") {
          category_list.set({
            category: req.body,
          });
          res.status(200).send("success");
        } else if (method === "PUT") {
          category_list.set({
            category: req.body,
          });
          res.status(200).send("success");
        } else if (method === "DELETE") {
          category_list.set({}).then((doc) => {
            res.status(200).send(doc.id);
          });
        } else {
          res.status(405).send("Method Not Allowed");
        }
      });
    });
  });

exports.product_list = functions.region(regions).https.onRequest((req, res) => {
  cors(req, res, () => {
    cors(req, res, async () => {
      const method = req.method;
      console.log(method);
      if (method === "GET") {
        const { category, pageSize, pageNumber, suggest } = req.query;
        const size = parseInt(pageSize);
        const page = parseInt(pageNumber);
        // console.log(size, page, category.split(","));
        if (category) {
          const query = product_collection.where(
            "category",
            "array-contains-any",
            category.split(",")
          );
          const snapshot = await query.get();
          const total = snapshot.size;
          if (suggest) {
            console.log(parseInt(Math.random() * (total - size)));
            product_collection
              .where("category", "array-contains-any", category.split(","))
              .orderBy("created_at")
              .startAt(parseInt(Math.random() * (total - size)))
              .limit(size)
              .get()
              .then((snapshot) => {
                const data = [];
                snapshot.forEach((doc) => {
                  data.push({
                    id: doc.id,
                    ...doc.data(),
                  });
                });
                res.status(200).send({
                  data: data,
                });
              });
          } else {
            product_collection
              .where("category", "array-contains-any", category.split(","))
              .orderBy("created_at")
              .startAt((page - 1) * size)
              .limit(size)
              .get()
              .then((snapshot) => {
                const data = [];
                snapshot.forEach((doc) => {
                  data.push({
                    id: doc.id,
                    ...doc.data(),
                  });
                });
                res.status(200).send({
                  data: data,
                  pagination: {
                    total: total,
                    pageSize: size,
                    pageNumber: page,
                  },
                });
              });
          }
        } else {
          const snapshot = await product_collection.get();
          const total = snapshot.size;
          product_collection
            .orderBy("created_at")
            .startAt((page - 1) * size)
            .limit(size)
            .get()
            .then((snapshot) => {
              const data = [];
              snapshot.forEach((doc) => {
                data.push({
                  id: doc.id,
                  ...doc.data(),
                });
              });
              console.log(snapshot.size);
              res.status(200).send({
                data: data,
                pagination: {
                  total: total,
                  pageSize: size,
                  pageNumber: page,
                },
              });
            });
        }
      } else {
        res.status(405).send("Method Not Allowed");
      }
    });
  });
});

exports.get_product_by_id = functions
  .region(regions)
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      cors(req, res, () => {
        const method = req.method;
        if (method === "GET") {
          const { id } = req.query;
          product_collection
            .doc(id)
            .get()
            .then((snapshot) => {
              res.status(200).send(snapshot.data());
            });
        } else {
          res.status(405).send("Method Not Allowed");
        }
      });
    });
  });

exports.brand = functions.region(regions).https.onRequest((req, res) => {
  cors(req, res, () => {
    cors(req, res, () => {
      const method = req.method;
      if (method === "GET") {
        brand_collection.get().then((snapshot) => {
          res.status(200).send(snapshot.data());
        });
      } else if (method === "POST") {
        brand_collection.set({
          brand: req.body.data,
        });
        res.status(200).send("success");
      } else {
        res.status(405).send("Method Not Allowed");
      }
    });
  });
});

exports.public_data_category = functions
  .region(regions)
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      cors(req, res, async () => {
        const method = req.method;
        if (method === "GET") {
          let responseData = {
            brand: [],
            category: [],
          };
          const category = [];
          const snapshot = await category_collection.get();
          snapshot.forEach((doc) => {
            product_collection
              .where("category", "array-contains-any", [doc.id])
              .get()
              .then((snapshot) => {
                category.push({
                  id: doc.id,
                  name: doc.data().category_name,
                  total: snapshot.size,
                });
              });
          });
          const brand = await brand_collection.get();
          brand.data().brand.forEach((element) => {
            const findData = category.find((item) => item.name === element);
            responseData.brand.push(findData);
          });
          res.status(200).send({
            brand: responseData.brand,
            category: category.filter(
              (item) => !responseData.brand.includes(item.name)
            ),
          });
        } else {
          res.status(405).send("Method Not Allowed");
        }
      });
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
