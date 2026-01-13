import { useState } from "react";
import { TICKET_ICON_LIBRARY } from "./Data/tickeyTypeIcon";
import { Plus, Trash2 } from "lucide-react";

const TicketTypeManager = ({ projectId }) => {
  const [ticketTypes, setTicketTypes] = useState([
    {
      id: 1,
      name: 'Feature',
      prefix: 'FEAT',
      separator: '-',
      iconKey: 'Rocket',
      svgCode: TICKET_ICON_LIBRARY.rocket.svg
    }
  ]);

  const addType = () => {
    setTicketTypes([
      ...ticketTypes,
      {
        id: Date.now(),
        name: 'New Type',
        prefix: 'NEW',
        separator: '-',
        iconKey: 'Tag',
        svgCode: TICKET_ICON_LIBRARY.tag.svg
      }
    ]);
  };

  const updateType = (id, field, value) => {
    setTicketTypes(ticketTypes.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: value };
        if (field === 'iconKey') {
          updated.svgCode = TICKET_ICON_LIBRARY[value].svg;
        }
        return updated;
      }
      return t;
    }));
  };

  const removeType = (id) => {
    setTicketTypes(ticketTypes.filter(t => t.id !== id));
  };

  /* 🔥 Backend payload ready */
  /*
  {
    projectId,
    ticketTypes: [
      { name, prefix, separator, iconKey }
    ]
  }
  */

  return (
    <section className="config-card">
      <div className="card-header">
        <h2>🎫 Ticket Types</h2>
        <button className="add-btn" onClick={addType}>
          <Plus size={16} />
        </button>
      </div>

      <div className="card-body">
        {ticketTypes.map(type => (
          <div key={type.id} className="convention-item">
            <div className="item-inputs">

              {/* ICON SELECT */}
              <select
                className="icon-picker"
                style={{width:"1.2rem"}}
                value={type.iconKey}
                onChange={(e) =>
                  updateType(type.id, 'iconKey', e.target.value)
                }
              >
                {Object.keys(TICKET_ICON_LIBRARY).map(key => (
                  <option key={key} value={key}>
                    {TICKET_ICON_LIBRARY[key].label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={type.name}
                onChange={(e) =>
                  updateType(type.id, 'name', e.target.value)
                }
              />

              <input
                className="prefix"
                type="text"
                value={type.prefix}
                onChange={(e) =>
                  updateType(type.id, 'prefix', e.target.value.toUpperCase())
                }
              />

              <select
                value={type.separator}
                onChange={(e) =>
                  updateType(type.id, 'separator', e.target.value)
                }
              >
                <option value="-">-</option>
                <option value="_">_</option>
                <option value="/">/</option>
              </select>

              <button
                className="delete-btn"
                onClick={() => removeType(type.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* PREVIEW */}
            <div className="item-preview">
              <span
                className="icon-preview"
                dangerouslySetInnerHTML={{ __html: type.svgCode }}
              />
              <span>
                {type.prefix}{type.separator}123
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TicketTypeManager;