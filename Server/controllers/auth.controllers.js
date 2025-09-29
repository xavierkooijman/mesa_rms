const argon2 = require("argon2");
const catchAsync = require("../utils/catchAsync");
const usersModel = require("../models/users.models");
const staffModel = require("../models/staff.models");
const restaurantModel = require("../models/restaurants.models");
const refreshTokenModel = require("../models/refreshToken.models");
const tokenContext = require("../utils/tokenContext");
const signTokens = require("../utils/signTokens");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");
const isProd = process.env.NODE_ENV === "production";

const loginHandler = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await usersModel.getUserByEmail(email);
  const password_match = await argon2.verify(user.password_hash, password);

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      401
    );
  }

  if (!password_match) {
    throw new AppError(
      "Invalid email or password",
      ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      401
    );
  }

  const tenant = {
    restaurantId: null,
    staffId: null,
    staffRole: null,
  };

  if (user.user_role == "staff") {
    const staff = await staffModel.getStaffByUserId(user.id);
    //if a user only has one staff membership we can set the tenant context,  else if the user has multiple staff memberships tenant context remains null. A user with staff membership must always have a staff entity column related to him.

    if (staff.length == 1) {
      tenant.restaurantId = staff[0].restaurant_id;
      tenant.staffId = staff[0].id;
      tenant.staffRole = staff[0].staff_role;
    }
  } else if (user.user_role == "owner") {
    const restaurantIds = await restaurantModel.getRestaurantIdsByOwnerId(
      user.id
    );

    // if user role is owner and only has one restaurant we can set the tenant context otherwise tenant fields must be null. staff related fields always null for owner roles.
    if (restaurantIds.length == 1) {
      tenant.restaurantId = restaurantIds[0].id;
    }
  }

  console.log(tenant);

  const { contextRaw, contextHash } = tokenContext();

  res.cookie(isProd ? "__Host-ctx" : "ctx", contextRaw, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    sameSite: "Strict",
    path: "/",
    secure: isProd,
  });

  const accessToken = signTokens.signAccessToken(
    user.id,
    user.user_role,
    contextHash,
    tenant
  );

  const refreshtokenId = crypto.randomUUID();

  const refreshToken = signTokens.signRefreshToken(user.id, refreshtokenId);

  const decodedToken = jwt.decode(refreshToken);
  const expires_at = new Date(decodedToken.exp * 1000);

  const hashedToken = await argon2.hash(refreshToken);

  await refreshTokenModel.saveRefreshToken({
    refreshtokenId,
    hashedToken,
    userId: user.id,
    expires_at,
  });

  res.cookie(isProd ? "__Host-refresh" : "refresh", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 * 30,
    sameSite: "Strict",
    path: "/",
    secure: isProd,
  });

  res.status(200).json({ accessToken });
});

const logoutHandler = catchAsync(async (req, res) => {
  // delete accessToken in the client side

  // delete refreshToken and context cookies
  const refreshToken = req.cookies[isProd ? "__Host-refresh" : "refresh"];

  res.clearCookie(isProd ? "__Host-ctx" : "ctx", {
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
    secure: isProd,
  });

  res.clearCookie(isProd ? "__Host-refresh" : "refresh", {
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
    secure: isProd,
  });

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err) => {
    if (err) {
      return res.sendStatus(204);
    }
  });

  decoded = jwt.decode(refreshToken);
  await refreshTokenModel.deleteRefreshToken(decoded.tokenId);
  res.sendStatus(204);
});

module.exports = { loginHandler, logoutHandler };
