import { Product } from '@/types';

export interface JewelryMeta {
  material: string;
  purity: string;
  gemstone: string;
  weightGrams: string;
  nonEmpty: boolean;
}

function clean(value?: string): string {
  return (value || '').trim();
}

export function getJewelryMeta(product: Product): JewelryMeta {
  const material = clean(product.material);
  const purity = clean(product.metalPurity);
  const gemstone = clean(product.gemstone);
  const weight = typeof product.weightGrams === 'number' && product.weightGrams > 0
    ? `${product.weightGrams} g`
    : '';
  const normalizedGemstone = gemstone.toLowerCase();
  const visibleGemstone = normalizedGemstone === 'none' ? '' : gemstone;

  return {
    material,
    purity,
    gemstone: visibleGemstone,
    weightGrams: weight,
    nonEmpty: Boolean(material || purity || visibleGemstone || weight),
  };
}

// e.g. "22K Gold", "925 Silver", "Gold · Diamond · 5.5 g"
export function getJewelryMetaLabel(product: Product): string | null {
  const meta = getJewelryMeta(product);
  if (!meta.nonEmpty) return null;

  const parts: string[] = [];
  if (meta.purity && meta.material) {
    parts.push(`${meta.purity} ${meta.material}`);
  } else if (meta.material) {
    parts.push(meta.material);
  } else if (meta.purity) {
    parts.push(meta.purity);
  }
  if (meta.gemstone) parts.push(meta.gemstone);
  if (meta.weightGrams) parts.push(meta.weightGrams);

  return parts.length > 0 ? parts.join(' · ') : null;
}

// Inspect spec rows too so legacy data (specifications array) is not missed
function specValue(product: Product, key: string): string {
  const found = (product.specifications || []).find(s => s.key.toLowerCase().includes(key.toLowerCase()));
  return found ? found.value : '';
}

export interface JewelrySpecRow { key: string; value: string; }

// Key/value rows for the Specifications tab (only non-empty jewelry fields)
export function getJewelrySpecRows(product: Product): JewelrySpecRow[] {
  const meta = getJewelryMeta(product);
  const rows: JewelrySpecRow[] = [];
  if (meta.material) rows.push({ key: 'Material', value: meta.material });
  if (meta.purity) rows.push({ key: 'Purity', value: meta.purity });
  if (meta.gemstone) rows.push({ key: 'Gemstone', value: meta.gemstone });
  const quality = clean(product.gemstoneQuality);
  if (quality) rows.push({ key: 'Gemstone Quality', value: quality });
  if (meta.weightGrams) rows.push({ key: 'Weight', value: meta.weightGrams });
  const chain = clean(product.chainLength);
  if (chain) rows.push({ key: 'Chain Length', value: chain });
  const ring = clean(product.ringSize);
  if (ring) rows.push({ key: 'Ring Size', value: ring });
  const hallmark = clean(product.hallmark);
  if (hallmark) rows.push({ key: 'Hallmark', value: hallmark });
  const certification = clean(product.certification);
  if (certification) rows.push({ key: 'Certification', value: certification });
  return rows;
}

// Hallmark / certification trust badges shown under the buy button
export function getTrustBadges(product: Product): string[] {
  const badges: string[] = [];
  const hallmark = clean(product.hallmark || specValue(product, 'hallmark'));
  const certification = clean(product.certification || specValue(product, 'certification'));
  const hasJewelryTrust = Boolean(hallmark || certification);

  if (hallmark) {
    badges.push('BIS Hallmarked');
  }
  if (certification) {
    const c = certification.toLowerCase();
    if (c.includes('igi')) badges.push('IGI Certified');
    else if (c.includes('gia')) badges.push('GIA Certified');
    else badges.push(certification);
  }
  if (hasJewelryTrust) {
    badges.push('Official Certificate Included');
  }
  return badges;
}