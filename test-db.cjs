const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if(!supabaseUrl) {
    console.log("No supabase URL found");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase
    .from('shoes')
    .select('id, is_public')
    .limit(1);
    
  console.log("Error:", error?.message);
}

test();
