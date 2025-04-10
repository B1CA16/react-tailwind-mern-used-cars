import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }
};

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

const registerUser = async (req, res) => {
    const { name, email, password, type, phone } = req.body;

    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }

        // if (phone && !validator.isMobilePhone(phone)) {
        //     return res.json({ success: false, message: "Invalid phone number" });
        // }

        if (phone.length > 16 || phone.length < 6) {
            return res.json({
                success: false,
                message: "Invalid phone number",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userType =
            type && ["dealer", "user", "admin"].includes(type) ? type : "user";

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            type: userType,
            phone,
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }
};

const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const { password, ...userData } = user.toObject();
        res.json({ success: true, user: userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }
};

const editUser = async (req, res) => {
    const { name, email, phone, type } = req.body;
    const { id } = req.params;

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        if (email && email !== user.email) {
            const exists = await userModel.findOne({ email });
            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use",
                });
            }
        }

        if (phone && (phone.length > 16 || phone.length < 6)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number",
            });
        }

        if (type && !["dealer", "user"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user type",
            });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.type = type || user.type;

        await user.save();

        const { password, ...userData } = user.toObject();

        res.status(200).json({ success: true, user: userData });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

// Add car to Favorites
const addToFavourite = async (req, res) => {
    const { carId } = req.body;
    const { id } = req.params;

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        if (user.favorites.includes(carId)) {
            return res.status(400).json({
                success: false,
                message: "Car is already in favorites",
            });
        }

        user.favorites.push(carId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Car added to favorites",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

// Remove car from Favorites
const removeFromFavourite = async (req, res) => {
    const { carId } = req.body;
    const { id } = req.params;

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        if (!user.favorites || user.favorites.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No favorites to remove",
            });
        }

        const carExistsInFavorites = user.favorites.some((fav) => {
            if (fav && fav.toString) {
                return fav.toString() === carId;
            }
            return false;
        });

        if (!carExistsInFavorites) {
            return res.status(400).json({
                success: false,
                message: "Car is not in favorites",
            });
        }

        user.favorites = user.favorites.filter(
            (fav) => fav && fav.toString() !== carId
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: "Car removed from favorites",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

// Get user favorites
const getUserFavorites = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id).populate("favorites");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            favorites: user.favorites,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

// get user ads
const getUserCars = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id).populate("cars");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            cars: user.cars,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export {
    loginUser,
    registerUser,
    getUser,
    editUser,
    addToFavourite,
    removeFromFavourite,
    getUserFavorites,
    getUserCars,
};
