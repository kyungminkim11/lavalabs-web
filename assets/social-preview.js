(() => {
  const pages = new Set([
    "index", "services", "insights", "guide-360-product-photography",
    "guide-360-virtual-tour", "guide-small-business-website", "web",
    "commerce", "space", "product-spin", "lavaspin", "space-rental",
    "space-fashion-popup", "photography", "pov-video", "equipment",
    "store", "map", "operations", "education-guide", "automation",
    "custom-development", "packages", "maintenance", "start", "portfolio",
    "pricing", "partnership", "about", "contact", "faq", "sitemap",
    "privacy", "terms"
  ]);

  const filename = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const slug = filename === "index.html" ? "index" : filename.replace(/\.html$/, "");
  if (!pages.has(slug)) return;

  const image = `https://space.lavalabs.co.kr/assets/social/${slug}.png?v=20260706b`;
  const title = document.querySelector('meta[property="og:title"]')?.content || document.title || "LavaLabs";
  const alt = `${title.replace(/\s*\|\s*LavaLabs\s*$/i, "")} | LavaLabs`;

  function setMeta(attribute, key, value) {
    let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.content = value;
  }

  setMeta("property", "og:image", image);
  setMeta("property", "og:image:secure_url", image);
  setMeta("property", "og:image:type", "image/png");
  setMeta("property", "og:image:width", "1200");
  setMeta("property", "og:image:height", "630");
  setMeta("property", "og:image:alt", alt);
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:image", image);
  setMeta("name", "twitter:image:alt", alt);

  let imageSrc = document.head.querySelector('link[rel="image_src"]');
  if (!imageSrc) {
    imageSrc = document.createElement("link");
    imageSrc.rel = "image_src";
    document.head.appendChild(imageSrc);
  }
  imageSrc.href = image;
})();