'use strict';

const expect      = require('chai').expect;
const MongoClient = require('mongodb');
const ObjectId    = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB;

MongoClient.connect(CONNECTION_STRING, (err, db) => {
  if (err) console.log("Database error: " + err);
  else console.log("Successful database connection");
});

module.exports = app => {
  app.route("/api/issues")
    .get((req, res) => {
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        const collection = db.collection("issues");
        
        collection.distinct("project", (error, result) => {
          res.json(result);
        })
      })
  })
  
  app.route('/api/issues/:project')
    .get((req, res) => {
      const project = req.params.project;
      const query = req.query;
    
      query.project = project;
    
      if (query._id) query._id = new ObjectId(query._id);
      if (query.open) query.open = String(query.open) == "true";

      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        const collection = db.collection("issues");
        
        collection.find(query).toArray((err, result) => {
          res.json(result);
        })
      })
    })
    
    .post((req, res) => {
      const project = req.params.project;
      
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        const collection = db.collection("issues");
        
        let assigned_to = "";
        let status_text = "";
        let created_on = new Date();
        
        if (req.body.assigned_to) assigned_to = req.body.assigned_to;
        if (req.body.status_text) status_text = req.body.status_text;
        
        if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) res.send("missing inputs");
        else {
          collection.insert({
            project: project,
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to: assigned_to,
            status_text: status_text,
            created_on: created_on,
            updated_on: created_on,
            open: true
          }, (err, result) => {
            res.json(result.ops[0]);
          })
        }           
      })
    })
    
    .put((req, res) => {
      let project = req.params.project;
      let changes = {};
      let noFields = true;
      
      if (req.body.open === "true") req.body.open = true;
      else if (req.body.open === "false") req.body.open = false;
    
      for (let i in req.body) {
        if (req.body[i] !== "" && i !== "_id") {
          noFields = false
          changes[i] = req.body[i];
        }
      }
      
      if (noFields === true) res.send("no updated field sent");
      else {
        changes.updated_on = new Date();
        
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
          const collection = db.collection("issues");
          
          collection.updateOne({_id: ObjectId(req.body._id)}, {$set: changes}, (err, result) => {
            if (err) {
              res.send("could not update " + req.body._id);
            } else {
              res.send("successfully updated");
            }
          })
        })
      }
    })
    
    .delete((req, res) => {
      const project = req.params.project;
      
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        const collection = db.collection("issues");
        
        if (!req.body._id || req.body._id.length !== 24) {
          res.send("_id error");
        } else {
          collection.findOneAndDelete({project: project, _id: ObjectId(req.body._id)}, (err, result) => {
            if (err) {
              res.send("could not delete " + req.body._id);
            } else if (result.value !== null) {
              res.send("deleted " + req.body._id);
            } else {
              res.send(req.body._id + " not found")
            }
          })
        }
      })
    });
};