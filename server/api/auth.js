const router = require("express").Router();
const { User, Otp } = require("../models/models");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const nodemailer = require("nodemailer");

const {
  verifyPhoneNumber,
  verifyEmail,
  verifyPassword,
  verifyToken,
  tokenRefresh,
} = require("../config/config");

//creating account
router.post("/account", async (req, res) => {
  const { email, contact, password, first_name, last_name, district } =
    req.body;
  if (verifyEmail(email)) {
    if (verifyPassword(password)) {
      if (verifyPhoneNumber(contact)) {
        try {
          //encryption the password
          const hashed_password = cryptoJs.AES.encrypt(
            password,
            process.env.PARSE_SECRET
          ).toString();
          // Check if the user with the provided email already exists
          const user = await User.findOne({
            where: { email: email },
          });
          if (!user) {
            //procced and register user
            const newUser = await User.create({
              email,
              password: hashed_password,
              contact,
              first_name,
              last_name,
              district,
            });
            res.status(201).json({
              status: true,
              data: "User registered successfully",
              user: newUser,
            });
          } else {
            res.status(409).json({
              status: false,
              data: "user alreasy registered",
            });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({
            status: false,
            data: "An error occurred while registering the user",
          });
        }
      } else {
        res.status(400).json({
          status: false,
          data: "wrong contact format",
        });
      }
    } else {
      res.status(400).json({
        status: false,
        data: "weak password",
      });
    }
  } else {
    res.status(400).json({
      status: false,
      data: "wrong email format",
    });
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //email validation
    if (verifyEmail(email)) {
      //check whether user exists
      const user = await User.findOne({
        where: { email: email },
      });

      if (!user) {
        res.status(409).json({
          status: false,
          data: "user not found",
        });
      } else {
        //check if email is verified
        if (user.verified != true) {
          res.status(200).json({
            status: true,
            data: "email not verified",
            emailNotVerified: true,
            user: {
              id: user.id,
              email: user.email,
            },
          });
        } else {
          //decrypt users passowrd
          const original_password = cryptoJs.AES.decrypt(
            user.password,
            process.env.PARSE_SECRET
          ).toString(cryptoJs.enc.Utf8);
          if (original_password === password) {
            //generate access token
            const accessToken = jwt.sign(
              {
                id: user.id,
                email: user.email,
                district: user.district,
                first_name: user.first_name,
              },
              process.env.ACCESS_SECRET,
              {
                expiresIn: "2y",
              }
            );
            // generate a refresh token
            const refreshToken = jwt.sign(
              {
                id: user.id,
                email: user.email,
                district: user.district,
                first_name: user.first_name,
              },
              process.env.REFRESH_SECRET,
              {
                expiresIn: "40y",
              }
            );
            //encrypt the refresh token
            const encryptRefreshToken = cryptoJs.AES.encrypt(
              refreshToken,
              process.env.ENC_REFRESH_TOKEN
            ).toString();
            // Store the refresh token in the database
            user.refreshToken = encryptRefreshToken;
            await user.save();
            console.log(refreshToken);

            //login response
            res.status(200).json({
              status: true,
              data: "Login successful",
              user: user,
              accessToken: accessToken,
            });
          } else {
            res.status(400).json({
              status: false,
              data: "wrong password",
            });
          }
        }
      }
    } else {
      res.status(400).json({
        status: false,
        data: "wrong email format",
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ status: false, reason: "Server error" });
  }
});

// Note. You will set logout fron front end by removing the access token and refresh tokens
// from local/session/cookies storage basing on what you shall have selected to use

// updating user data
// verifyToken, tokenRefresh,
router.put("/update/user/:id", verifyToken, tokenRefresh, async (req, res) => {
  try {
    const { email, contact, first_name, last_name, district } = req.body;
    const id = req.params.id; // Use the user ID from the route parameter

    // Validate email format if provided
    if (email && !verifyEmail(email)) {
      return res.status(400).json({
        status: false,
        data: "Wrong email format",
      });
    }

    // Validate contact format if provided
    if (contact && !verifyPhoneNumber(contact)) {
      return res.status(400).json({
        status: false,
        data: "Wrong contact format",
      });
    }

    // Find the user by ID
    const user = await User.findByPk(id);

    if (user) {
      // Update user data
      user.email = email || user.email;
      user.contact = contact || user.contact;
      user.first_name = first_name || user.first_name;
      user.last_name = last_name || user.last_name;
      user.district = district || user.district;

      // Save the updated user
      await user.save();

      res.status(200).json({
        status: true,
        data: "User updated successfully",
        user: user,
      });
    } else {
      res.status(404).json({
        status: false,
        data: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      data: "An error occurred while updating the user",
    });
  }
});

//verify email
/**
 * 1. We shall add a field in the db for verify email
 * if verified is true: allow login else
 * send the user to verify email
 *
 *
 * implementation
 * 1. endpoint for request OTP
 * 2. endpoint for verifying otp and this updating verifying the email
 * * */
/** request OTP for verify email **/
router.post("/request/otp", async (req, res) => {
  try {
    const { email } = req.body;

    // console.log("Received email:", email); // Log the email received from the request

    if (verifyEmail(email)) {
      // console.log("Email format is valid."); // Log for email validation

      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        // console.log("User not found in the database."); // Log if user doesn't exist
        return res.status(409).json({
          status: false,
          data: "user not found",
        });
      } else {
        // Utility function to generate OTP
        // Utility function to generate OTP
        function generateOTP(length) {
          const digits = "0123456789";
          let otp = "";
          for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
          }
          return otp;
        }

        // Generate OTP and convert it to an integer
        let otp = generateOTP(6);
        otp = parseInt(otp, 10); // Convert to integer

        const currentTime = Date.now(); // Current time in milliseconds (timestamp)
        const otpExpiry = currentTime + 3 * 60 * 1000; // Expiry in milliseconds (timestamp)

        // Save OTP to DB
        const saveOtp = await Otp.create({
          user_id: user.id, // Make sure this ID is valid
          otp: otp,
          expiry: otpExpiry,
        });
        // console.log("Saved OTP record:", saveOtp); // Log the saved OTP record

        // Create mail transporter
        const mail_transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "kanlyteug@gmail.com",
            pass: "kkcvsaypbtgjwjvx",
          },
        });

        // Configure message
        const mail = {
          from: `"Thermosnoop"<kanlyteug@gmail.com>`,
          to: user.email,
          subject: "OTP for email verification",
          text: `Hello ${user.last_name}, Your OTP is: ${saveOtp.otp} Please note that it is valid for 3 minutes.`,
        };

        try {
          await mail_transporter.sendMail(mail);
          console.log("Email sent successfully."); // Log successful email sending

          const forward_result = {
            status: true,
            result: saveOtp,
            reason: "Email sent",
          };
          res.status(200).json(forward_result);
        } catch (error) {
          console.log(error);
          // console.error("Error sending email:", error); // Log email sending error
          const forward_result = {
            status: false,
            reason: "Server error",
          };
          res.status(500).json(forward_result);
        }
      }
    } else {
      // console.log("Invalid email format."); // Log invalid email format
      return res.status(400).json({
        status: false,
        data: "Wrong email format",
      });
    }
  } catch (error) {
    // console.error("Unhandled server error:", error); // Log any unexpected errors
    const forward_result = {
      status: false,
      reason: "server error",
    };
    res.json(forward_result);
  }
});

// get all OTPs for a user
router.get("/all/otp/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const otps = await Otp.findAll({
      where: { user_id: user_id },
    });

    // If OTPs are found, return them
    if (otps.length > 0) {
      res.status(200).json({
        success: true,
        data: otps,
      });
    } else {
      // If no OTPs are found, return a message indicating so
      res.status(404).json({
        success: false,
        message: "No OTPs found for this user.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    const forward_result = {
      status: false,
      reason: "Server error",
    };
    res.json(forward_result);
  }
});

//verify email
router.put("/verify/email/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { otp } = req.body;

    // Fetch the most recent OTP for the user
    const otpRecord = await Otp.findOne({
      where: { user_id: user_id },
      order: [["createdAt", "DESC"]],
    });

    if (!otpRecord) {
      return res.status(404).json({ status: false, reason: "No OTP found" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ status: false, reason: "OTP incorrect" });
    }

    // Validate OTP expiry
    const currentTime = Date.now();
    const otpExpiryTime = otpRecord.expiry;

    if (currentTime > otpExpiryTime) {
      return res.status(400).json({ status: false, reason: "OTP expired" });
    }

    // Find user and update `verified` status
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ status: false, reason: "User not found" });
    }

    user.verified = true;
    await user.save();

    return res.status(200).json({ status: true, reason: "Email verified" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ status: false, reason: "Server error" });
  }
});

/**
 * reset password
 * 1. request otp
 * 2. verify otp
 * 3. reset password
 *
 ****/
/** verify otp **/
router.get("/verify/otp/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { otp } = req.body;

    // Fetch the most recent OTP for the user
    const otpRecord = await Otp.findOne({
      where: { user_id: user_id },
      order: [["createdAt", "DESC"]],
    });

    if (!otpRecord) {
      return res.status(404).json({ status: false, reason: "No OTP found" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ status: false, reason: "OTP incorrect" });
    }

    // Validate OTP expiry
    const currentTime = Date.now();
    const otpExpiryTime = otpRecord.expiry;

    if (currentTime > otpExpiryTime) {
      return res.status(400).json({ status: false, reason: "OTP expired" });
    }

    // all condiions fulfilled
    return res.status(200).json({ status: true, reason: "otp verified" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ status: false, reason: "Server error" });
  }
});
/** reset password **/
/* This route to only be accessed after a successful OTP verification */
router.put("/reset/password/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ status: false, reason: "Password is required" });
    }

    if (verifyPassword(password)) {
      // Encrypt the password
      const hashed_password = cryptoJs.AES.encrypt(
        password,
        process.env.PARSE_SECRET
      ).toString();

      const user = await User.findByPk(user_id);
      if (!user) {
        return res
          .status(404)
          .json({ status: false, reason: "User not found" });
      }

      user.password = hashed_password;
      await user.save();

      return res.status(200).json({
        status: true,
        reason: "Password has been reset successfully",
      });
    } else {
      return res.status(400).json({
        status: false,
        reason: "Weak password",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      reason: "Server error",
    });
  }
});

module.exports = router;
