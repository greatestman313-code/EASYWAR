'use client';
export default function HelpIndex(){
  return (
    <div className="pagePad">
      <h1>المساعدة</h1>
      <p>اختر قسمًا من القائمة:</p>
      <ul className="linksList">
        <li><a href="/help/center">Help center</a></li>
        <li><a href="/help/release-notes">Release notes</a></li>
        <li><a href="/help/terms">Terms & policies</a></li>
        <li><a href="/help/download">Download apps</a></li>
        <li><a href="/help/shortcuts">Keyboard shortcuts</a></li>
      </ul>
    </div>
  );
}
