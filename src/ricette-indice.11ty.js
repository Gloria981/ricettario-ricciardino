exports.data = {
  permalink: "/ricette-indice.json",
  eleventyExcludeFromCollections: true,
};

exports.render = function (data) {
  const indice = data.collections.ricette.map((ricetta) => ({
    titolo: ricetta.data.titolo,
    url: this.url(ricetta.url),
    tipo_piatto: ricetta.data.tipo_piatto,
    tags: ricetta.data.tags || [],
  }));
  return JSON.stringify(indice);
};
