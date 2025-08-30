'use client';
export default function Upgrade(){
  return (
    <div className="docWrap">
      <h1>Upgrade your plan</h1>
      <div className="cards2">
        <div className="plan">
          <h2>Plus</h2>
          <div className="price">$20 <span>/month</span></div>
          <ul>
            <li>GPT-5 advanced reasoning</li>
            <li>Expanded messaging & uploads</li>
            <li>Faster image creation</li>
            <li>More memory & context</li>
          </ul>
          <button className="btn">Your current plan</button>
        </div>
        <div className="plan highlight">
          <h2>Pro</h2>
          <div className="price">$200 <span>/month</span></div>
          <ul>
            <li>Pro reasoning & deep research</li>
            <li>Unlimited messages & uploads</li>
            <li>Maximum context & memory</li>
            <li>Priority features</li>
          </ul>
          <button className="btn">Get Pro</button>
        </div>
      </div>
    </div>
  );
}
