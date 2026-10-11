import { products } from "./catalog-data.mjs";

const QUERY = {
  "gsr-electric-iron": "clothes iron",
  "leku-standing-fan": "electric fan",
  "duravault-16-rechargeable-fan": "rechargeable fan",
  "kitchen-appliances-combo": "cookware pots",
  "home-appliances-combo": "kitchen appliances",
  "electric-kettle": "kettle stainless steel",
};

const only = process.argv[2] ? process.argv[2].split(",") : null;

async function search(term, pages = 2) {
  const out = [];
  for (let page = 1; page <= pages; page++) {
    const params = new URLSearchParams({ q: term, page_size: "20", page: String(page) });
    const res = await fetch(`https://api.openverse.org/v1/images/?${params}`, {
      headers: { "User-Agent": "IKElectronicsSeed/1.0" },
    });
    if (!res.ok) { await new Promise((r)=>setTimeout(r,2500)); continue; }
    const data = await res.json();
    out.push(...(data.results ?? []));
    if (!data.next) break;
    await new Promise((r) => setTimeout(r, 250));
  }
  return out;
}

for (const product of products) {
  if (only && !only.includes(product.slug)) continue;
  const term = QUERY[product.slug] ?? product.imageTerm;
  console.log(`\n===== ${product.slug}  (q="${term}") =====`);
  try {
    const results = (await search(term))
      .filter((r) => r?.url && /\.(jpe?g|png)(\?|$)/i.test(r.url))
      .slice(0, 6);
    if (!results.length) { console.log("  (no results)"); continue; }
    results.forEach((r, i) => {
      console.log(`  [${i}] ${r.license} ${r.width}x${r.height}  ${r.title}`);
      console.log(`      ${r.url}`);
    });
  } catch (e) {
    console.log("  ERR " + e.message);
  }
}