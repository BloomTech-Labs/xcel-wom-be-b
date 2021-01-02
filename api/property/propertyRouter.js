const express = require('express');
const authRequired = require('../middleware/authRequired');
const Properties = require('./propertyModel');
const router = express.Router();

router.get('/', authRequired, function (req, res) {
  Properties.findAll()
    .then((properties) => {
      res.status(200).json(properties);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/:id', authRequired, function (req, res) {
  const id = String(req.params.id);
  Properties.findById(id)
    .then((property) => {
      if (property) {
        res.status(200).json(property);
      } else {
        res.status(404).json({ error: 'PropertyNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post('/', authRequired, async (req, res) => {
  const property = req.body;
  if (property) {
    const id = property.id || 0;
    try {
      await Properties.findById(id).then(async (pf) => {
        if (pf == undefined) {
          //property not found so lets insert it
          await Properties.create(property).then((property) =>
            res
              .status(200)
              .json({ message: 'property created', property: property[0] })
          );
        } else {
          res.status(400).json({ message: 'property already exists' });
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404).json({ message: 'Property missing' });
  }
});

router.put('/', authRequired, function (req, res) {
  const property = req.body;
  if (property) {
    const id = property.id || 0;
    Properties.findById(id)
      .then(
        Properties.update(id, property)
          .then((updated) => {
            res
              .status(200)
              .json({ message: 'property created', property: updated[0] });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update property '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find property '${id}'`,
          error: err.message,
        });
      });
  }
});

router.delete('/:id', authRequired, function (req, res) {
  const id = req.params.id;
  try {
    Properties.findById(id).then((property) => {
      Properties.remove(property.id).then(() => {
        res.status(200).json({
          message: `Property '${id}' was deleted.`,
          property: property,
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete property with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
