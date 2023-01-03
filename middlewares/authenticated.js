import { verify } from "jsonwebtoken";

const authenticated = (fn) => async (req, res) => {

  verify(req.cookies.auth, process.env.SECRET, async function(err, decoded) {
    
    if (!err && decoded)
    {
      return await fn(req, res);
    }

    res.status("401").json({message: "You are not authorized to perform this action"});

  });
  

};

export default authenticated;