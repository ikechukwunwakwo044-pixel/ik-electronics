import { writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve("public/product-images");

const PINS = {
  "gsr-electric-iron": "https://live.staticflickr.com/4056/4431404308_d64f6fc146_b.jpg",
  "leku-standing-fan": "https://live.staticflickr.com/3941/15614999206_0a4f19a29a_b.jpg",
  "duravault-16-rechargeable-fan": "https://live.staticflickr.com/3184/2541634620_30c208241a_b.jpg",
  "qasa-blender-grinder": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Feldbach-Nostalgiewelt_Posch-electric_blender-01ESD.jpg",
  "lg-uhd-tv-32-lf50": "https://upload.wikimedia.org/wikipedia/commons/b/b0/A_flat-screen_television.jpg",
  "snowsea-refrigerator": "https://live.staticflickr.com/6149/6040059574_7b58c0fa47_b.jpg",
  "snowsea-twin-tub-washing-machine": "https://live.staticflickr.com/2022/2473522040_3571818aac_b.jpg",
  "lg-uhd-ai-thinq-smart-tv": "https://upload.wikimedia.org/wikipedia/commons/4/40/Smart_Television.jpg",
  "mi-samba-home-theater": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Home_Theater_Speakers_6_2019-06-22.jpg",
  "solar-standing-fan": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Solar_fan.jpg",
  "redmi-34-curved-monitor": "https://live.staticflickr.com/2930/14256160427_bd5648ee6d_b.jpg",
  "home-appliances-combo": "https://live.staticflickr.com/5/4685908_3e5dffcb8d_b.jpg",
  "kitchen-appliances-combo": "https://live.staticflickr.com/4/4284937_73ae18ed89_b.jpg",
  "electric-kettle": "https://live.staticflickr.com/19/101825627_f8b2fe2eeb_b.jpg",
  "itel-power-go-pro-power-station": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Goal_Zero_Yeti_1400_Lithium_Portable_Power_Station_with_WiFi_Battery_Pack_with_MacBook_Pro_-_USB-C_Power_Delivery_Specification_%28PD_spec%29_%2843467687445%29.jpg",
};

function thumbify(url, width = 1280) {
  const u = new URL(url);
  if (u.hostname !== "upload.wikimedia.org") return url;
  if (!u.pathname.includes("/commons/") || u.pathname.includes("/thumb/")) return url;
  const parts = u.pathname.split("/").filter(Boolean); // ["wikipedia","commons","b","b0","File.jpg"]
  const file = parts.at(-1);
  const dirs = parts.slice(2, -1).join("/"); // b/b0
  u.pathname = `/wikipedia/commons/thumb/${dirs}/${file}/${width}px-${file}`;
  return u.toString();
}

async function download(url) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": "IKElectronicsSeed/1.0" } });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 2500 * attempt));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  throw new Error("rate-limited (429 x4)");
}

let ok = 0;
let failed = 0;
for (const [slug, url] of Object.entries(PINS)) {
  try {
    const buf = await download(thumbify(url));
    await writeFile(path.join(OUT_DIR, `${slug}.jpg`), buf);
    ok++;
    console.log(`OK  ${slug}  ${(buf.length / 1024).toFixed(0)} KB`);
    await new Promise((r) => setTimeout(r, 400));
  } catch (err) {
    failed++;
    console.log(`ERR ${slug}  ${err.message}`);
  }
}
console.log(`\nPinned. ${ok} ok, ${failed} failed.`);