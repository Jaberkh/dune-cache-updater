import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const CACHE_PATH = path.join(__dirname, '..', 'data', 'DB.json');  // مسیر ذخیره کش
const DUNE_API_KEY = process.env.DUNE_API_KEY;  // کلید API از GitHub Secrets

async function fetchDuneData() {
  try {
    const res = await fetch(`https://api.dune.com/api/v1/query/4837362/results?api_key=${DUNE_API_KEY}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch data from Dune');
    }

    const data = await res.json();
    console.log('Fetched Dune data:', data);  // چاپ داده‌های دریافتی از API

    return data;
  } catch (error) {
    console.error('Error fetching Dune data:', error);
    return null;
  }
}

async function updateCache() {
  const data = await fetchDuneData();
  
  if (data) {
    const cache = {
      updatedAt: Date.now(),
      data: data
    };

    // ذخیره کش در فایل DB.json
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
    console.log('Cache updated successfully');
  } else {
    console.log('No data fetched, cache not updated');
  }
}

updateCache();
