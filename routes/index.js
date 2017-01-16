var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/TESTER';

/* GET home page. */
router.get('/', function(req, res, next) {
  // render the index.hbs template and replace {{title}} with 'MongoDB - Basics'
  res.render('index', {title: 'MongoDB - Basics'});
});

/* CREATE Data */
router.post('/insert', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('data').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted: ' + result);
      db.close();
    });
  });

  res.redirect('/');
});

/* READ Data */
router.get('/data', function(req, resp, next){
      var result = [];
      mongo.connect(url, function(err, db){
        assert.equal(null, err);
        var dbOutput = db.collection('data').find();
        dbOutput.forEach(function(ind, err){
          assert.equal(null, err);
          result.push(ind);
        }, function(){
          db.close();
          resp.render('index', {itemValues: result, title: 'MongoDB - Basics'});
        });
      });
});

router.get('/data/:id', function(req, resp, next){
    var result = [];
      mongo.connect(url, function(err, db){
        assert.equal(null, err);
        var dbOutput = db.collection('data').find({"_id": objectId(req.params.id)});
        dbOutput.forEach(function(ind, err){
          assert.equal(null, err);
          result.push(ind);
        }, function(){
          db.close();
          resp.render('data', {itemSelect: result, title: 'MongoDB - Data Entry'});
        });
      });
});

router.get('/comments', function(req, resp, next){
      var result = [];
      mongo.connect(url, function(err, db){
        assert.equal(null, err);
        var dbOutput = db.collection('data').find();
        dbOutput.forEach(function(ind, err){
          assert.equal(null, err);
          result.push(ind);
        }, function(){
          db.close();
          resp.render('comments', {itemSelect: result, title: 'MongoDB - Comments'});
        });
      });
});

router.get('/comments/:id', function(req, resp, next){
    var result = [];
    mongo.connect(url, function(err, db){
      assert.equal(null, err);
      var dbOutput = db.collection('data').find({"_id": objectId(req.params.id)});
      dbOutput.forEach(function(ind, err){
        assert.equal(null, err);
        result.push(ind);
      }, function(){
        db.close();
        resp.render('comments', {itemSelect: result, title: 'MongoDB - Comments'});
      });
    });
});

/* UPDATE Data */
router.post('/comments/:addComBtn', function(req, resp, next){
  var result = [];
  result.push(req.body.newComment);
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('data').update({"_id": objectId(req.body.addComBtn)}, {$set: {comment: result}});
    db.close();
    resp.redirect('/comments?id=' + req.body.addComBtn );
    });
});

/* DELETE Data */
router.post('/data/:deleteBtn/delete', function(req, resp, next){
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('data').remove({"_id": objectId(req.body.deleteBtn)});
    db.close();
    resp.redirect('/data');
  });
});

module.exports = router;
