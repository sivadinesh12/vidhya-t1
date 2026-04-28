/**
 * models/User.js  –  User Schema & Model
 *
 * Represents a student or admin on the Vidhya platform.
 * Passwords are stored as bcrypt hashes – never plain text.
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const SALT_ROUNDS = 12;                        // bcrypt work factor

const userSchema = new mongoose.Schema(
  {
    // ── Identity ────────────────────────────────────────────────────────────
    name: {
      type    : String,
      required: [true, 'Name is required'],
      trim    : true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type    : String,
      required: [true, 'Email is required'],
      unique  : true,
      lowercase: true,
      trim    : true,
      match   : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    },
    password: {
      type    : String,
      minlength: [6, 'Password must be at least 6 characters'],
      select  : false,                         // Never returned in queries by default
    },

    // ── Role-Based Access Control ────────────────────────────────────────────
    role: {
      type   : String,
      enum   : ['user', 'admin'],
      default: 'user',
    },

    // ── Profile ──────────────────────────────────────────────────────────────
    avatar: {
      type: String,
      default: null,                           // Relative path to uploaded image
    },
    targetExam: {
      type : String,
      enum : ['NEET', 'JEE_MAINS', 'JEE_ADVANCED', 'BOARDS', 'OTHER'],
      default: 'NEET',
    },
    targetYear: {
      type: Number,
      min : 2024,
      max : 2030,
    },

    // ── Social Login ─────────────────────────────────────────────────────────
    googleId: { type: String, default: null },
    appleId : { type: String, default: null },

    // ── Account State ────────────────────────────────────────────────────────
    isActive: {
      type   : Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,                          // Adds createdAt, updatedAt automatically
  }
);

// ── Pre-save hook: hash password before storing ──────────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash if the password field was actually changed
  if (!this.isModified('password') || !this.password) return next();

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

// ── Instance method: compare a plain-text password with the stored hash ──────
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// ── Instance method: return a safe object (no password) ──────────────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
