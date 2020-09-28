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
                c=1;
                hash = user.password;
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
                        // else if(user.password !== hash){
                        //     flag=2
                        // }
                    }
                }) 
                fs.writeFile(filename,JSON.stringify(db,null,'\t'),(err)=>{
                    if(err)
                        console.log(err)
                    if(flag==1)
                        res.redirect('/home.html')
                    // else if(flag==2)
                    //     res.send('Wrong Password')    
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
    let pass = req.body.password
    let flag=0,i=0,c=0
    let hash
    db.users.forEach(user => {
        if(user.rno === rno && user.email === email){
                // hash=user.password;
                c=1;flag=1;
                // console.log(hash)
        }
    }) 
    if(c==0){
        res.send('User does not exist')
    }
    else{
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                throw err
            } else {
                bcrypt.hash(pass, salt, function(err, hash) {
                    if (err) {
                        throw err
                    } else {
                        hashedPswd = hash;
                        // console.log(hashedPswd)
                        if(flag==1){
                            db.users.forEach(user => {
                                if(user.rno === rno && user.email === email){
                                        // hash=user.password;
                                        if(user.password === hashedPswd)
                                            flag=2;
                                        else   
                                            user.password= hashedPswd;
                                        // console.log(hash)
                                }
                            }) 
                            } 
                            fs.writeFile(filename,JSON.stringify(db,null,'\t'),(err)=>{
                                if(err)
                                    console.log(err)
                                if(flag==1)
                                    // res.redirect('/home.html')
                                    res.send('Password changed successfully.')
                                else if(flag==2)
                                    res.send('Old password cannot be your new password')
                                else
                                    res.send('Wrong credentials.')
                            })
                    }
                })
            }
        })
    }

})

//VIEW ALL USERS
app.get('/view',(req,res)=>{

    res.writeHead(200,{'Content-Type':'text/html'})
    let data = fs.readFileSync(filename)
    let db = JSON.parse(data)
    
    res.write('<table><tr><th>Name</th><th>Email</th><th>Regst. no.</th></tr>')
    db.users.forEach((user) => {
        res.write(`<tr><td>${user.name}</td><td>${user.email}</td><td>${user.rno}</td></tr>`)
    })
    res.write('</table>')
    res.end()
})


//UPDATE EMAIL
app.post('/update',(req,res) => {
    let data = fs.readFileSync(filename)
    let db = JSON.parse(data),i=0,flag=0
    let rno = req.body.rno
    let email = req.body.email
    let pass = req.body.password
    let hash,c=0
    db.users.forEach(user => {
        if(user.rno === rno){
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
                if(user.rno === rno){
                    if(user.password === hash){
                        flag=1
                        user.email = email;
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
                    res.send('Email has been updated!')
                else if(flag==2)
                    res.send('Wrong Password')    
            })
        }
    })
    }

})
//set profile
// app.post('/setdp',(req,res)=>{
//     // res.send('This is POST request')
//     // let user = req.body
//     let data = fs.readFileSync(filename)
//     let db = JSON.parse(data)
//     let email = req.body.email
//     let image = req.body.image
//     let pswd="null"
//     let flag=1,i=0
//     db.users.forEach(user => {
//         if(user.email === email){
//                 user.image=image;
//                 // console.log(image)
//         }
//     }) 
//     fs.writeFile(filename,JSON.stringify(db,null,'\t'),(err)=>{
//         if(err)
//             console.log(err)
//         else 
//             res.send('Uploaded')    
//     })
// })


//DELETE ACCOUNT
app.post('/delete',(req,res) => {
    let data = fs.readFileSync(filename)
    let db = JSON.parse(data)
    let rno = req.body.rno
    let pass = req.body.password
    let i = 0,flag=0,c=0

    let hash
    db.users.forEach(user => {
        if(user.rno === rno){
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
                if(user.rno === rno){
                    if(user.password === hash){
                        flag=1
                        // delete db.users[i]
                        db.users.splice(i,1)
                        // name=db.users[i].name
                    }
                    else if(user.password !== hash){
                        flag=2
                    }
                }
                i++
            }) 
            fs.writeFile(filename,JSON.stringify(db,null,'\t'),(err)=>{
                if(err)
                    console.log(err)
                if(flag==1)
                    res.send('Account has been deleted!')
                else if(flag==2)
                    res.send('Wrong Password')    
            })
        }
    })
    }
})


//LOGOUT
app.get('/logout',(req,res) => {
    res.redirect('/index.html')
})

let port = process.env.PORT;
if (port == null || port == "") { port = 4000; }

app.listen(port, function() {
  console.log("Server has started successfully!");
});


// var http = require('http');
// var formidable = require('formidable');
// var fs = require('fs');
// http.createServer(function (req, res) {
//   if (req.url == '/fileupload') {
//     var form = new formidable.IncomingForm();
//     form.parse(req, function (err, fields, files) {
//       var oldpath = files.filetoupload.path;
//       var newpath = 'C:/Users/mmuaz/OneDrive/Pictures' + files.filetoupload.name;
//       fs.rename(oldpath, newpath, function (err) {
//         if (err) throw err;
//         res.write('File uploaded and moved!');
//         res.end();
//       });
//  });
//   } else {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
//     res.write('<input type="file" name="filetoupload"><br>');
//     res.write('<input type="submit">');
//     res.write('</form>');
//     return res.end();
//   }
// }).listen(8080);