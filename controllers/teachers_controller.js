
const conn = require("../conn/connection.js");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');
const { sendConfirmationEmail, sendVerificationSuccessEmail } = require('../helpers/email');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// // Register a new teacher
// function register_teacher(req, res) {
//   const { name, email, password, questions } = req.body;

//   // Check if profile picture is provided
//   if (!req.file) {
//     return res.status(400).json({ error: 'Profile picture is required' });
//   }

//   // Upload the profile picture to Cloudinary
//   cloudinary.uploader.upload(req.file.path, { folder: 'profile_pictures', resource_type: 'auto' }, (error, result) => {
//     if (error) {
//       console.error('Error uploading profile picture:', error);
//       return res.status(500).json({ error: 'Failed to register teacher' });
//     }

//     const profile_picture = result.secure_url;

//     // Generate verification token using JWT
//     const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

//     // Check if email already exists in the `teachers` table
//     conn.query(
//       'SELECT * FROM teachers WHERE email = ?',
//       [email],
//       (error, results) => {
//         if (error) {
//           console.error('Error checking existing email:', error);
//           return res.status(500).json({ error: 'Failed to register teacher' });
//         }

//         if (results.length > 0) {
//           // Email already registered
//           return res.status(400).json({ error: 'Email already registered' });
//         }

//         // Hash the password
//         bcrypt.hash(password, 10, (error, hashedPassword) => {
//           if (error) {
//             console.error('Error hashing password:', error);
//             return res.status(500).json({ error: 'Failed to register teacher' });
//           }

//           // Insert the teacher's data into the `teachers` table with the hashed password
//           conn.query(
//             'INSERT INTO teachers (name, email, password, profile_picture) VALUES (?, ?, ?, ?)',
//             [name, email, hashedPassword, profile_picture],
//             (error, results) => {
//               if (error) {
//                 console.error('Error registering teacher:', error);
//                 return res.status(500).json({ error: 'Failed to register teacher' });
//               }

//               const teacherId = results.insertId;

//               // Insert the security questions into the `questions` table
//               conn.query(
//                 'INSERT INTO questions (teacher_id, question1, question2, question3) VALUES (?, ?, ?, ?)',
//                 [teacherId, questions[0], questions[1], questions[2]],
//                 (error) => {
//                   if (error) {
//                     console.error('Error inserting security questions:', error);
//                     return res.status(500).json({ error: 'Failed to register teacher' });
//                   }

//                   // Send confirmation email
//                   sendConfirmationEmail(email, verificationToken);

//                   res.status(200).json({ message: 'Registration successful! Please check your email to verify your account.' });
//                 }
//               );
//             }
//           );
//         });
//       }
//     );
//   });
// }





// // Register a new teacher
// function register_teacher(req, res) {
//     const { name, email, password, address, phone } = req.body;
  
//     // Check if email already exists in the `teachers` table
//     conn.query(
//       'SELECT * FROM teachers WHERE email = ?',
//       [email],
//       (error, results) => {
//         if (error) {
//           console.error('Error checking existing email:', error);
//           return res.status(500).json({ error: 'Failed to register teacher' });
//         }
  
//         if (results.length > 0) {
//           // Email already registered
//           return res.status(400).json({ error: 'Email already registered' });
//         }
  
//         // Hash the password
//         bcrypt.hash(password, 10, (error, hashedPassword) => {
//           if (error) {
//             console.error('Error hashing password:', error);
//             return res.status(500).json({ error: 'Failed to register teacher' });
//           }
  
//           // Generate verification token using JWT
//           const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
//           // Insert the teacher's data into the `teachers` table with the hashed password and address/phone
//           conn.query(
//             'INSERT INTO teachers (name, email, password, address, phone) VALUES (?, ?, ?, ?, ?)',
//             [name, email, hashedPassword, address, phone],
//             (error, results) => {
//               if (error) {
//                 console.error('Error registering teacher:', error);
//                 return res.status(500).json({ error: 'Failed to register teacher' });
//               }
  
//               const teacherId = results.insertId;
  
//               // Send confirmation email
//               sendConfirmationEmail(email, verificationToken);
  
//               res.status(200).json({ message: 'Registration successful! Please check your email to verify your account.' });
//             }
//           );
//         });
//       }
//     );
//   }
  






// Register a new teacher
function register_teacher(req, res) {
    const { name, email, password, address, phone } = req.body;
  
    // Check if email already exists in the `teachers` table
    conn.query(
      'SELECT * FROM teachers WHERE email = ?',
      [email],
      (error, results) => {
        if (error) {
          console.error('Error checking existing email:', error);
          return res.status(500).json({ error: 'Failed to register teacher' });
        }
  
        if (results.length > 0) {
          // Email already registered
          return res.status(400).json({ error: 'Email already registered' });
        }
  
        // Hash the password
        bcrypt.hash(password, 10, (error, hashedPassword) => {
          if (error) {
            console.error('Error hashing password:', error);
            return res.status(500).json({ error: 'Failed to register teacher' });
          }
  
          // Generate verification token using JWT
          const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
          // Insert the teacher's data into the `teachers` table with the hashed password, address, and phone
          conn.query(
            'INSERT INTO teachers (name, email, password, address, phone) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, phone],
            (error, results) => {
              if (error) {
                console.error('Error registering teacher:', error);
                return res.status(500).json({ error: 'Failed to register teacher' });
              }
  
              const teacherId = results.insertId;
  
              // Get the count of teachers in the `groups` table
              conn.query(
                'SELECT COUNT(*) AS teacher_count FROM groups',
                (error, results) => {
                  if (error) {
                    console.error('Error retrieving teacher count from groups:', error);
                    return res.status(500).json({ error: 'Failed to register teacher' });
                  }
  
                  const teacherCount = results[0].teacher_count;
                  const groupId = Math.floor(teacherCount / 15) + 1; // Calculate the group ID for the teacher
  
                  // Insert the teacher into the `groups` table with the calculated group ID
                  conn.query(
                    'INSERT INTO groups (teacher_id, group_id) VALUES (?, ?)',
                    [teacherId, groupId],
                    (error) => {
                      if (error) {
                        console.error('Error inserting teacher into groups:', error);
                        return res.status(500).json({ error: 'Failed to register teacher' });
                      }
  
                      // Send confirmation email
                      sendConfirmationEmail(email, verificationToken);
  
                      res.status(200).json({ message: 'Registration successful! Please check your email to verify your account.' });
                    }
                  );
                }
              );
            }
          );
        });
      }
    );
  }
  


// Confirm email
function confirm_email(req, res) {
    const { token } = req.params;
  
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        console.error('Error verifying email token:', error);
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
  
      const { email } = decoded;
  
      // Check if the email is already verified
      conn.query(
        'SELECT is_email_verified FROM teachers WHERE email = ?',
        [email],
        (error, results) => {
          if (error) {
            console.error('Error checking email verification status:', error);
            return res.status(500).json({ error: 'Failed to verify email' });
          }
  
          // Check if email is already verified
          if (results.length > 0 && results[0].is_email_verified === 1) {
            return res.status(400).json({ error: 'Email already verified' });
          }
  
          // Update the teacher's email verification status and set is_email_verified to 1
          conn.query(
            'UPDATE teachers SET is_email_verified = 1 WHERE email = ?',
            [email],
            (error, results) => {
              if (error) {
                console.error('Error updating email verification status:', error);
                return res.status(500).json({ error: 'Failed to verify email' });
              }
  
              // Send verification success email
              sendVerificationSuccessEmail(email);
  
              res.status(200).json({ message: 'Email confirmed successfully', isEmailVerified: true });
            }
          );
        }
      );
    });
  }


//   Teacher Login API


// function login_teacher(req, res) {
//     const { email, password } = req.body;
  
//     // Check if email and password are provided
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }
  
//     // Check if the email exists in the `teachers` table
//     conn.query(
//       'SELECT * FROM teachers WHERE email = ?',
//       [email],
//       (error, results) => {
//         if (error) {
//           console.error('Error checking existing email:', error);
//           return res.status(500).json({ error: 'Failed to login' });
//         }
  
//         if (results.length === 0) {
//           // Email not found
//           return res.status(404).json({ error: 'Email not found' });
//         }
  
//         const teacher = results[0];
  
//         // Check if the password is correct
//         bcrypt.compare(password, teacher.password, (error, isMatch) => {
//           if (error) {
//             console.error('Error comparing passwords:', error);
//             return res.status(500).json({ error: 'Failed to login' });
//           }
  
//           if (!isMatch) {
//             // Incorrect password
//             return res.status(401).json({ error: 'Incorrect password' });
//           }
  
//           // Generate JWT token
//           const token = jwt.sign({ id: teacher.id, email: teacher.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
//           // Set the token as a cookie
//           res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day expiration
  
//           res.status(200).json({ message: 'Login successful', token });
//         });
//       }
//     );
//   }


function login_teacher(req, res) {
    const { email, password } = req.body;
  
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    // Check if the email exists in the `teachers` table
    conn.query(
      'SELECT * FROM teachers WHERE email = ?',
      [email],
      (error, results) => {
        if (error) {
          console.error('Error checking existing email:', error);
          return res.status(500).json({ error: 'Failed to login' });
        }
  
        if (results.length === 0) {
          // Email not found
          return res.status(404).json({ error: 'Email not found' });
        }
  
        const teacher = results[0];
  
        // Check if the teacher's email is verified
        if (teacher.is_email_verified === 0) {
          return res.status(403).json({ error: 'Please verify your email before login' });
        }
  
        // Check if the teacher's account is blocked
        if (teacher.status === 0) {
          return res.status(403).json({ error: 'Your account has been blocked by the admin. Please contact the administrator' });
        }
  
        // Check if the password is correct
        bcrypt.compare(password, teacher.password, (error, isMatch) => {
          if (error) {
            console.error('Error comparing passwords:', error);
            return res.status(500).json({ error: 'Failed to login' });
          }
  
          if (!isMatch) {
            // Incorrect password
            return res.status(401).json({ error: 'Incorrect password' });
          }
  
          // Generate JWT token
          const token = jwt.sign({ id: teacher.id, email: teacher.email, name: teacher.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
          // Set the token as a cookie
          res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day expiration
  
          res.status(200).json({ message: 'Login successful', token });
        });
      }
    );
  }
  
  




// // Get a single teacher by ID
// function get_single_teacher(req, res) {
//     const teacherId = req.params.id;
//     // const loggedInUserId = req.user.id;
  
//     // Query the `teachers` table to get the teacher by ID
//     conn.query(
//       'SELECT * FROM teachers WHERE id = ?',
//       [teacherId],
//       (error, results) => {
//         if (error) {
//           console.error('Error fetching teacher:', error);
//           return res.status(500).json({ error: 'Failed to get teacher' });
//         }
  
//         // Check if the teacher exists
//         if (results.length === 0) {
//           return res.status(404).json({ error: 'Teacher not found' });
//         }
  
//         // Check if the logged-in user is authorized to access this teacher's information
//         const teacher = results[0];
//         // if (teacher.id !== loggedInUserId) {
//         //   return res.status(403).json({ error: 'Forbidden' });
//         // }
  
//         // Fetch the associated general_photos for the teacher
//         conn.query(
//           'SELECT * FROM general_photos WHERE teacher_id = ?',
//           [teacherId],
//           (error, photoResults) => {
//             if (error) {
//               console.error('Error fetching general photos:', error);
//               return res.status(500).json({ error: 'Failed to get general photos' });
//             }
  
//             // Exclude the password field from the teacher data
//             const { password, ...teacherData } = teacher;
  
//             // Add the general_photos to the teacher data
//             teacherData.general_photos = photoResults;
  
//             res.status(200).json({ teacher: teacherData });
//           }
//         );
//       }
//     );
//   }









// Get a single teacher by ID
function get_single_teacher(req, res) {
    const teacherId = req.params.id;
  
    // Query the `teachers` table to get the teacher by ID
    conn.query(
      'SELECT * FROM teachers WHERE id = ?',
      [teacherId],
      (error, results) => {
        if (error) {
          console.error('Error fetching teacher:', error);
          return res.status(500).json({ error: 'Failed to get teacher' });
        }
  
        // Check if the teacher exists
        if (results.length === 0) {
          return res.status(404).json({ error: 'Teacher not found' });
        }
  
        // Fetch the associated profile_picture from the profile_pictures table
        conn.query(
          'SELECT * FROM profile_pictures WHERE teacher_id = ?',
          [teacherId],
          (error, photoResults) => {
            if (error) {
              console.error('Error fetching profile picture:', error);
              return res.status(500).json({ error: 'Failed to get profile picture' });
            }
  
            // Exclude the password field from the teacher data
            const { password, ...teacherData } = results[0];
  
            // Add the profile_picture to the teacher data
            teacherData.profile_picture = photoResults.length > 0 ? photoResults[0].picture_url : null;
  
            // Fetch the associated general_photos for the teacher
            conn.query(
              'SELECT * FROM general_photos WHERE teacher_id = ?',
              [teacherId],
              (error, generalPhotoResults) => {
                if (error) {
                  console.error('Error fetching general photos:', error);
                  return res.status(500).json({ error: 'Failed to get general photos' });
                }
  
                // Add the general_photos to the teacher data
                teacherData.general_photos = generalPhotoResults;
  
                res.status(200).json({ teacher: teacherData });
              }
            );
          }
        );
      }
    );
  }
  
  


//   upload photos API by logged-in user
  

//   function add_photos(req, res) {
//     const teacherId = req.user.id; // Assuming you have implemented user authentication
  
//     // Get the array of photo files from the request body
//     const photos = req.files;

  
//     // Check if the number of photos exceeds the limit
//     // if (photos.length > 5) {
//     //   return res.status(400).json({ error: 'Maximum of 5 photos can be uploaded.' });
//     // }
  
//     // Check if the user has already uploaded 5 photos
//     conn.query(
//       'SELECT COUNT(*) AS photo_count FROM general_photos WHERE teacher_id = ?',
//       [teacherId],
//       (error, results) => {
//         if (error) {
//           console.error('Error retrieving photo count:', error);
//           return res.status(500).json({ error: 'Failed to retrieve photo count' });
//         }
  
//         const photoCount = results[0].photo_count;
  
//         // Check if the user has already uploaded 5 photos
//         if (photoCount >= 5) {
//           return res.status(400).json({ error: 'Maximum of 5 photos have already been uploaded.' });
//         }
  
//         // Array to store the generated photo URLs
//         const photoUrls = [];
  
//         // Create a folder in Cloudinary for the logged-in user
//         cloudinary.api.create_folder(`general_photos/${teacherId}`, (error, result) => {
//           if (error) {
//             console.error('Error creating folder in Cloudinary:', error);
//             return res.status(500).json({ error: 'Failed to create folder in Cloudinary' });
//           }
  
//           // Iterate through the photos array
//           for (const photo of photos) {
//             // Upload the photo to Cloudinary inside the folder
//             cloudinary.uploader.upload(photo.path, { folder: `general_photos/${teacherId}` }, (error, result) => {
//               if (error) {
//                 console.error('Error uploading photo:', error);
//                 return res.status(500).json({ error: 'Failed to upload photo' });
//               }
  
//               // Save the generated photo URL to the array
//               photoUrls.push(result.secure_url);
  
//               // Check if all photos have been processed
//               if (photoUrls.length === photos.length) {
//                 // Save the photo URLs in the general_photos table
//                 const photoRecords = photoUrls.map((photoUrl) => [teacherId, photoUrl]);
  
//                 conn.query(
//                   'INSERT INTO general_photos (teacher_id, photo_url) VALUES ?',
//                   [photoRecords],
//                   (error, results) => {
//                     if (error) {
//                       console.error('Error saving photo records:', error);
//                       return res.status(500).json({ error: 'Failed to save photo records' });
//                     }
  
//                     res.status(200).json({ message: 'Photos added successfully' });
//                   }
//                 );
//               }
//             });
//           }
//         });
//       }
//     );
//   }
 

function add_photos(req, res) {
    const teacherId = req.user.id; // Assuming you have implemented user authentication
  
    // Get the array of photo files from the request body
    const photos = req.files;
  
    // Check if the user has already uploaded 5 photos
    conn.query(
      'SELECT COUNT(*) AS photo_count FROM general_photos WHERE teacher_id = ?',
      [teacherId],
      (error, results) => {
        if (error) {
          console.error('Error retrieving photo count:', error);
          return res.status(500).json({ error: 'Failed to retrieve photo count' });
        }
  
        const photoCount = results[0].photo_count;
  
        // Check if the user has already uploaded 5 photos
        if (photoCount >= 5) {
          return res.status(400).json({ error: 'Maximum of 5 photos have already been uploaded.' });
        }
  
        // Array to store the generated photo URLs and public IDs
        const photoData = [];
  
        // Create a folder in Cloudinary for the logged-in user
        cloudinary.api.create_folder(`general_photos/${teacherId}`, (error, result) => {
          if (error) {
            console.error('Error creating folder in Cloudinary:', error);
            return res.status(500).json({ error: 'Failed to create folder in Cloudinary' });
          }
  
          // Iterate through the photos array
          for (const photo of photos) {
            // Upload the photo to Cloudinary inside the folder
            cloudinary.uploader.upload(photo.path, { folder: `general_photos/${teacherId}` }, (error, result) => {
              if (error) {
                console.error('Error uploading photo:', error);
                return res.status(500).json({ error: 'Failed to upload photo' });
              }
  
              // Extract the public ID and secure URL from the Cloudinary response
              const { public_id, secure_url } = result;
  
              // Save the generated photo URL and public ID to the array
              photoData.push({ teacher_id: teacherId, photo_url: secure_url, public_id });
  
              // Check if all photos have been processed
              if (photoData.length === photos.length) {
                // Save the photo data in the general_photos table
                conn.query(
                  'INSERT INTO general_photos (teacher_id, photo_url, public_id) VALUES ?',
                  [photoData.map(({ teacher_id, photo_url, public_id }) => [teacher_id, photo_url, public_id])],
                  (error, results) => {
                    if (error) {
                      console.error('Error saving photo data:', error);
                      return res.status(500).json({ error: 'Failed to save photo data' });
                    }
  
                    res.status(200).json({ message: 'Photos added successfully' });
                  }
                );
              }
            });
          }
        });
      }
    );
  }
  
  

  



// // Update teacher credentials including security questions
// function edit_teacher(req, res) {
//     const teacherId = req.params.id; // Assuming the teacher ID is extracted from req.params
//     const loggedInUserId = req.user.id; // Assuming you have implemented user authentication
  
//     // Check if the logged-in user is authorized to update the teacher's credentials
//     if (teacherId !== String(loggedInUserId)) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }
  
//     const { name, email, questions } = req.body;
  
//     // Check if the email has changed
//     if (email) {
//       // Check if the updated email already exists in the `teachers` table
//       conn.query(
//         'SELECT * FROM teachers WHERE email = ? AND id <> ?',
//         [email, teacherId],
//         (error, results) => {
//           if (error) {
//             console.error('Error checking email availability:', error);
//             return res.status(500).json({ error: 'Failed to update teacher credentials' });
//           }
  
//           if (results.length > 0) {
//             // Email already exists
//             return res.status(400).json({ error: 'Email already taken' });
//           }
  
//           // Update the teacher's credentials in the `teachers` table including the email
//           conn.query(
//             'UPDATE teachers SET name = ?, email = ? WHERE id = ?',
//             [name, email, teacherId],
//             (error, results) => {
//               if (error) {
//                 console.error('Error updating teacher credentials:', error);
//                 return res.status(500).json({ error: 'Failed to update teacher credentials' });
//               }
  
//               // Check if questions array is valid and contains three elements
//               if (questions && questions.length === 3) {
//                 // Update the security questions in the `questions` table
//                 conn.query(
//                   'UPDATE questions SET question1 = ?, question2 = ?, question3 = ? WHERE teacher_id = ?',
//                   [questions[0], questions[1], questions[2], teacherId],
//                   (error) => {
//                     if (error) {
//                       console.error('Error updating security questions:', error);
//                       return res.status(500).json({ error: 'Failed to update teacher credentials' });
//                     }
  
//                     res.status(200).json({ message: 'Teacher credentials updated successfully' });
//                   }
//                 );
//               } else {
//                 // Questions array is invalid or does not contain three elements
//                 res.status(400).json({ error: 'Invalid questions array' });
//               }
//             }
//           );
//         }
//       );
//     } else {
//       // Update the teacher's credentials in the `teachers` table excluding the email
//       conn.query(
//         'UPDATE teachers SET name = ? WHERE id = ?',
//         [name, teacherId],
//         (error, results) => {
//           if (error) {
//             console.error('Error updating teacher credentials:', error);
//             return res.status(500).json({ error: 'Failed to update teacher credentials' });
//           }
  
//           // Check if questions array is valid and contains three elements
//           if (questions && questions.length === 3) {
//             // Update the security questions in the `questions` table
//             conn.query(
//               'UPDATE questions SET question1 = ?, question2 = ?, question3 = ? WHERE teacher_id = ?',
//               [questions[0], questions[1], questions[2], teacherId],
//               (error) => {
//                 if (error) {
//                   console.error('Error updating security questions:', error);
//                   return res.status(500).json({ error: 'Failed to update teacher credentials' });
//                 }          res.status(200).json({ message: 'Teacher credentials updated successfully' });
//             }
//           );
//         } else {
//           // Questions array is invalid or does not contain three elements
//           res.status(400).json({ error: 'Invalid questions array' });
//         }
//       }
//     );
// }
// }    




function edit_teacher(req, res) {
    const teacherId = req.params.id; // Assuming the teacher ID is extracted from req.params
    const loggedInUserId = req.user.id; // Assuming you have implemented user authentication
  
    // Check if the logged-in user is authorized to update the teacher's credentials
    if (teacherId !== String(loggedInUserId)) {
      return res.status(403).json({ error: 'Forbidden, you are not allowed to make changes' });
    }
  
    const { name, email, phone, address, questions } = req.body;
  
    // Update the teacher's credentials in the `teachers` table
    conn.query(
      'SELECT * FROM teachers WHERE id = ?',
      [teacherId],
      (error, results) => {
        if (error) {
          console.error('Error retrieving teacher data:', error);
          return res.status(500).json({ error: 'Failed to update teacher credentials' });
        }
  
        // Check if the teacher exists
        if (results.length === 0) {
          return res.status(404).json({ error: 'Teacher not found' });
        }
  
        const teacher = results[0];
  
        // Update the teacher's credentials in the `teachers` table
        conn.query(
          'UPDATE teachers SET name = ?, email = IFNULL(?, email), phone = IFNULL(?, phone), address = IFNULL(?, address) WHERE id = ?',
          [name, email, phone, address, teacherId],
          (error, results) => {
            if (error) {
              console.error('Error updating teacher credentials:', error);
              return res.status(500).json({ error: 'Failed to update teacher credentials' });
            }
  
            // Update the security questions in the `questions` table
            conn.query(
              'SELECT * FROM questions WHERE teacher_id = ?',
              [teacherId],
              (error, results) => {
                if (error) {
                  console.error('Error retrieving security questions:', error);
                  return res.status(500).json({ error: 'Failed to update teacher credentials' });
                }
  
                if (results.length === 0) {
                  // No existing questions, insert new questions
                  conn.query(
                    'INSERT INTO questions (teacher_id, question1, question2, question3, question4) VALUES (?, ?, ?, ?, ?)',
                    [teacherId, questions[0], questions[1], questions[2], questions[3]],
                    (error) => {
                      if (error) {
                        console.error('Error adding security questions:', error);
                        return res.status(500).json({ error: 'Failed to update teacher credentials' });
                      }
  
                      res.status(200).json({ message: 'Teacher credentials updated successfully' });
                    }
                  );
                } else {
                  // Update existing questions
                  conn.query(
                    'UPDATE questions SET question1 = ?, question2 = ?, question3 = ? , question4 = ? WHERE teacher_id = ?',
                    [questions[0], questions[1], questions[2], questions[3], teacherId],
                    (error) => {
                      if (error) {
                        console.error('Error updating security questions:', error);
                        return res.status(500).json({ error: 'Failed to update teacher credentials' });
                      }
  
                      res.status(200).json({ message: 'Teacher credentials updated successfully' });
                    }
                  );
                }
              }
            );
          }
        );
      }
    );
  }
    





// Change teacher's profile picture API

function change_profile_picture(req, res) {
  const teacherId = req.params.id; // Assuming the teacher ID is extracted from req.params
  const loggedInUserId = req.user.id; // Assuming you have implemented user authentication
  
  // Check if the logged-in user is authorized to update the teacher's profile picture
  if (teacherId !== String(loggedInUserId)) {
    return res.status(403).json({ error: 'Forbidden, You are not allowed to make changes' });
  }

  const { profile_picture } = req.body;

  // Check if profile picture is provided
  if (!req.file) {
    return res.status(400).json({ error: 'Profile picture is required' });
  }

  // Delete the old profile picture from Cloudinary
  conn.query(
    'SELECT profile_picture FROM teachers WHERE id = ?',
    [teacherId],
    (error, results) => {
      if (error) {
        console.error('Error fetching teacher profile picture:', error);
        return res.status(500).json({ error: 'Failed to change profile picture' });
      }

      // Check if the teacher has an existing profile picture
      const oldProfilePicture = results[0]?.profile_picture;
      if (oldProfilePicture) {
        // Delete the old profile picture from Cloudinary
        const publicId = oldProfilePicture.split('/').pop().split('.')[0];
        cloudinary.uploader.destroy(publicId, (error, result) => {
            
          if (error) {
            console.error('Error deleting old profile picture from Cloudinary:', error);
            return res.status(500).json({ error: 'Failed to change profile picture' });
          }

          // Update the teacher's profile picture in the `teachers` table
          updateProfilePicture();
        });
      } else {
        // No old profile picture to delete, directly update the teacher's profile picture
        updateProfilePicture();
      }
    }
  );

  // Update the teacher's profile picture in the `teachers` table
  function updateProfilePicture() {
    // Upload the new profile picture to Cloudinary
    cloudinary.uploader.upload(req.file.path, { folder: 'profile_pictures', resource_type: 'auto' }, (error, result) => {
      if (error) {
        console.error('Error uploading profile picture to Cloudinary:', error);
        return res.status(500).json({ error: 'Failed to change profile picture' });
      }

      const newProfilePicture = result.secure_url;

      // Update the teacher's profile picture in the `teachers` table
      conn.query(
        'UPDATE teachers SET profile_picture = ? WHERE id = ?',
        [newProfilePicture, teacherId],
        (error, results) => {
          if (error) {
            console.error('Error updating teacher profile picture:', error);
            return res.status(500).json({ error: 'Failed to change profile picture' });
          }

          res.status(200).json({ message: 'Profile picture changed successfully' });
        }
      );
    });
  }
}




// ####### profile picture chnage API #######

function change_profile_picture(req, res) {
    const teacherId = req.params.id; // Assuming the teacher ID is extracted from req.params
    const loggedInUserId = req.user.id; // Assuming you have implemented user authentication
  
    // Check if the logged-in user is authorized to update the teacher's profile picture
    if (teacherId !== String(loggedInUserId)) {
      return res.status(403).json({ error: 'Forbidden, You are not allowed to make changes' });
    }
  
    // Check if profile picture is provided
    if (!req.file) {
      return res.status(400).json({ error: 'Profile picture is required' });
    }
  
    // Delete the old profile picture from Cloudinary and the profile_pictures table
    conn.query(
      'SELECT picture_url, public_id FROM profile_pictures WHERE teacher_id = ?',
      [teacherId],
      (error, results) => {
        if (error) {
          console.error('Error fetching teacher profile picture:', error);
          return res.status(500).json({ error: 'Failed to change profile picture' });
        }
  
        // Check if the teacher has an existing profile picture
        const oldProfilePicture = results[0]?.picture_url;
        const publicId = results[0]?.public_id;
  
        // Delete the old profile picture from Cloudinary
        if (oldProfilePicture && publicId) {
          cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
              console.error('Error deleting old profile picture from Cloudinary:', error);
              return res.status(500).json({ error: 'Failed to change profile picture' });
            }
  
            // Delete the old profile picture from the profile_pictures table
            conn.query(
              'DELETE FROM profile_pictures WHERE teacher_id = ?',
              [teacherId],
              (error) => {
                if (error) {
                  console.error('Error deleting old profile picture from profile_pictures table:', error);
                  return res.status(500).json({ error: 'Failed to change profile picture' });
                }
  
                // Update the teacher's profile picture in the profile_pictures table
                updateProfilePicture();
              }
            );
          });
        } else {
          // No old profile picture to delete, directly update the teacher's profile picture
          updateProfilePicture();
        }
      }
    );
  
    // Update the teacher's profile picture in the profile_pictures table
    function updateProfilePicture() {
      // Upload the new profile picture to Cloudinary
      cloudinary.uploader.upload(req.file.path, { folder: 'profile_pictures', resource_type: 'auto' }, (error, result) => {
        if (error) {
          console.error('Error uploading profile picture to Cloudinary:', error);
          return res.status(500).json({ error: 'Failed to change profile picture' });
        }
  
        const newProfilePicture = result.secure_url;
  
        // Insert the new profile picture into the profile_pictures table
        conn.query(
          'INSERT INTO profile_pictures (teacher_id, picture_url, public_id) VALUES (?, ?, ?)',
          [teacherId, newProfilePicture, result.public_id],
          (error, results) => {
            if (error) {
              console.error('Error updating teacher profile picture:', error);
              return res.status(500).json({ error: 'Failed to change profile picture' });
            }
  
            res.status(200).json({ message: 'New Profile picture Added successfully' });
          }
        );
      });
    }
  }
  

//   

function delete_photo(req, res) {
    const loggedInUserId = req.user.id; // Assuming you have implemented user authentication
    const photoId = req.params.id; // Assuming the photo ID is extracted from the URL parameters
  
    // Retrieve the photo public ID and teacher ID from the general_photos table
    conn.query(
      'SELECT public_id, teacher_id FROM general_photos WHERE id = ?',
      [photoId],
      (error, results) => {
        if (error) {
          console.error('Error retrieving photo details:', error);
          return res.status(500).json({ error: 'Failed to delete photo' });
        }
  
        // Check if the photo exists
        if (results.length === 0) {
          return res.status(404).json({ error: 'Photo not found' });
        }
  
        const { public_id: publicId, teacher_id: photoTeacherId } = results[0];
  
        // Check if the logged-in user is the owner of the photo
        if (photoTeacherId !== loggedInUserId) {
          return res.status(403).json({ error: 'Forbidden, You are not allowed to delete this photo' });
        }
  
        // Delete the photo from Cloudinary
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            console.error('Error deleting photo from Cloudinary:', error);
            return res.status(500).json({ error: 'Failed to delete photo' });
          }
  
          // Delete the photo record from the general_photos table
          conn.query(
            'DELETE FROM general_photos WHERE id = ?',
            [photoId],
            (error) => {
              if (error) {
                console.error('Error deleting photo from general_photos table:', error);
                return res.status(500).json({ error: 'Failed to delete photo' });
              }
  
              res.status(200).json({ message: 'Photo deleted successfully' });
            }
          );
        });
      }
    );
  }


//   ###### normal vote cast API #######




function normal_vote(req, res) {
    const { voter_name, voter_email } = req.body;
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date
  
    // Check if the visitor has already cast a vote today using the provided email address
    conn.query(
      'SELECT * FROM votes WHERE voter_email = ? AND vote_date = ?',
      [voter_email, currentDate],
      (error, results) => {
        if (error) {
          console.error('Error checking existing vote:', error);
          return res.status(500).json({ error: 'Failed to cast vote' });
        }
  
        if (results.length > 0) {
          // Visitor has already cast a vote today
          return res.status(400).json({ error: 'You have already cast a vote today' });
        }
  
        // Check if the voter is voting for oneself
        conn.query(
          'SELECT id FROM teachers WHERE id = ? AND email = ?',
          [req.params.id, voter_email],
          (error, results) => {
            if (error) {
              console.error('Error checking self-voting:', error);
              return res.status(500).json({ error: 'Failed to cast vote' });
            }
  
            if (results.length > 0) {
              // Voter is voting for oneself
              return res.status(400).json({ error: 'You cannot vote for yourself' });
            }
  
            // Retrieve the double vote configuration
            conn.query(
              'SELECT double_vote_on_off FROM dbl_vote_configuration',
              (error, results) => {
                if (error) {
                  console.error('Error retrieving double vote configuration:', error);
                  return res.status(500).json({ error: 'Failed to cast vote' });
                }
  
                const doubleVoteEnabled = results[0].double_vote_on_off === 'on';
  
                // Update the vote count based on the double vote configuration
                const voteCount = doubleVoteEnabled ? 2 : 1;
  
                // Insert the vote into the `votes` table
                conn.query(
                  'INSERT INTO votes (voter_name, voter_email, vote_date, teacher_id) VALUES (?, ?, ?, ?)',
                  [voter_name, voter_email, currentDate, req.params.id],
                  (error, results) => {
                    if (error) {
                      console.error('Error casting vote:', error);
                      return res.status(500).json({ error: 'Failed to cast vote' });
                    }
  
                    // Update the vote_count in the `teachers` table
                    conn.query(
                      'UPDATE teachers SET vote_count = vote_count + ? WHERE id = ?',
                      [voteCount, req.params.id],
                      (error) => {
                        if (error) {
                          console.error('Error updating vote count:', error);
                          return res.status(500).json({ error: 'Failed to cast vote' });
                        }
  
                        res.status(200).json({ message: 'Vote cast successfully' });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }
  


                
  
  
  
module.exports = 
    {
     register_teacher,
     confirm_email,
     login_teacher,
     get_single_teacher,
     add_photos,
     edit_teacher,
     change_profile_picture,
     delete_photo,
     normal_vote,
    
    };