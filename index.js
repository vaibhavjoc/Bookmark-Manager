const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const { UserModel, BookmarkMOdel } = require("./db");

const { auth } = require("./auth")

const bcrypt = require("bcrypt");

const { z } = require("zod");

const dotenv = require("dotenv");
dotenv.config();

const path = require("path")

app.use(express.static(path.join(__dirname, "public")));

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

    if (!parsedWithSuccess.success) {
        res.json({
            message: "Invalid Format"
        });
        return
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

    if (!response) {
        return res.json({
            message: "User does not exist"
        })
    }

    const passwordMatched = await bcrypt.compare(password, response.password);

    if (passwordMatched) {
        const token = jwt.sign({
            id: response._id
        }, process.env.JWT_SECRET);

        res.json({
            token: token,
            message: "You are Logged In Successfully"
        })
    } else {
        res.status(403).json({
            message: "Invalid Credentials"
        })
    }
});

app.post("/bookmark", auth, async function (req, res) {
    const userId = req.userId;
    const title = req.body.title;

    if(!title) {
        return res.json({
            message: "Title can't be empty"
        })
    }

    const bookmark = await BookmarkMOdel.create({
        title: title,
        userId
    })

    res.json({
        userId
    })
})

app.get("/bookmarks", auth, async function (req, res) {

    const userId = req.userId;

    const bookmarks = await BookmarkMOdel.find({
        userId: userId
    })

    res.json({
        bookmarks
    })
})

app.delete("/bookmark", auth, async function (req, res) {
    
})

async function main() {
    await mongoose.connect(process.env.MONGODB_CON);
    app.listen(3000);
}

main();