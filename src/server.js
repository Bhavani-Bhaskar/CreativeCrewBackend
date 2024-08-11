import cors from 'cors';
import express from 'express';
import { connectToDB ,db} from "./db.js";

const app = express()
app.use(cors())
app.use(express.json())

// app.get('/', (req, res) => {
//     res.json("server is running successfully!");
// })

app.get('/',(req,res)=>{
    res.json("server running very quickly");
})

// app.post('/kumar',(req,res)=>{
//     res.json({Name:req.body.Name ,Branch:req.body.Branch });
//     console.log({ Name: req.body.Name, Branch: req.body.Branch, Year: req.body.year });

// })
// app.put('/',(req,res)=>{
//     res.json("server running very slowly");
// })
// app.delete('/',(req,res)=>{
//     res.json("server running very bad");
// })


app.post('/insert', async(req, res) => {
    await db.collection("student").insertOne({email:req.body.name,password:req.body.password})
    .then((result)=>{
        res.json(result)
    })
    .catch((e)=>console.log(e))
})
app.post('/insertmany', async(req, res) => {
    await db.collection("test").insertMany(req.body)
    .then((result)=>{
        res.json(result)
    })
    .catch((e)=>console.log(e))
})
app.post('/students', async (req, res) => {
    await db.collection("student").find().toArray()
    .then((result)=>{
        res.send(result);
    }
    )
    .catch((e)=>console.log(e))

app.post('/findone', async(req, res) => {
    await db.collection("test").findOne( 
        {Name:"red"}
    )
    .then((result)=>{
        res.json(result)
    })
    .catch((e)=>console.log(e))
})
app.post('/findmany', async(req, res) => {
    await db.collection("test").find().toArray()
    .then((result)=>{
        res.json(result)
    })
    .catch((e)=>console.log(e))
})
app.post('/updateone', async(req, res) => {
    await db.collection("test").updateOne( {Name:"red"} ,{$set:{Age:23}} )
    .then((result)=>{
        res.json(result)
    })
    .catch((e)=>console.log(e))
})
app.post('/signin', async (req, res) => {
    try {
        const found = await db.collection("student").findOne({ email: req.body.name });
     console.log(found)
        if (found && found.password === req.body.password) {
            console.log("login successfully");
            res.json({ message: "login successfully" });
        } else {
            console.log("failed to login");
            res.json({ error: "login failed" });
        }
    } catch (error) {
        console.log("error occurred");
        res.json({ message: "login failed during login" });
    }
});
app.post('/signup', async (req, res) => {
    const { name, dateOfBirth,email, password, confirmPassword,  phoneNumber } = req.body;
  
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
  
    try {
      const existingUser = await db.collection('student').findOne({ email });
      if (existingUser) {
        return res.json({ error: "User already exists" });
      }
  
  
      const newUser = {
        name,
        dateOfBirth,
        email,
        password,
        confirmPassword,
      
        phoneNumber,
      };
  
      const result = await db.collection('student').insertOne(newUser);
      res.status(201).json({ message: "User created successfully", userId: result.insertedId });
    } catch (error) {
      console.error('Error during sign-up:', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.post('/forgotpassword', async (req, res) => {
    
    const { email,password,confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
      }

    try {
        const found = await db.collection("student").updateOne({ email: req.body.email } ,{$set:{password:req.body.password}},{$set:{confirmPassword:req.body.confirmpassword}});
res.json(found);
     
    }

 catch (error) {
    console.error('Error during sign-up:', error);
}
});



app.post('/greaterthan', async(req,res)=>{
    const result=await db.collection("test").find({Age:{$gte:30}}).toArray()
   .then((result)=>{
     res.json(result);
   })
   .catch((e)=>{
    res.json(e)
   })
})

app.post('/findin', async (req, res) => {
    try {
        const result = await db.collection("test").find({ Name: { $in: ["Raju", "mani"] } });
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});




connectToDB(() => {
    app.listen(9000, () => {
        console.log("server running at 9000 ");
    })
})
