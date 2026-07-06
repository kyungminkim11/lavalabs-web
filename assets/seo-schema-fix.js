(() => {
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (page !== "faq.html") return;
  const script = document.querySelector('script[data-seo-schema]');
  if (!script) return;
  try {
    const data = JSON.parse(script.textContent);
    const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [];
    graph.forEach((item) => {
      if (typeof item?.["@id"] === "string" && item["@id"].endsWith("#webpage") && item["@type"] === "FAQPage") {
        item["@type"] = "WebPage";
      }
    });
    script.textContent = JSON.stringify(data);
  } catch {
    // Leave the original schema untouched if parsing fails.
  }
})();