const express = require('express');
const mysql = require('mysql2');
//const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
//added part
const http = require('http');
const { Server } = require('socket.io');
//till here
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const PORT = process.env.PORT || 5000;




// Initialize Express app
const app = express();
//added part
const server = http.createServer(app);
const io = new Server(server);
//till here
// Middleware
//app.use(cors());
app.use(cors({ origin: 'http://localhost:5000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(
    session({
        secret: 'your-secret-key', // Replace with a strong secret key
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // Set to true in production with HTTPS
    })
);

/*const db =  await mysql.createConnection({
    host: 'localhost', // your MySQL server host
    user: 'root', // your MySQL username
    password: 'Nikita#123', // your MySQL password
    database: 'bondback', // your database name
});*/
// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost', // your MySQL server host
    user: 'root', // your MySQL username
    password: 'prasanna@1234', // your MySQL password
    database: 'bondback', // your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL connected');
});

// Serve static files from 'views' folder
app.use(express.static(path.join(__dirname, 'views')));

// Routes to handle specific HTML files
app.get('/student_profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'student_profile.html'));
});

app.get('/student_edit.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'student_edit.html'));
});

app.get('/student_signin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'student_signin.html'));
});

// Default route to send student_home.html
app.get('/student_home_new.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'student_home_new.html'));
});

app.get('/alumni_view.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'alumni_view.html'));
});

app.get('/alumni_profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'alumni_profile.html'));
});

app.get('/student_profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'student_profile.html'));
});

app.get('/salumni_profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'alumni_profile.html'));
});

// Signup route
/*app.post('/student_signup', (req, res) => {
    console.log('Received a POST request to /student_signup');
    const { firstName, lastName, email, password, username, uec, contactNo, year, branch, linkedin_link ,profile_photo} = req.body;
    
    // Logging request body to check form submission
    console.log('Form data received:', req.body);

    const query = `
    INSERT INTO students (firstName, lastName, email, password, username, uec, contactNo, year, branch, linkedin_link,profile_photo) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [firstName, lastName, email, password, username, uec, contactNo, year, branch, linkedin_link,profile_photo];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting student:', err);
            return res.status(500).json({ message: 'Error registering student', error: err });
        }
       
            //res.status(200).json({ message: 'Student signed in successfully!', student: results[0] });
           req.session.email = email;
           //req.session.user = results[0];
           res.sendFile(path.join(__dirname, 'views', 'student_home_new.html'));
        
        //res.status(201).json({ message: 'Student registered successfully!' });
    });
});*/

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.post('/student_signup', upload.single('profile_photo'), (req, res) => {
    console.log('Received a POST request to /student_signup');
    
    // Extract form data from req.body
    const { fullname, email, password, username, uec, contactNo, year, branch, linkedin_link} = req.body;

    // Extract file information from req.file
    const profile_photo = req.file ? req.file.filename : null;
    
    // Logging form data and file info
    console.log('Form data received:', req.body);
    console.log('Uploaded file:', req.file);

    const query = `
        INSERT INTO students (fullname, email, password, username, uec, contactNo, year, branch, linkedin_link, profile_photo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [fullname, email, password, username, uec, contactNo, year, branch, linkedin_link, profile_photo];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting student:', err);
            return res.status(500).json({ message: 'Error registering student', error: err });
        }
        
        console.log('Setting session for:', { email, fullname, username });
        req.session.user = { email, fullname, username };
        return  res.sendFile(path.join(__dirname, 'views', 'student_home.html'));
        
        //res.status(201).json({ message: 'Student registered successfully!' });
    });
});

/*app.post('/student_signup',upload.single('profile_photo'), (req, res) => {
    const { fullname, email, password, confirmPassword, username, contactNo, year, branch, uec, linkedin_link } = req.body;
    const profile_photo = req.file ? req.file.filename : null;
    // Validation: Check if all fields are provided
    /*if (!fullname || !email || !password || !username || !contactNo || !year || !branch || !uec || !linkedin_link) {
        return res.status(400).json({ message: 'All fields are required' });
    }*/

    // Validation: Check if password and confirmPassword match
    /*if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if email already exists
    const checkQuery = 'SELECT * FROM students WHERE email = ?';
    db.query(checkQuery, [email], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Insert student data into the database
        const insertQuery = `
            INSERT INTO students (fullname, email, password, username, contactNo, year, branch, uec, linkedin_link,profile_photo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(
            insertQuery,
            [fullname, email, password, username, contactNo, year, branch, uec, linkedin_link,profile_photo],
            (insertErr, insertResult) => {
                if (insertErr) {
                    console.error('Error inserting student data:', insertErr);
                    return res.status(500).json({ message: 'Signup failed' });
                }
                console.log('Setting session for:', { email, fullname, username });
                req.session.user = { email, fullname, username };
                   return res.sendFile(path.join(__dirname, 'views', 'student_home.html'));
            }
        );
    });
});*/


// Alumni signup route
app.post('/alumni_signup', upload.single('profile_photo'), (req, res) => {
  console.log('Received a POST request to /alumni_signup');
  
  // Destructure form data from request body
  const { fullname, email, password, username, Cno, curr_org, pass_year, linkedin_link, prev_exp, domain, location, contactNo, } = req.body;
  const profile_photo = req.file ? req.file.filename : null;
  // Log form data to check submission
  console.log('Form data received:', req.body);
  console.log('Uploaded file:', req.file);

  // Define query to insert data into alumni table
  const query = `
  INSERT INTO alumni (fullname, email, password, username, Cno, curr_org, pass_year, linkedin_link, prev_exp, domain, location, contactNo, profile_photo) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Values to be inserted
  const values = [fullname, email, password, username, Cno, curr_org, pass_year, linkedin_link, prev_exp, domain, location, contactNo, profile_photo];

  
  // Execute the query
  db.query(query, values, (err, result) => {
      if (err) {
          console.error('Error inserting alumni:', err);
          return res.status(500).json({ message: 'Error registering alumni', error: err });
      }
      console.log('Setting session for:', { email, fullname, username });
      req.session.user = { email, fullname, username };
      return  res.sendFile(path.join(__dirname, 'views', 'alumni_home.html'));
  });
});

// Teacher signup route
app.post('/teacher_signup', upload.single('profile_photo'), (req, res) => {
  console.log('Received a POST request to /teacher_signup');
  const { fullname, username, email, password, branch, contactNo } = req.body;
  const profile_photo = req.file ? req.file.filename : null;

  // Logging request body to check form submission
  console.log('Form data received:', req.body);
  const query = `INSERT INTO teachers (fullname, username, email, password, branch, contactNo,profile_photo) 
  VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [fullname, username, email, password, branch, contactNo];

  db.query(query, values, (err, result) => {
      if (err) {
          console.error('Error inserting teacher:', err);
          return res.status(500).json({ message: 'Error registering teacher', error: err });
      }
      res.sendFile(path.join(__dirname, 'views', 'teacher_home.html'));
      res.status(201).json({ message: 'Teacher registered successfully!' });
  });
});


// Admin signup route
app.post('/admin_signup', (req, res) => {
  console.log('Received a POST request to /admin_signup');
  
  // Destructure form data from request body
  const { username, password, name, email, contactNo } = req.body;

  // Logging request body to check form submission
  console.log('Form data received:', req.body);

  // Define query to insert data into Admin table
  const query = `
  INSERT INTO admin (username, password, name, email, contact_no) 
  VALUES (?, ?, ?, ?, ?)`;

  // Values to be inserted
  const values = [username, password, name, email, contactNo];

  // Execute the query
  db.query(query, values, (err, result) => {
      if (err) {
          console.error('Error inserting admin:', err);
          return res.status(500).json({ message: 'Error registering admin', error: err });
      }
      res.status(201).json({ message: 'Admin registered successfully!' });
  });
});

//signin
// Student Sign-in route
app.post('/student_signin', (req, res) => {
    const { email, password } = req.body;
    //added part
    req.session.email = email;
    const query = `SELECT * FROM students WHERE email = ? AND password = ?`;
    const values = [email, password];
    
    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error signing in student:', err);
            return res.status(500).json({ message: 'Error signing in student', error: err });
        }
        
        if (results.length > 0) {
            //res.status(200).json({ message: 'Student signed in successfully!', student: results[0] });
           // req.session.email = email;
           req.session.user = {
            id: results[0].id,
            email: results[0].email,
            fullname: results[0].fullname, // Assuming you have a name field
        };
           //req.session.user = results[0];
            //res.sendFile(path.join(__dirname, 'student_home_new.html'));
            res.sendFile(path.join(__dirname, 'views', 'student_home.html'));
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});

app.get('/current_user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user); // Return the stored session data
    } else {
        res.status(401).json({ message: 'No user logged in' });
    }
});


// Alumni Sign-in route
app.post('/alumni-signin', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM alumni WHERE email = ? AND password = ?`;
    const values = [email, password];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error signing in alumni:', err);
            return res.status(500).json({ message: 'Error signing in alumni', error: err });
        }

        if (results.length > 0) {
            req.session.user = results[0];
            res.sendFile(path.join(__dirname, 'views', 'alumni_home.html'));
            
            //res.status(200).json({ message: 'Alumni signed in successfully!', alumni: results[0] });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});

// Teacher Sign-in route
app.post('/teacher-signin', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM teachers WHERE email = ? AND password = ?`;
    const values = [email, password];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error signing in teacher:', err);
            return res.status(500).json({ message: 'Error signing in teacher', error: err });
        }

        if (results.length > 0) {
            res.status(200).json({ message: 'Teacher signed in successfully!', teacher: results[0] });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});



//Admin Sign-in route
// Admin Sign-in route
app.post('/admin_signin', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM admin WHERE email = ? AND password = ?`;
    const values = [email, password];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error signing in admin:', err);
            return res.status(500).json({ message: 'Error signing in admin', error: err });
        }

        if (results.length > 0) {
            req.session.user = results[0];
            res.status(200).json({ message: 'Admin signed in successfully!', admin: results[0] });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});


// Endpoint to get student profile
//api to get student information
app.get('/api/getStudentProfile', (req, res) => {
    // Check if the user is logged in
    if (req.session.user) {
        const email = req.session.user.email; // Assuming session stores user email

        // Query to get student data from the database based on email
        const query = 'SELECT * FROM students WHERE email = ?'; // Replace 'students' with your actual table name

        db.query(query, [email], (err, result) => {
            if (err) {
                console.error('Error fetching student data:', err);
                return res.status(500).json({ message: 'Error fetching student data' });
            }

            if (result.length > 0) {
    
                result[0].profile_photo = result[0].profile_photo;
                return res.status(200).json(result[0]);
                /*if (studentData.profile_photo) {
                    const base64Image = studentData.profile_photo.toString('base64');
                    studentData.profile_photo = `data:image/png;base64,${base64Image}`; // Adjust MIME type if needed
                }*/
            } else {
                res.status(404).json({ message: 'Student not found' });
            }
        });
    } else {
        res.status(401).json({ message: 'User not logged in' });
    }
});
/*app.get('/api/getStudentProfile', (req, res) => {
    // Extract the email from query parameters (if session-based login isn't used)
    const email = req.query.email; // Ensure the frontend sends 'email' as a query parameter

    if (!email) {
        return res.status(400).json({ message: 'Email is required' }); // Validation for email
    }

    // Query to get student data from the database based on email
    const query = 'SELECT * FROM students WHERE email = ?'; // Replace 'students' with your actual table name

    db.query(query, [email], (err, result) => {
        if (err) {
            console.error('Error fetching student data:', err);
            return res.status(500).json({ message: 'Error fetching student data' });
        }

        if (result.length > 0) {
            const studentData = result[0];

            // Update profile photo path if it exists
            if (studentData.profile_photo) {
                studentData.profile_photo = `http://Bondback/uploads/${studentData.profile_photo}`;
            }

            // Send back the student data
            res.json(studentData);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    });
});*/

// Endpoint to update student profile
app.post('/api/updateStudentProfile', upload.single('profile_photo'), (req, res) => {
    const { fullname, password, username, uec, contactNo, year, branch, linkedin_link } = req.body; 
    const email = req.session.user.email;
    
    // Check if file is uploaded
    const profilePhotoPath = req.file ? `/uploads/${req.file.filename}` : null; // Get the uploaded file path if exists


    const query = `UPDATE students SET fullname= ?, password = ?, username = ?, uec = ?, contactNo = ?, year = ?, branch = ?, linkedin_link = ?, profile_photo = ? WHERE email = ?`;
    const values = [fullname, password, username, uec, contactNo, year, branch, linkedin_link, profilePhotoPath, email];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).json({ message: 'Error updating profile', error: err });
        }
        res.json({ message: 'Profile updated successfully!' });
    });
});

//Profile for alumni 
app.get('/api/getAlumniProfile', (req, res) => {
    console.log('Request received for Alumni Profile');
    if (req.session.user) {
        const email = req.session.user.email;

        const query = 'SELECT * FROM alumni WHERE email = ?';
        db.query(query, [email], (err, result) => {
            if (err) {
                console.error('Error fetching alumni data:', err);
                return res.status(500).json({ message: 'Error fetching alumni data' });
            }

            if (result.length > 0) {
                result[0].profile_photo = result[0].profile_photo; // Keep it as relative path, like '1732512976495-profile%20photo.png'
return res.status(200).json(result[0]); // Send the alumni data back to the frontend


                //return res.status(200).json(result[0]); // Send the alumni data back to the frontend
            } else {
                return res.status(404).json({ message: 'Alumni not found' });
            }
        });
    } else {
        return res.status(401).json({ message: 'User not logged in' });
    }
});


// Endpoint to update alumni profile
app.post('/api/updateAlumniProfile', (req, res) => {
    const { id, fullname, password, username,  curr_org, pass_year, linkedin_link, domain, location, contactNo } = req.body; // Destructure updated fields
    const email = req.session.user.email; // Use session-stored email as identifier

    const query = `UPDATE alumni SET fullname = ?,password= ?, username= ?, curr_org= ?, pass_year= ?, linkedin_link= ?, domain= ?, location= ?, contactNo= ? where email=?`;
    const values = [id, fullname, password, username, curr_org, pass_year, linkedin_link,domain, location, contactNo,email];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).json({ message: 'Error updating profile', error: err });
        }
        res.json({ message: 'Profile updated successfully!' });
    });
});
/*app.get('/api/getStudentProfile', (req, res) => {
    // Check if the user is logged in
    if (req.session.user) {
        const email = req.session.user.email; // Assuming session stores user email

        // Query to get student data from the database based on email
        const query = 'SELECT * FROM students WHERE email = ?'; // Replace 'students' with your actual table name

        db.query(query, [email], (err, result) => {
            if (err) {
                console.error('Error fetching student data:', err);
                return res.status(500).json({ message: 'Error fetching student data' });
            }

            if (result.length > 0) {
                // Send back the student data
                studentData=res.json(result[0]);
                //result[0].profile_photo = `http://Bondback BY/uploads/${result[0].profile_photo}`;
                result[0].profile_photo = `http://Bondback/uploads/${result[0].profile_photo}`;
                /*if (studentData.profile_photo) {
                    const base64Image = studentData.profile_photo.toString('base64');
                    studentData.profile_photo = `data:image/png;base64,${base64Image}`; // Adjust MIME type if needed
                }*/
            /*} else {
                res.status(404).json({ message: 'Student not found' });
            }
        });
    } else {
        res.status(401).json({ message: 'User not logged in' });
    }
});*/
/*app.get('/api/getStudentProfile', (req, res) => {
    // Extract the email from query parameters (if session-based login isn't used)
    const email = req.query.email; // Ensure the frontend sends 'email' as a query parameter

    if (!email) {
        return res.status(400).json({ message: 'Email is required' }); // Validation for email
    }

    // Query to get student data from the database based on email
    const query = 'SELECT * FROM students WHERE email = ?'; // Replace 'students' with your actual table name

    db.query(query, [email], (err, result) => {
        if (err) {
            console.error('Error fetching student data:', err);
            return res.status(500).json({ message: 'Error fetching student data' });
        }

        if (result.length > 0) {
            const studentData = result[0];

            // Update profile photo path if it exists
            if (studentData.profile_photo) {
                studentData.profile_photo = `http://Bondback/uploads/${studentData.profile_photo}`;
            }

            // Send back the student data
            res.json(studentData);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    });
});*/

// Endpoint to update student profile
/*app.post('/api/updateStudentProfile', upload.single('profile_photo'), (req, res) => {
    const { fullname, password, username, uec, contactNo, year, branch, linkedin_link } = req.body; 
    const email = req.session.user.email;
    
    // Check if file is uploaded
    const profilePhotoPath = req.file ? `/uploads/${req.file.filename}` : null; // Get the uploaded file path if exists


    const query = `UPDATE students SET fullname= ?, password = ?, username = ?, uec = ?, contactNo = ?, year = ?, branch = ?, linkedin_link = ?, profile_photo = ? WHERE email = ?`;
    const values = [fullname, password, username, uec, contactNo, year, branch, linkedin_link, profilePhotoPath, email];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).json({ message: 'Error updating profile', error: err });
        }
        res.json({ message: 'Profile updated successfully!' });
    });
});*/

// Sample Node.js/Express route
app.get('/getAllAlumni', (req, res) => { 
    const query = "SELECT fullname, pass_year, curr_org, linkedin_link, profile_photo FROM alumni";
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error fetching alumni data" });
        }

        results.forEach(alumni => {
            alumni.profile_photo = alumni.profile_photo
                ? `http://localhost:5000/uploads/${alumni.profile_photo}`
                : null;
        });

        res.json(results);
    });
});



app.get('/searchAlumni', async (req, res) => {
    const { type, value } = req.query; // type can be 'name', 'year', or 'organization'

    let query = "";
    let params = [];

    // Build the query based on the search type
    if (type === 'name') {
        query = "SELECT * FROM alumni WHERE firstName LIKE ? OR lastName LIKE ?";
        params = [`%${value}%`, `%${value}%`];
    } else if (type === 'year') {
        query = "SELECT * FROM alumni WHERE pass_year = ?";
        params = [value];
    } else if (type === 'organization') {
        query = "SELECT * FROM alumni WHERE curr_org LIKE ?";
        params = [`%${value}%`];
    }

    try {
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});
app.get('/search', (req, res) => {
    const searchTerm = `%${req.query.q}%`; // Get the search term from the query parameters

    const query = `
    SELECT 'alumni' AS type, email, fullname,'' as branch, curr_org, pass_year, domain,'' AS uec 
    FROM alumni 
    WHERE fullname LIKE ? OR curr_org LIKE ? OR pass_year LIKE ? OR domain LIKE ?
    UNION
    SELECT 'student' AS type, email, fullname, branch, '' AS curr_org ,'' pass_year, '' AS domain ,uec
    FROM students 
    WHERE fullname LIKE ? OR branch LIKE ? OR  uec LIKE ?
    UNION
    SELECT 'post' AS type, id, title, content, '' AS curr_org,'' AS pass_year, '' AS domain ,'' AS uec 
    FROM posts 
    WHERE title LIKE ? OR content LIKE ?
`;

const params = [
    searchTerm, searchTerm, searchTerm, searchTerm, // Alumni filters
    searchTerm, searchTerm, searchTerm, // Student filters
    searchTerm, searchTerm                          // Post filters
];

db.query(query, params, (err, results) => {
    if (err) {
        console.error('Error during search:', err);
        return res.status(500).json({ message: 'Search error' });
    }
    res.json(results);
});

});



// Route to handle post submission
/*app.post('/addPost', upload.single('image'), (req, res) => {
    const { title, content,fullname } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const createdAt = new Date();

    const query = 'INSERT INTO posts (title, content, image_url, created_at,fullname) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, content, imageUrl, createdAt,fullname], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error saving post.' });
        }
        res.status(200).json({ message: 'Post created successfully!' });
    });
});*/

app.post('/addPost', upload.single('image'), (req, res) => {
    const { title, content, fullname, email, profile_photo} = req.body; // Extract additional data from the request body
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const createdAt = new Date();
    //console.log(req.body);

    console.log(profile_photo);
    // Update query to include fullname and email explicitly
    const query = `
        INSERT INTO posts (title, content, image_url, created_at, fullname, email, profile_photo)
         VALUES (?, ?, ?, ?, ?, ?,?)
    `;

    db.query(query, [title, content, imageUrl, createdAt, fullname, email, profile_photo], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error saving post.' });
        }
        res.status(200).json({ message: 'Post created successfully!' });
    });
});



app.get('/getPosts', (req, res) => {
    const query = 'SELECT id, title, content, image_url, created_at, fullname,profile_photo FROM posts ORDER BY created_at DESC';

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching posts.' });
        }
        res.status(200).json(results); // Send all posts as JSON
    });
});
/*app.get('/getPosts', (req, res) => {
    const query = `
        SELECT posts.content, posts.image_url, alumni.fullname, alumni.profile_photo
        FROM posts
        JOIN alumni ON posts.fullname = alumni.fullname;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.status(500).json({ error: 'Failed to fetch posts' });
        }

        // Send the results as JSON
        res.json(results);
    });
});*/


/*app.get('/getMessages', async (req, res) => {
    const { user1, user2 } = req.query;
    try {
        const result = await db.query(
            'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp ASC',
            [user1, user2, user2, user1]
        );
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
});


app.get('/chat', async (req, res) => {
    const { studentId, alumniId } = req.query;

    if (!studentId || !alumniId) {
        return res.status(400).json({ error: 'studentId and alumniId are required' });
    }

    try {
        const messages = await db.query(
            `SELECT * FROM messages 
             WHERE (sender_id = ? AND receiver_id = ?) 
                OR (sender_id = ? AND receiver_id = ?)
             ORDER BY created_at ASC`,
            [studentId, alumniId, alumniId, studentId]
        );

        res.json(messages);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});*/

app.get('/getBatchmates/:pass_year', (req, res) => {
    const passYear = req.params.pass_year;

    const query = `SELECT * FROM alumni WHERE pass_year = ?`; // Update table name if needed
    db.query(query, [passYear], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error fetching batchmates' });
        }
        res.send(results);
    });
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    socket.on('sendMessage', (data) => {
      const { sender_id, receiver_id, message } = data;
      const sql = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
      db.query(sql, [sender_id, receiver_id, message], (err, result) => {
        if (err) throw err;
        io.emit(`receiveMessage-${receiver_id}`, data); // Emit to specific receiver
      });
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });


  app.post('/sendMessage', (req, res) => {
    const { sender_id, receiver_id, message } = req.body;
    const sql = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
    db.query(sql, [sender_id, receiver_id, message], (err, result) => {
      if (err) throw err;
      res.send({ message: 'Message sent!' });
    });
  });

  app.get('/getMessages/:userId/:chatWithId', (req, res) => {
    const { userId, chatWithId } = req.params;
    const sql = `
      SELECT * FROM messages 
      WHERE (sender_id = ? AND receiver_id = ?) 
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY timestamp ASC`;
    db.query(sql, [userId, chatWithId, chatWithId, userId], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });

  app.get('/api/myposts', (req, res) => {
    const userEmail = req.query.email;

    if (!userEmail) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const query = 'SELECT id, title, content, image_url, created_at FROM posts WHERE email = ?';
    db.query(query, [userEmail], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed.' });
        } else {
            res.json(results);
        }
    });
});


// Route to delete a post by ID
app.delete('/api/deletePost/:id', (req, res) => {
    const postId = req.params.id;

    const query = 'DELETE FROM posts WHERE id = ?';
    db.query(query, [postId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete post.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        res.json({ message: 'Post deleted successfully.' });
    });
});

  



app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

    
