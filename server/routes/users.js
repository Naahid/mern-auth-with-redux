const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post('/signup', async(req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        const existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({
                message: 'An account with this email already exist'
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password doesn't match"
            })
        }
        // hash the password
        const salt = await bcrypt.genSalt()
        const hashedPass = await bcrypt.hash(password, salt)

        const user = await User.create({
            username,
            email,
            password: hashedPass
        })

        const token = jwt.sign({
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET, {
                expiresIn: '1h'
            }
        )
        user.password = undefined
        res.status(200).json({
            user,
            token
        })


    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: 'something went wrong.'
        })

    }
})

router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        //validate
        if (!email || !password) {
            return res.status(400).json({
                errMes: 'Please enter all required fields first '
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist ."
            })
        }
        const correctPassword = await bcrypt.compare(
            password,
            user.password
        )
        if (!correctPassword) {
            return res.status(400).json({
                message: 'Invalid password'
            })
        }
        const token = jwt.sign({
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET, {
                expiresIn: '1h'
            }
        )
        user.password = undefined
        res.status(200).json({
            user,
            token
        })
    } catch (err) {
        res.status(500).json({ message: 'something went wrong.' })
    }
})


module.exports = router;