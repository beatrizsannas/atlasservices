import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env
const envPath = path.resolve(process.cwd(), '.env');
let env = {};
try {
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

async function checkAppointmentTypes() {
    console.log('Checking appointment types in database...\n');

    // Get all unique type values from appointments
    const { data, error } = await supabase
        .from('appointments')
        .select('type')
        .limit(100);

    if (error) {
        console.log('Error querying appointments:', error.message);
        return;
    }

    if (data && data.length > 0) {
        const types = [...new Set(data.map(a => a.type))];
        console.log('✅ Found these TYPE values in the database:');
        types.forEach(type => console.log(`   - "${type}"`));
    } else {
        console.log('⚠️  No appointments found in database');
    }

    console.log('\n📝 Testing INSERT with different type values...\n');

    // Note: We're just checking the error messages, not actually inserting
    const testTypes = ['service', 'quote', 'avulso', 'servico', 'orcamento'];

    console.log('Cannot test INSERT without auth, but based on existing data:');
    console.log('The constraint likely accepts one of these values.');
}

checkAppointmentTypes();
