
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env
let env = {};
try {
    const envPath = path.resolve(process.cwd(), '.env');
    const data = fs.readFileSync(envPath, 'utf8');
    data.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) env[key.trim()] = value.trim();
    });
} catch (e) {
    console.log('No .env file found');
}

const supabaseUrl = env['VITE_SUPABASE_URL'] || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'] || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    console.log('Checking appointments table columns...');

    // Try to select date + total_amount
    const { data: d1, error: e1 } = await supabase.from('appointments').select('id, total_amount').limit(1);
    if (!e1) {
        console.log('Column "total_amount" exists!');
    } else {
        console.log('Error selecting "total_amount":', e1.message);
    }

    // Try price
    const { data: d2, error: e2 } = await supabase.from('appointments').select('id, price').limit(1);
    if (!e2) {
        console.log('Column "price" exists!');
    } else {
        console.log('Error selecting "price":', e2.message);
    }

    // Try value
    const { data: d3, error: e3 } = await supabase.from('appointments').select('id, value').limit(1);
    if (!e3) {
        console.log('Column "value" exists!');
    } else {
        console.log('Error selecting "value":', e3.message);
    }
}

checkSchema();
