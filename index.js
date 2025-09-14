const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const { UserModel } = require("./db");

const { auth, JWT_SECRET } = require("./auth")

const bcrypt = require("bcrypt");

const { z } = require("zod");

app.use(express.json());

app.post("/signup", async function (req, res) {
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string()
            .min(8, { message: "Password should have minimum length of 8" })
            .max(15, "Password is too long")
            .regex(/^(?=.*[A-Z]).{8,}$/, {
                message:
                    "Should Contain at least one uppercase letter and have a minimum length of 8 characters.",
            })
    });

    const parsedWithSuccess = requiredBody.safeParse(req.body);

    if (!parsedWithSuccess) {
        return res.json({
            message: "Invalid Format"
        });
    }

    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 5);

    await UserModel.create({
        email: email,
        password: hashedPassword
    })

    res.json({
        message: "You are signed up successfully"
    });

});

app.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email
    })

    if(!response) {
        return res.json({
            message: "User does not exist"
        })
    }

    const passwordMatched = await bcrypt.compare(password, response.password);

    if(passwordMatched) {
        const token = jwt.sign({
            id: response._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Invalid Credentials"
        })
    }
});

async function main() {
    await mongoose.connect("mongodb+srv://joshivaibhav:TdmUFHtotsKGtZNz@cluster0.mpy1won.mongodb.net/bookmark-app-database");
    app.listen(3000);
}

main();