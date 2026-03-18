import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { initialDebrisData } from '../data/debrisData';

const EMPTY_FORM = {
  objectId: '', objectName: '', country: '', launchYear: '',
  orbitType: '', velocity: '', altitude: '', riskLevel: '', status: '',
};

function validate(form) {
  const e = {};
  if (!form.objectId.trim())   e.objectId   = 'Object ID is required';
  if (!form.objectName.trim()) e.objectName = 'Object name is required';
  if (!form.country.trim())    e.country    = 'Country is required';
  if (!form.launchYear) e.launchYear = 'Launch year is required';
  else if (Number(form.launchYear) < 1957 || Number(form.launchYear) > 2030)
    e.launchYear = 'Year must be between 1957 and 2030';
  if (!form.orbitType) e.orbitType = 'Select an orbit type';
  if (!form.velocity) e.velocity = 'Velocity is required';
  else if (Number(form.velocity) <= 0 || Number(form.velocity) > 30)
    e.velocity = 'Velocity must be 0.1–30 km/s';
  if (!form.altitude) e.altitude = 'Altitude is required';
  else if (Number(form.altitude) <= 0) e.altitude = 'Altitude must be positive';
  if (!form.riskLevel) e.riskLevel = 'Select a risk level';
  if (!form.status)    e.status    = 'Select a status';
  return e;
}

export default function AddEditDebris() {
  const { id } = useParams();
  const navigate  = useNavigate();
  const isEdit    = Boolean(id);

  const [form,  setForm]  = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    if (isEdit) {
      const s = localStorage.getItem('debrisData');
      const list = s ? JSON.parse(s) : initialDebrisData;
      const found = list.find(d => String(d.id) === String(id));
      if (found) setForm({
        objectId: found.objectId, objectName: found.objectName, country: found.country,
        launchYear: String(found.launchYear), orbitType: found.orbitType,
        velocity: String(found.velocity), altitude: String(found.altitude),
        riskLevel: found.riskLevel, status: found.status,
      });
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const s = localStorage.getItem('debrisData');
    let list = s ? JSON.parse(s) : initialDebrisData;
    const entry = {
      ...form,
      launchYear: Number(form.launchYear),
      velocity: parseFloat(form.velocity),
      altitude: parseFloat(form.altitude),
    };

    if (isEdit) {
      list = list.map(d => String(d.id) === String(id) ? { ...d, ...entry } : d);
    } else {
      const newId = list.length > 0 ? Math.max(...list.map(d => d.id)) + 1 : 1;
      list.push({ id: newId, ...entry });
    }

    localStorage.setItem('debrisData', JSON.stringify(list));
    setSaved(true);
    setTimeout(() => navigate('/debris-list'), 1500);
  };

  const FG = ({ name, label, children }) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {children}
      {errors[name] && <div className="form-error">{errors[name]}</div>}
    </div>
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-title">{isEdit ? 'Edit Object' : 'Add Object'}</div>
          <div className="page-subtitle">{isEdit ? `Editing record #${id}` : 'Register a new debris object in the catalog'}</div>
        </div>
        <Link to="/debris-list" className="btn btn-secondary">← Back</Link>
      </div>

      {/* Explainer */}
      <div className="explainer">
        <div className="explainer-title">About This Page</div>
        <div className="explainer-text">
          {isEdit
            ? 'Update the details of an existing debris record. All fields marked with * are required.'
            : 'Fill in the details below to add a new space object to the catalog. The data is saved locally in your browser.'}
        </div>
        <div className="explainer-defs">
          <div className="def-chip"><strong>Object ID</strong> — Unique reference code (e.g. SDM-046)</div>
          <div className="def-chip"><strong>LEO / MEO / GEO</strong> — The orbit zone: Low (200–2000 km), Medium, or Geostationary (~35,786 km)</div>
          <div className="def-chip"><strong>Velocity</strong> — Orbital speed in km/s. LEO ≈ 7–8 km/s, GEO ≈ 3 km/s</div>
          <div className="def-chip"><strong>Altitude</strong> — Height above Earth's surface in km</div>
        </div>
      </div>

      {saved && (
        <div className="alert-box alert-success" style={{ marginBottom: 20 }}>
          ✓ {isEdit ? 'Record updated' : 'Object added'} — redirecting…
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <FG name="objectId" label="Object ID *">
              <input id="objectId" name="objectId" type="text" placeholder="e.g. SDM-046"
                value={form.objectId} onChange={handleChange} className={errors.objectId ? 'error' : ''} />
            </FG>
            <FG name="objectName" label="Object Name *">
              <input id="objectName" name="objectName" type="text" placeholder="e.g. Cosmos Fragment A"
                value={form.objectName} onChange={handleChange} className={errors.objectName ? 'error' : ''} />
            </FG>
            <FG name="country" label="Country / Agency *">
              <input id="country" name="country" type="text" placeholder="e.g. Russia"
                value={form.country} onChange={handleChange} className={errors.country ? 'error' : ''} />
            </FG>
            <FG name="launchYear" label="Launch Year *">
              <input id="launchYear" name="launchYear" type="number" min={1957} max={2030} placeholder="e.g. 1999"
                value={form.launchYear} onChange={handleChange} className={errors.launchYear ? 'error' : ''} />
            </FG>
            <FG name="orbitType" label="Orbit Type *">
              <select id="orbitType" name="orbitType" value={form.orbitType} onChange={handleChange} className={errors.orbitType ? 'error' : ''}>
                <option value="">-- Select Orbit --</option>
                <option value="LEO">LEO — Low Earth Orbit (200–2,000 km)</option>
                <option value="MEO">MEO — Medium Earth Orbit (2,000–35,786 km)</option>
                <option value="GEO">GEO — Geostationary Orbit (~35,786 km)</option>
              </select>
            </FG>
            <FG name="velocity" label="Velocity (km/s) *">
              <input id="velocity" name="velocity" type="number" step="0.1" placeholder="e.g. 7.8"
                value={form.velocity} onChange={handleChange} className={errors.velocity ? 'error' : ''} />
            </FG>
            <FG name="altitude" label="Altitude (km) *">
              <input id="altitude" name="altitude" type="number" step="1" placeholder="e.g. 420"
                value={form.altitude} onChange={handleChange} className={errors.altitude ? 'error' : ''} />
            </FG>
            <FG name="riskLevel" label="Risk Level *">
              <select id="riskLevel" name="riskLevel" value={form.riskLevel} onChange={handleChange} className={errors.riskLevel ? 'error' : ''}>
                <option value="">-- Select Risk Level --</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </FG>
            <FG name="status" label="Status *">
              <select id="status" name="status" value={form.status} onChange={handleChange} className={errors.status ? 'error' : ''}>
                <option value="">-- Select Status --</option>
                <option value="Active">Active</option>
                <option value="Debris">Debris</option>
                <option value="Inactive">Inactive</option>
              </select>
            </FG>
          </div>

          <div className="divider" />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Add to Catalog'}
            </button>
            <button type="button" className="btn btn-secondary"
              onClick={() => { setForm(EMPTY_FORM); setErrors({}); setSaved(false); }}>
              Reset
            </button>
            <Link to="/debris-list" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
