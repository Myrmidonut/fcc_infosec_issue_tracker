/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

MongoClient.connect(CONNECTION_STRING, (err, db) => {
  if (err) {
    console.log("Database error: " + err);
  } else {
    console.log("Successful database connection");
  }
});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      // for an array of all issues on that specific project with all the information for each issue as was returned when posted.
      // I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false).
      // I can pass along as many fields/values as I want.
      
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
    
    .post(function (req, res){
      const project = req.params.project;
      // with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
      // The object saved (and returned) will include all of those fields (blank for optional no input) 
      // and also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.
    
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        const collection = db.collection("issues");
        
        let assigned_to = "";
        let status_text = "";
        let created_on = new Date();
        
        if (req.body.assigned_to) assigned_to = req.body.assigned_to;
        if (req.body.status_text) status_text = req.body.status_text;
        
        if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by) res.send("missing inputs");
        else {
          collection.insert({project: project,
                             issue_title: req.body.issue_title,
                             issue_text: req.body.issue_text,
                             created_by: req.body.created_by,
                             assigned_to: assigned_to,
                             status_text: status_text,
                             created_on: created_on,
                             updated_on: created_on,
                             open: true}, (err, result) => {
            res.json(result.ops[0]);
          })
        }           
      })
    
    })
    
    .put(function (req, res){
      // with a _id and any fields in the object with a value to object said object. 
      // Returned will be 'successfully updated' or 'could not update '+_id.
      // This should always update updated_on. If no fields are sent return 'no updated field sent'.
    
      const project = req.params.project;
      let changes = {};
      let noFields = true;
    
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
            if (err) res.send("could not update " + req.body._id);
            else res.send("successfully updated");
          })
        })
      }
    
    })
    
    .delete(function (req, res){
      // with a _id to completely delete an issue.
      // If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
    
      const project = req.params.project;
    
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        const collection = db.collection("issues");
        
        if (!req.body._id) res.send("_id error");
        else {
          collection.remove({project: project, _id: ObjectId(req.body._id)}, (err, result) => {
            if (err) res.send("could not delete " + req.body._id);
            else res.send("deleted " + req.body._id);
          })
        }
      })
    
    });
    
};