const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const MongoCLient = require("mongodb").MongoClient
const connectionString = "mongodb+srv://robotniik:1234mongodb1234@cluster0.ytlbmdq.mongodb.net/?retryWrites=true&w=majority"

MongoCLient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db("star-wars-quotes")
    const quotesCollection = db.collection("quotes")
    app.set("view engine", "ejs")
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static("public"))
    app.use(bodyParser.json())

    app.get("/",(req,res) => {
        quotesCollection.find().toArray()
            .then(results => {
                console.log(results)
                res.render("index.ejs", {quotes: results})
            })
            .catch(error => console.error(error))
        
    })    

    app.post("/quotes",(req, res) =>{
        quotesCollection.insertOne(req.body)
            .then(result => {
                console.log(result)
                res.redirect("/")
            })
            .catch(error => console.error(error))
    })
    app.put("/quotes", (req,res) => {
        quotesCollection.findOneAndUpdate(
            { name: 'Yoda' },
            {
              $set: {
                name: req.body.name,
                quote: req.body.quote
              }
            },
            {
              upsert: true
            }
          )
            .then(result => {
                console.log(result)
                res.json("Success")
            })
            .catch(error => console.error(error))
            
    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
            { name: req.body.name }
        )
            .then(result => {
            if (result.deletedCount === 0) {
                return res.json('No quote to delete')
            }
            res.json('Deleted Darth Vadar\'s quote')
            })
            .catch(error => console.error(error))
        })
          
    })
    
    app.listen(3000, function(){
        console.log("listening on 3000")
    })

  })

  .catch(error => console.error(error))






