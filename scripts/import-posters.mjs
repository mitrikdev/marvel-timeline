// Refresh locally hosted, compact theatrical poster artwork and its source register.
// Run from the repository root: node scripts/import-posters.mjs
// Existing assets are reused; set REFRESH_POSTERS=1 to download them again.
import { access, readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import { setTimeout as delay } from 'node:timers/promises';

const pageOverrides = {
  'iron-man': 'Iron Man (2008 film)',
  'the-incredible-hulk': 'The Incredible Hulk (film)',
  thor: 'Thor (film)',
  'the-avengers': 'The Avengers (2012 film)',
  'guardians-of-the-galaxy': 'Guardians of the Galaxy (film)',
  'ant-man': 'Ant-Man (film)',
  'doctor-strange': 'Doctor Strange (2016 film)',
  'black-panther': 'Black Panther (film)',
  'captain-marvel': 'Captain Marvel (film)',
  'black-widow': 'Black Widow (2021 film)',
  eternals: 'Eternals (film)',
  'spider-man': 'Spider-Man (2002 film)',
  'the-amazing-spider-man': 'The Amazing Spider-Man (film)',
  venom: 'Venom (2018 film)',
  morbius: 'Morbius (film)',
  'madame-web': 'Madame Web (film)',
  'kraven-the-hunter': 'Kraven the Hunter (film)',
  'x-men': 'X-Men (film)',
  x2: 'X2 (film)',
  deadpool: 'Deadpool (film)',
  logan: 'Logan (film)',
  'dark-phoenix': 'Dark Phoenix (film)',
  'fantastic-four-2005': 'Fantastic Four (2005 film)',
  'fantastic-four-2015': 'Fantastic Four (2015 film)',
  'the-wolverine': 'The Wolverine (film)',
  'the-new-mutants': 'The New Mutants (film)',
  blade: 'Blade (1998 film)',
  daredevil: 'Daredevil (film)',
  elektra: 'Elektra (2005 film)',
  'hulk-2003': 'Hulk (film)',
  'the-punisher-2004': 'The Punisher (2004 film)',
  'ghost-rider': 'Ghost Rider (2007 film)',
};

const movies = (
  await Promise.all(
    ['mcu', 'legacy'].map(async (name) => {
      const data = await readFile(`src/data/${name}.ts`, 'utf8');
      return [
        ...data.matchAll(/\bid: '([^']+)',\s+title: '([^']+)',\s+releaseDate: '(\d{4})-[^']+'/g),
      ].map(([, id, title, year]) => ({ id, title, year }));
    }),
  )
).flat();

const unescapeHtml = (text) => text.replaceAll('&amp;', '&').replaceAll('&quot;', '"');
const fetchChecked = async (url) => {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    await delay(attempt ? 6000 : 800);
    let response;
    try {
      response = await fetch(url, {
        signal: AbortSignal.timeout(25000),
        headers: {
          'User-Agent':
            'MarvelTimelinePosterImporter/1.0 (https://marvel-timeline-sepia.vercel.app/)',
        },
      });
    } catch (error) {
      if (attempt === 3) throw error;
      continue;
    }
    if (response.ok) return response;
    if (response.status !== 429 || attempt === 3) throw new Error(response.status + ': ' + url);
    await response.body?.cancel();
  }
};
await mkdir('public/posters', { recursive: true });
const previous = JSON.parse(
  await readFile('public/posters/sources.json', 'utf8').catch(() => '[]'),
);
const sources = [];
const failures = [];
// Keep requests sequential to avoid burdening Wikimedia's public service.
for (const movie of movies) {
  try {
    const existing = previous.find(({ id }) => id === movie.id);
    if (
      existing &&
      process.env.REFRESH_POSTERS !== '1' &&
      (await access('public' + existing.src).then(
        () => true,
        () => false,
      ))
    ) {
      sources.push(existing);
      continue;
    }
    const page = pageOverrides[movie.id] ?? movie.title;
    const pageUrl = `https://en.wikipedia.org/wiki/${encodeURI(page.replaceAll(' ', '_'))}`;
    const html = await (await fetchChecked(pageUrl)).text();
    const index = html.indexOf('infobox-image');
    if (index < 0) throw new Error(`Missing film infobox: ${pageUrl}`);
    const section = html.slice(index, index + 7000);
    const tag = section.match(/<img\s[^>]+>/)?.[0];
    if (!tag) throw new Error(`Missing poster: ${pageUrl}`);
    const src = unescapeHtml(tag.match(/\ssrc="([^"]+)"/)?.[1] ?? '');
    const resource = unescapeHtml(tag.match(/\sresource="([^"]+)"/)?.[1] ?? '');
    const imageUrl = new URL(src, pageUrl);
    imageUrl.search = '';
    // Original poster files are typically already reduced for identification;
    // avoid enlarged thumbnail requests, and cap any larger originals below.
    imageUrl.hostname = 'upload.wikimedia.org';
    if (imageUrl.pathname.includes('/thumb/')) {
      imageUrl.pathname = imageUrl.pathname
        .replace('/thumb/', '/')
        .split('/')
        .slice(0, -1)
        .join('/');
    }
    const buffer = Buffer.from(await (await fetchChecked(imageUrl)).arrayBuffer());
    const { data, info } = await sharp(buffer)
      .rotate()
      .resize({ width: 360, height: 540, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    if (info.width >= info.height) throw new Error(`Poster is not portrait: ${pageUrl}`);
    const srcPath = `/posters/${movie.id}.webp`;
    await writeFile(`public${srcPath}`, data);
    sources.push({
      ...movie,
      src: srcPath,
      sourceUrl: pageUrl,
      imageSourceUrl: resource ? new URL(resource, pageUrl).href : imageUrl.href,
      originalImageUrl: imageUrl.href,
      width: info.width,
      height: info.height,
      bytes: info.size,
    });
    console.log(`${movie.id}: ${info.width}x${info.height}, ${info.size} bytes`);
  } catch (error) {
    failures.push({ id: movie.id, error: error.message });
    console.error(`${movie.id}: ${error.message}`);
  }
}
await writeFile('public/posters/sources.json', `${JSON.stringify(sources, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
} else {
  const entries = Object.fromEntries(
    sources.map(({ id, src, sourceUrl, width, height }) => [id, { src, sourceUrl, width, height }]),
  );
  await writeFile(
    'src/data/posters.ts',
    `// Locally hosted promotional artwork. See docs/sources-posters.md.\nexport type MoviePoster = {\n  src: string;\n  sourceUrl: string;\n  width: number;\n  height: number;\n};\n\nexport const posters: Record<string, MoviePoster> = ${JSON.stringify(entries, null, 2)};\n`,
  );
  const table = sources
    .map(
      ({ title, year, src, imageSourceUrl }) =>
        `| ${title} (${year}) | [Local asset](../public${src}) | [Image source and rights information](${imageSourceUrl}) |`,
    )
    .join('\n');
  await writeFile(
    'docs/sources-posters.md',
    `# Poster artwork sources\n\nThe film posters below were retrieved from the corresponding English Wikipedia film infoboxes on 2026-09-12. Each image-description page identifies the artwork and provides its source and rights information. The artwork is promotional material owned by the respective studios, distributors, and other rights holders; it is not covered by this project's source-code license. Display is limited to small images identifying and discussing the corresponding films. This independent app is not affiliated with or endorsed by Marvel, Disney, Sony, or the other studios.\n\nAssets are stored locally as WebP, preserving their original proportions and capped at 360 × 540 pixels without upscaling. No images are requested from the reference app. See [the machine-readable source register](../public/posters/sources.json) for film pages, original image URLs, dimensions, and file sizes. To import missing assets and rebuild this register, run \`node scripts/import-posters.mjs\`.\n\n| Film | Asset | Source |\n| --- | --- | --- |\n${table}\n`,
  );
  console.log(
    `Imported ${sources.length} posters, ${sources.reduce((sum, p) => sum + p.bytes, 0)} bytes total.`,
  );
}
