import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { products } from "./catalog-data.mjs";

const OUT_DIR = path.resolve("public/product-images");
const FREE_LICENSES = /^(pdm|cc0|by|by-sa)$/i;

const MATCH = {
  "qasa-electric-kettle": /kettle|boil|teapot|hot.?water/i,
  "qasa-blender-grinder": /blend/i,
  "gsr-electric-iron": /clothes.?iron|steam.?iron|\biron\b/i,
  "itel-power-go-pro-power-station": /power.?station|generator|battery|solar.?generator/i,
  "djack-3-1-speaker-system": /speaker|loudspeaker/i,
  "lg-uhd-tv-32-lf50": /television|smart.?tv|\btv\b|flat.?screen|screen/i,
  "snowsea-refrigerator": /refrigerator|fridge|chiller|freezer/i,
  "snowsea-twin-tub-washing-machine": /washing.?machine|washer|twin.?tub/i,
  "leku-standing-fan": /\bfan\b|pedestal|stand.?fan/i,
  "kenwood-blender": /blender/i,
  "electric-kettle": /kettle|boil|teapot|hot.?water/i,
  "gfc-air-fryer": /air.?fryer|fryer|oven|kitchen/i,
  "duravault-16-rechargeable-fan": /\bfan\b|portable.?fan|battery.?fan/i,
  "lg-uhd-ai-thinq-smart-tv": /television|smart.?tv|\btv\b|led.?tv/i,
  "refrigerator-freezer": /refrigerator|fridge|freezer/i,
  "djack-power-tank": /power.?bank|portable.?charger/i,
  "djack-inverter-power-solution": /inverter|power|backup/i,
  "hisense-70-tv": /television|\btv\b|screen|monitor/i,
  "mi-samba-home-theater": /speaker|cine|home.?ther|sound|audio/i,
  "premium-gaming-chair": /gaming.?chair|race.?chair|office.?chair|gamer/i,
  "smart-tv-32": /television|smart.?tv|\btv\b|screen/i,
  "solar-standing-fan": /solar.?fan|\bfan\b/i,
  "home-appliances-combo": /appliance|kitchen|household/i,
  "kitchen-appliances-combo": /appliance|kitchen|cookware/i,
  "redmi-34-curved-monitor": /monitor|curved|display|screen/i,
};

const QUERY = {
  "qasa-blender-grinder": "electric blender",
  "gsr-electric-iron": "steam iron clothes",
  "djack-3-1-speaker-system": "loudspeaker woofer",
  "lg-uhd-tv-32-lf50": "flat screen television",
  "snowsea-twin-tub-washing-machine": "washing machine home",
  "kenwood-blender": "kitchen blender appliance",
  "refrigerator-freezer": "refrigerator freezer kitchen",
  "djack-power-tank": "power bank portable charger",
  "home-appliances-combo": "home appliances kitchen",
  "kitchen-appliances-combo": "household kitchen appliances",
  "redmi-34-curved-monitor": "curved computer monitor",
  "mi-samba-home-theater": "home theater speakers",
};

const REJECT = {
  "qasa-blender-grinder": /baby|falafel|sink|kitchen|render/i,
  "gsr-electric-iron": /mill|foundry|ore|steel|wrought|gate/i,
  "djack-3-1-speaker-system": /radio|transistor|vintage|remco/i,
  "lg-uhd-tv-32-lf50": /graveyard|crt|vintage|old|pile|junk/i,
  "snowsea-twin-tub-washing-machine": /heritage|museum|humphrey|water.?heater|vacuum/i,
  "kenwood-blender": /baby|falafel|render|sink|inexplicable|blender.?3d|splash/i,
  "refrigerator-freezer": /condenser|motor|compressor/i,
  "djack-power-tank": /solar.?array|datacenter|panel/i,
  "home-appliances-combo": /advert|194|195|'8|'9|vintage|museum|blantyre/i,
  "kitchen-appliances-combo": /advert|194|195|'8|'9|vintage|museum|century/i,
  "redmi-34-curved-monitor": /tv|television|samsung|crt/i,
  "mi-samba-home-theater": /empty|room|hall/i,
};

async function searchOpenversePages(term, pages = 3) {
  const results = [];
  for (let page = 1; page <= pages; page++) {
    const params = new URLSearchParams({ q: term, page_size: "20", page: String(page) });
    const url = `https://api.openverse.org/v1/images/?${params}`;
    let data = null;
    for (let attempt = 1; attempt <= 5; attempt++) {
      const res = await fetch(url, { headers: { "User-Agent": "IKElectronicsSeed/1.0" } });
      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
        continue;
      }
      if (!res.ok) throw new Error(`Openverse HTTP ${res.status}`);
      data = await res.json();
      break;
    }
    if (!data) throw new Error("Openverse rate-limited (429 x5)");
    const got = (data.results ?? []).filter((i) => i?.url && /\.(jpe?g|png)(\?|$)/i.test(i.url));
    results.push(...got);
    if (!data.next) break;
    await new Promise((r) => setTimeout(r, 250));
  }
  return results;
}

function score(result, regex, reject) {
  const title = result.title ?? "";
  const tags = (result.tags ?? []).map((t) => t.name ?? t).join(" ");
  const text = `${title} ${tags}`;
  if (reject && reject.test(text)) return null;
  if (!regex.test(text)) return null;
  const license = result.license ?? "";
  let score = 10;
  if (FREE_LICENSES.test(license)) score += 5;
  if (/cc0|pdm/i.test(license)) score += 10;
  if (result.width && result.width >= 1000) score += 3;
  else if (result.width && result.width >= 600) score += 1;
  return { score, license };
}

let ok = 0;
let failed = 0;

await mkdir(OUT_DIR, { recursive: true });

for (const product of products) {
  const target = path.join(OUT_DIR, `${product.slug}.jpg`);
  try {
    const rx = MATCH[product.slug] ?? new RegExp("", "i");
    const reject = REJECT[product.slug];
    const term = QUERY[product.slug] ?? product.imageTerm;
    const results = await searchOpenversePages(term);
    const scored = results
      .map((r) => ({ r, s: score(r, rx, reject) }))
      .filter((x) => x.s)
      .sort((a, b) => b.s.score - a.s.score);
    const pick = scored[0]?.r ?? null;
    if (!pick) {
      failed++;
      console.log(`NO MATCH  ${product.slug}`);
      continue;
    }
    const buf = await download(pick.url);
    await writeFile(target, buf);
    ok++;
    console.log(`OK  ${product.slug}  <- ${pick.title} [${pick.license}] (${pick.width}x${pick.height})`);
    await new Promise((r) => setTimeout(r, 300));
  } catch (err) {
    failed++;
    console.log(`ERR ${product.slug}  ${err.message}`);
  }
}

async function download(url) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": "IKElectronicsSeed/1.0" } });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 3000 * attempt));
      continue;
    }
    if (!res.ok) throw new Error(`download HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  throw new Error("download rate-limited (429 x4)");
}

console.log(`\nDone. ${ok} downloaded, ${failed} failed.`);