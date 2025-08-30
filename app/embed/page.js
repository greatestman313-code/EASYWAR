export const metadata = { title: "Embed | EASY WAR" };

export default function EmbedPage() {
  return (
    <main style={{minHeight:'100vh', display:'grid', placeItems:'center'}}>
      <div style={{maxWidth:860, width:'100%', padding:24}}>
        <h1 style={{fontSize:28, marginBottom:16}}>صفحة تضمين</h1>
        <p>ضع هنا عناصر التضمين (iFrame/Widget) أو أي سكربت خارجي.</p>
        <div style={{marginTop:16, border:'1px dashed #1e2b57', padding:16, borderRadius:12}}>
          <p style={{opacity:.75}}>مثال iFrame:</p>
          <iframe
            src="https://example.com"
            style={{width:'100%', height:360, border:0, borderRadius:12}}
            title="Demo"
            allow="clipboard-write; microphone; camera"
          />
        </div>
      </div>
    </main>
  );
}
