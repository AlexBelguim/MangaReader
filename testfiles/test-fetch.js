async function test() {
  const imageUrl = "https://i3.nhentai.net/galleries/3891442/1.webp";
  try {
    const response = await fetch(imageUrl, {
      headers: {
        'Referer': new URL(imageUrl).origin + '/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log("Status:", response.status);
    console.log("Headers:", response.headers.get('content-type'));
  } catch(e) {
    console.error("Fetch error:", e);
  }
}
test();
