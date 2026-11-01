export const contactOffers = Object.freeze({
    introSabine: { practitioner: "sabine", de: "Kennenlerngespräch mit Sabine", tr: "Sabine ile tanışma görüşmesi" },
    introSelcan: { practitioner: "selcan", de: "Kennenlerngespräch mit Selcan", tr: "Selcan ile tanışma görüşmesi" },
    firstSabine: { practitioner: "sabine", de: "Erstsitzung mit Sabine", tr: "Sabine ile ilk seans" },
    firstSelcan: { practitioner: "selcan", de: "Erstsitzung mit Selcan", tr: "Selcan ile ilk seans" },
    followSabine: { practitioner: "sabine", de: "Folgesitzung mit Sabine", tr: "Sabine ile devam seansı" },
});
export const getContactOffer = code => typeof code === "string" && Object.hasOwn(contactOffers, code) ? contactOffers[code] : null;
export const contactOfferFromSearch = search => {
    const values = new URLSearchParams(search).getAll("offer");
    return values.length === 1 && getContactOffer(values[0]) ? values[0] : "";
};
export const contactOfferUrl = code => getContactOffer(code) ? `/kontakt?offer=${code}` : "/kontakt";
