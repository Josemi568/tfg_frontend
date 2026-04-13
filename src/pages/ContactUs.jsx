import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ContactUsStyle.css';

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
        <div className="container">
            <h1 className="titulo-contacto">Ponte en contacto con nosotros</h1>
            <p className="parrafo-contacto">Aqui en Plazart nos preocupamos por la integridad de nuestra plataforma y nuestros usuarios, por
                lo que si quieres avisarnos de algo por favor cuentanoslo aqui abajo:</p>
            <form onSubmit={handleSubmit} className="formulario-contacto">
                <div>
                    <label className="etiqueta-contacto">Motivo de contacto:</label>
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="selector-contacto"
                    >
                        <option value="" className="opcion-contacto">Seleccione una opción</option>
                        <option value="Reportar un fallo" className="opcion-contacto">Reportar un fallo</option>
                        <option value="Reportar un usuario" className="opcion-contacto">Reportar un usuario</option>
                        <option value="Sugerencia" className="opcion-contacto">Sugerencia</option>
                        <option value="Otro" className="opcion-contacto">Otro</option>
                    </select>
                </div>
                <div>
                    <label className="etiqueta-contacto">Describe tu problema:</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows="6"
                        className="area-texto-contacto"
                        placeholder="Escribe aquí los detalles..."
                    ></textarea>
                </div>
                <button type="submit" className="boton-contacto">
                    Enviar Mensaje
                </button>
            </form>
        </div>
    );
};

export default ContactUs;
