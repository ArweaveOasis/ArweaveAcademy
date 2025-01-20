module.exports = function (eleventyConfig) {
  // Copy the `css` directory to the output
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");

  // Filter untuk format tanggal
  eleventyConfig.addFilter("dateFormat", function (date, format) {
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  // Buat koleksi "posts" untuk semua postingan blog
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByTag("posts");
  });

  //filter url jadi rel
  module.exports = function (eleventyConfig) {
    eleventyConfig.addFilter("rel", (url) => url.replace(/^\//, ""));
  };
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
  };
};
