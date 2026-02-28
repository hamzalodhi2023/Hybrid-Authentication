export const setRefreshToken = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: parseInt(process.env.REFRESH_TOKEN_EXP_TIME),
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "development" ? false : true,
    path: "/",
  });
};

export const setAccessToken = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    maxAge: parseInt(process.env.ACCESS_TOKEN_EXP_TIME),
    httpOnly: false,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "development" ? false : true,
    path: "/",
  });
};

export const getRefreshToken = (req) => {
  return req.cookies.refreshToken;
};

export const getAccessToken = (req) => {
  return req.cookies.accessToken;
};
