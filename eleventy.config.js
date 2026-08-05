module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/immagini");
  eleventyConfig.addPassthroughCopy("src/style.css");

  eleventyConfig.addFilter("slug", (str) =>
    String(str)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );

  // Tutte le ricette, ordinate alfabeticamente per titolo.
  eleventyConfig.addCollection("ricette", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/ricette/*.md")
      .sort((a, b) => a.data.titolo.localeCompare(b.data.titolo, "it"));
  });

  // Elenco di tutti i tag distinti usati nelle ricette, ordinati alfabeticamente.
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagSet = new Set();
    collectionApi.getFilteredByGlob("src/ricette/*.md").forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return [...tagSet].sort((a, b) => a.localeCompare(b, "it"));
  });

  return {
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
