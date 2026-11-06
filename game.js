(() => {
  "use strict";

  const menu = document.getElementById("mainMenu");
  const gameShell = document.getElementById("gameShell");
  const answers = document.getElementById("answers");
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const message = document.getElementById("message");
  const tileSize = 24;
  const chunkSize = 32;
  const saveKey = "teressa-adventure-v3";
  const backupSaveKey = `${saveKey}-backup`;
  const villageSpacing = 100;
  const caveEntranceSpacing = 240;
  const villageNames = [
    "Bramblewick", "Mosslight", "Fernhollow", "Clover Rest", "Thistlebrook",
    "Willowmere", "Foxglove Crossing", "Honeyfern", "Dewdrop Vale", "Elderbloom",
    "Hazelrun", "Mushroom Glen", "Wrenwood", "Juniper Hearth", "Briar Glen",
    "Moonpetal", "Acorn Hollow", "Pinewhistle", "Ambermead", "Silverleaf",
    "Foxburrow", "Larkspur Landing", "Greenhush", "Buttercup Bend", "Hearthwillow",
    "Rainberry", "Sagebrush Nook", "Maplebrook", "Wildermere", "Thornfield",
    "Quietroot", "Starling Ford", "Birchbarrow", "Bluebell Downs", "Cinderbrook",
    "Mossy Lantern", "Puddlewick", "Old Rowan", "Brackenridge", "Sunpetal",
    "Fallowfen", "Tumblewood", "Glimmerden", "Hollowbark", "Poppyvale",
    "Golden Acorn", "Rook's Rest", "Mallowfen", "Cedarwake", "Bumbleburrow",
    "Frostwillow", "Redcap Hollow", "Meadowglen", "Foxfern", "Woolly Thistle",
    "Brambleford", "Oatcake Hill", "Lanternleaf", "Greymoss", "Pinecone Reach",
    "Applewick", "Wren's Nest", "Softwind", "Bramblegate", "Dapplewood",
    "Cloverhush", "Mossy Steps", "Hazelshade", "Thistledown", "Gingersnap",
    "Brookhollow", "Cattail Crossing", "Fablewood", "Fernwhistle", "Root & Ribbon",
    "Merrymead", "Raspberry Dell", "Wealdstone", "Spriggan's Rest", "Lilypond",
    "Brindlewood", "Sparrowfen", "Candlewick", "Greenbarrow", "Winding Fern",
    "Sweetbriar", "Copper Kettle", "Dawnmeadow", "Mossbell", "Woollybrook",
    "Everspring", "Nightjar Nook", "Pinehollow", "Tansy Terrace", "Bumblewick",
    "Rillstone", "Cloverdown", "Bark & Berry", "Fawn's Crossing", "Whispering Moss"
  ];
  const biomes = [
    { name: "Sunmeadow", description: "Open grassy hills and gentle surface creatures.", surface: "grass", soil: "dirt", stone: "stone", sky: ["#294451", "#93b87e"], leaf: "#477447", mob: "mossling" },
    { name: "Frostfall", description: "A chilly, snow-bright land watched by swift rime bats.", surface: "frostgrass", soil: "frostdirt", stone: "froststone", sky: ["#26394e", "#8eacc0"], leaf: "#7596a0", mob: "frostbat" },
    { name: "Cinderwild", description: "Warm ashlands with emberlings and dark volcanic rock.", surface: "ashgrass", soil: "ashdirt", stone: "basalt", sky: ["#382d41", "#b66b59"], leaf: "#855247", mob: "emberling" },
    { name: "Mossveil", description: "Deep green woodland where armored fang beetles roam.", surface: "mossgrass", soil: "mossdirt", stone: "mossstone", sky: ["#1e4040", "#6f9b73"], leaf: "#39705a", mob: "fangbeetle" },
    { name: "Starhollow", description: "Violet twilight country haunted by powerful void wisps.", surface: "stargrass", soil: "stardirt", stone: "starstone", sky: ["#241e49", "#8069ae"], leaf: "#61569a", mob: "voidwisp" }
  ];
  const layers = ["Topsoil", "Hollowstone", "Blueglass Deep", "Cinder Veins", "The Starless"];
  const terrainColors = {
    grass: "#779b50", dirt: "#825637", stone: "#777970", wood: "#a77a48", frostgrass: "#b1d3d5", frostdirt: "#827e80",
    froststone: "#768ca0", ashgrass: "#ad7958", ashdirt: "#705044", basalt: "#555061",
    mossgrass: "#559067", mossdirt: "#67503e", mossstone: "#567269", stargrass: "#9282c2",
    stardirt: "#514567", starstone: "#514776", deepstone: "#373642", cinderstone: "#613f46",
    iceore: "#90d8df", copper: "#bf7546", iron: "#a6abb0", gold: "#f2c65d",
    starore: "#bd8fff", brick: "#907252"
  };
  const tilePalettes = {
    dirt: ["#825637", "#70482f", "#986440", "#b27a4d"],
    frostdirt: ["#827e80", "#67666f", "#a09ba0", "#c3bfc0"],
    ashdirt: ["#705044", "#563e39", "#8d604b", "#a8775e"],
    mossdirt: ["#67503e", "#493a34", "#806248", "#9a7958"],
    stardirt: ["#514567", "#3b3455", "#685783", "#8872a2"],
    stone: ["#777970", "#555d5b", "#999a89", "#b8b5a2"],
    froststone: ["#768ca0", "#536c83", "#99b0bc", "#c2d5d9"],
    basalt: ["#555061", "#3e3a4d", "#716275", "#97808a"],
    mossstone: ["#567269", "#3c5654", "#729087", "#9bb09b"],
    starstone: ["#514776", "#39375f", "#71649b", "#a28bc4"],
    deepstone: ["#373642", "#292b39", "#4d4b59", "#777180"],
    cinderstone: ["#613f46", "#482f3c", "#83535a", "#aa7166"],
    grass: ["#825637", "#70482f", "#986440", "#b27a4d"],
    frostgrass: ["#827e80", "#67666f", "#a09ba0", "#c3bfc0"],
    ashgrass: ["#705044", "#563e39", "#8d604b", "#a8775e"],
    mossgrass: ["#67503e", "#493a34", "#806248", "#9a7958"],
    stargrass: ["#514567", "#3b3455", "#685783", "#8872a2"],
    copper: ["#bf7546", "#874d37", "#db9860", "#f0bf74"],
    iron: ["#a6abb0", "#6f7a82", "#c8d0d2", "#e7ebdf"],
    gold: ["#bd8b3c", "#856039", "#e5ba55", "#ffe58b"],
    starore: ["#8264ba", "#553e86", "#b38bea", "#e0c3ff"],
    iceore: ["#709eaf", "#527b91", "#a0d4df", "#e3f5ef"],
    wood: ["#79512f", "#533a2b", "#a87847", "#d0a063"],
    brick: ["#735c49", "#4c4140", "#9a7b5d", "#c2a477"]
  };
  const weaponNames = ["Bramble blade", "Copper sabre", "Frostfang", "Cinder cleaver", "Starforged edge"];
  const weaponColors = ["#cad0b8", "#db9860", "#9de3f0", "#ff9476", "#c5a5ff"];
  const pickaxeNames = ["Twig pick", "Copper pickaxe", "Frost pick", "Cinder drill", "Starforged pick"];
  const materialSlots = [
    { key: "dirt", label: "Dirt", tile: "dirt", detail: "Common soil · place with right-click." },
    { key: "stone", label: "Stone", tile: "stone", detail: "Building block · place with right-click." },
    { key: "wood", label: "Wood", tile: "wood", detail: "Gathered from trees · place with right-click." },
    { key: "copper", label: "Copper ore", tile: "copper", detail: "Common ore · mine with any pickaxe." },
    { key: "iron", label: "Iron ore", tile: "iron", detail: "Hard ore · requires a rank 1 pickaxe." }
  ];
  const mobSpecs = {
    mossling: { name: "Mossling", hp: 22, damage: 6, speed: 44, xp: 16, color: "#7bb66d", drop: "copper" },
    frostbat: { name: "Rime bat", hp: 30, damage: 8, speed: 62, xp: 24, color: "#8bc5df", drop: "iron" },
    emberling: { name: "Cinder imp", hp: 43, damage: 11, speed: 55, xp: 36, color: "#ed8665", drop: "copper" },
    fangbeetle: { name: "Fang beetle", hp: 68, damage: 15, speed: 35, xp: 51, color: "#83ba87", drop: "iron" },
    voidwisp: { name: "Void wisp", hp: 92, damage: 20, speed: 70, xp: 75, color: "#b892ec", drop: "iron" },
    cavernite: { name: "Cavernite", hp: 33, damage: 9, speed: 37, xp: 28, color: "#a49b88", drop: "iron" },
    deepstalker: { name: "Deepstalker", hp: 79, damage: 18, speed: 52, xp: 66, color: "#c27b92", drop: "gold" },
    starling: { name: "Starling", hp: 135, damage: 26, speed: 75, xp: 110, color: "#d0a6ff", drop: "starore" }
  };
  const chunks = new Map();
  const edits = new Map();
  const enemies = new Map();
  const spawnedChunks = new Set();
  const defeatedEnemies = new Set();
  const defeatedBosses = new Set();
  const keys = {};
  const camera = { x: 0, y: 0 };
  let player = null;
  let activeBoss = null;
  let particles = [];
  let mouseTile = null;
  let paused = true;
  let facing = 1;
  let selectedItem = 0;
  const swordSlot = 0;
  const pickaxeSlot = 1;
  const firstMaterialSlot = 2;
  let lastTime = 0;
  let saveTimer = 0;
  let caveTorches = [];
  let miningSwing = 0;
  let currentTitleVillageId = null;
  let villageTitleTime = 0;
  let displayedBiome = "";
  let displayedLayer = -1;
  const villageTitleDuration = 3.4;
  const villageTitleFadeDuration = 1.2;

  function hash(x, y, seed = 0) {
    let value = Math.imul((x | 0) ^ Math.imul((y | 0), 0x45d9f3b) ^ seed ^ 0x9e3779b9, 0x45d9f3b);
    value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
  }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function noise1(x, scale, seed = 11) {
    const cell = Math.floor(x / scale);
    const t = smooth((x - cell * scale) / scale);
    return (hash(cell, seed) * 2 - 1) * (1 - t) + (hash(cell + 1, seed) * 2 - 1) * t;
  }
  function drawSwordShape(bladeColor) {
    ctx.fillStyle = "#d3ad68";
    ctx.fillRect(-7, -4, 14, 3);
    ctx.fillStyle = "#f4d893";
    ctx.fillRect(-5, -4, 10, 1);
    ctx.fillStyle = "#583b2b";
    ctx.fillRect(-2, -1, 4, 10);
    ctx.fillStyle = "#cf9c5e";
    ctx.fillRect(-2, 1, 4, 1);
    ctx.fillRect(-2, 5, 4, 1);
    ctx.fillStyle = "#d7b26c";
    ctx.fillRect(-3, 9, 6, 3);
    ctx.fillStyle = "#34414a";
    ctx.beginPath();
    ctx.moveTo(-2, -4);
    ctx.lineTo(-3, -23);
    ctx.lineTo(0, -30);
    ctx.lineTo(3, -23);
    ctx.lineTo(2, -4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = bladeColor;
    ctx.beginPath();
    ctx.moveTo(-1, -5);
    ctx.lineTo(-2, -22);
    ctx.lineTo(0, -27);
    ctx.lineTo(2, -22);
    ctx.lineTo(1, -5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fff5d5";
    ctx.fillRect(-1, -22, 1, 14);
  }
  function noise2(x, y, scale, seed = 71) {
    const cx = Math.floor(x / scale), cy = Math.floor(y / scale);
    const fx = smooth((x - cx * scale) / scale), fy = smooth((y - cy * scale) / scale);
    const top = hash(cx, cy, seed) * (1 - fx) + hash(cx + 1, cy, seed) * fx;
    const bottom = hash(cx, cy + 1, seed) * (1 - fx) + hash(cx + 1, cy + 1, seed) * fx;
    return top * (1 - fy) + bottom * fy;
  }
  function rawSurfaceAt(x) {
    return Math.max(12, Math.round(18 + noise1(x, 23) * 5 + noise1(x, 79, 83) * 8));
  }
  function villageAtSegment(segment) {
    const nameIndex = ((segment % villageNames.length) + villageNames.length) % villageNames.length;
    return {
      id: `village:${segment}`,
      segment,
      centerX: segment * villageSpacing + 40 + Math.floor(hash(segment, 0, 1802) * 21),
      name: villageNames[nameIndex]
    };
  }
  function nearestVillage(tx) {
    const segment = Math.floor(tx / villageSpacing);
    let nearest = null;
    for (let offset = -1; offset <= 1; offset++) {
      const village = villageAtSegment(segment + offset);
      if (!nearest || Math.abs(village.centerX - tx) < Math.abs(nearest.centerX - tx)) nearest = village;
    }
    return nearest;
  }
  function surfaceAt(x) {
    let height = rawSurfaceAt(x);
    const village = nearestVillage(x);
    const villageDistance = Math.abs(x - village.centerX);
    if (villageDistance < 15) {
      const blend = 1 - smooth(Math.max(0, (villageDistance - 9) / 6));
      height += (rawSurfaceAt(village.centerX) - height) * blend;
    }
    const spawnDistance = Math.abs(x - 18);
    if (spawnDistance < 10) {
      const blend = 1 - smooth(Math.max(0, (spawnDistance - 5) / 5));
      height += (rawSurfaceAt(18) - height) * blend;
    }
    return Math.round(height);
  }
  function biomeAt(x) {
    const band = Math.floor(x / 300);
    return biomes[((band % biomes.length) + biomes.length) % biomes.length];
  }
  function layerAt(y) {
    if (y < 0) return 0;
    if (y < 75) return 0;
    if (y < 180) return 1;
    if (y < 360) return 2;
    if (y < 700) return 3;
    return 4;
  }
  function roomAt(tx, ty) {
    const guess = Math.max(1, Math.floor((ty - 65) / 92) + 1);
    const nearSegment = Math.floor((tx - 92) / caveEntranceSpacing);
    for (let tier = Math.max(1, guess - 1); tier <= guess + 1; tier++) {
      const y = 65 + (tier - 1) * 92;
      for (let segment = nearSegment - 1; segment <= nearSegment + 1; segment++) {
        const x = caveEntranceAtSegment(segment) - 57 + (tier * 47 % 112);
        if (tx >= x && tx < x + 30 && ty >= y && ty < y + 19) {
          return { tier, x, y, width: 30, height: 19, centerX: x + 15, entranceSegment: segment };
        }
      }
    }
    return null;
  }
  function caveEntranceAtSegment(segment) {
    const variation = segment === 0 ? 0 : Math.floor(hash(segment, 0, 4901) * 25) - 12;
    return segment * caveEntranceSpacing + 92 + variation;
  }
  function shaftCenterAt(ty, entranceX) {
    return entranceX + Math.round(Math.sin(ty * .027) * 8 + noise1(ty, 58, 317) * 5);
  }
  function inCaveTunnel(tx, ty) {
    const nearSegment = Math.floor((tx - 92) / caveEntranceSpacing);
    const tier = Math.floor((ty - 65) / 92) + 1;
    const caveBand = Math.floor(ty / 39);
    const caveY = caveBand * 39 + 22;
    for (let segment = nearSegment - 1; segment <= nearSegment + 1; segment++) {
      const entranceX = caveEntranceAtSegment(segment);
      if (ty < 65) {
        const entranceY = surfaceAt(entranceX);
        const shaftStartY = entranceY + 24;
        if (ty >= entranceY && ty <= shaftStartY) {
          const progress = (ty - entranceY) / (shaftStartY - entranceY);
          const centerX = entranceX + (shaftCenterAt(shaftStartY, entranceX) - entranceX) * progress;
          if (Math.abs(tx - centerX) <= 1) return true;
        } else if (ty > shaftStartY && Math.abs(tx - shaftCenterAt(ty, entranceX)) <= 2) return true;
      } else if (Math.abs(tx - shaftCenterAt(ty, entranceX)) <= 2) return true;
      if (tier > 0) {
        const roomX = entranceX - 57 + (tier * 47 % 112);
        const roomRight = roomX + 29;
        const corridorY = 65 + (tier - 1) * 92 + 15;
        const shaftX = shaftCenterAt(corridorY, entranceX);
        if (shaftX < roomX && Math.abs(ty - corridorY) <= 2
          && tx >= shaftX && tx <= roomX + 2) return true;
        if (shaftX > roomRight && Math.abs(ty - corridorY) <= 2
          && tx >= roomRight - 2 && tx <= shaftX) return true;
      }
      const shaftX = shaftCenterAt(caveY, entranceX);
      const branchX = shaftX + (hash(caveBand, segment, 781) > .5 ? 1 : -1) * (9 + Math.floor(hash(caveBand, segment, 317) * 15));
      if (Math.abs(ty - caveY) <= 2 && tx >= Math.min(branchX, shaftX) && tx <= Math.max(branchX, shaftX)) return true;
      const dx = (tx - branchX) / 8, dy = (ty - caveY) / 4;
      if (dx * dx + dy * dy < .83) return true;
    }
    return false;
  }
  function baseTile(tx, ty) {
    if (ty < 0) return null;
    const room = roomAt(tx, ty);
    if (room) {
      const rx = tx - room.x, ry = ty - room.y;
      if ((rx <= 2 || rx >= room.width - 3) && ry >= 12 && ry <= 16) return null;
      if (rx === 0 || rx === room.width - 1 || ry === 0 || ry === room.height - 1) return "brick";
      if (ry === room.height - 2 && hash(rx, ry, room.tier) > .3) return "brick";
      if (ry === room.height - 2) return "brick";
      return null;
    }
    const surface = surfaceAt(tx), depth = ty - surface, biome = biomeAt(tx);
    if (depth < 0) return null;
    if (inCaveTunnel(tx, ty)) return null;
    if (depth <= 1) return biome.surface;
    if (depth < 14) return biome.soil;
    const layer = layerAt(ty);
    const cave = depth > 7 && (noise2(tx, ty, 25, 117) * .68 + noise2(tx + 14, ty - 9, 11, 219) * .32) > .73;
    if (cave && hash(tx, ty, 401) > .09) return null;
    if (depth > 14 && depth < 190 && noise2(tx, ty, 17, 319) > .94) return "copper";
    if (depth > 55 && depth < 440 && noise2(tx + 213, ty - 91, 23, 521) > .95) return "iron";
    if (depth > 120 && noise2(tx - 415, ty, 29, 733) > .975) return "gold";
    if (depth > 280 && noise2(tx + 971, ty + 341, 31, 919) > .985) return "starore";
    if (layer >= 4) return hash(tx, ty, 611) > .86 ? "starore" : "deepstone";
    if (layer >= 3) return hash(tx, ty, 421) > .87 ? "cinderstone" : "deepstone";
    if (layer >= 2 && biome.name === "Frostfall" && hash(tx, ty, 319) > .9) return "iceore";
    return layer < 2 ? biome.stone : (layer === 2 ? (biome.name === "Cinderwild" ? "basalt" : biome.name === "Mossveil" ? "mossstone" : biome.name === "Starhollow" ? "starstone" : biome.stone) : "deepstone");
  }
  function chunkFor(tx, ty) {
    const cx = Math.floor(tx / chunkSize), cy = Math.floor(ty / chunkSize);
    const key = `${cx},${cy}`;
    if (chunks.has(key)) return chunks.get(key);
    const chunk = new Array(chunkSize * chunkSize);
    for (let y = 0; y < chunkSize; y++) {
      for (let x = 0; x < chunkSize; x++) chunk[y * chunkSize + x] = baseTile(cx * chunkSize + x, cy * chunkSize + y);
    }
    chunks.set(key, chunk);
    return chunk;
  }
  function chunkIndex(tx, ty) {
    const localX = ((tx % chunkSize) + chunkSize) % chunkSize;
    const localY = ((ty % chunkSize) + chunkSize) % chunkSize;
    return localY * chunkSize + localX;
  }
  function tileAt(tx, ty) {
    tx = Math.floor(tx); ty = Math.floor(ty);
    if (ty < 0) return null;
    const key = `${tx},${ty}`;
    if (edits.has(key)) return edits.get(key);
    const chunk = chunkFor(tx, ty);
    return chunk[chunkIndex(tx, ty)];
  }
  function setTile(tx, ty, type) {
    tx = Math.floor(tx); ty = Math.floor(ty);
    const key = `${tx},${ty}`;
    if (type === baseTile(tx, ty)) edits.delete(key);
    else edits.set(key, type);
    const chunk = chunkFor(tx, ty);
    chunk[chunkIndex(tx, ty)] = type;
  }
  function supportedAt(tx, ty) { return tileAt(tx, ty) !== null; }
  function spawnEnemyForChunk(cx, cy) {
    const key = `${cx},${cy}`;
    if (spawnedChunks.has(key)) return;
    spawnedChunks.add(key);
    const seed = hash(cx, cy, 7301);
    if (cy === 0) {
      for (let slot = 0; slot < 2; slot++) {
        const tx = cx * chunkSize + 4 + Math.floor(hash(cx, slot, 7403) * (chunkSize - 8));
        if (Math.abs(tx - nearestVillage(tx).centerX) < 10) continue;
        const surface = surfaceAt(tx);
        const ty = surface - 2;
        if (tileAt(tx, ty) !== null || tileAt(tx, ty + 2) === null) continue;
        const type = biomeAt(tx).mob;
        const spec = mobSpecs[type];
        const id = `mob:surface:${cx}:${slot}:${type}`;
        if (!defeatedEnemies.has(id)) {
          enemies.set(id, {
            id, type, name: spec.name, x: tx * tileSize, y: ty * tileSize, w: 22, h: 20,
            vx: 0, vy: 0, hp: spec.hp, maxHp: spec.hp, damage: spec.damage, speed: spec.speed,
            xp: spec.xp, color: spec.color, drop: spec.drop, grounded: false, hitCooldown: 0,
            boss: false, phase: hash(cx, slot, 7409) * Math.PI * 2
          });
        }
      }
      return;
    }
    if (seed > .42) return;
    const tx = cx * chunkSize + 4 + Math.floor(hash(cx, cy, 47) * (chunkSize - 8));
    if (Math.abs(tx - nearestVillage(tx).centerX) < 18) return;
    let ty = cy * chunkSize + 3 + Math.floor(hash(cy, cx, 97) * 12);
    for (let i = 0; i < 12 && (tileAt(tx, ty) !== null || tileAt(tx, ty + 2) === null); i++) {
      ty = cy * chunkSize + 2 + ((ty + i + 1) % (chunkSize - 4));
    }
    if (ty < surfaceAt(tx) - 2) return;
    const depth = Math.max(0, ty - surfaceAt(tx));
    const biome = biomeAt(tx);
    const type = depth < 40 ? biome.mob
      : depth < 120 ? (seed > .14 ? "cavernite" : biome.mob)
      : depth < 270 ? (seed > .13 ? "deepstalker" : "cavernite")
      : (seed > .12 ? "starling" : "deepstalker");
    const spec = mobSpecs[type];
    const scaling = 1 + Math.max(0, depth - 30) / 160;
    const id = `mob:${key}:${type}`;
    if (!defeatedEnemies.has(id)) {
      enemies.set(id, {
        id, type, name: spec.name, x: tx * tileSize, y: ty * tileSize, w: 22, h: 20,
        vx: 0, vy: 0, hp: Math.round(spec.hp * scaling), maxHp: Math.round(spec.hp * scaling),
        damage: Math.round(spec.damage * scaling), speed: spec.speed, xp: Math.round(spec.xp * scaling),
        color: spec.color, drop: spec.drop, grounded: false, hitCooldown: 0, boss: false,
        phase: hash(cx, cy, 71) * Math.PI * 2
      });
    }
  }
  function ensureWorld() {
    const px = Math.floor(player.x / tileSize), py = Math.floor(player.y / tileSize);
    const centerX = Math.floor(px / chunkSize), centerY = Math.floor(Math.max(0, py) / chunkSize);
    for (let cy = Math.max(0, centerY - 2); cy <= centerY + 2; cy++) {
      for (let cx = centerX - 3; cx <= centerX + 3; cx++) {
        chunkFor(cx * chunkSize, cy * chunkSize);
        spawnEnemyForChunk(cx, cy);
      }
    }
    for (const [key] of chunks) {
      const [cx, cy] = key.split(",").map(Number);
      if (Math.abs(cx - centerX) > 8 || Math.abs(cy - centerY) > 8) chunks.delete(key);
    }
    for (const [id, enemy] of enemies) {
      if (!enemy.boss && Math.abs(enemy.x / tileSize - px) > chunkSize * 7) enemies.delete(id);
    }
    for (const key of spawnedChunks) {
      const [cx, cy] = key.split(",").map(Number);
      if (Math.abs(cx - centerX) > 8 || Math.abs(cy - centerY) > 8) spawnedChunks.delete(key);
    }
    caveTorches = [];
    const playerSegment = Math.floor((px - 92) / caveEntranceSpacing);
    for (let band = Math.max(0, Math.floor((py - 26) / 39)); band <= Math.floor((py + 38) / 39); band++) {
      const caveY = band * 39 + 22;
      for (let segment = playerSegment - 1; segment <= playerSegment + 1; segment++) {
        const shaftX = shaftCenterAt(caveY, caveEntranceAtSegment(segment));
        const branchX = shaftX + (hash(band, segment, 781) > .5 ? 1 : -1) * (9 + Math.floor(hash(band, segment, 317) * 15));
        caveTorches.push({ x: (shaftX + 2) * tileSize, y: caveY * tileSize - 9 });
        caveTorches.push({ x: (branchX + 2) * tileSize, y: caveY * tileSize - 9 });
      }
    }
  }
  function villageNearPlayer() {
    const tx = Math.floor((player.x + player.w / 2) / tileSize);
    const village = nearestVillage(tx);
    const surface = surfaceAt(tx);
    const playerFeet = (player.y + player.h) / tileSize;
    return Math.abs(tx - village.centerX) <= 24 && Math.abs(playerFeet - surface) <= 7
      ? village : null;
  }
  function updateVillageHud() {
    const village = villageNearPlayer();
    const trainingCost = 5 + player.level * 2;
    document.getElementById("talkToVillagerButton").disabled = !village;
    document.getElementById("setSpawnButton").disabled = !village;
    const trainButton = document.getElementById("trainButton");
    trainButton.disabled = !village || (player.inventory.gold || 0) < trainingCost;
    trainButton.textContent = `Train · ${trainingCost} gold`;
    const restButton = document.getElementById("restButton");
    restButton.disabled = !village || player.health >= maxHealth() || (player.inventory.gold || 0) < 2;
    restButton.textContent = "Rest · 2 gold";
    document.getElementById("villageStatus").textContent = village
      ? `${village.name}: talk to the villager (T) for healing, training, and a safe spawn.`
      : "Find a village for training, healing, and a safe spawn point.";
  }
  function bossLevelRequirement(tier) { return tier * 5; }
  function interactWithVillager() {
    const village = villageNearPlayer();
    if (!village) {
      message.textContent = "Move closer to a village villager to talk.";
      return;
    }
    const dialog = document.getElementById("villagerDialog");
    const restButton = document.getElementById("villagerRestButton");
    const trainButton = document.getElementById("villagerTrainButton");
    const spawnButton = document.getElementById("villagerSpawnButton");
    const trainingCost = 5 + player.level * 2;
    document.getElementById("villagerDialogTitle").textContent = `${village.name}'s Wayfarer`;
    document.getElementById("villagerDialogText").textContent =
      `Welcome, traveler. Rest here to recover your health for 2 gold, train for ${trainingCost} gold to gain a level, or make this village your safe return point.`;
    restButton.disabled = player.health >= maxHealth() || (player.inventory.gold || 0) < 2;
    restButton.textContent = player.health >= maxHealth() ? "Already at full health" : "Rest and heal · 2 gold";
    trainButton.disabled = (player.inventory.gold || 0) < trainingCost;
    trainButton.textContent = `Train · ${trainingCost} gold`;
    spawnButton.textContent = player.spawnX === village.centerX * tileSize + (tileSize - player.w) / 2
      ? "Spawn is already set here"
      : "Set this village as spawn";
    spawnButton.disabled = player.spawnX === village.centerX * tileSize + (tileSize - player.w) / 2;
    villagerDialogPausedBefore = paused;
    paused = true;
    saveGame();
    dialog.showModal();
  }
  let villagerDialogPausedBefore = true;
  function maxHealth() { return 100 + player.level * 6 + player.weaponRank * 15; }
  function xpRequired() { return 45 + player.level * 28; }
  function nextBossTarget(playerTileX, playerTileY) {
    let tier = 1;
    while (defeatedBosses.has(tier)) tier++;
    const nearestSegment = Math.round((playerTileX - 92) / caveEntranceSpacing);
    let target = null;
    for (let segment = nearestSegment - 2; segment <= nearestSegment + 2; segment++) {
      const roomX = caveEntranceAtSegment(segment) - 57 + (tier * 47 % 112);
      const roomY = 65 + (tier - 1) * 92;
      const dx = roomX + 15 - playerTileX;
      const dy = roomY + 9.5 - playerTileY;
      const distance = Math.hypot(dx, dy);
      if (!target || distance < target.distance) {
        target = { tier, x: roomX + 15, y: roomY + 9.5, dx, dy, distance };
      }
    }
    return target;
  }
  function updateBossCompass() {
    const compass = document.getElementById("bossCompass");
    const arrow = document.getElementById("bossCompassArrow");
    const label = document.getElementById("bossCompassLabel");
    if (!player || !compass || !arrow || !label) return;
    const playerTileX = Math.floor((player.x + player.w / 2) / tileSize);
    const playerTileY = Math.floor((player.y + player.h / 2) / tileSize);
    const target = nextBossTarget(playerTileX, playerTileY);
    if (!target) return;
    const bearing = Math.atan2(target.dx, -target.dy) * 180 / Math.PI;
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const direction = directions[Math.round(((bearing % 360) + 360) % 360 / 45) % directions.length];
    const meters = Math.round(target.distance * 2);
    arrow.style.transform = `rotate(${bearing}deg)`;
    const levelGate = bossLevelRequirement(target.tier);
    const location = target.distance < 1
      ? "ARRIVED"
      : `${direction} · ${meters.toLocaleString()} m`;
    label.textContent = player.level < levelGate
      ? `LEVEL ${target.tier} BOSS ROOM · NEED LVL ${levelGate} · ${location}`
      : `LEVEL ${target.tier} BOSS ROOM · ${location}`;
    compass.setAttribute("aria-label", `Compass to level ${target.tier} boss room, required level ${levelGate}, ${direction}, ${meters.toLocaleString()} meters away.`);
  }
  function updateHud() {
    const total = Math.max(1, maxHealth());
    const hearts = 10, filled = Math.ceil(player.health / total * hearts);
    document.getElementById("health").textContent = `${"♥".repeat(filled)}${"♡".repeat(hearts - filled)} ${Math.max(0, Math.ceil(player.health))}/${total}`;
    document.getElementById("levelLabel").textContent = `LVL ${player.level}`;
    document.getElementById("xpLabel").textContent = `${player.xp} / ${xpRequired()} XP`;
    document.getElementById("xpBar").style.width = `${Math.min(100, player.xp / xpRequired() * 100)}%`;
    const playerTileX = Math.floor((player.x + player.w / 2) / tileSize);
    const playerTileY = Math.floor(player.y / tileSize);
    const biome = biomeAt(playerTileX);
    const depth = Math.max(0, Math.floor((player.y + player.h) / tileSize - surfaceAt(playerTileX)) * 2);
    document.getElementById("depthLabel").textContent = depth ? `${layers[layerAt(playerTileY)]} · ${depth} m` : "Surface";
    document.getElementById("coordLabel").textContent = `Tile ${Math.floor(player.x / tileSize)}, ${Math.floor(player.y / tileSize)}`;
    document.getElementById("bossCount").textContent = `Guardians ${defeatedBosses.size}`;
    document.getElementById("weaponLabel").textContent = `${weaponNames[Math.min(4, player.weaponRank)]} · ${player.damage} ATK`;
    const regionName = document.getElementById("regionName");
    regionName.textContent = `BIOME · ${biome.name}`;
    regionName.title = `${biome.description} Region: ${layers[layerAt(playerTileY)]}.`;
    regionName.setAttribute("aria-label", `${biome.name} biome. ${biome.description} ${layers[layerAt(playerTileY)]} region.`);
    displayedBiome = biome.name;
    displayedLayer = layerAt(playerTileY);
    const resources = [
      { key: "potions", label: "Rations", title: "Healing potions · press E to restore health." },
      { key: "copper", label: "Copper", title: "Copper ore · a common crafting resource." },
      { key: "iron", label: "Iron", title: "Iron ore · a deeper mining resource." },
      { key: "starore", label: "Star ore", title: "Star ore · rare reward from guardian bosses." }
    ];
    document.getElementById("goldCount").textContent =
      Math.max(0, Math.floor(Number(player.inventory.gold) || 0)).toLocaleString();
    document.getElementById("lootReadout").innerHTML = resources.map(resource =>
      `<span class="resource-chip" title="${resource.title}"><span class="resource-icon ${resource.key}" aria-hidden="true"></span>${resource.label} <strong>${player.inventory[resource.key] || 0}</strong></span>`
    ).join("");
    updateVillageHud();
    const hotbar = document.getElementById("hotbar");
    const swordIndex = Math.min(weaponNames.length - 1, player.weaponRank);
    const pickaxeIndex = Math.min(pickaxeNames.length - 1, player.pickaxeRank);
    const equipmentSlots = [
      {
        name: weaponNames[swordIndex], kind: "SWORD", stat: `${player.damage} ATK`,
        detail: `${weaponNames[swordIndex]} · ${player.damage} attack damage · click or press J to strike.`,
        icon: `<svg class="gear-icon sword-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="m11 20 11-15 6-4-1 8-12 15Z" fill="#26353b" stroke="#f6e5b6" stroke-width="1.2"/><path d="m13 19 10-13 3-2-1 4-11 13Z" fill="${weaponColors[swordIndex]}" stroke="#fff4d2" stroke-width=".8"/><path d="m23 6 2-2-1 4-9 12Z" fill="#fff9e7"/><path d="m8 16 12 8-4 4-12-9Z" fill="#d5aa62" stroke="#543d2b" stroke-width="1"/><path d="m7 20 5 4-4 5-5-4Z" fill="#70452f" stroke="#e0bd79" stroke-width=".8"/><path d="m7 22 4 3m-6-1 4 3" stroke="#d4aa6b" stroke-width="1"/><circle cx="4" cy="28" r="2" fill="#c6a05d" stroke="#f4dda3" stroke-width=".8"/></svg>`
      },
      {
        name: pickaxeNames[pickaxeIndex], kind: "PICKAXE", stat: `RANK ${player.pickaxeRank}`,
        detail: `${pickaxeNames[pickaxeIndex]} · mining rank ${player.pickaxeRank} · equip slot 2 and click or press F to mine.`,
        icon: `<svg class="gear-icon pickaxe-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="m10 28 11-17" stroke="#bb8951" stroke-width="4"/><path d="m3 10 5-6 7 3 7 1 7 6-4 5-7-5-7-1-5 5-4-4Z" fill="${weaponColors[pickaxeIndex]}" stroke="#f8e9be" stroke-width="1.5"/><path d="m5 10 4-4 5 2" fill="none" stroke="#fff3cd" stroke-width="1.4"/></svg>`
      }
    ];
    const gearMarkup = equipmentSlots.map((equipment, index) =>
      `<div class="slot equipment${index === pickaxeSlot ? " pickaxe-slot" : ""}${selectedItem === index ? " active" : ""}" role="button" tabindex="0" data-slot="${index}" aria-label="${index + 1}: ${equipment.detail}" title="${index + 1} · ${equipment.detail}"><span class="slot-key">${index + 1}</span>${equipment.icon}<span class="slot-name">${equipment.name}</span><span class="slot-kind">${equipment.kind}</span><span class="slot-stat">${equipment.stat}</span></div>`
    ).join("");
    const materialMarkup = materialSlots.map((item, index) => {
      const slot = index + firstMaterialSlot;
      const count = player.inventory[item.key] || 0;
      const detail = `${item.label} · ${count} in pack · ${item.detail}`;
      return `<div class="slot material-slot${selectedItem === slot ? " active" : ""}" role="button" tabindex="0" data-slot="${slot}" aria-label="${slot + 1}: ${detail}" title="${slot + 1} · ${detail}"><span class="slot-key">${slot + 1}</span><div class="icon ${item.key}" aria-hidden="true"></div><span class="slot-name">${item.label}</span><span class="slot-kind">MATERIAL</span><span class="slot-stat">× ${count}</span></div>`;
    }).join("");
    hotbar.innerHTML = gearMarkup + materialMarkup;
    const selectedEquipment = equipmentSlots[selectedItem];
    const selectedMaterial = materialSlots[selectedItem - firstMaterialSlot];
    const detailsTitle = document.getElementById("selectedItemName");
    const detailsText = document.getElementById("selectedItemDescription");
    const detailsCount = document.getElementById("selectedItemQuantity");
    if (selectedEquipment) {
      detailsTitle.textContent = `${selectedEquipment.name} · ${selectedEquipment.kind}`;
      detailsText.textContent = selectedEquipment.detail;
      detailsCount.textContent = selectedEquipment.stat;
    } else if (selectedMaterial) {
      detailsTitle.textContent = selectedMaterial.label;
      detailsText.textContent = selectedMaterial.detail;
      detailsCount.textContent = `× ${player.inventory[selectedMaterial.key] || 0}`;
    }
    updateBossCompass();
  }
  function saveGame() {
    if (!player) return false;
    let serialized;
    try {
      const savedEdits = Array.from(edits.entries()).slice(-5000);
      serialized = JSON.stringify({
        x: player.x, y: player.y, health: player.health, level: player.level, xp: player.xp,
        weaponRank: player.weaponRank, damage: player.damage, inventory: player.inventory,
        edits: savedEdits, defeated: Array.from(defeatedEnemies).slice(-2000),
        bosses: Array.from(defeatedBosses), pickaxeRank: player.pickaxeRank,
        spawnX: player.spawnX, spawnY: player.spawnY, version: 5, savedAt: Date.now()
      });
    } catch (error) {
      console.error("Teressa could not prepare your adventure for saving.", error);
      message.textContent = "Could not prepare your adventure for saving. Check available browser storage.";
      return false;
    }
    let verifiedCopies = 0;
    const errors = [];
    for (const key of [saveKey, backupSaveKey]) {
      try {
        localStorage.setItem(key, serialized);
        if (localStorage.getItem(key) === serialized) verifiedCopies++;
        else errors.push(new Error(`Save verification failed for ${key}.`));
      } catch (error) {
        errors.push(error);
      }
    }
    if (verifiedCopies > 0) {
      if (errors.length) console.warn("Teressa saved your adventure, but could not verify every backup copy.", errors);
      return true;
    }
    console.error("Teressa could not save your adventure to either verified copy.", errors);
    message.textContent = "Could not save your adventure. Update canceled to protect your progress; check available browser storage.";
    return false;
  }
  function legacySaveReadError(error) {
    console.error("Teressa could not read its saved adventure.", error);
    message.textContent = "Your saved adventure could not be read; starting a new adventure.";
  }
  function saveCandidateIsValid(saved) {
    return saved && [3, 4, 5].includes(saved.version)
      && Number.isFinite(saved.x) && Number.isFinite(saved.y)
      && (!saved.inventory || (typeof saved.inventory === "object" && !Array.isArray(saved.inventory)))
      && (!saved.edits || Array.isArray(saved.edits))
      && (!saved.defeated || Array.isArray(saved.defeated))
      && (!saved.bosses || Array.isArray(saved.bosses));
  }
  function resetTerrain() {
    if (!player || !window.confirm("Reset mined, placed, and altered terrain to its original generated state? Your character, inventory, and boss progress will be kept.")) return;
    edits.clear();
    chunks.clear();
    ensureWorld();
    const overlapsTerrain = () => solidAt(player.x + 2, player.y + 2) ||
      solidAt(player.x + player.w - 2, player.y + 2) ||
      solidAt(player.x + 2, player.y + player.h - 2) ||
      solidAt(player.x + player.w - 2, player.y + player.h - 2);
    const playerOverlapsTerrain = overlapsTerrain();
    if (playerOverlapsTerrain) {
      player.x = player.spawnX;
      player.y = player.spawnY;
      player.vx = 0;
      player.vy = 0;
      if (overlapsTerrain()) {
        player.x = 18 * tileSize;
        player.y = surfaceAt(18) * tileSize - player.h;
        player.spawnX = player.x;
        player.spawnY = player.y;
      }
    }
    render();
    saveGame();
    message.textContent = playerOverlapsTerrain
      ? "Terrain restored. Your progress is safe; you were moved to your saved spawn because the reset filled your location."
      : "Terrain restored. Your character and progress are unchanged.";
  }
  function loadSavedGame() {
    try {
      const candidates = [];
      for (const key of [saveKey, backupSaveKey]) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        try {
          const candidate = JSON.parse(raw);
          if (!saveCandidateIsValid(candidate)) {
            console.warn(`Teressa found an invalid saved adventure in ${key}.`);
            continue;
          }
          candidates.push({ saved: candidate, raw, key });
        } catch (error) {
          console.warn(`Teressa could not parse the saved adventure in ${key}; trying another copy.`, error);
        }
      }
      candidates.sort((a, b) => (Number(b.saved.savedAt) || 0) - (Number(a.saved.savedAt) || 0));
      const latest = candidates[0];
      if (!latest) return null;
      const { saved, key: sourceKey, raw } = latest;
      if (sourceKey !== saveKey) {
        try {
          localStorage.setItem(saveKey, raw);
        } catch (error) {
          console.warn("Teressa loaded the backup save but could not restore the primary copy.", error);
        }
      }
      player.x = Math.max(-Number.MAX_SAFE_INTEGER / 100, saved.x);
      player.y = Math.max(0, saved.y);
      player.level = Math.max(1, Math.floor(saved.level) || 1);
      player.xp = Math.max(0, Math.floor(saved.xp) || 0);
      player.weaponRank = Math.max(0, Math.floor(saved.weaponRank) || 0);
      player.pickaxeRank = Math.min(4, Math.max(0, Math.floor(saved.pickaxeRank ?? saved.weaponRank) || 0));
      player.damage = Math.max(12, Math.floor(saved.damage) || 16);
      player.inventory = { ...player.inventory, ...(saved.inventory || {}) };
      player.health = Math.min(maxHealth(), Math.max(1, Number(saved.health) || maxHealth()));
      player.spawnX = Number.isFinite(saved.spawnX) ? saved.spawnX : player.x;
      player.spawnY = Number.isFinite(saved.spawnY) ? saved.spawnY : player.y;
      for (const edit of saved.edits || []) {
        if (Array.isArray(edit) && typeof edit[0] === "string" && /^-?\d+,-?\d+$/.test(edit[0])
          && (edit[1] === null || typeof edit[1] === "string")) edits.set(edit[0], edit[1]);
      }
      for (const id of saved.defeated || []) if (typeof id === "string") defeatedEnemies.add(id);
      for (const tier of saved.bosses || []) if (Number.isInteger(tier)) defeatedBosses.add(tier);
      if (sourceKey !== saveKey) {
        console.warn("Teressa recovered your adventure from its backup save.");
        message.textContent = "Recovered your adventure from its backup save.";
      }
      return true;
    } catch (error) {
      legacySaveReadError(error);
      return null;
    }
  }
  function initializeGame(loadSave) {
    chunks.clear(); edits.clear(); enemies.clear(); spawnedChunks.clear();
    defeatedEnemies.clear(); defeatedBosses.clear(); particles = []; caveTorches = [];
    activeBoss = null; camera.x = 0; camera.y = 0;
    currentTitleVillageId = null; villageTitleTime = 0;
    player = {
      x: 18 * tileSize, y: surfaceAt(18) * tileSize - 31, w: 16, h: 31, vx: 0, vy: 0, grounded: false,
      spawnX: 18 * tileSize, spawnY: surfaceAt(18) * tileSize - 31,
      health: 100, level: 1, xp: 0, weaponRank: 0, pickaxeRank: 0, damage: 16, inventory: { dirt: 15, stone: 0, wood: 0, copper: 0, iron: 0, gold: 0, starore: 0, potions: 1 },
      attackCooldown: 0, attackTimer: 0, invulnerable: 0
    };
    const loaded = loadSave ? loadSavedGame() : false;
    if (loadSave && !loaded) return false;
    if (player.health <= 0) player.health = maxHealth();
    ensureWorld();
    updateHud();
    return loaded;
  }
  function solidAt(x, y) { return tileAt(Math.floor(x / tileSize), Math.floor(y / tileSize)) !== null; }
  function moveEntity(entity, dt) {
    entity.grounded = false;
    entity.x += entity.vx * dt;
    const x1 = entity.x + 2, x2 = entity.x + entity.w - 2;
    if (entity.vx > 0 && (solidAt(x2, entity.y + 2) || solidAt(x2, entity.y + entity.h - 2))) {
      entity.x = Math.floor(x2 / tileSize) * tileSize - entity.w;
      if (entity.boss) entity.vy = -320;
      else entity.vx *= -1;
    } else if (entity.vx < 0 && (solidAt(x1, entity.y + 2) || solidAt(x1, entity.y + entity.h - 2))) {
      entity.x = (Math.floor(x1 / tileSize) + 1) * tileSize;
      if (entity.boss) entity.vy = -320;
      else entity.vx *= -1;
    }
    entity.vy = Math.min(entity.vy + (entity.boss ? 920 : 850) * dt, 580);
    entity.y += entity.vy * dt;
    const left = entity.x + 2, right = entity.x + entity.w - 2;
    if (entity.vy >= 0 && (solidAt(left, entity.y + entity.h) || solidAt(right, entity.y + entity.h))) {
      entity.y = Math.floor((entity.y + entity.h) / tileSize) * tileSize - entity.h;
      entity.vy = 0;
      entity.grounded = true;
    } else if (entity.vy < 0 && (solidAt(left, entity.y) || solidAt(right, entity.y))) {
      entity.y = (Math.floor(entity.y / tileSize) + 1) * tileSize;
      entity.vy = 0;
    }
  }
  function overlaps(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  function addParticle(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) particles.push({ x, y, vx: (hash(i, Math.floor(x), Date.now() % 99991) - .5) * 210, vy: -hash(i + 2, Math.floor(y), 72) * 190, color, life: .35 + hash(i, Math.floor(y), 9) * .55 });
  }
  function gainXp(amount) {
    player.xp += Math.max(1, Math.floor(amount));
    let leveled = false;
    while (player.xp >= xpRequired()) {
      player.xp -= xpRequired();
      player.level++;
      player.health = Math.min(maxHealth(), player.health + 20);
      player.damage += 2;
      leveled = true;
    }
    if (leveled) message.textContent = `Level up! Level ${player.level} — your health and damage increased.`;
  }
  function rewardEnemy(enemy) {
    defeatedEnemies.add(enemy.id);
    enemies.delete(enemy.id);
    const enemyTileX = Math.floor((enemy.x + enemy.w / 2) / tileSize);
    const enemyTileY = Math.floor((enemy.y + enemy.h) / tileSize);
    const isUndergroundMob = !enemy.boss && enemyTileY > surfaceAt(enemyTileX) + 1;
    const earnedXp = isUndergroundMob ? Math.round(enemy.xp * 1.15) : enemy.xp;
    gainXp(earnedXp);
    const amount = enemy.boss ? 1 + Math.floor(enemy.tier / 2) : 1 + Math.floor(hash(Math.floor(enemy.x), Math.floor(enemy.y), 17) * 3);
    const drop = enemy.boss ? "starore" : enemy.drop;
    player.inventory[drop] = (player.inventory[drop] || 0) + amount;
    if (hash(Math.floor(enemy.x), Math.floor(enemy.y), 31) > .79) player.inventory.potions++;
    addParticle(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, enemy.color, enemy.boss ? 28 : 12);
    if (enemy.boss) {
      defeatedBosses.add(enemy.tier);
      const newRank = Math.min(4, player.weaponRank + 1);
      const newPickaxeRank = Math.min(4, player.pickaxeRank + 1);
      player.weaponRank = newRank;
      player.pickaxeRank = newPickaxeRank;
      player.damage += 15 + Math.min(enemy.tier, 10) * 2;
      player.health = maxHealth();
      player.inventory.potions++;
      activeBoss = null;
      message.textContent = `Boss defeated! ${weaponNames[newRank]} + ${pickaxeNames[newPickaxeRank]} forged · +${amount} star ore · full heal`;
      saveGame();
    } else {
      message.textContent = `Defeated ${enemy.name}! +${earnedXp} XP${isUndergroundMob ? " · cave bonus" : ""} · ${amount} ${drop}`;
    }
    updateHud();
  }
  function hurtPlayer(damage, direction) {
    if (player.invulnerable > 0) return;
    player.health = Math.max(0, player.health - damage);
    player.invulnerable = 1.15;
    player.vx = direction * 165;
    player.vy = -210;
    addParticle(player.x + player.w / 2, player.y + 12, "#ed8b72", 6);
    if (player.health <= 0) {
      saveGame();
      player.health = 0;
      paused = true;
      showOverlay("The wilds claimed you", `Level ${player.level} · ${defeatedBosses.size} boss${defeatedBosses.size === 1 ? "" : "es"} defeated. Your save remains safe; respawn at the surface and try again.`, "Respawn at camp");
    }
    updateHud();
  }
  function attack() {
    if (paused || player.attackCooldown > 0) return;
    if (selectedItem !== swordSlot) {
      message.textContent = "Equip your sword in slot 1 to attack.";
      return;
    }
    player.attackCooldown = Math.max(.19, .43 - player.weaponRank * .035);
    player.attackTimer = .19;
    const reach = 63 + player.weaponRank * 4;
    let hits = 0;
    for (const enemy of enemies.values()) {
      if (Math.abs(enemy.y - player.y) > 58 || Math.abs(enemy.x - player.x) > reach) continue;
      const direction = Math.sign(enemy.x + enemy.w / 2 - (player.x + player.w / 2)) || facing;
      if (direction !== facing && Math.abs(enemy.x - player.x) > 27) continue;
      enemy.hp -= player.damage;
      enemy.vx = direction * (enemy.boss ? 80 : 155);
      enemy.vy = enemy.boss ? -120 : -165;
      enemy.hitCooldown = .42;
      addParticle(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, enemy.color, 5);
      hits++;
      if (enemy.hp <= 0) rewardEnemy(enemy);
    }
    if (hits) message.textContent = `Blade strike! ${hits} hit${hits === 1 ? "" : "s"} · ${player.damage} damage`;
  }
  function mine(tx, ty) {
    if (Math.abs(tx * tileSize - player.x) > tileSize * 6 || Math.abs(ty * tileSize - player.y) > tileSize * 5) {
      message.textContent = "Too far to mine; move closer."; return;
    }
    const type = tileAt(tx, ty);
    if (!type) return;
    const soil = ["dirt", "grass", "frostgrass", "ashgrass", "mossgrass", "stargrass", "frostdirt", "ashdirt", "mossdirt", "stardirt"];
    const required = ({ wood: 0, stone: 0, froststone: 0, basalt: 0, mossstone: 0, starstone: 0, deepstone: 1, cinderstone: 2, copper: 0, iceore: 1, iron: 1, gold: 2, starore: 3, brick: 4 })[type];
    if (!soil.includes(type) && selectedItem !== pickaxeSlot) {
      message.textContent = "Equip your pickaxe in slot 2 to mine anything tougher than dirt.";
      return;
    }
    if (required !== undefined && player.pickaxeRank < required) {
      message.textContent = `${type} is too tough for your pickaxe. Defeat the next guardian to forge a stronger pickaxe.`;
      return;
    }
    setTile(tx, ty, null);
    let loot = type;
    if (["grass", "frostgrass", "ashgrass", "mossgrass", "stargrass", "frostdirt", "ashdirt", "mossdirt", "stardirt"].includes(type)) loot = "dirt";
    if (["froststone", "basalt", "mossstone", "starstone", "deepstone", "cinderstone"].includes(type)) loot = "stone";
    if (player.inventory[loot] !== undefined) player.inventory[loot]++;
    addParticle(tx * tileSize + 12, ty * tileSize + 12, terrainColors[type] || "#bd9b72", 4);
    miningSwing = .16;
    message.textContent = `Mined ${type}${player.inventory[loot] !== undefined ? ` · ${player.inventory[loot]} ${loot}` : ""}`;
    updateHud();
  }
  function usePotion() {
    if (!player.inventory.potions) { message.textContent = "No healing potions. Enemies and bosses sometimes drop them."; return; }
    if (player.health >= maxHealth()) { message.textContent = "You're already at full health."; return; }
    player.inventory.potions--;
    player.health = Math.min(maxHealth(), player.health + 45);
    player.invulnerable = Math.max(player.invulnerable, .35);
    message.textContent = "Healing potion used · recovered 45 health.";
    updateHud();
  }
  function placeBlock(tx, ty) {
    if (Math.abs(tx * tileSize - player.x) > tileSize * 6 || Math.abs(ty * tileSize - player.y) > tileSize * 5) return;
    const item = materialSlots[selectedItem - firstMaterialSlot];
    if (!item) {
      message.textContent = "Select a block in slots 3–7 before building.";
      return;
    }
    const room = roomAt(tx, ty);
    const block = { x: tx * tileSize, y: ty * tileSize, w: tileSize, h: tileSize };
    if (!player.inventory[item.key] || tileAt(tx, ty) || overlaps(player, block) || room) return;
    setTile(tx, ty, item.tile);
    player.inventory[item.key]--;
    updateHud();
  }
  function triggerBosses() {
    if (activeBoss) return;
    const tx = Math.floor((player.x + player.w / 2) / tileSize);
    const ty = Math.floor((player.y + player.h / 2) / tileSize);
    const room = roomAt(tx, ty);
    if (!room || defeatedBosses.has(room.tier)) return;
    if (player.level < bossLevelRequirement(room.tier)) return;
    const tier = room.tier, hp = 140 + tier * 64;
    const bossNames = ["The Root Warden", "Glacier Maw", "Ashen Colossus", "The Hollow King", "The Star Eater"];
    const bossName = bossNames[(tier - 1) % bossNames.length];
    activeBoss = {
      id: `boss:${tier}`, tier, boss: true, type: `boss${tier}`,
      name: tier <= bossNames.length ? bossName : `${bossName} ${tier}`,
      x: room.centerX * tileSize - 30, y: (room.y + room.height - 4) * tileSize - 48,
      w: 60 + Math.min(tier, 8) * 3, h: 49 + Math.min(tier, 6) * 3,
      vx: 0, vy: 0, grounded: false, hp, maxHp: hp, damage: 13 + tier * 4,
      speed: 35 + tier * 2, xp: 130 + tier * 75, drop: "starore",
      color: weaponColors[(tier - 1) % weaponColors.length], phase: 0,
      hitCooldown: 0, room, biome: biomeAt(room.centerX)
    };
    enemies.set(activeBoss.id, activeBoss);
    message.textContent = `${activeBoss.name} awakens! Fight it inside the boss chamber.`;
  }
  function spawnSurfaceTrees(startX, endX) {
    for (let x = startX; x <= endX; x++) {
      if (hash(x, 0, 62) > .12) continue;
      if (Math.abs(x - nearestVillage(x).centerX) < 17 || Math.abs(x - 18) < 10) continue;
      const top = surfaceAt(x) * tileSize - camera.y, sx = x * tileSize - camera.x;
      const biome = biomeAt(x);
      ctx.fillStyle = "#342d2a";
      ctx.fillRect(sx + 7, top - 47, 11, 51);
      ctx.fillStyle = "#795333";
      ctx.fillRect(sx + 9, top - 47, 7, 48);
      ctx.fillStyle = "#b17b49";
      ctx.fillRect(sx + 10, top - 41, 2, 35);
      const leaf = biome.name === "Frostfall" ? "#a3c2c2" : biome.leaf;
      const canopy = [[-18, -62, 18, 15], [-10, -76, 19, 16], [6, -72, 19, 17], [17, -59, 14, 14], [-1, -88, 17, 15], [-22, -50, 15, 13]];
      for (let i = 0; i < canopy.length; i++) {
        const [dx, dy, width, height] = canopy[i];
        ctx.fillStyle = "#28352f";
        ctx.fillRect(sx + dx + 2, top + dy + 3, width, height);
        ctx.fillStyle = i % 3 === 0 ? leaf : biome.leaf;
        ctx.fillRect(sx + dx, top + dy, width, height);
        ctx.fillStyle = "rgba(227,241,192,.25)";
        ctx.fillRect(sx + dx + 3, top + dy + 2, Math.max(4, width - 8), 3);
      }
      ctx.fillStyle = "#e3e3c2";
      ctx.fillRect(sx - 2, top - 80, 5, 4);
      ctx.fillRect(sx + 17, top - 68, 4, 3);
    }
  }
  function drawVillage(village) {
    const groundY = surfaceAt(village.centerX) * tileSize - camera.y;
    const centerX = village.centerX * tileSize - camera.x;
    const houses = [
      { x: centerX - 142, width: 88, wall: "#896344", roof: "#58413d" },
      { x: centerX + 54, width: 88, wall: "#76664e", roof: "#4c5a48" }
    ];
    for (const house of houses) {
      const top = groundY - 66;
      ctx.fillStyle = "#332b29";
      ctx.fillRect(house.x - 3, top + 10, house.width + 6, 62);
      ctx.fillStyle = "#b28a58";
      ctx.fillRect(house.x - 2, top + 15, 2, 51);
      ctx.fillStyle = house.wall;
      ctx.fillRect(house.x, top + 16, house.width, 49);
      ctx.fillStyle = "rgba(36,28,25,.23)";
      for (let row = 0; row < 3; row++) {
        ctx.fillRect(house.x + 3, top + 28 + row * 12, house.width - 6, 2);
      }
      ctx.fillStyle = "rgba(255,230,174,.18)";
      for (let plank = 0; plank < 5; plank++) {
        const plankX = house.x + 7 + plank * 17;
        ctx.fillRect(plankX, top + 20, 2, 42);
      }
      ctx.fillStyle = "#322b30";
      ctx.beginPath();
      ctx.moveTo(house.x - 10, top + 19);
      ctx.lineTo(house.x + 5, top + 19);
      ctx.lineTo(house.x + 5, top + 11);
      ctx.lineTo(house.x + 20, top + 11);
      ctx.lineTo(house.x + 20, top + 3);
      ctx.lineTo(house.x + house.width / 2 - 13, top + 3);
      ctx.lineTo(house.x + house.width / 2, top - 15);
      ctx.lineTo(house.x + house.width / 2 + 13, top + 3);
      ctx.lineTo(house.x + house.width - 20, top + 3);
      ctx.lineTo(house.x + house.width - 20, top + 11);
      ctx.lineTo(house.x + house.width - 5, top + 11);
      ctx.lineTo(house.x + house.width - 5, top + 19);
      ctx.lineTo(house.x + house.width + 10, top + 19);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = house.roof;
      ctx.beginPath();
      ctx.moveTo(house.x - 6, top + 15);
      ctx.lineTo(house.x + 8, top + 15);
      ctx.lineTo(house.x + 8, top + 7);
      ctx.lineTo(house.x + 24, top + 7);
      ctx.lineTo(house.x + 24, top);
      ctx.lineTo(house.x + house.width / 2 - 12, top);
      ctx.lineTo(house.x + house.width / 2, top - 13);
      ctx.lineTo(house.x + house.width / 2 + 12, top);
      ctx.lineTo(house.x + house.width - 24, top);
      ctx.lineTo(house.x + house.width - 24, top + 7);
      ctx.lineTo(house.x + house.width - 8, top + 7);
      ctx.lineTo(house.x + house.width - 8, top + 15);
      ctx.lineTo(house.x + house.width + 6, top + 15);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(255,235,191,.2)";
      ctx.fillRect(house.x + 11, top + 12, 21, 3);
      ctx.fillRect(house.x + house.width - 31, top + 4, 19, 3);
      ctx.fillStyle = "#c39a5a";
      ctx.fillRect(house.x + 11, top + 25, 21, 19);
      ctx.fillRect(house.x + house.width - 32, top + 25, 21, 19);
      ctx.fillStyle = "#282e31";
      ctx.fillRect(house.x + 14, top + 28, 15, 13);
      ctx.fillRect(house.x + house.width - 29, top + 28, 15, 13);
      ctx.fillStyle = "#9dc2bd";
      ctx.fillRect(house.x + 16, top + 30, 11, 9);
      ctx.fillRect(house.x + house.width - 27, top + 30, 11, 9);
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.fillRect(house.x + 16, top + 30, 11, 2);
      ctx.fillRect(house.x + house.width - 27, top + 30, 11, 2);
      ctx.fillStyle = "#49352a";
      ctx.fillRect(house.x + house.width / 2 - 10, top + 39, 20, 27);
      ctx.fillStyle = "#765238";
      ctx.fillRect(house.x + house.width / 2 - 7, top + 42, 14, 24);
      ctx.fillStyle = "#f3ca76";
      ctx.fillRect(house.x + house.width / 2 + 4, top + 52, 3, 3);
      ctx.fillStyle = "#d6bb82";
      ctx.fillRect(house.x + 10, top + 1, 18, 6);
      ctx.fillStyle = "#f1d29a";
      ctx.fillRect(house.x + 12, top + 2, 11, 2);
    }
    ctx.fillStyle = "#5f452e";
    ctx.fillRect(centerX - 4, groundY - 21, 8, 21);
    ctx.fillStyle = "#eb9a50";
    ctx.fillRect(centerX - 8, groundY - 28, 16, 10);
    ctx.fillStyle = "#ffe49a";
    ctx.fillRect(centerX - 3, groundY - 25, 6, 7);
    ctx.fillStyle = "#3e342c";
    ctx.fillRect(centerX - 37, groundY - 4, 74, 7);
    ctx.fillStyle = "#9c794c";
    ctx.fillRect(centerX - 34, groundY - 4, 68, 2);
    ctx.fillStyle = "#c7a86c";
    ctx.fillRect(centerX - 76, groundY - 35, 3, 35);
    ctx.fillRect(centerX - 92, groundY - 35, 35, 20);
    ctx.fillStyle = "#496747";
    ctx.fillRect(centerX - 80, groundY - 31, 4, 8);
    ctx.fillRect(centerX - 84, groundY - 27, 12, 3);
    const npcX = centerX + 18, npcY = groundY - 31;
    ctx.fillStyle = "#49332d";
    ctx.fillRect(npcX + 3, npcY, 11, 10);
    ctx.fillStyle = "#e3bd8f";
    ctx.fillRect(npcX + 4, npcY + 4, 9, 10);
    ctx.fillStyle = "#d3b05f";
    ctx.fillRect(npcX + 2, npcY + 14, 14, 10);
    ctx.fillStyle = "#463a32";
    ctx.fillRect(npcX + 2, npcY + 24, 5, 7);
    ctx.fillRect(npcX + 10, npcY + 24, 5, 7);
    ctx.fillStyle = "#fff1bd";
    ctx.fillRect(npcX + 6, npcY + 7, 2, 2);
  }
  function drawVillages(left, right) {
    const first = Math.floor(left / villageSpacing) - 1;
    const last = Math.floor(right / villageSpacing) + 1;
    for (let segment = first; segment <= last; segment++) drawVillage(villageAtSegment(segment));
  }
  function drawLockedBossDoors() {
    if (!player) return;
    const left = Math.floor(camera.x / tileSize) - 2;
    const right = Math.ceil((camera.x + canvas.width) / tileSize) + 2;
    const top = Math.floor(camera.y / tileSize) - 1;
    const bottom = Math.ceil((camera.y + canvas.height) / tileSize) + 1;
    const firstTier = Math.max(1, Math.floor((top - 65) / 92) + 1);
    const lastTier = Math.max(firstTier, Math.floor((bottom - 65) / 92) + 1);
    const firstSegment = Math.floor((left - 92) / caveEntranceSpacing) - 1;
    const lastSegment = Math.floor((right - 92) / caveEntranceSpacing) + 1;
    for (let tier = firstTier; tier <= lastTier; tier++) {
      if (player.level >= bossLevelRequirement(tier) || defeatedBosses.has(tier)) continue;
      const roomY = 65 + (tier - 1) * 92 + 12;
      if (roomY > bottom || roomY + 5 < top) continue;
      for (let segment = firstSegment; segment <= lastSegment; segment++) {
        const roomX = caveEntranceAtSegment(segment) - 57 + (tier * 47 % 112);
        const screenX = roomX * tileSize - camera.x;
        const screenY = roomY * tileSize - camera.y;
        for (const doorX of [screenX, screenX + 27 * tileSize]) {
          ctx.fillStyle = "#302b32";
          ctx.fillRect(doorX, screenY, 3 * tileSize, 5 * tileSize);
          ctx.fillStyle = "#665143";
          for (let plank = 0; plank < 3; plank++) {
            ctx.fillRect(doorX + 4 + plank * 22, screenY + 2, 17, 5 * tileSize - 4);
            ctx.fillStyle = "#b08a5d";
            ctx.fillRect(doorX + 4 + plank * 22, screenY + 2, 2, 5 * tileSize - 4);
            ctx.fillStyle = "#665143";
          }
          ctx.fillStyle = "#d5b66c";
          ctx.fillRect(doorX + 28, screenY + 38, 17, 22);
          ctx.fillRect(doorX + 24, screenY + 34, 25, 6);
          ctx.fillStyle = "#463b31";
          ctx.fillRect(doorX + 33, screenY + 44, 7, 11);
          ctx.fillStyle = "#f4dfa0";
          ctx.fillRect(doorX + 35, screenY + 47, 3, 3);
        }
      }
    }
  }
  function drawCaveEntrances(left, right) {
    const first = Math.floor((left - 92) / caveEntranceSpacing) - 1;
    const last = Math.floor((right - 92) / caveEntranceSpacing) + 1;
    for (let segment = first; segment <= last; segment++) {
      const entranceX = caveEntranceAtSegment(segment);
      const surfaceTileY = surfaceAt(entranceX);
      if (entranceX + 3 < left || entranceX - 3 > right
        || surfaceTileY + 3 < Math.floor(camera.y / tileSize)
        || surfaceTileY - 4 > Math.ceil((camera.y + canvas.height) / tileSize)) continue;
      const biome = biomeAt(entranceX);
      const openingLeft = entranceX - 1;
      const openingTop = surfaceTileY - 2;
      const openingWidth = 3;
      const openingHeight = 5;
      const openingX = Math.round(openingLeft * tileSize - camera.x);
      const openingY = Math.round(openingTop * tileSize - camera.y);

      ctx.fillStyle = "#10151d";
      ctx.fillRect(openingX, openingY, openingWidth * tileSize, openingHeight * tileSize);
      ctx.fillStyle = "#171b24";
      ctx.fillRect(openingX + 2, openingY + 2, openingWidth * tileSize - 4, openingHeight * tileSize - 4);
      ctx.fillStyle = "rgba(7,10,16,.55)";
      ctx.fillRect(openingX + 5, openingY + 5, tileSize - 7, openingHeight * tileSize - 10);
      ctx.fillRect(openingX + tileSize * 2 + 2, openingY + 5, tileSize - 7, openingHeight * tileSize - 10);

      const frameCells = [
        [-2, -3], [-1, -3], [0, -3], [1, -3], [2, -3],
        [-2, -2], [2, -2],
        [-2, -1], [2, -1], [-2, 0], [2, 0],
        [-2, 1], [2, 1], [-2, 2], [2, 2]
      ];
      for (const [offsetX, offsetY] of frameCells) {
        drawTile(biome.stone, entranceX + offsetX, surfaceTileY + offsetY);
      }

      const trim = biome.name === "Frostfall" ? "#d9eff0"
        : biome.name === "Cinderwild" ? "#db9a70"
        : biome.name === "Mossveil" ? "#9cc58a"
        : biome.name === "Starhollow" ? "#cab5f3" : "#a8c878";
      const torchX = Math.round((entranceX + 2) * tileSize - camera.x);
      const torchY = Math.round((surfaceTileY - 1) * tileSize - camera.y);
      ctx.fillStyle = "#503827";
      ctx.fillRect(torchX + 5, torchY + 5, 5, 13);
      ctx.fillStyle = "#f5b960";
      ctx.fillRect(torchX + 5, torchY, 5, 8);
      ctx.fillStyle = "#fff1bd";
      ctx.fillRect(torchX + 7, torchY + 2, 2, 4);
      ctx.fillStyle = trim;
      ctx.fillRect(openingX - 2, openingY + tileSize * 2, 3, 5);
      ctx.fillRect(openingX + openingWidth * tileSize - 1, openingY + tileSize * 3, 3, 5);
    }
  }
  function drawVillageTitle(village, alpha) {
    if (!village || alpha <= 0) return;
    const centerX = canvas.width / 2;
    const panelWidth = Math.min(canvas.width - 48, 760);
    ctx.save();
    ctx.globalAlpha = alpha;
    const backdrop = ctx.createRadialGradient(centerX, 100, 25, centerX, 100, panelWidth * .52);
    backdrop.addColorStop(0, "rgba(12,18,33,.27)");
    backdrop.addColorStop(.55, "rgba(12,18,33,.12)");
    backdrop.addColorStop(1, "rgba(12,18,33,0)");
    ctx.fillStyle = backdrop;
    ctx.fillRect(centerX - panelWidth / 2, 18, panelWidth, 140);

    ctx.strokeStyle = "rgba(244,239,222,.88)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(12,18,33,.9)";
    ctx.shadowBlur = 10;
    const flourishY = 48;
    for (const direction of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(centerX + direction * 13, flourishY);
      ctx.bezierCurveTo(centerX + direction * 35, flourishY - 19, centerX + direction * 54, flourishY + 17, centerX + direction * 82, flourishY);
      ctx.bezierCurveTo(centerX + direction * 103, flourishY - 15, centerX + direction * 122, flourishY + 13, centerX + direction * 145, flourishY);
      ctx.bezierCurveTo(centerX + direction * 161, flourishY - 9, centerX + direction * 176, flourishY + 7, centerX + direction * 193, flourishY);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX + direction * 82, flourishY, 5, Math.PI * .15, Math.PI * 1.8);
      ctx.stroke();
    }
    ctx.fillStyle = "#f4efde";
    ctx.beginPath();
    ctx.moveTo(centerX, flourishY - 10);
    ctx.lineTo(centerX + 7, flourishY);
    ctx.lineTo(centerX, flourishY + 10);
    ctx.lineTo(centerX - 7, flourishY);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowBlur = 11;
    ctx.fillStyle = "#f1eee8";
    ctx.font = `500 ${Math.min(49, Math.max(34, 610 / village.name.length))}px Georgia, "Times New Roman", serif`;
    ctx.letterSpacing = "5px";
    ctx.fillText(village.name.toUpperCase(), centerX, 91, panelWidth - 80);

    ctx.shadowBlur = 8;
    ctx.fillStyle = "#d9d7d0";
    ctx.font = "14px Georgia, 'Times New Roman', serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("THE BLOOMING HAMLET", centerX, 119, panelWidth - 90);

    ctx.strokeStyle = "rgba(244,239,222,.75)";
    ctx.lineWidth = 1.5;
    const dividerY = 145;
    for (const direction of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(centerX + direction * 15, dividerY);
      ctx.bezierCurveTo(centerX + direction * 36, dividerY - 12, centerX + direction * 58, dividerY + 11, centerX + direction * 80, dividerY);
      ctx.bezierCurveTo(centerX + direction * 104, dividerY - 8, centerX + direction * 128, dividerY + 8, centerX + direction * 155, dividerY);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(centerX, dividerY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  function drawTile(type, tx, ty) {
    const x = Math.round(tx * tileSize - camera.x), y = Math.round(ty * tileSize - camera.y);
    const color = terrainColors[type] || terrainColors[biomeAt(tx).stone] || "#6d6c6d";
    const palette = tilePalettes[type] || [color, "#34343a", "#aaa79b", "#d0c8ae"];
    ctx.fillStyle = palette[1];
    ctx.fillRect(x, y, tileSize, tileSize);
    ctx.fillStyle = palette[0];
    ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
    ctx.fillStyle = "rgba(255,244,208,.16)";
    ctx.fillRect(x + 2, y + 2, tileSize - 4, 2);
    ctx.fillRect(x + 2, y + 2, 2, tileSize - 4);
    ctx.fillStyle = "rgba(16,21,24,.22)";
    ctx.fillRect(x + 2, y + tileSize - 4, tileSize - 4, 2);
    ctx.fillRect(x + tileSize - 4, y + 2, 2, tileSize - 4);
    if (type.includes("grass")) {
      const biome = biomeAt(tx);
      const cap = type === "frostgrass" ? "#d9e7dc" : type === "ashgrass" ? "#b97759" : type === "mossgrass" ? "#78a878" : type === "stargrass" ? "#a99add" : "#91b753";
      ctx.fillStyle = "#344137";
      ctx.fillRect(x, y, tileSize, 7);
      ctx.fillStyle = biome.leaf;
      ctx.fillRect(x + 2, y + 1, tileSize - 4, 4);
      ctx.fillStyle = cap;
      ctx.fillRect(x + 3, y + 1, tileSize - 7, 2);
      ctx.fillStyle = "rgba(28,38,28,.48)";
      ctx.fillRect(x + 2, y + 6, tileSize - 4, 2);
      for (let tuft = 0; tuft < 3; tuft++) {
        const tuftX = x + 3 + Math.floor(hash(tx, ty, 210 + tuft) * (tileSize - 7));
        ctx.fillStyle = cap;
        ctx.fillRect(tuftX, y - (tuft % 2), 2, 3 + (tuft % 2));
      }
    }
    if (type === "brick") {
      ctx.fillStyle = "rgba(36,28,30,.35)";
      ctx.fillRect(x + 2, y + 11, tileSize - 4, 2);
      ctx.fillRect(x + 10, y + 2, 2, 9);
      ctx.fillRect(x + 17, y + 13, 2, 9);
      ctx.fillStyle = "#c5a475";
      ctx.fillRect(x + 4, y + 4, 5, 2);
      ctx.fillRect(x + 15, y + 16, 5, 2);
    } else {
      for (let fleck = 0; fleck < 4; fleck++) {
        const fx = 4 + Math.floor(hash(tx, ty, fleck + 15) * (tileSize - 9));
        const fy = (type.includes("grass") ? 10 : 4) + Math.floor(hash(ty, tx, fleck + 39) * (tileSize - 10));
        ctx.fillStyle = fleck % 2 ? palette[2] : palette[3];
        ctx.fillRect(x + fx, y + fy, fleck % 3 === 0 ? 4 : 3, 2);
        ctx.fillStyle = "rgba(27,30,31,.18)";
        ctx.fillRect(x + fx + 1, y + fy + 2, fleck % 3 === 0 ? 3 : 2, 1);
      }
      if (["stone", "froststone", "basalt", "mossstone", "starstone", "deepstone", "cinderstone"].includes(type)) {
        const chipX = x + 5 + Math.floor(hash(tx, ty, 73) * 10);
        const chipY = y + 5 + Math.floor(hash(ty, tx, 74) * 10);
        ctx.fillStyle = "rgba(235,231,207,.25)";
        ctx.fillRect(chipX, chipY, 5, 2);
        ctx.fillRect(chipX, chipY + 2, 2, 3);
        ctx.fillStyle = "rgba(26,29,34,.3)";
        ctx.fillRect(chipX + 3, chipY + 2, 3, 2);
      }
      if (["copper", "iron", "gold", "starore", "iceore"].includes(type)) {
        ctx.fillStyle = palette[2];
        ctx.fillRect(x + 7, y + 5, 4, 4);
        ctx.fillRect(x + 11, y + 9, 4, 4);
        ctx.fillStyle = palette[3];
        ctx.fillRect(x + 8, y + 6, 2, 2);
        ctx.fillRect(x + 12, y + 10, 2, 2);
      }
    }
    ctx.fillStyle = "rgba(12,17,20,.28)";
    ctx.fillRect(x, y + tileSize - 2, tileSize, 2);
    ctx.fillRect(x + tileSize - 2, y, 2, tileSize);
  }
  function drawBackground() {
    const playerTx = Math.floor(player.x / tileSize), biome = biomeAt(playerTx);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, biome.sky[0]); gradient.addColorStop(1, biome.sky[1]);
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const surfaceY = surfaceAt(playerTx) * tileSize - camera.y;
    if (surfaceY > -80) {
      ctx.fillStyle = biome.name === "Frostfall" ? "#d6edf0" : "#ffefba";
      ctx.beginPath(); ctx.arc(canvas.width * .78 - camera.x * .035, 90 - camera.y * .05, 29, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 5; i++) {
        const cx = ((i * 311 - camera.x * .12) % (canvas.width + 150) + canvas.width + 150) % (canvas.width + 150) - 70;
        const cy = 120 + i % 3 * 42;
        ctx.fillStyle = "rgba(230,239,222,.12)";
        ctx.fillRect(cx, cy + 8, 70, 10); ctx.fillRect(cx + 15, cy, 43, 13);
      }
      for (let i = 0; i < 38; i++) {
        const sx = (i * 197 + 61) % canvas.width, sy = (i * 83 + 29) % Math.max(10, Math.min(canvas.height, surfaceY));
        ctx.fillStyle = i % 4 === 0 ? "#fff0c1" : "rgba(235,239,210,.48)";
        ctx.fillRect(sx, sy, i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1);
      }
    } else {
      ctx.fillStyle = "#d2c7ed";
      for (let i = 0; i < 70; i++) ctx.fillRect(hash(i, Math.floor(camera.y / 300), 22) * canvas.width, hash(i, Math.floor(camera.y / 300), 44) * canvas.height, 2, 2);
    }
    const horizon = Math.min(canvas.height + 30, Math.max(-120, surfaceY));
    if (horizon > -70) {
      for (let i = 0; i < 9; i++) {
        const mx = ((i * 181 - camera.x * .2) % (canvas.width + 220) + canvas.width + 220) % (canvas.width + 220) - 110;
        const peak = horizon - 160 + i * 19 % 65;
        ctx.fillStyle = i % 2 ? "#35494a" : "#40544e";
        ctx.beginPath(); ctx.moveTo(mx - 110, horizon + 16); ctx.lineTo(mx, peak); ctx.lineTo(mx + 110, horizon + 16); ctx.closePath(); ctx.fill();
      }
    }
  }
  function drawTorch(torch, index) {
    const x = torch.x - camera.x, y = torch.y - camera.y;
    ctx.fillStyle = "#503827"; ctx.fillRect(x + 5, y + 5, 5, 13);
    ctx.fillStyle = index % 2 ? "#ff9f52" : "#ffe17d"; ctx.fillRect(x + 5, y, 5, 8);
    ctx.fillStyle = "#fff3ba"; ctx.fillRect(x + 7, y + 2, 2, 4);
  }
  function drawTiles() {
    const left = Math.floor(camera.x / tileSize) - 1, right = Math.ceil((camera.x + canvas.width) / tileSize) + 1;
    const top = Math.max(0, Math.floor(camera.y / tileSize) - 1), bottom = Math.floor((camera.y + canvas.height) / tileSize) + 1;
    for (let ty = top; ty <= bottom; ty++) {
      for (let tx = left; tx <= right; tx++) {
        const type = tileAt(tx, ty);
        if (type !== null) {
          drawTile(type, tx, ty);
        } else if (ty >= surfaceAt(tx)) {
          const x = Math.round(tx * tileSize - camera.x);
          const y = Math.round(ty * tileSize - camera.y);
          ctx.fillStyle = ty >= 700 ? "#11131d" : "#151923";
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      }
    }
    spawnSurfaceTrees(left, right);
    drawVillages(left, right);
    drawCaveEntrances(left, right);
    for (const enemy of enemies.values()) {
      const room = enemy.room;
      if (!room) continue;
      for (let i = 0; i < 5; i++) {
        const tx = room.x + 4 + i * 5, ty = room.y + room.height - 3;
        ctx.fillStyle = "#6a4930"; ctx.fillRect(tx * tileSize - camera.x + 7, ty * tileSize - camera.y - 20, 7, 20);
        ctx.fillStyle = "#f4b65f"; ctx.fillRect(tx * tileSize - camera.x + 6, ty * tileSize - camera.y - 27, 9, 9);
      }
    }
    for (let x = left; x <= right; x++) {
      for (let y = Math.max(0, top); y <= bottom; y++) {
        if (tileAt(x, y) !== null || tileAt(x, y + 1) === null || y < surfaceAt(x) - 1 || hash(x, y, 97) > .015) continue;
        const sx = x * tileSize - camera.x, sy = y * tileSize - camera.y;
        ctx.fillStyle = hash(x, y, 98) > .5 ? "#e9b875" : "#c98491";
        ctx.fillRect(sx + 8, sy + 3, 5, 5); ctx.fillStyle = "#59794d"; ctx.fillRect(sx + 10, sy + 8, 2, 7);
      }
    }
    if (camera.y > 60) {
      const darkness = Math.min(.76, (camera.y - 60) / 950);
      ctx.fillStyle = `rgba(8,12,24,${darkness})`; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const px = player.x - camera.x + player.w / 2, py = player.y - camera.y + player.h / 2;
      const glow = ctx.createRadialGradient(px, py, 20, px, py, 265);
      glow.addColorStop(0, "rgba(255,204,128,.5)"); glow.addColorStop(.24, "rgba(247,157,83,.22)"); glow.addColorStop(1, "rgba(247,157,83,0)");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    caveTorches.forEach(drawTorch);
  }
  function drawEnemy(enemy) {
    const x = Math.round(enemy.x - camera.x), y = Math.round(enemy.y - camera.y);
    if (x + enemy.w < -30 || x > canvas.width + 30 || y + enemy.h < -30 || y > canvas.height + 30) return;
    if (enemy.boss) {
      const pulse = Math.sin(performance.now() * .004 + enemy.phase) * 3;
      ctx.fillStyle = "#201e2b"; ctx.fillRect(x + 8, y + 12, enemy.w - 16, enemy.h - 13);
      ctx.fillStyle = enemy.color; ctx.fillRect(x + 5, y + 9 + pulse, enemy.w - 10, enemy.h - 13);
      ctx.fillStyle = "#f4e3ba"; ctx.fillRect(x + enemy.w * .31, y + 20, 5, 5); ctx.fillRect(x + enemy.w * .67, y + 20, 5, 5);
      ctx.fillStyle = "#292534"; ctx.fillRect(x + enemy.w * .31 + 1, y + 21, 2, 3); ctx.fillRect(x + enemy.w * .67 + 1, y + 21, 2, 3);
      ctx.fillStyle = "#f1c96e"; ctx.fillRect(x + enemy.w * .22, y + 4, 7, 11); ctx.fillRect(x + enemy.w * .69, y + 2, 7, 13);
      ctx.fillStyle = "#3e3542"; ctx.fillRect(x, y + enemy.h - 9, enemy.w, 9);
      ctx.fillStyle = enemy.color; ctx.fillRect(x + 2, y + enemy.h - 8, Math.max(0, (enemy.w - 4) * enemy.hp / enemy.maxHp), 5);
      ctx.fillStyle = "#faf0d0"; ctx.font = "bold 15px Georgia"; ctx.textAlign = "center";
      ctx.fillText(`${enemy.name} · TIER ${enemy.tier}`, x + enemy.w / 2, y - 10);
      return;
    }
    ctx.fillStyle = "#26342d"; ctx.fillRect(x + 2, y + 8, enemy.w - 4, enemy.h - 7);
    ctx.fillStyle = enemy.color; ctx.fillRect(x + 3, y + 5, enemy.w - 6, enemy.h - 7);
    if (enemy.type === "frostbat") {
      ctx.fillStyle = "#719fbd";
      ctx.fillRect(x - 6, y + 7, 9, 4); ctx.fillRect(x - 4, y + 11, 7, 5);
      ctx.fillRect(x + enemy.w - 3, y + 7, 9, 4); ctx.fillRect(x + enemy.w - 3, y + 11, 7, 5);
      ctx.fillStyle = "#e9c9ee"; ctx.fillRect(x + 8, y + 1, 4, 5);
    } else if (enemy.type === "fangbeetle" || enemy.type === "cavernite") {
      ctx.fillStyle = enemy.type === "fangbeetle" ? "#d0b880" : "#c2b9a2";
      ctx.fillRect(x + 5, y + 3, 5, 5); ctx.fillRect(x + 13, y + 2, 5, 6);
      ctx.fillStyle = "#344239"; ctx.fillRect(x + 4, y + 17, 4, 4); ctx.fillRect(x + 15, y + 17, 4, 4);
    } else if (enemy.type === "emberling") {
      ctx.fillStyle = "#ffd176"; ctx.fillRect(x + 5, y, 4, 7); ctx.fillRect(x + 13, y, 4, 7);
      ctx.fillStyle = "#f4ddba"; ctx.fillRect(x + 8, y + 9, 3, 3); ctx.fillRect(x + 15, y + 9, 3, 3);
    } else if (enemy.type === "voidwisp" || enemy.type === "starling") {
      ctx.fillStyle = "#eee2ff";
      ctx.fillRect(x + 9, y, 4, 5); ctx.fillRect(x + 4, y + 8, 4, 4);
      ctx.fillRect(x + 16, y + 8, 4, 4); ctx.fillRect(x + 9, y + 17, 4, 4);
      ctx.fillStyle = "#261f43"; ctx.fillRect(x + 9, y + 8, 3, 5); ctx.fillRect(x + 15, y + 8, 3, 5);
    }
    ctx.fillStyle = "#d8efc5"; ctx.fillRect(x + 6, y + 9, 3, 4); ctx.fillRect(x + enemy.w - 9, y + 9, 3, 4);
    ctx.fillStyle = "#344239"; ctx.fillRect(x + 7, y + 10, 2, 2); ctx.fillRect(x + enemy.w - 8, y + 10, 2, 2);
    if (enemy.hp < enemy.maxHp) {
      ctx.fillStyle = "#281d26"; ctx.fillRect(x, y - 6, enemy.w, 3);
      ctx.fillStyle = "#e67c76"; ctx.fillRect(x + 1, y - 5, (enemy.w - 2) * enemy.hp / enemy.maxHp, 1);
    }
  }
  function drawPlayer() {
    const x = Math.round(player.x - camera.x), y = Math.round(player.y - camera.y);
    if (player.invulnerable > 0 && Math.floor(player.invulnerable * 14) % 2) ctx.globalAlpha = .45;
    const step = player.grounded && Math.abs(player.vx) > 0 ? Math.sin(performance.now() * .019) * 2 : 0;
    const armor = weaponColors[Math.min(4, player.weaponRank)];
    const facingX = facing > 0 ? x : x + 16;
    ctx.fillStyle = "rgba(11,15,20,.45)";
    ctx.fillRect(x, y + 30, 18, 3);

    ctx.fillStyle = "#322b30";
    ctx.fillRect(x + 3, y + 5, 12, 12);
    ctx.fillRect(x + 5, y + 2, 8, 4);
    ctx.fillStyle = "#503728";
    ctx.fillRect(x + 2, y + 3, 12, 4);
    ctx.fillRect(x + 4, y + 1, 8, 3);
    ctx.fillStyle = "#72523a";
    ctx.fillRect(x + 4, y + 2, 7, 2);
    ctx.fillStyle = "#e3bd8f";
    ctx.fillRect(x + 5, y + 7, 8, 9);
    ctx.fillStyle = "#c89170";
    ctx.fillRect(x + (facing > 0 ? 5 : 11), y + 12, 3, 3);
    ctx.fillStyle = "#f8e6bd";
    ctx.fillRect(x + (facing > 0 ? 11 : 4), y + 9, 2, 2);
    ctx.fillStyle = "#49332d";
    ctx.fillRect(x + 6, y + 15, 6, 2);

    ctx.fillStyle = "#26332f";
    ctx.fillRect(x + 3, y + 17, 12, 10);
    ctx.fillStyle = armor;
    ctx.fillRect(x + 4, y + 17, 10, 8);
    ctx.fillStyle = "rgba(255,244,208,.42)";
    ctx.fillRect(x + 5, y + 18, 7, 2);
    ctx.fillStyle = "rgba(24,30,31,.38)";
    ctx.fillRect(x + 4, y + 23, 10, 2);
    ctx.fillStyle = "#d1b273";
    ctx.fillRect(x + 3, y + 25, 12, 2);
    ctx.fillStyle = "#765238";
    ctx.fillRect(x + 8, y + 18, 2, 4);

    ctx.fillStyle = "#6b482f";
    ctx.fillRect(x + 1, y + 18, 3, 8);
    ctx.fillStyle = "#b16b59";
    ctx.fillRect(x + 2, y + 20, 2, 5);
    ctx.fillStyle = "#e3bd8f";
    ctx.fillRect(facing > 0 ? x + 13 : x + 1, y + 21, 3, 4);
    ctx.fillStyle = "#526044";
    ctx.fillRect(x + 4, y + 27 + Math.round(step), 4, 4);
    ctx.fillRect(x + 10, y + 27 - Math.round(step), 4, 4);
    ctx.fillStyle = "#3b302b";
    ctx.fillRect(x + 3, y + 30 + Math.round(step), 6, 2);
    ctx.fillRect(x + 9, y + 30 - Math.round(step), 6, 2);
    ctx.fillStyle = "#8b6843";
    ctx.fillRect(x + 4, y + 28 + Math.round(step), 3, 1);
    ctx.fillRect(x + 10, y + 28 - Math.round(step), 3, 1);

    ctx.fillStyle = "#d8c28e";
    ctx.fillRect(facingX + 1, y + 17, 2, 2);
    ctx.fillRect(facingX + 1, y + 24, 2, 2);
    if (selectedItem === swordSlot && player.attackTimer > 0) {
      const swordX = x + (facing > 0 ? 15 : -23), swing = Math.sin(player.attackTimer * 18) * 7;
      ctx.save(); ctx.translate(swordX + 7, y + 19); ctx.rotate(facing * (-.55 - swing * .025));
      drawSwordShape(weaponColors[Math.min(4, player.weaponRank)]);
      ctx.restore();
    } else if (selectedItem === swordSlot) {
      ctx.save();
      ctx.translate(x + (facing > 0 ? 17 : -4), y + 20);
      ctx.rotate(facing > 0 ? -.72 : .72);
      drawSwordShape(weaponColors[Math.min(4, player.weaponRank)]);
      ctx.restore();
    } else if (selectedItem === pickaxeSlot) {
      ctx.save();
      ctx.translate(x + (facing > 0 ? 16 : 1), y + 19);
      ctx.rotate(facing * -.55);
      ctx.fillStyle = "#996938"; ctx.fillRect(0, 0, 3, 13);
      ctx.fillStyle = weaponColors[Math.min(4, player.pickaxeRank)];
      ctx.fillRect(-6, -3, 15, 4); ctx.fillRect(-7, -6, 4, 5);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (mouseTile) {
      const tx = mouseTile.x * tileSize - camera.x, ty = mouseTile.y * tileSize - camera.y;
      ctx.strokeStyle = Math.abs(mouseTile.x * tileSize - player.x) < tileSize * 6 ? "#ffe39b" : "#ff9277";
      ctx.lineWidth = 2; ctx.strokeRect(Math.round(tx) + 1, Math.round(ty) + 1, tileSize - 2, tileSize - 2);
    }
  }
  function render() {
    drawBackground();
    drawTiles();
    drawLockedBossDoors();
    const titleAlpha = villageTitleTime > 0
      ? Math.min(1, villageTitleTime / villageTitleFadeDuration)
      : 0;
    drawVillageTitle(villageNearPlayer(), titleAlpha);
    for (const enemy of enemies.values()) drawEnemy(enemy);
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color; ctx.fillRect(p.x - camera.x, p.y - camera.y, 4, 4);
    }
    ctx.globalAlpha = 1;
    drawPlayer();
  }
  function resizeCanvas() {
    const width = Math.floor(canvas.clientWidth);
    const height = Math.floor(canvas.clientHeight);
    if (!width || !height || (canvas.width === width && canvas.height === height)) return;
    canvas.width = width;
    canvas.height = height;
    if (player) render();
  }
  function update(dt) {
    if (paused) return;
    dt = Math.min(dt, .035);
    ensureWorld();
    const direction = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0);
    player.vx = direction * 190;
    if (direction) facing = direction;
    if ((keys.Space || keys.ArrowUp || keys.KeyW) && player.grounded) {
      player.vy = -420;
      player.grounded = false;
    }
    const previousX = player.x, previousY = player.y, previousGrounded = player.grounded;
    const previousRoom = roomAt(
      Math.floor((player.x + player.w / 2) / tileSize),
      Math.floor((player.y + player.h / 2) / tileSize)
    );
    moveEntity(player, dt);
    player.x = Math.max(-Number.MAX_SAFE_INTEGER / 100, Math.min(Number.MAX_SAFE_INTEGER / 100, player.x));
    const playerRoom = roomAt(
      Math.floor((player.x + player.w / 2) / tileSize),
      Math.floor((player.y + player.h / 2) / tileSize)
    );
    if (playerRoom && playerRoom.tier !== (previousRoom && previousRoom.tier)
      && player.level < bossLevelRequirement(playerRoom.tier)) {
      player.x = previousX;
      player.y = previousY;
      player.grounded = previousGrounded;
      player.vx = 0;
      player.vy = 0;
      message.textContent = `The level ${playerRoom.tier} guardian seals this chamber. Reach level ${bossLevelRequirement(playerRoom.tier)} to enter.`;
    }
    const currentBiome = biomeAt(Math.floor((player.x + player.w / 2) / tileSize)).name;
    const currentLayer = layerAt(Math.floor(player.y / tileSize));
    if (currentBiome !== displayedBiome || currentLayer !== displayedLayer) updateHud();
    updateBossCompass();
    const nearbyVillage = villageNearPlayer();
    const nearbyVillageId = nearbyVillage ? nearbyVillage.id : null;
    if (nearbyVillageId !== currentTitleVillageId) {
      currentTitleVillageId = nearbyVillageId;
      villageTitleTime = nearbyVillage ? villageTitleDuration : 0;
    } else if (villageTitleTime > 0) {
      villageTitleTime = Math.max(0, villageTitleTime - dt);
    }
    updateVillageHud();
    const currentPlayerRoom = roomAt(
      Math.floor((player.x + player.w / 2) / tileSize),
      Math.floor((player.y + player.h / 2) / tileSize)
    );
    if (currentPlayerRoom && currentPlayerRoom.tier > 0 && !defeatedBosses.has(currentPlayerRoom.tier)) triggerBosses();
    for (const enemy of enemies.values()) {
      const dx = player.x - enemy.x, dy = player.y - enemy.y;
      if (Math.abs(dx) > 1300 || Math.abs(dy) > 900) continue;
      enemy.hitCooldown = Math.max(0, enemy.hitCooldown - dt);
      if (enemy.boss) {
        enemy.phase += dt;
        enemy.vx = Math.abs(dx) < 720 ? Math.sign(dx) * enemy.speed : 0;
        if (enemy.grounded && Math.abs(dx) < 560 && enemy.phase % 2.8 < dt * 2) enemy.vy = -345 - Math.min(95, enemy.tier * 7);
      } else {
        const activeRange = 700;
        enemy.vx = Math.abs(dx) < activeRange && Math.abs(dy) < 420 ? Math.sign(dx) * enemy.speed : Math.sin(enemy.phase += dt) * 20;
        if (enemy.grounded && Math.abs(dx) < 330 && enemy.phase % 2.2 < dt * 2) enemy.vy = -245;
      }
      moveEntity(enemy, dt);
      if (overlaps(player, enemy) && enemy.hitCooldown <= 0) {
        enemy.hitCooldown = enemy.boss ? 1.1 : 1.3;
        hurtPlayer(enemy.damage, player.x < enemy.x ? -1 : 1);
      }
    }
    player.attackCooldown = Math.max(0, player.attackCooldown - dt);
    player.attackTimer = Math.max(0, player.attackTimer - dt);
    player.invulnerable = Math.max(0, player.invulnerable - dt);
    miningSwing = Math.max(0, miningSwing - dt);
    particles = particles.filter(p => p.life > 0);
    for (const p of particles) { p.life -= dt; p.vy += 360 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
    const worldWidth = canvas.width, worldHeight = canvas.height;
    camera.x += (player.x - worldWidth * .42 - camera.x) * Math.min(1, dt * 6);
    camera.y = Math.max(0, camera.y + (player.y - worldHeight * .48 - camera.y) * Math.min(1, dt * 5));
    saveTimer += dt;
    if (saveTimer >= 5) { saveTimer = 0; saveGame(); updateHud(); }
  }
  function showOverlay(title, text, button) {
    document.getElementById("overlayTitle").textContent = title;
    document.getElementById("overlayText").textContent = text;
    document.getElementById("resumeButton").textContent = button || "Keep exploring";
    overlay.hidden = false;
  }
  function startGame(loadSave) {
    const loaded = initializeGame(loadSave);
    if (loadSave && !loaded) {
      document.getElementById("menuStatus").textContent = "No readable save was found. Choose New Game to start an adventure.";
      refreshMenuSaveState();
      return false;
    }
    menu.hidden = true; gameShell.hidden = false; overlay.hidden = true;
    document.body.classList.add("game-active");
    resizeCanvas();
    paused = false; lastTime = performance.now(); render();
    if (!loadSave) saveGame();
    return true;
  }
  function refreshMenuSaveState() {
    const loadButton = document.getElementById("loadGameButton");
    try {
      const hasSave = localStorage.getItem(saveKey) !== null || localStorage.getItem(backupSaveKey) !== null;
      loadButton.disabled = !hasSave;
      document.getElementById("menuStatus").textContent = hasSave
        ? "A saved adventure is ready to load."
        : "No saved adventure yet. Start a new game to begin.";
    } catch (error) {
      console.error("Teressa could not check for a saved adventure.", error);
      loadButton.disabled = true;
      document.getElementById("menuStatus").textContent = "Saved-game storage is unavailable in this browser.";
    }
  }
  function respawn() {
    defeatedEnemies.clear();
    enemies.clear(); spawnedChunks.clear(); activeBoss = null;
    player.x = player.spawnX;
    player.y = player.spawnY;
    player.health = maxHealth();
    player.invulnerable = 1.4;
    ensureWorld();
    updateHud(); saveGame();
    overlay.hidden = true; paused = false; lastTime = performance.now();
    message.textContent = "Back at your saved spawn. Your level, gear, and boss victories are saved.";
  }
  document.getElementById("loadGameButton").addEventListener("click", () => startGame(true));
  document.getElementById("newGameButton").addEventListener("click", () => {
    let hasSave = false;
    try {
      hasSave = localStorage.getItem(saveKey) !== null || localStorage.getItem(backupSaveKey) !== null;
    } catch (error) {
      console.error("Teressa could not check whether a new game will replace a save.", error);
    }
    if (hasSave && !window.confirm("Start a new adventure? This will replace your current saved game.")) return;
    startGame(false);
  });
  refreshMenuSaveState();
  const assignmentAnswerList = document.getElementById("assignmentAnswerList");
  for (const answer of window.TERESSA_ASSIGNMENT_ANSWERS || []) {
    if (!answer || typeof answer.title !== "string" || !Array.isArray(answer.paragraphs)) continue;
    const article = document.createElement("article");
    const heading = document.createElement("h2");
    heading.textContent = answer.title;
    article.className = "answer";
    article.append(heading);
    for (const text of answer.paragraphs) {
      if (typeof text !== "string") continue;
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      article.append(paragraph);
    }
    assignmentAnswerList.append(article);
  }
  document.getElementById("assignmentButton").addEventListener("click", () => { answers.hidden = false; });
  document.getElementById("closeAnswers").addEventListener("click", () => { answers.hidden = true; });
  const creditsDialog = document.getElementById("creditsDialog");
  const creditsList = document.getElementById("creditsList");
  for (const credit of window.TERESSA_CREDITS || []) {
    if (!credit || typeof credit.name !== "string" || typeof credit.role !== "string") continue;
    const item = document.createElement("li");
    const role = document.createElement("strong");
    const name = document.createElement("span");
    role.textContent = credit.role;
    name.textContent = credit.name;
    item.append(role, name);
    creditsList.append(item);
  }
  document.getElementById("creditsButton").addEventListener("click", () => creditsDialog.showModal());
  document.getElementById("closeCredits").addEventListener("click", () => creditsDialog.close());
  document.getElementById("menuButton").addEventListener("click", () => {
    saveGame(); paused = true; gameShell.hidden = true; menu.hidden = false; answers.hidden = true;
    document.body.classList.remove("game-active");
    if (document.fullscreenElement) document.exitFullscreen().catch(error => console.error("Teressa could not exit fullscreen mode.", error));
    refreshMenuSaveState();
  });
  const fullscreenButton = document.getElementById("fullscreenButton");
  fullscreenButton.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await gameShell.requestFullscreen();
    } catch (error) {
      console.error("Teressa could not change fullscreen mode.", error);
      message.textContent = "Fullscreen is unavailable. You can still play in the full app window.";
    }
  });
  document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement ? "Exit fullscreen" : "Fullscreen";
    resizeCanvas();
  });
  window.addEventListener("resize", resizeCanvas);
  const progressionGuide = document.getElementById("progressionGuide");
  const toolProgressionToggle = document.getElementById("toolProgressionToggle");
  const toolProgression = document.getElementById("toolProgression");
  toolProgressionToggle.addEventListener("click", () => {
    const expanded = toolProgressionToggle.getAttribute("aria-expanded") === "true";
    toolProgressionToggle.setAttribute("aria-expanded", String(!expanded));
    toolProgression.hidden = expanded;
    toolProgressionToggle.textContent = expanded ? "Show tool progression" : "Hide tool progression";
  });
  let pausedBeforeGuide = true;
  document.getElementById("progressionGuideButton").addEventListener("click", () => {
    if (progressionGuide.open) return;
    pausedBeforeGuide = paused;
    paused = true;
    saveGame();
    progressionGuide.showModal();
  });
  document.getElementById("closeProgressionGuide").addEventListener("click", () => progressionGuide.close());
  progressionGuide.addEventListener("close", () => {
    paused = pausedBeforeGuide;
    if (!paused) lastTime = performance.now();
  });
  document.getElementById("resetTerrainButton").addEventListener("click", resetTerrain);
  document.getElementById("saveGameButton").addEventListener("click", () => {
    if (saveGame()) message.textContent = "Adventure saved.";
  });
  document.getElementById("teleportSpawnButton").addEventListener("click", () => {
    if (!player) return;
    player.x = player.spawnX;
    player.y = player.spawnY;
    player.vx = 0;
    player.vy = 0;
    camera.x = Math.max(0, player.x - canvas.width * .42);
    camera.y = Math.max(0, player.y - canvas.height * .48);
    ensureWorld();
    updateHud();
    render();
    saveGame();
    message.textContent = "Returned to your saved spawn. Your health and inventory are unchanged.";
  });
  document.getElementById("setSpawnButton").addEventListener("click", () => {
    const village = villageNearPlayer();
    if (!village) return;
    player.spawnX = village.centerX * tileSize + (tileSize - player.w) / 2;
    player.spawnY = surfaceAt(village.centerX) * tileSize - player.h;
    saveGame();
    message.textContent = `${village.name} is now your spawn point.`;
    updateVillageHud();
  });
  document.getElementById("trainButton").addEventListener("click", () => {
    if (!villageNearPlayer()) return;
    const cost = 5 + player.level * 2;
    if ((player.inventory.gold || 0) < cost) return;
    player.inventory.gold -= cost;
    player.level++;
    player.damage += 2;
    player.health = maxHealth();
    updateHud();
    saveGame();
    message.textContent = `Training complete! Level ${player.level} · attack damage increased.`;
  });
  document.getElementById("restButton").addEventListener("click", () => {
    if (!villageNearPlayer() || player.health >= maxHealth() || (player.inventory.gold || 0) < 2) return;
    player.inventory.gold -= 2;
    player.health = maxHealth();
    updateHud();
    saveGame();
    message.textContent = "You rested at the village and recovered to full health.";
  });
  const villagerDialog = document.getElementById("villagerDialog");
  document.getElementById("talkToVillagerButton").addEventListener("click", interactWithVillager);
  document.getElementById("villagerRestButton").addEventListener("click", () => {
    document.getElementById("restButton").click();
    villagerDialog.close();
  });
  document.getElementById("villagerTrainButton").addEventListener("click", () => {
    document.getElementById("trainButton").click();
    villagerDialog.close();
  });
  document.getElementById("villagerSpawnButton").addEventListener("click", () => {
    document.getElementById("setSpawnButton").click();
    villagerDialog.close();
  });
  document.getElementById("villagerCloseButton").addEventListener("click", () => villagerDialog.close());
  villagerDialog.addEventListener("close", () => {
    paused = villagerDialogPausedBefore;
    if (!paused) lastTime = performance.now();
  });
  const updateButton = document.getElementById("updateButton");
  const menuUpdateButton = document.getElementById("menuUpdateButton");
  async function updateApp(button, statusElement) {
    if (player && !saveGame()) {
      statusElement.textContent = "Update canceled because your latest progress could not be saved. Your existing save was left untouched.";
      return;
    }
    updateButton.disabled = true;
    menuUpdateButton.disabled = true;
    button.textContent = "Checking…";
    statusElement.textContent = player
      ? "Progress saved and verified. Loading the latest app files…"
      : "Loading the latest app files. Your saved adventure will be kept…";
    try {
      if (location.protocol !== "file:" && "serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          const worker = registration.installing || registration.waiting;
          if (worker) {
            worker.postMessage({ type: "SKIP_WAITING" });
            if (worker.state !== "activated") {
              await new Promise((resolve, reject) => {
                const onStateChange = () => {
                  if (worker.state === "activated") {
                    worker.removeEventListener("statechange", onStateChange);
                    resolve();
                  } else if (worker.state === "redundant") {
                    worker.removeEventListener("statechange", onStateChange);
                    reject(new Error("The new app version could not be activated."));
                  }
                };
                worker.addEventListener("statechange", onStateChange);
                onStateChange();
              });
            }
          }
        }
      }
      location.reload();
    } catch (error) {
      console.error("Teressa could not update its app files.", error);
      statusElement.textContent = "Update failed. Check your connection, then try again.";
      updateButton.disabled = false;
      menuUpdateButton.disabled = false;
      updateButton.textContent = "Update now";
      menuUpdateButton.textContent = "Update game";
    }
  }
  updateButton.addEventListener("click", () => updateApp(updateButton, message));
  menuUpdateButton.addEventListener("click", () => updateApp(menuUpdateButton, document.getElementById("menuStatus")));
  document.getElementById("resumeButton").addEventListener("click", () => {
    if (player.health <= 0) respawn();
    else { overlay.hidden = true; paused = false; lastTime = performance.now(); }
  });
  document.getElementById("hotbar").addEventListener("click", event => {
    const slot = event.target.closest("[data-slot]");
    if (!slot) return;
    selectedItem = Number(slot.dataset.slot);
    updateHud();
  });
  document.getElementById("hotbar").addEventListener("keydown", event => {
    if (event.code !== "Enter" && event.code !== "Space") return;
    const slot = event.target.closest("[data-slot]");
    if (!slot) return;
    event.preventDefault();
    event.stopPropagation();
    selectedItem = Number(slot.dataset.slot);
    updateHud();
    document.querySelector(`#hotbar [data-slot="${selectedItem}"]`).focus();
  });
  let installPrompt;
  const installButton = document.getElementById("installButton");
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault(); installPrompt = event; installButton.hidden = false;
  });
  installButton.addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt(); await installPrompt.userChoice;
    installPrompt = null; installButton.hidden = true;
  });
  window.addEventListener("appinstalled", () => { installButton.hidden = true; });
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./sw.js").catch(error => console.error("Teressa could not enable offline app support.", error));
  }
  window.addEventListener("keydown", event => {
    if (event.code === "Escape" && progressionGuide.open) {
      event.preventDefault();
      progressionGuide.close();
      return;
    }
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
    keys[event.code] = true;
    if (paused) return;
    if (event.code === "KeyT") interactWithVillager();
    if (/^Digit[1-7]$/.test(event.code)) { selectedItem = Number(event.code.slice(-1)) - 1; updateHud(); }
    if (event.code === "KeyJ") attack();
    if (event.code === "KeyE") usePotion();
    if (event.code === "KeyF" && mouseTile) mine(mouseTile.x, mouseTile.y);
    if (event.code === "Escape") { paused = true; showOverlay("Paused", "Your adventure saves automatically.", "Keep exploring"); }
  });
  window.addEventListener("keyup", event => { keys[event.code] = false; });
  window.addEventListener("blur", () => { if (player) saveGame(); });
  window.addEventListener("pagehide", saveGame);
  window.setInterval(() => { if (player) saveGame(); }, 30000);
  canvas.addEventListener("contextmenu", event => event.preventDefault());
  canvas.addEventListener("mousemove", event => {
    const rect = canvas.getBoundingClientRect();
    mouseTile = {
      x: Math.floor((event.clientX - rect.left) * canvas.width / rect.width + camera.x) / tileSize | 0,
      y: Math.floor((event.clientY - rect.top) * canvas.height / rect.height + camera.y) / tileSize | 0
    };
  });
  canvas.addEventListener("mouseleave", () => { mouseTile = null; });
  canvas.addEventListener("mousedown", event => {
    if (paused || !player || !mouseTile) return;
    if (event.button === 0) {
      const rect = canvas.getBoundingClientRect();
      const worldX = (event.clientX - rect.left) * canvas.width / rect.width + camera.x;
      const worldY = (event.clientY - rect.top) * canvas.height / rect.height + camera.y;
      const village = nearestVillage(Math.floor(worldX / tileSize));
      const npcX = village.centerX * tileSize + 18;
      const npcY = surfaceAt(village.centerX) * tileSize - 31;
      const playerDistance = Math.hypot(
        player.x + player.w / 2 - (npcX + 8),
        player.y + player.h / 2 - (npcY + 15)
      );
      if (worldX >= npcX && worldX <= npcX + 18 && worldY >= npcY && worldY <= npcY + 31
        && playerDistance <= tileSize * 6) {
        interactWithVillager();
        return;
      }
      if (event.shiftKey) mine(mouseTile.x, mouseTile.y);
      else if (selectedItem === swordSlot) attack();
      else if (selectedItem === pickaxeSlot) mine(mouseTile.x, mouseTile.y);
      else message.textContent = "Equip your sword (slot 1) to fight or pickaxe (slot 2) to mine.";
    } else if (event.button === 2 && selectedItem >= firstMaterialSlot) placeBlock(mouseTile.x, mouseTile.y);
    else if (event.button === 2 && selectedItem === swordSlot) attack();
  });
  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000 || 0, .04);
    lastTime = now;
    update(dt);
    if (!paused && player) render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
