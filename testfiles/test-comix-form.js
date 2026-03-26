

async function run() {
  try {
    console.log('Fetching Homepage...');
    const response = await fetch('http://localhost:8191/v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cmd: 'request.get', url: 'https://comix.to/', maxTimeout: 60000 })
    });
    const data = await response.json();
    const html = data.solution.response;
    console.log(`Title: ${(html.match(/<title>(.*?)<\/title>/) || [])[1]}`);
    
      // Extract form HTML
      const forms = html.match(/<form[^>]*>[\s\S]*?<\/form>/gi) || [];
      console.log(`Found ${forms.length} forms`);
      for (const f of forms) {
        if (f.toLowerCase().includes('search')) {
           console.log('SEARCH FORM:');
           console.log(f);
        }
      }
  } catch (err) {
    console.error(err);
  }
}

run();
