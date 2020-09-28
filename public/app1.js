// var a=6; //let or const
// // console.log(a);

// let b = {
//     "name":'muazam',
//     "age":19
// };
// // for JSON put keys in inverted commas---"name":"muazam"
// // console.log(b)

// // 1 == '1' true
// // 1 === '1' false

// // array -- let a = [1,2,3,'muazam']

// // functions
// // function add(a,b){
// //     return a+b;
// // }

// // arrow functions

// // const add = (a,b) => {
// //     return a+b
// // }
// const add = (a,b) => a+b;
// let p=add(5,4)
// // console.log(p)

// //let has limited scope; var declares globally


// let arr = [1,2,3,'muazam']
// arr.forEach((num)=>{
//     // console.log(num)
// })

// let c = arr.filter(num=>num%2==0)
// // console.log(c);

// const http = require('http')
// const url = require('url')
// const fs = require('fs')

// function onRequest(req,res){
//     res.writeHead(200,{'Content-Type':'text/html'})
//     let link = url.parse(req.url,true)
//     console.log(link)
//     if(link.pathname === '/'){
//         fs.readFile('./index.html',(err,data)=>{
//             if(err){
//                 res.end('Error occured')
//             }
//             res.write(data)
//             res.end()
//         })
//     }
//     else if(link.pathname === '/add' && req.method === 'GET'){
//         res.end('this is GET')
//     } else if(link.pathname === '/add' && req.method === 'POST'){
//         res.end('this is POST')
//     }

// }

// let server = http.createServer(onRequest)
// server.listen(4000, () => console.log('Server is running'))


// EXPRESS -- framework of node.js
const express = require('express')
const app = express()
const fs = require('fs')
const filename = './db.json'

const bcrypt = require('bcryptjs');
const saltRounds = 5;

app.use(express.static(__dirname+ "/views"));
app.use(express.static(__dirname+ "/public"));
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/',(req,res) => {
    res.sendFile(__dirname+'views/index.html')
})
// app.get('/add',(req,res)=>{
//     res.send('This is GET request')
// })

//sign up
app.post('/add',(req,res)=>{
    // res.send('This is POST request')
    let user = req.body
    let data = fs.readFileSync(filename)
    let db = JSON.parse(data)
    let email = req.body.email
    let rno = req.body.rno
    // let pswd="null"
    let flag=1,i=0
    
    let password = req.body.password;

    db.users.forEach(user => {
        if(user.email === email || user.rno === rno){
            flag=0
        }
    })
    let length = db.users.length
    let hashedPswd
    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
            throw err
        } else {
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    throw err
                } else {
                    hashedPswd = hash;
                    // console.log(hashedPswd)
                    if(flag==1){
                            db.users.push(user)
                            db.users[length].password = hashedPswd;
                        } fs.writeFile(filename,JSON.stringify(db,null,'\t'),(err)=>{
                            if(err)
                                console.log(err)
                            if(flag==1)
                                res.redirect('/home.html')
                            else
                                res.send('A user already exists with these credentials')
                        })
                }
            })
        }
    })

})



//LOGIN
app.post('/login',(req,res)=>{
    // res.send('This is POST request')
    let user = req.body
    let data = fs.readFileSync(filename)
    let db = JSON.parse(data)
    let email = req.body.email
    let pass = req.body.password
    let flag=0,i=0,c=0;
    let hash
    db.users.forEach(user => {
        if(user.email === email){
                hash=user.password;
                c=1
                // console.log(hash)
        }
    }) 
    if(c==0){
        res.send('User does not exist')
    }
    else{
    bcrypt.compare(pass, hash, function(err, isMatch) {
        if (err) {
            throw err
        } else if (!isMatch) {
            // console.log("no ")
            flag = 2
            res.send('Wrong Password')    
        } else {
            db.users.forEach(user => {
                if(user.email === email){
                    if(user.password === hash){
                        flag=1
                        // name=db.users[i].name
                    }
                    else if(user.password !== hash){
                        flag=2
                    }
                }
            }) 
            fs.writeFile(filename,JSON.stringify(db,null,'\t'),(err)=>{
                if(err)
                    console.log(err)
                if(flag==1)
                    res.redirect('/home.html')
                else if(flag==2)
                    res.send('Wrong Password')    
            })
        }
    })
    }
    
    // let hash = "$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K"

    
})



//FORGOT PASSWORD
app.post('/forgot',(req,res)=>{
    // res.send('This is POST request')
    let user = req.body
    let data = fs.readFileSync(filename)
    let db = JSON.parse(data)
    let email = req.body.email
    let rno = req.body.rno
    let flag=1,i=0,pass="No such user was found";
   

    db.users.forEach(user => {
        if(db.users[i].email === email ){
            if(db.users[i].rno === rno){
                pass = db.users[i].password
                flag=1
            }
            else{
                pass = "Wrong credentials"
                flag=2
            }
        }
        i++
    })
    fs.writeFile(filename,JSON.stringify(db,null,'\t'),(err)=>{
        if(err)
            console.log(err)
        if(flag==1){
            res.send(pass)
        }
        else if(flag==2)
            res.send(pass)
        
    })
})

//VIEW ALL USERS
app.get('/view',(req,res)=>{

    res.writeHead(200,{'Content-Type':'text/html'})
    let data = fs.readFileSync(filename)
    let db = JSON.parse(data)
    
    res.write('<table><tr><th>Name</th><th>Email</th><th>Roll no.</th></tr>')
    db.users.forEach((user) => {
        res.write(`<tr><td>${user.name}</td><td>${user.email}</td><td>${user.rno}</td></tr>`)
    })
    res.write('</table>')
    res.end()
})

app.post('/update',(req,res) => {
    let data = fs.readFileSync(filename)
    let db = JSON.parse(data),i=0,flag=0
    let rno = req.body.rno
    let email = req.body.email
    let pass = req.body.password

    // db.users.forEach(user => {
    //     if(user.rno === rno){
    //         user.email = req.body.email
    //     }
    // })
    db.users.forEach(user => {
        if(db.users[i].rno === rno ){
            if(db.users[i].password === pass){
                db.users[i].email = email
                flag=1
            }
            
        }
        i++
    })

    fs.writeFile(filename,JSON.stringify(db,null,'\t'),(err)=>{
        if(err)
            console.log(err)
        if(flag==1)
            res.send('Email has been updated')
        else
            res.send('Wrong credentials')

    })
})


//DELETE ACCOUNT
app.post('/delete',(req,res) => {
    let data = fs.readFileSync(filename)
    let db = JSON.parse(data)
    let rno = req.body.rno
    let pass = req.body.password
    let i = 0;
    let flag=0

    db.users.forEach(user => {
        if(user.rno === rno && user.password === pass){
            delete db.users.splice(i,1)
            flag=1
        }
        i++
    })
        
    fs.writeFile(filename,JSON.stringify(db,null,'\t'),(err)=>{
        if(err)
            console.log(err)
        if(flag==1)    
            res.send('Account has been deleted.')
        else if(flag==0)
            res.send('No such user')
    })
})


//LOGOUT
app.get('/logout',(req,res) => {
    res.redirect('/index.html')
})


// app.listen(4000,() => console.log('Server running'))
// app.listen(process.env.PORT || 4000, process.env.IP, function(){
//     console.log("Server has Started on 4000");
// });
let port = process.env.PORT;
if (port == null || port == "") { port = 4000; }

app.listen(port, function() {
  console.log("Server has started successfully!");
});


