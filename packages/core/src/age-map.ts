export const AGE_RULES = [
  { match: [/swaddle|muslin|burp|pacifier|hooded towel/i], tags: ['0-3m','3-6m'] },
  { match: [/teether|teething|stack(ing)? cups?/i], tags: ['3-6m','6-12m'] },
  { match: [/weaning|divided plate|suction plate|snack cup|placemat/i], tags: ['6-12m','12-24m'] },
  { match: [/toddler cutlery|sippy|straw cup/i], tags: ['12-24m','2-4y'] },
  { match: [/lunch box|snack container|water bottle/i], tags: ['2-4y','4-7y'] },
  { match: [/corner guard|drawer lock|door stop|edge guard/i], tags: ['12-24m','2-4y'] },
  { match: [/stroller|pram|diaper bag|caddy|organizer/i], tags: ['0-3m','3-6m','6-12m','12-24m'] },
  { match: [/onesie|bodysuit/i], tags: ['0-3m','3-6m','6-12m'] },
  { match: [/kids tee|t-?shirt|hoodie|beanie/i], tags: ['2-4y','4-7y'] },
];

export function inferAgeTags(title: string, desc?: string) {
  const hay = `${title} ${desc ?? ''}`;
  const tags = new Set<string>();
  for (const r of AGE_RULES) if (r.match.some((rx) => rx.test(hay))) r.tags.forEach((t) => tags.add(t));
  return Array.from(tags);
}

