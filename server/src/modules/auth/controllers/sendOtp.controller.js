const sendOtp = async (req, res) => {
  try {
    const { userId, sessionId } = req.user;

    console.log(userId);

    // ! End response
    res.status(200).json({
      message: "User logged in Successfully",
      error: null,
      data: null,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error, data: null });
  }
};

export default sendOtp;
