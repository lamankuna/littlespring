export type NavPillar = { slug: string; label: string; children: string[] };

export const NAV = {
  pillars: [
    { slug: 'feeding-mess', label: 'Feeding & Mess', children: ['plates-bowls','bibs','utensils','smocks','feeding-sets'] },
    { slug: 'bath-care', label: 'Bath & Care', children: ['hooded-towels','rinsers','brushes','kneelers','toy-organizers'] },
    { slug: 'nursery-sleep', label: 'Nursery & Sleep', children: ['swaddles','blankets','organizers','night-lights'] },
    { slug: 'on-the-go', label: 'On-the-Go & Travel', children: ['diaper-bags','stroller-organizers','hooks','travel-mats'] },
    { slug: 'apparel', label: 'Little Spring Apparel', children: ['onesies','tees','beanies'] },
    { slug: 'safety-proofing', label: 'Safety & Proofing', children: ['edge-guards','drawer-locks','door-stoppers'] },
    { slug: 'starter-bundles', label: 'Starter Bundles', children: ['0-3m-starter','weaning-starter','bathtime-kit'] }
  ],
  ages: ['0-3m','3-6m','6-12m','12-24m','2-4y','4-7y'],
  badges: ['fast-ship-za','local-pod']
} as const;
