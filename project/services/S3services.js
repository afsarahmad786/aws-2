const AWS = require("aws-sdk");

const uploadToS3 = (data, filename) => {
  const Bukcketname = "expensetracker120";
  const user_key = "AKIA3L3RDKHULDPH2UXI";
  const user_sect = "fP2lsqzjY89nJUWrvUFMLafczk6uKFr6Nt7nt1T9";
  const s3 = new AWS.S3({
    accessKeyId: user_key,
    secretAccessKey: user_sect,
    // Bucket: Bukcketname,
  });

  var params = {
    Bucket: Bukcketname,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3res) => {
      if (err) {
        console.log("something went wrong while uploading to S3");
        reject(err);
      } else {
        console.log("Success", s3res);
        resolve(s3res.Location);
      }
    });
  });
};
module.exports = { uploadToS3 };
