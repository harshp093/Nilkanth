const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found.');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] ? match[2].trim() : '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[match[1]] = value;
    }
  });
  return env;
}

const realReviews = [
  {
    name: 'Sandip Patel',
    rating: 5,
    city: 'Nadiad',
    comment: 'Best quality Italian marble and granite collection in Nadiad. Hiteshbhai and his team are very professional. The rates are very reasonable and they deliver on time. Highly recommended!',
    is_approved: true
  },
  {
    name: 'Dr. Amit Shah',
    rating: 5,
    city: 'Anand',
    comment: 'Sourced vitrified tiles and kitchen granite for my new clinic in Anand. Amazing variety and genuine guidance about the right thickness and materials. Very satisfied with the service.',
    is_approved: true
  },
  {
    name: 'Karan Vaghela',
    rating: 5,
    city: 'Ahmedabad',
    comment: 'Huge showroom at Piplag Chokdi. Sourced Kota stone and cladding tiles for my farmhouse near Ahmedabad. Delivery was prompt and material quality is excellent.',
    is_approved: true
  },
  {
    name: 'Ramesh Bhai Prajapati',
    rating: 5,
    city: 'Nadiad',
    comment: 'Perfect place for all flooring needs. They have huge stock of natural stones, marble, granite, and tiles. Best dealer in Kheda/Nadiad district. Genuine rates and no dummy commitments.',
    is_approved: true
  },
  {
    name: 'Snehal Desai',
    rating: 4,
    city: 'Vadodara',
    comment: 'Excellent collection of sanitary ware and brand tiles. I visited from Vadodara after checking their catalog online. Sourced Somany tiles and artificial quartz for my kitchen. Excellent service!',
    is_approved: true
  },
  {
    name: 'Vijay Chavda',
    rating: 5,
    city: 'Nadiad',
    comment: 'Good options for steps tile and parking tiles. Staff is cooperative and helpful in choosing colors. Quality stone supplier for outer wall elevation.',
    is_approved: true
  }
];

async function seed() {
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    console.error('❌ Error: Supabase URL or Key is missing in .env');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey);

  console.log('🌱 Seeding reviews into database...');
  
  // First clean up existing reviews to avoid duplication if run multiple times
  const { error: deleteError } = await supabase
    .from('reviews')
    .delete()
    .in('name', realReviews.map(r => r.name));

  if (deleteError) {
    console.warn('⚠️ Warning: Failed to clean up existing reviews:', deleteError.message);
  }

  // Insert the reviews
  const { error } = await supabase
    .from('reviews')
    .insert(realReviews);

  if (error) {
    console.error('❌ Error seeding reviews:', error.message);
    process.exit(1);
  } else {
    console.log('✅ Reviews seeded successfully!');
    console.log(`Inserted ${realReviews.length} authentic customer reviews.`);
  }
}

seed();
