import { useState } from 'react';
import { MdExpandMore } from 'react-icons/md';

export default function FaqAccordion({ categories }) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className="faq-accordion">
      {categories.map((cat) => (
        <div key={cat.id} className={`faq-item ${openId === cat.id ? 'faq-item--open' : ''}`}>
          <button type="button" className="faq-item__header" onClick={() => toggle(cat.id)}>
            <span>{cat.title}</span>
            <MdExpandMore size={24} className="faq-item__icon" />
          </button>
          {openId === cat.id && (
            <div className="faq-item__body">
              {cat.items.map((item, idx) => (
                <div key={idx} className="faq-sub-item">
                  <h6>{item.title}</h6>
                  {item.content.map((para, pIdx) =>
                    para.match(/^\d+\./) ? (
                      <p key={pIdx} className="faq-list-item">{para}</p>
                    ) : (
                      <p key={pIdx}>{para}</p>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
