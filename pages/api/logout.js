import authenticated from "../../middlewares/authenticated";

export default authenticated(async function (req, res) {
  if (req.method === "POST") {
    res.setHeader(
      "Set-Cookie",
      "auth=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );

    return res.status(200).json({
      success: "Successfully logged out",
    });
  } else {
    res.status("400").send({ message: "Invalid request" });
  }
});
