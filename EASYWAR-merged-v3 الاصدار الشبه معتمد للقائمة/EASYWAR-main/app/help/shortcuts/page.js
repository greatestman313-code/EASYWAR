'use client';
export default function Shortcuts(){
  const data = [
    ['Enter', 'إرسال'],
    ['Shift + Enter', 'سطر جديد'],
    ['Ctrl/Cmd + K', 'بحث في المحادثات'],
    ['Ctrl/Cmd + /', 'إظهار الاختصارات'],
  ];
  return (
    <div className="docWrap">
      <h1>Keyboard shortcuts</h1>
      <table className="table">
        <tbody>
          {data.map((r,i)=>(
            <tr key={i}><td>{r[0]}</td><td>{r[1]}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
