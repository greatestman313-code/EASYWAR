import { NextResponse } from "next/server";

const SOURCES = {
  biz: [
    { name: "Harvard Business Review", base: "https://hbr.org", search: (q)=>`https://www.google.com/search?q=site:hbr.org+${encodeURIComponent(q)}` },
    { name: "McKinsey Insights", base: "https://www.mckinsey.com/featured-insights", search: (q)=>`https://www.google.com/search?q=site:mckinsey.com+${encodeURIComponent(q)}` },
    { name: "BCG Ideas", base: "https://www.bcg.com/ideas", search: (q)=>`https://www.google.com/search?q=site:bcg.com+${encodeURIComponent(q)}` },
    { name: "OECD", base: "https://www.oecd.org", search: (q)=>`https://www.google.com/search?q=site:oecd.org+${encodeURIComponent(q)}` },
    { name: "World Bank", base: "https://www.worldbank.org", search: (q)=>`https://www.google.com/search?q=site:worldbank.org+${encodeURIComponent(q)}` }
  ],
  mkt: [
    { name: "Think with Google", base: "https://www.thinkwithgoogle.com", search: (q)=>`https://www.google.com/search?q=site:thinkwithgoogle.com+${encodeURIComponent(q)}` },
    { name: "Meta for Business", base: "https://www.facebook.com/business", search: (q)=>`https://www.google.com/search?q=site:facebook.com/business+${encodeURIComponent(q)}` },
    { name: "HubSpot Blog", base: "https://blog.hubspot.com", search: (q)=>`https://www.google.com/search?q=site:blog.hubspot.com+${encodeURIComponent(q)}` },
    { name: "Nielsen", base: "https://www.nielsen.com", search: (q)=>`https://www.google.com/search?q=site:nielsen.com+${encodeURIComponent(q)}` }
  ]
};

export async function POST(req){
  const { topic, group } = await req.json().catch(()=>({}));
  if (!topic) return NextResponse.json({ ok:false, error:"Missing 'topic'." }, { status:400 });
  const g = group === "mkt" ? "mkt" : "biz";
  const list = SOURCES[g].map(s => ({
    name: s.name,
    base: s.base,
    search: s.search(topic)
  }));
  return NextResponse.json({ ok:true, topic, group:g, list });
}
