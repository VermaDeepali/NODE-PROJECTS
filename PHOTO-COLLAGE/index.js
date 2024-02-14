const createCollage = require("nf-photo-collage");
const fs = require("fs")

const options = {
  sources: [
    //  "https://unsplash.com/photos/a-tree-with-purple-lights-in-the-background-QyxXUhskUZM",
    //  "https://unsplash.com/photos/a-snow-covered-mountain-with-a-lake-in-front-of-it-6X8QuPSr2UE",
    "./images/img-1.jpg",
    "./images/img-2.jpg",
    "./images/img-3.jpg",
    "./images/img-4.jpg",
  ],
  width: 2, // number of images per row
  height: 2, // number of images per column
  imageWidth: 350, // width of each image
  imageHeight: 350, // height of each image
  backgroundColor: "#cccccc", // optional, defaults to black.
  spacing: 2, // optional: pixels between each image
};

createCollage(options)
  .then((canvas) => {
    const src = canvas.jpegStream();
    const dest = fs.createWriteStream("photo_collage.jpg");
    src.pipe(dest);
    console.log("Collage created successfully!!")
  });

