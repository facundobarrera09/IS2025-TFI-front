import '../styles/components/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Primera línea: Universidad y Materia */}
        <div className="footer-row footer-row-university">
          <div className="footer-text-primary">
            Universidad Tecnológica Nacional - Facultad Regional Tucumán
          </div>
          <div className="footer-separator">|</div>
          <div className="footer-text-primary">
            Ingeniería de Software - Ingeniería en Sistemas
          </div>
        </div>

        {/* Segunda línea: Equipo Docente */}
        <div className="footer-row footer-row-teachers">
          <div>
            <strong className="footer-label">Prof. Teoría:</strong> Francisco Vicente
          </div>
          <div className="footer-separator">•</div>
          <div>
            <strong className="footer-label">Prof. Práctica:</strong> Alexandra Dufour
          </div>
          <div className="footer-separator">•</div>
          <div>
            <strong className="footer-label">Ayudantes:</strong> Barbara Lapetina, Marcelo de Jesús Núñez
          </div>
        </div>

        {/* Tercera línea: Desarrolladores */}
        <div className="footer-row footer-row-developers">
          <div className="footer-text-primary">Desarrolladores:</div>
          <div className="footer-text-secondary">Barrera Aybar, Lucas F.</div>
          <div className="footer-separator">•</div>
          <div className="footer-text-secondary">Berdu, Jasmin I.</div>
          <div className="footer-separator">•</div>
          <div className="footer-text-secondary">Gallardo, Maximiliano</div>
          <div className="footer-separator">•</div>
          <div className="footer-text-secondary">Paez, Micaela A.</div>
          <div className="footer-separator">•</div>
          <div className="footer-text-secondary">Vera Morales, Maia J.</div>
          <div className="footer-separator">•</div>
          <div className="footer-text-secondary">Villagra, Mauro</div>
        </div>

        {/* Cuarta línea: Copyright */}
        <div className="footer-row-copyright">
          © {new Date().getFullYear()} - Sistema de Gestión Hospitalaria - Trabajo Final Integrador
        </div>
      </div>
    </footer>
  );
}
