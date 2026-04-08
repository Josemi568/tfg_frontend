import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contacto Plazart - ${reason}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:plazartcontact387@gmail.com?subject=${subject}&body=${body}`;
    navigate('/');
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '40px', minHeight: '60vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Ponte en contacto con nosotros</h1>
      <p>Aqui en Plazart nos preocupamos por la integridad de nuestra plataforma y nuestros usuarios, por
        lo que si quieres avisarnos de algo por favor cuentanoslo aqui abajo:</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Motivo de contacto:</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'inherit' }}
          >
            <option value="" style={{ color: '#000' }}>Seleccione una opción</option>
            <option value="Reportar un fallo" style={{ color: '#000' }}>Reportar un fallo</option>
            <option value="Reportar un usuario" style={{ color: '#000' }}>Reportar un usuario</option>
            <option value="Sugerencia" style={{ color: '#000' }}>Sugerencia</option>
            <option value="Otro" style={{ color: '#000' }}>Otro</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Describe tu problema:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows="6"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'inherit', resize: 'vertical' }}
            placeholder="Escribe aquí los detalles..."
          ></textarea>
        </div>
        <button type="submit" style={{ padding: '12px', borderRadius: '8px' }}>
          Enviar Mensaje
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
