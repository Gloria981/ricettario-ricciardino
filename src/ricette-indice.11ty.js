exports.data = {
  permalink: "/ricette-indice.json",
  eleventyExcludeFromCollections: true,
};

exports.render = function (data) {
  const indice = data.collections.ricette.map((ricetta) => {
    const testoRicerca = [
      ricetta.data.titolo,
      ...(ricetta.data.tipo_piatto || []),
      ricetta.data.tempo_preparazione,
      ricetta.data.porzioni,
      ...(ricetta.data.tags || []),
      ...(ricetta.data.ingredienti || []),
      ricetta.data.extra,
      (ricetta.templateContent || "").replace(/<[^>]+>/g, " "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return {
      titolo: ricetta.data.titolo,
      url: this.url(ricetta.url),
      immagine: ricetta.data.immagine ? this.url(ricetta.data.immagine) : null,
      tipo_piatto: ricetta.data.tipo_piatto || [],
      tags: ricetta.data.tags || [],
      testoRicerca,
    };
  });
  return JSON.stringify(indice);
};
