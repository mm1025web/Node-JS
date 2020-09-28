"use strict";

// EXPRESS -- framework of node.js
var express = require('express');

var app = express();

var fs = require('fs');

var filename = './db.json';

var bcrypt = require('bcryptjs');

var saltRounds = 5;
app.use(express["static"](__dirname + "/views"));
app.use(express["static"](__dirname + "/public"));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.get('/', function (req, res) {
  res.sendFile(__dirname + 'views/index.html');
}); //sign up

app.post('/add', function (req, res) {
  // res.send('This is POST request')
  var user = req.body;
  var data = fs.readFileSync(filename);
  var db = JSON.parse(data);
  var email = req.body.email;
  var rno = req.body.rno; // let pswd="null"

  var flag = 1,
      i = 0;
  var password = req.body.password;
  db.users.forEach(function (user) {
    if (user.email === email || user.rno === rno) {
      flag = 0;
    }
  });
  var length = db.users.length;
  var hashedPswd;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      throw err;
    } else {
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          throw err;
        } else {
          hashedPswd = hash; // console.log(hashedPswd)

          if (flag == 1) {
            db.users.push(user);
            db.users[length].password = hashedPswd;
          }

          fs.writeFile(filename, JSON.stringify(db, null, '\t'), function (err) {
            if (err) console.log(err);
            if (flag == 1) res.redirect('/home.html');else res.send('A user already exists with these credentials');
          });
        }
      });
    }
  });
}); //LOGIN

app.post('/login', function (req, res) {
  // res.send('This is POST request')
  var user = req.body;
  var data = fs.readFileSync(filename);
  var db = JSON.parse(data);
  var email = req.body.email;
  var pass = req.body.password;
  var flag = 0,
      i = 0,
      c = 0;
  var hash;
  db.users.forEach(function (user) {
    if (user.email === email) {
      c = 1;
      hash = user.password;
    }
  });

  if (c == 0) {
    res.send('User does not exist');
  } else {
    bcrypt.compare(pass, hash, function (err, isMatch) {
      if (err) {
        throw err;
      } else if (!isMatch) {
        // console.log("no ")
        flag = 2;
        res.send('Wrong Password');
      } else {
        db.users.forEach(function (user) {
          if (user.email === email) {
            if (user.password === hash) {
              flag = 1; // name=db.users[i].name
            } // else if(user.password !== hash){
            //     flag=2
            // }

          }
        });
        fs.writeFile(filename, JSON.stringify(db, null, '\t'), function (err) {
          if (err) console.log(err);
          if (flag == 1) res.redirect('/home.html'); // else if(flag==2)
          //     res.send('Wrong Password')    
        });
      }
    });
  } // let hash = "$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K"

}); //FORGOT PASSWORD

app.post('/forgot', function (req, res) {
  // res.send('This is POST request')
  var user = req.body;
  var data = fs.readFileSync(filename);
  var db = JSON.parse(data);
  var email = req.body.email;
  var rno = req.body.rno;
  var pass = req.body.password;
  var flag = 0,
      i = 0,
      c = 0;
  var hash;
  db.users.forEach(function (user) {
    if (user.rno === rno && user.email === email) {
      // hash=user.password;
      c = 1;
      flag = 1; // console.log(hash)
    }
  });

  if (c == 0) {
    res.send('User does not exist');
  } else {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        throw err;
      } else {
        bcrypt.hash(pass, salt, function (err, hash) {
          if (err) {
            throw err;
          } else {
            hashedPswd = hash; // console.log(hashedPswd)

            if (flag == 1) {
              db.users.forEach(function (user) {
                if (user.rno === rno && user.email === email) {
                  // hash=user.password;
                  if (user.password === hashedPswd) flag = 2;else user.password = hashedPswd; // console.log(hash)
                }
              });
            }

            fs.writeFile(filename, JSON.stringify(db, null, '\t'), function (err) {
              if (err) console.log(err);
              if (flag == 1) // res.redirect('/home.html')
                res.send('Password changed successfully.');else if (flag == 2) res.send('Old password cannot be your new password');else res.send('Wrong credentials.');
            });
          }
        });
      }
    });
  }
}); //VIEW ALL USERS

app.get('/view', function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  var data = fs.readFileSync(filename);
  var db = JSON.parse(data);
  res.write('<table><tr><th>Name</th><th>Email</th><th>Regst. no.</th></tr>');
  db.users.forEach(function (user) {
    res.write("<tr><td>".concat(user.name, "</td><td>").concat(user.email, "</td><td>").concat(user.rno, "</td></tr>"));
  });
  res.write('</table>');
  res.end();
}); //UPDATE EMAIL

app.post('/update', function (req, res) {
  var data = fs.readFileSync(filename);
  var db = JSON.parse(data),
      i = 0,
      flag = 0;
  var rno = req.body.rno;
  var email = req.body.email;
  var pass = req.body.password;
  var hash,
      c = 0;
  db.users.forEach(function (user) {
    if (user.rno === rno) {
      hash = user.password;
      c = 1; // console.log(hash)
    }
  });

  if (c == 0) {
    res.send('User does not exist');
  } else {
    bcrypt.compare(pass, hash, function (err, isMatch) {
      if (err) {
        throw err;
      } else if (!isMatch) {
        // console.log("no ")
        flag = 2;
        res.send('Wrong Password');
      } else {
        db.users.forEach(function (user) {
          if (user.rno === rno) {
            if (user.password === hash) {
              flag = 1;
              user.email = email; // name=db.users[i].name
            } else if (user.password !== hash) {
              flag = 2;
            }
          }
        });
        fs.writeFile(filename, JSON.stringify(db, null, '\t'), function (err) {
          if (err) console.log(err);
          if (flag == 1) res.send('Email has been updated!');else if (flag == 2) res.send('Wrong Password');
        });
      }
    });
  }
}); //set profile

app.post('/setdp', function (req, res) {
  // res.send('This is POST request')
  // let user = req.body
  var data = fs.readFileSync(filename);
  var db = JSON.parse(data);
  var email = req.body.email;
  var image = req.body.image; // let pswd="null"

  var flag = 1,
      i = 0;
  db.users.forEach(function (user) {
    if (user.email === email) {
      user.image = image; // console.log(image)
    }
  });
  fs.writeFile(filename, JSON.stringify(db, null, '\t'), function (err) {
    if (err) console.log(err);else res.send('Uploaded');
  });
}); //DELETE ACCOUNT

app.post('/delete', function (req, res) {
  var data = fs.readFileSync(filename);
  var db = JSON.parse(data);
  var rno = req.body.rno;
  var pass = req.body.password;
  var i = 0,
      flag = 0,
      c = 0;
  var hash;
  db.users.forEach(function (user) {
    if (user.rno === rno) {
      hash = user.password;
      c = 1; // console.log(hash)
    }
  });

  if (c == 0) {
    res.send('User does not exist');
  } else {
    bcrypt.compare(pass, hash, function (err, isMatch) {
      if (err) {
        throw err;
      } else if (!isMatch) {
        // console.log("no ")
        flag = 2;
        res.send('Wrong Password');
      } else {
        db.users.forEach(function (user) {
          if (user.rno === rno) {
            if (user.password === hash) {
              flag = 1; // delete db.users[i]

              db.users.splice(i, 1); // name=db.users[i].name
            } else if (user.password !== hash) {
              flag = 2;
            }
          }

          i++;
        });
        fs.writeFile(filename, JSON.stringify(db, null, '\t'), function (err) {
          if (err) console.log(err);
          if (flag == 1) res.send('Account has been deleted!');else if (flag == 2) res.send('Wrong Password');
        });
      }
    });
  }
}); //LOGOUT

app.get('/logout', function (req, res) {
  res.redirect('/index.html');
});
var port = process.env.PORT;

if (port == null || port == "") {
  port = 4000;
}

app.listen(port, function () {
  console.log("Server has started successfully!");
});