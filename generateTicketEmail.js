const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const mjml = require("mjml");
const { exec } = require("child_process");

const lockFilePath = "./.git/index.lock";
if (fs.existsSync(lockFilePath)) {
  fs.unlinkSync(lockFilePath);
  console.log("🧹 Cleaned up leftover Git lock file.");
}

// const nodemailer = require("nodemailer");

async function updateMjmlEmail() {
  let mjmlTemplate = fs.readFileSync("index.mjml", "utf-8");

  const email = `

<!-- Hero and Check-In Process  -->

<!-- FULL-WIDTH BACKGROUND CANVAS -->
<mj-section full-width="full-width" background-url="https://jon-carlos-concert.s3.us-east-1.amazonaws.com/jon3.png" background-repeat="no-repeat" background-position="top center" background-color="#000000" padding="0">
  <mj-column padding="0">

    <!-- Header (keep transparent so background shows through) -->
    <mj-section padding="24px 16px 10px">
      <mj-column>
        <mj-text css-class="kicker muted" align="center" padding="0">
          St. Kilian Roman Catholic Church
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- HERO: Text above, image below (glass card so background is visible) -->
    <mj-section padding="0 16px 8px">
      <mj-column>
        <mj-wrapper background-color="rgba(7,7,7,0.58)" padding="0" border="1px solid rgba(255,255,255,0.14)" >
          
          <!-- Hero Content -->
          <mj-section padding="22px 20px 12px">
            <mj-column>
              <mj-text css-class="kicker muted" align="center" padding="0 0 8px 0" font-weight="600" >
                LIVE PERFORMANCE
              </mj-text>

              <mj-text css-class="headline" align="center" padding="0 0 10px 0" font-size="28px" line-height="34px">
                Juan "Jon Carlo" Garcia
              </mj-text>

              <mj-text css-class="muted" align="center" padding="0 0 8px 0">
                Hola {{ first_name|default:'Friend' }} {{ last_name|default:"" }},
              </mj-text>

              <mj-text css-class="muted" align="center" padding="0">
                Este concierto es un encuentro de fe y esperanza que nos recuerda que Dios siempre esta con nosotros en cada momento de nuestras vidas y que, en sus ojos, valemos más de lo que imaginamos. Es una invitación para todos aquellos que dudan o se sienten solos, a abrir su corazón y creer con fe que Él camina con nosotros siempre.              
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Artist Image (remove extra padding so it feels centered + premium) -->
          <mj-section padding="0 20px 10px">
            <mj-column padding="0">
              <mj-image src="https://jon-carlos-concert.s3.us-east-1.amazonaws.com/jon.png" alt="Jon Carlo Live in Concert" padding="0" fluid-on-mobile="true" border-radius="14px" />
            </mj-column>
          </mj-section>

          <!-- Centered Details + CTA -->
          <mj-section padding="18px 20px 22px">
            <mj-column>
              <mj-text align="center" padding="0 0 14px 0">
                <strong>Domingo, Mayo 3, 2026</strong><br />
                1:00 PM – 5:00 PM · Puertas abren a las 11:40 AM<br />
                St. Kilian Roman Catholic Church – Auditorium<br />
                50 Cherry St, Farmingdale, NY 11735
              </mj-text>
            </mj-column>
          </mj-section>

        </mj-wrapper>
      </mj-column>
    </mj-section>


    <!-- Check In Process -->
    <mj-section padding="0 16px 8px">
      <mj-column>
        <mj-wrapper background-color="rgba(7,7,7,0.58)" padding="0" border="1px solid rgba(255,255,255,0.14)">
          <mj-section padding="20px 25px">
            <mj-column>
              <mj-text css-class="section-title" align="center">
                Proceso de Registro (Check-in)
              </mj-text>

              <mj-text css-class="section-title" align="center">
                Al llegar, deberá presentar este correo electrónico o proporcionar su nombre y apellido a uno de los representantes en la entrada.
              </mj-text>

              <mj-text css-class="section-title" align="center">
                  Una vez verificada su asistencia, nuestro equipo le brindará las indicaciones necesarias para su asiento y cualquier información adicional sobre el evento.
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
      </mj-column>
    </mj-section>

  </mj-column>
</mj-section>






<!-- This Section will be for the Ticket Confirmation Barcode and POV CAM  -->
<mj-section full-width="full-width" background-color="#090708" background-url="https://via.placeholder.com/600x400/000000/000000" padding="0">
  <mj-column padding="0">

    <!-- This Section will be for the Ticket Confirmation Barcode -->
    <mj-section padding="8px 16px 8px">
        <mj-column>
          <mj-wrapper background-color="rgba(7,7,7,0.58)" padding="0" border="1px solid rgba(255,255,255,0.14)">
            <mj-section padding="20px 25px">
              <mj-column>
                
                <mj-text align="center" font-size="24px" font-weight="bold" color="#D4AF37" padding="0 20px 10px 20px">
                  🎟️ Tu Entrada
                </mj-text>

                <mj-image align="center" width="260px" padding="10px 20px" src="https://bwipjs-api.metafloor.com/?bcid=code128&text={{ person|lookup:'confirmation' }}&scale=3&includetext&backgroundcolor=000000&barcolor=FFFFFF" alt="Código de barras" />

                <mj-text align="center" font-size="16px" color="#ffffff" padding="10px 20px 0 20px" >
                  Nombre de Confirmacion: <strong>{{ person.first_name }} {{person.last_name}}</strong>
                </mj-text>

                <mj-text align="center" font-size="16px" color="#ffffff" padding="10px 20px 0 20px" >
                  Código de Confirmación: <strong>{{ person|lookup:'confirmation' }}</strong>
                </mj-text>

                {% if person|lookup:'adultos' and person|lookup:'adultos' != '0' %}
                  <mj-text align="center" color="#ffffff">
                    Adultos: <strong>{{ person|lookup:'adultos' }}</strong>
                  </mj-text>
                {% endif %}

                {% if person|lookup:'jovenes' and person|lookup:'jovenes' != '0' %}
                  <mj-text align="center" color="#ffffff">
                    Adolescentess: <strong>{{ person|lookup:'jovenes' }}</strong>
                  </mj-text>
                {% endif %}

                {% if person|lookup:'ninos' and person|lookup:'ninos' != '0' %}
                  <mj-text align="center" color="#ffffff">
                    Niños: <strong>{{ person|lookup:'ninos' }}</strong>
                  </mj-text>
                {% endif %}

                <mj-text align="center" font-size="14px" color="#bbbbbb" padding="5px 20px 0 20px" >
                  Presenta este código al ingresar al concierto.
                </mj-text>

              </mj-column>
            </mj-section>
          </mj-wrapper>
        </mj-column>
      </mj-section> 



      <!-- POV CAM  -->  
      <mj-section padding="8px 16px 8px">
        <mj-column>
          <mj-wrapper background-color="rgba(7,7,7,0.58)" padding="0" border="1px solid rgba(255,255,255,0.14)">
            <mj-section padding="20px 25px">
              <mj-column>
                
                <mj-image src="https://jon-carlos-concert.s3.us-east-1.amazonaws.com/POV+Logo.png" alt="POV Cam Logo" width="120px" padding="0 0 10px 0" />

                <mj-text align="center" font-size="20px" font-weight="bold" color="#ffffff" padding="0 0 8px 0" >
                  📸 Captura el Momento
                </mj-text>

                <mj-text align="center" font-size="15px" color="#dddddd" line-height="1.6" padding="0 10px">
                  ¡Queremos vivir la noche a través de tus ojos! ✨  
                  Captura tus momentos favoritos durante el concierto y súbelos directamente a nuestra galería compartida usando la aplicación POV Cam.
                </mj-text>

                <mj-text align="center" font-size="15px" color="#ffffff" font-weight="bold" padding="12px 0 4px 0" >
                  Los primeros 250 participantes podrán capturar y subir sus fotos dentro de la aplicación.
                </mj-text>

                <mj-text align="center" font-size="14px" color="#bbbbbb" padding="0 10px 8px 10px" >
                  Pero no te preocupes — todos los momentos serán compartidos posteriormente en nuestra página web:
                  <br />
                  <a href="https://stkilianspanishministry.com/jon-carlo" style="color:#d4af37; text-decoration:none; font-weight:bold;" target="_blank">
                    stkilianspanishministry.com/jon-carlo
                  </a>
                </mj-text>

                <!-- QR CODE -->
                <mj-image src="https://jon-carlos-concert.s3.us-east-1.amazonaws.com/QR+for+POV+Cam.JPG" alt="Escanear QR" width="180px" padding="10px auto" />

                <!-- BUTTON -->
                <mj-button href="https://pov.camera/qr/99E8605B-4FB9-47C9-A3A9-6E556B6CF3E3" background-color="#d4af37" color="#000000" font-size="15px" border-radius="25px" padding="12px 20px" >
                  Subir mis momentos
                </mj-button>

                <mj-text align="center" font-size="13px" color="#aaaaaa" padding="10px 10px 0 10px" >
                  Todas las fotos serán recopiladas y compartidas en una galería después del evento 📷
                </mj-text>

                <mj-text align="center" font-size="13px" color="#ffffff" padding="12px 10px 0 10px" >
                  “Estaré Contigo” — capturemos juntos esos momentos donde sentimos que Dios siempre está con nosotros 🙏
                </mj-text>

              </mj-column>
            </mj-section>
          </mj-wrapper>
        </mj-column>
      </mj-section> 

  </mj-column>
</mj-section>





<!-- This Section will be for the Initiative and Parking information -->
<mj-section full-width="full-width" background-url="https://jon-carlos-concert.s3.us-east-1.amazonaws.com/jjjon080808.png" background-repeat="no-repeat" background-position="top center" background-color="#080808" padding="0" >
  <mj-column padding="0">

    <!-- Attendance Notice (glass) -->
    <mj-section padding="0 7px">
      <mj-column padding="0">
        <mj-wrapper css-class="notice" background-color="rgba(7,7,7,0.58)" padding="18px" border="1px solid rgba(255,255,255,0.18)">
          <mj-text align="center" css-class="section-title">
            Informacion para Invitados
          </mj-text>

          <mj-text align="center" css-class="muted">
            Los asientos son limitados. Todos los invitados deben asegurar sus boletos con anticipación.
          </mj-text>
        </mj-wrapper>
      </mj-column>
    </mj-section>

    <!-- Purpose Section (glass to show background through) -->
    <mj-section padding="0 16px 7px">
      <mj-column>
        <mj-wrapper background-color="rgba(7,7,7,0.58)" padding="0" border="1px solid rgba(255,255,255,0.12)" >
          <mj-section padding="20px">
            <mj-column>
              <mj-text css-class="section-title" align="center">
                Iniciativa de este Evento
              </mj-text>

              <mj-text css-class="muted">
                Este concierto es una iniciativa de recaudación de fondos en apoyo a la reposición de la estatua de la Virgen María ubicada al lado del auditorio.
              </mj-text>

              <mj-text css-class="muted">
                La estatua ha servido durante mucho tiempo como un símbolo visible de fe y reflexión para nuestra parroquia, y los fondos recaudados ayudarán a restaurar esta presencia para las futuras generaciones.
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
      </mj-column>
    </mj-section>

    <!-- Parking Map Section (glass to match) -->
    <mj-section padding="0 16px 24px">
      <mj-column>
        <mj-wrapper background-color="rgba(7,7,7,0.58)" padding="0" border="1px solid rgba(255,255,255,0.12)">
          <mj-section padding="20px">
            <mj-column>
              <mj-text css-class="section-title" align="center">
                Parking & Directions
              </mj-text>

              <mj-text css-class="muted" align="center" padding="0 0 14px 0">
                Utilice el mapa a continuación para obtener indicaciones hacia el lugar del evento. Recomendamos llegar temprano para poder estacionarse y entrar con comodidad.
              </mj-text>

              <mj-image href="https://www.google.com/maps/search/?api=1&query=50+Cherry+St+Farmingdale+NY+11735" src="https://jon-carlos-concert.s3.us-east-1.amazonaws.com/Map+of+location.png" alt="Map to venue" border-radius="16px" padding="5px" />

              <mj-text css-class="muted" align="center" font-size="12px" padding="12px 0 14px 0">
                50 Cherry St, Farmingdale, NY 11735
              </mj-text>

              <mj-button background-color="#FFFFFF" color="#000000" align="center" href="https://www.google.com/maps/search/?api=1&query=50+Cherry+St,+Farmingdale,+NY+11735" border-radius="999px" font-weight="700" padding="0" >
                Abrir en Google Maps
              </mj-button>

              <mj-text css-class="muted" align="center" font-size="13px" padding="14px 0 0 0">
                Hay estacionamiento disponible en el lugar y en las calles cercanas donde esté permitido. Por favor, siga las señales publicadas y cualquier indicación en el sitio.
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
      </mj-column>
    </mj-section>

  </mj-column>
</mj-section>




<mj-section full-width="full-width" background-color="#000000" background-url="https://via.placeholder.com/600x400/000000/000000" padding="0" css-class="force-black">
  <mj-column padding="0">

    <mj-section padding="0 7px">
      <mj-column padding="0">
        <mj-wrapper css-class="notice" background-color="#000000" padding="18px">

<!-- This Section will be for the Footer  -->
<mj-section padding="0 16px 32px" background-color="#000000">
  <mj-column>

    <mj-text align="center" css-class="muted" font-size="14px" padding="16px 0 8px" color="#dddddd">
      Thank you for supporting our parish and community initiatives.
    </mj-text>

    <!-- Website Link -->
    <mj-text align="center" font-size="13px" padding="4px 0 8px">
      <a href="https://stkilianspanishministry.com"
         style="color:#D4AF37; text-decoration:none; font-weight:600;">
        Visit Our Website
      </a>
    </mj-text>

    <!-- Preferences + Unsubscribe -->
    <mj-text align="center" font-size="12px" padding="4px 0" color="#bbbbbb" >
      <a href="{% manage_preferences_link %}"
         style="color:#bbbbbb; text-decoration:underline;">
        Manage Preferences
      </a>
      &nbsp;|&nbsp;
      <a href="{% unsubscribe_link %}"
         style="color:#bbbbbb; text-decoration:underline;">
        Unsubscribe
      </a>
    </mj-text>

    <mj-text  align="center" css-class="muted" font-size="12px" padding="8px 0 0" color="#999999">
      © 2026 St. Kilian Roman Catholic Church<br />
      You are receiving this email because you opted in to event updates.
    </mj-text>

  </mj-column>
</mj-section>

 </mj-wrapper>
      </mj-column>
    </mj-section>

  </mj-column>
</mj-section>


    `;

  mjmlTemplate = mjmlTemplate.replace("{{BULLETIN}}", email);

  fs.writeFileSync("ticket.mjml", mjmlTemplate, "utf-8");
  console.log("Generated MJML email saved as ticket.mjml");

  // Convert MJML to HTML
  const emailHtml = mjml(mjmlTemplate).html;
  fs.writeFileSync("ticket.html", emailHtml, "utf8");

  console.log("Generated HTML email saved as ticket.html");
}

updateMjmlEmail();

