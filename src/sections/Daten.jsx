import { Code2, Lightbulb, Rocket, Users, ArrowRight, Check, Calendar1 } from "lucide-react"
import { useState } from "react";
import { Button } from "@/components/Button"
import { InlineWidget, PopupButton } from "react-calendly";


export const Daten = () => {
    const [isSchmidt, setIsSchmidt] = useState(true);
    
    return (
         <section id="daten" className="pt-20 relative overflow-hidden">
            <div className="container relative z-10 min-w-screen animate-fade-in">
                <div className="container mx-auto">
                    <div className="space-y-4 py-6">
                        <h1 className="text-2xl md:text-3xl leading-tight  font-bold text-primary">Datenschutzerklärung
                        </h1>
                        <h2 className="text-xl md:text-2xl leading-tight  font-bold text-primary">1. Datenschutz auf einen Blick
                        </h2>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Allgemeine Hinweise
                        </h3>
                        <p className="text-md">
                            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten <br/>
                            passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie <br/>
                            persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen <br/>
                            Sie unserer unter diesem Text aufgeführten Datenschutzerklärung <br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Datenerfassung auf dieser Website
                        </h3>
                        <p className="text-md font-bold">
                            Wer ist verantwortlich für die Datenerfassung auf dieser Website? <br/>
                        </p>
                        <p className="text-md">
                            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten <br/>
                            können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle“ in dieser Datenschutzerklärung entnehmen. <br/>
                        </p>
                        <p className="text-md font-bold">
                            Wie erfassen wir Ihre Daten? <br/>
                        </p>
                        <p className="text-md">
                            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um <br/>
                            Daten handeln, die Sie in ein Kontaktformular eingeben. <br/>
                        </p>
                        <p className="text-md">
                            Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT <br/>
                            Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit <br/>
                            des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten. <br/>
                        </p>
                        <p className="text-md font-bold">
                            Wofür nutzen wir Ihre Daten? <br/>
                        </p>
                        <p className="text-md">
                            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere <br/>
                            Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden. Sofern über die Website Verträge <br/>
                            geschlossen oder angebahnt werden können, werden die übermittelten Daten auch für Vertragsangebote, <br/>
                            Bestellungen oder sonstige Auftragsanfragen verarbeitet. <br/>
                        </p>
                        <p className="text-md font-bold">
                            Welche Rechte haben Sie bezüglich Ihrer Daten? <br/>
                        </p>
                         <p className="text-md">
                            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer <br/>
                            gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder <br/>
                            Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, <br/>
                            können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter <br/>
                            bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. <br/>
                            Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. <br/><br/>
                            Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden. <br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Analyse-Tools und Tools von Drittanbietern
                        </h3>
                        <p className="text-md">
                            Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor <br/>
                            allem mit sogenannten Analyseprogrammen. <br/><br/>
                            Detaillierte Informationen zu diesen Analyseprogrammen finden Sie in der folgenden <br/>
                            Datenschutzerklärung. <br/>
                        </p>
                         <h2 className="text-xl md:text-2xl leading-tight  font-bold text-primary">2. Hosting
                        </h2>
                         <p className="text-md">
                            Wir hosten die Inhalte unserer Website bei folgendem Anbieter: <br/>
                        </p>
                         <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Externes Hosting
                        </h3>
                         <p className="text-md">
                            Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden<br/>
                            werden auf den Servern des Hosters / der Hoster gespeichert. Hierbei kann es sich v. a. um IP-Adressen,<br/>
                            Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe<br/>
                            und sonstige Daten, die über eine Website generiert werden, handeln.<br/><br/>
                            Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und<br/>
                            bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und effizienten<br/>
                            Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).<br/>
                            Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf<br/>
                            Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG, soweit die Einwilligung die Speicherung<br/>
                            von Cookies oder den Zugriff auf Informationen im Endgerät des Nutzers (z. B. Device-Fingerprinting) im<br/>
                            Sinne des TDDDG umfasst. Die Einwilligung ist jederzeit widerrufbar.<br/><br/>
                            Unser(e) Hoster wird bzw. werden Ihre Daten nur insoweit verarbeiten, wie dies zur Erfüllung seiner<br/>
                            Leistungspflichten erforderlich ist und unsere Weisungen in Bezug auf diese Daten befolgen.<br/><br/>
                            Wir setzen folgende(n) Hoster ein:<br/><br/>
                            Hostinger International Ltd.<br/>
                            61 Lordou Vironos Street<br/>
                            Lumiel Building, 4th Floor<br/>
                            6023 Larnaca<br/>
                            Zypern<br/>
                        </p>
                         <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Auftragsverarbeitung
                        </h3>
                        <p className="text-md">
                            Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes<br/>
                            geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der<br/>
                            gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach unseren<br/>
                            Weisungen und unter Einhaltung der DSGVO verarbeitet.<br/>
                        </p>
                         <h2 className="text-xl md:text-2xl leading-tight  font-bold text-primary">3. Allgemeine Hinweise und Pflichtinformationen
                        </h2>
                         <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Datenschutz
                        </h3>
                        <p className="text-md">
                            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre<br/>
                            personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie<br/>
                            dieser Datenschutzerklärung.<br/><br/>
                            Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben.<br/>
                            Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende<br/>
                            Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie<br/>
                            und zu welchem Zweck das geschieht.<br/><br/>
                            Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail)<br/>
                            Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht<br/>
                            möglich.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Hinweis zur verantwortlichen Stelle
                        </h3>
                        <p className="text-md">
                            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br/><br/>
                            Fatma Selcan Yilmaz<br/>
                            Ragazerstr.15<br/>
                            13407 Berlin<br/><br/>
                            Telefon: 00491775022131<br/>
                            E-Mail: kontakt@spirit-healing.coach<br/><br/>
                            Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über<br/>
                            die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.)<br/>
                            entscheidet.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Speicherdauer
                        </h3>
                        <p className="text-md">
                            Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben<br/>
                            Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein<br/>
                            berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen,<br/>
                            werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer<br/>
                            personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im<br/>
                            letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung auf dieser<br/>
                            Website
                        </h3>
                        <p className="text-md">
                            Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf<br/>
                            Grundlage von Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO, sofern besondere Datenkategorien<br/>
                            nach Art. 9 Abs. 1 DSGVO verarbeitet werden. Im Falle einer ausdrücklichen Einwilligung in die Übertragung<br/>
                            personenbezogener Daten in Drittstaaten erfolgt die Datenverarbeitung außerdem auf Grundlage von Art.<br/>
                            49 Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies oder in den Zugriff auf Informationen in<br/>
                            Ihr Endgerät (z. B. via Device-Fingerprinting) eingewilligt haben, erfolgt die Datenverarbeitung zusätzlich<br/>
                            auf Grundlage von § 25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar. Sind Ihre Daten zur<br/>
                            Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, verarbeiten wir Ihre<br/>
                            Daten auf Grundlage des Art. 6 Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir Ihre Daten, sofern diese<br/>
                            zur Erfüllung einer rechtlichen Verpflichtung erforderlich sind auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO.<br/>
                            Die Datenverarbeitung kann ferner auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f<br/>
                            DSGVO erfolgen. Über die jeweils im Einzelfall einschlägigen Rechtsgrundlagen wird in den folgenden<br/>
                            Absätzen dieser Datenschutzerklärung informiert.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Empfänger von personenbezogenen Daten
                        </h3>
                        <p className="text-md">
                            Im Rahmen unserer Geschäftstätigkeit arbeiten wir mit verschiedenen externen Stellen zusammen. Dabei<br/>
                            ist teilweise auch eine Übermittlung von personenbezogenen Daten an diese externen Stellen erforderlich.<br/>
                            Wir geben personenbezogene Daten nur dann an externe Stellen weiter, wenn dies im Rahmen einer<br/>
                            Vertragserfüllung erforderlich ist, wenn wir gesetzlich hierzu verpflichtet sind (z. B. Weitergabe von Daten<br/>
                            an Steuerbehörden), wenn wir ein berechtigtes Interesse nach Art. 6 Abs. 1 lit. f DSGVO an der Weitergabe<br/>
                            haben oder wenn eine sonstige Rechtsgrundlage die Datenweitergabe erlaubt. Beim Einsatz von<br/>
                            Auftragsverarbeitern geben wir personenbezogene Daten unserer Kunden nur auf Grundlage eines gültigen<br/>
                            Vertrags über Auftragsverarbeitung weiter. Im Falle einer gemeinsamen Verarbeitung wird ein Vertrag über<br/>
                            gemeinsame Verarbeitung geschlossen.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Widerruf Ihrer Einwilligung zur Datenverarbeitung
                        </h3>
                        <p className="text-md">
                            Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine<br/>
                            bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten<br/>
                            Datenverarbeitung bleibt vom Widerruf unberührt.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen<br/>
                            Direktwerbung (Art. 21 DSGVO)
                        </h3>
                        <p className="text-md">
                            WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F DSGVO<br/>
                            ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN<br/>
                            SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN<br/>
                            WIDERSPRUCH EINZULEGEN; DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN GESTÜTZTES<br/>
                            PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF DENEN EINE VERARBEITUNG BERUHT,<br/>
                            ENTNEHMEN SIE DIESER DATENSCHUTZERKLÄRUNG. WENN SIE WIDERSPRUCH EINLEGEN,<br/>
                            WERDEN WIR IHRE BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES<br/>
                            SEI DENN, WIR KÖNNEN ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG<br/>
                            NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN ÜBERWIEGEN ODER DIE<br/>
                            VERARBEITUNG DIENT DER GELTENDMACHUNG, AUSÜBUNG ODER VERTEIDIGUNG VON<br/>
                            RECHTSANSPRÜCHEN (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).<br/><br/>
                            WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN,<br/>
                            SO HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE<br/>
                            BETREFFENDER PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG<br/>
                            EINZULEGEN; DIES GILT AUCH FÜR DAS PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN<br/>
                            VERBINDUNG STEHT. WENN SIE WIDERSPRECHEN, WERDEN IHRE PERSONENBEZOGENEN DATEN<br/>
                            ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER DIREKTWERBUNG VERWENDET (WIDERSPRUCH<br/>
                            NACH ART. 21 ABS. 2 DSGVO).<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Beschwerderecht bei der zuständigen Aufsichtsbehörde
                        </h3>
                        <p className="text-md">
                            Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer<br/>
                            Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes<br/>
                            oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht unbeschadet anderweitiger<br/>
                            verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Recht auf Datenübertragbarkeit
                        </h3>
                        <p className="text-md">
                            Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags<br/>
                            automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format<br/>
                            aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen<br/>
                            verlangen, erfolgt dies nur, soweit es technisch machbar ist.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Auskunft, Berichtigung und Löschung
                        </h3>
                        <p className="text-md">
                            Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche<br/>
                            Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den<br/>
                            Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie<br/>
                            zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Recht auf Einschränkung der Verarbeitung
                        </h3>
                        <p className="text-md">
                            Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.<br/>
                            Hierzu können Sie sich jederzeit an uns wenden. Das Recht auf Einschränkung der Verarbeitung besteht in<br/>
                            folgenden Fällen:<br/><br/>
                            - Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten bestreiten, benötigen wir<br/>
                            <span className="pl-3">in der Regel Zeit, um dies zu überprüfen. Für die Dauer der Prüfung haben Sie das Recht, die<br/></span>
                            <span className="pl-3">Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.<br/></span>
                            - Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig geschah/geschieht, können Sie<br/>
                            <span className="pl-3">statt der Löschung die Einschränkung der Datenverarbeitung verlangen.<br/></span>
                            - Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen, Sie sie jedoch zur Ausübung,<br/>
                            <span className="pl-3">Verteidigung oder Geltendmachung von Rechtsansprüchen benötigen, haben Sie das Recht, statt der<br/></span>
                            <span className="pl-3">Löschung die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.<br/></span>
                            - Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine Abwägung zwischen<br/>
                            <span className="pl-3">Ihren und unseren Interessen vorgenommen werden. Solange noch nicht feststeht, wessen Interessen<br/></span>
                            <span className="pl-3">überwiegen, haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten<br/></span>
                            <span className="pl-3">zu verlangen.<br/><br/></span>
                            Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten eingeschränkt haben, dürfen diese Daten – von<br/>
                            ihrer Speicherung abgesehen – nur mit Ihrer Einwilligung oder zur Geltendmachung, Ausübung oder<br/>
                            Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte einer anderen natürlichen oder<br/>
                            juristischen Person oder aus Gründen eines wichtigen öffentlichen Interesses der Europäischen Union oder<br/>
                            eines Mitgliedstaats verarbeitet werden.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">SSL- bzw. TLS-Verschlüsselung
                        </h3>
                        <p className="text-md">
                            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum<br/>
                            Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLSV-<br/>
                            erschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von<br/>
                            „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.<br/><br/>
                            Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht<br/>
                            von Dritten mitgelesen werden.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Widerspruch gegen Werbe-E-Mails
                        </h3>
                        <p className="text-md">
                            Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von<br/>
                            nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Die<br/>
                            Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von<br/>
                            Werbeinformationen, etwa durch Spam-E-Mails, vor.<br/>
                        </p>
                         <h2 className="text-xl md:text-2xl leading-tight  font-bold text-primary">4. Datenerfassung auf dieser Website
                        </h2>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Cookies
                        </h3>
                        <p className="text-md">
                            Unsere Internetseiten verwenden so genannte „Cookies“. Cookies sind kleine Datenpakete und richten auf<br/>
                            Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung<br/>
                            (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. Session-Cookies<br/>
                            werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben auf Ihrem Endgerät<br/>
                            gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch Ihren Webbrowser erfolgt.<br/><br/>
                            Cookies können von uns (First-Party-Cookies) oder von Drittunternehmen stammen (sog. Third-Party-<br/>
                            Cookies). Third-Party-Cookies ermöglichen die Einbindung bestimmter Dienstleistungen von<br/>
                            Drittunternehmen innerhalb von Webseiten (z. B. Cookies zur Abwicklung von Zahlungsdienstleistungen).<br/><br/>
                            Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind technisch notwendig, da bestimmte<br/>
                            Webseitenfunktionen ohne diese nicht funktionieren würden (z. B. die Warenkorbfunktion oder die Anzeige<br/>
                            von Videos). Andere Cookies können zur Auswertung des Nutzerverhaltens oder zu Werbezwecken<br/>
                            verwendet werden.<br/><br/>
                            Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs, zur Bereitstellung<br/>
                            bestimmter, von Ihnen erwünschter Funktionen (z. B. für die Warenkorbfunktion) oder zur Optimierung der<br/>
                            Website (z. B. Cookies zur Messung des Webpublikums) erforderlich sind (notwendige Cookies), werden auf<br/>
                            Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert, sofern keine andere Rechtsgrundlage angegeben wird.<br/>
                            Der Websitebetreiber hat ein berechtigtes Interesse an der Speicherung von notwendigen Cookies zur<br/>
                            technisch fehlerfreien und optimierten Bereitstellung seiner Dienste. Sofern eine Einwilligung zur<br/>
                            Speicherung von Cookies und vergleichbaren Wiedererkennungstechnologien abgefragt wurde, erfolgt die<br/>
                            Verarbeitung ausschließlich auf Grundlage dieser Einwilligung (Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1<br/>
                            TDDDG); die Einwilligung ist jederzeit widerrufbar.<br/><br/>
                            Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und<br/>
                            Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen<br/>
                            sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren. Bei der<br/>
                            Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.<br/><br/>
                            Sofern weitere Cookies und Dienste auf dieser Website eingesetzt werden, können Sie dies dieser<br/>
                            Datenschutzerklärung entnehmen.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Kontaktformular
                        </h3>
                        <p className="text-md">
                            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem<br/>
                            Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage<br/>
                            und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre<br/>
                            Einwilligung weiter.<br/><br/>
                            Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit<br/>
                            der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen<br/>
                            erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der<br/>
                            effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer<br/>
                            Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde; die Einwilligung ist jederzeit<br/>
                            widerrufbar.<br/><br/>
                            Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung<br/>
                            auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt<br/>
                            (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende gesetzliche Bestimmungen –<br/>
                            insbesondere Aufbewahrungsfristen – bleiben unberührt.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Anfrage per E-Mail, Telefon oder Telefax
                        </h3>
                        <p className="text-md">
                            Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird Ihre Anfrage inklusive aller daraus<br/>
                            hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens<br/>
                            bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.<br/><br/>
                            Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit<br/>
                            der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen<br/>
                            erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der<br/>
                            effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer<br/>
                            Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde; die Einwilligung ist jederzeit<br/>
                            widerrufbar.<br/><br/>
                            Die von Ihnen an uns per Kontaktanfragen übersandten Daten verbleiben bei uns, bis Sie uns zur Löschung<br/>
                            auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt<br/>
                            (z. B. nach abgeschlossener Bearbeitung Ihres Anliegens). Zwingende gesetzliche Bestimmungen –<br/>
                            insbesondere gesetzliche Aufbewahrungsfristen – bleiben unberührt.<br/>
                        </p>
                        <h2 className="text-xl md:text-2xl leading-tight  font-bold text-primary">5. Soziale Medien
                        </h2>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Facebook
                        </h3>
                        <p className="text-md">
                            Auf dieser Website sind Elemente des sozialen Netzwerks Facebook integriert. Anbieter dieses Dienstes ist<br/>
                            die Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland. Die erfassten Daten werden<br/>
                            nach Aussage von Facebook jedoch auch in die USA und in andere Drittländer übertragen.<br/><br/>
                            Eine Übersicht über die Facebook Social-Media-Elemente finden Sie hier:<br/>
                            https://developers.facebook.com/docs/plugins/?locale=de_DE.<br/><br/>
                            Wenn das Social-Media-Element aktiv ist, wird eine direkte Verbindung zwischen Ihrem Endgerät und dem<br/>
                            Facebook-Server hergestellt. Facebook erhält dadurch die Information, dass Sie mit Ihrer IP-Adresse diese<br/>
                            Website besucht haben. Wenn Sie den Facebook „Like-Button“ anklicken, während Sie in Ihrem Facebook-<br/>
                            Account eingeloggt sind, können Sie die Inhalte dieser Website auf Ihrem Facebook-Profil verlinken.<br/>
                            Dadurch kann Facebook den Besuch dieser Website Ihrem Benutzerkonto zuordnen. Wir weisen darauf hin,<br/>
                            dass wir als Anbieter der Seiten keine Kenntnis vom Inhalt der übermittelten Daten sowie deren Nutzung<br/>
                            durch Facebook erhalten. Weitere Informationen hierzu finden Sie in der Datenschutzerklärung von<br/>
                            Facebook unter:<br/><br/>
                            https://de-de.facebook.com/privacy/explanation.<br/><br/>
                            Die Nutzung dieses Dienstes erfolgt auf Grundlage Ihrer Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und §<br/>
                            25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar<br/><br/>
                            Soweit mit Hilfe des hier beschriebenen Tools personenbezogene Daten auf unserer Website erfasst und an<br/>
                            Facebook weitergeleitet werden, sind wir und die Meta Platforms Ireland Limited, Merrion Road Dublin 4,<br/>
                            Dublin, D04 X2K5, Irland gemeinsam für diese Datenverarbeitung verantwortlich (Art. 26 DSGVO). Die<br/>
                            gemeinsame Verantwortlichkeit beschränkt sich dabei ausschließlich auf die Erfassung der Daten und deren<br/>
                            Weitergabe an Facebook. Die nach der Weiterleitung erfolgende Verarbeitung durch Facebook ist nicht Teil<br/>
                            der gemeinsamen Verantwortung. Die uns gemeinsam obliegenden Verpflichtungen wurden in einer<br/>
                            Vereinbarung über gemeinsame Verarbeitung festgehalten. Den Wortlaut der Vereinbarung finden Sie<br/>
                            unter:<br/><br/>
                            https://www.facebook.com/legal/controller_addendum. Laut dieser Vereinbarung sind wir für die Erteilung<br/>
                            der Datenschutzinformationen beim Einsatz des Facebook-Tools und für die datenschutzrechtlich sichere<br/>
                            Implementierung des Tools auf unserer Website verantwortlich. Für die Datensicherheit der Facebook-<br/>
                            Produkte ist Facebook verantwortlich. Betroffenenrechte (z. B. Auskunftsersuchen) hinsichtlich der bei<br/>
                            Facebook verarbeiteten Daten können Sie direkt bei Facebook geltend machen. Wenn Sie die<br/>
                            Betroffenenrechte bei uns geltend machen, sind wir verpflichtet, diese an Facebook weiterzuleiten.<br/><br/>
                            Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der EU-Kommission gestützt.<br/>
                            Details finden Sie hier:<br/>
                            https://www.facebook.com/legal/EU_data_transfer_addendum,<br/>
                            https://de-de.facebook.com/help/566994660333381 und<br/>
                            https://www.facebook.com/policy.php.<br/><br/>
                            Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US Data Privacy Framework“ (DPF). Der<br/>
                            DPF ist ein Übereinkommen zwischen der Europäischen Union und den USA, der die Einhaltung<br/>
                            europäischer Datenschutzstandards bei Datenverarbeitungen in den USA gewährleisten soll. Jedes nach<br/>
                            dem DPF zertifizierte Unternehmen verpflichtet sich, diese Datenschutzstandards einzuhalten. Weitere<br/>
                            Informationen hierzu erhalten Sie vom Anbieter unter folgendem Link:<br/>
                            https://www.dataprivacyframework.gov/participant/4452.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Instagram
                        </h3>
                        <p className="text-md">
                            Auf dieser Website sind Funktionen des Dienstes Instagram eingebunden. Diese Funktionen werden<br/>
                            angeboten durch die Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland.<br/><br/>
                            Wenn das Social-Media-Element aktiv ist, wird eine direkte Verbindung zwischen Ihrem Endgerät und dem<br/>
                            Instagram-Server hergestellt. Instagram erhält dadurch Informationen über den Besuch dieser Website<br/>
                            durch Sie.<br/><br/>
                            Wenn Sie in Ihrem Instagram-Account eingeloggt sind, können Sie durch Anklicken des Instagram-Buttons<br/>
                            die Inhalte dieser Website mit Ihrem Instagram-Profil verlinken. Dadurch kann Instagram den Besuch dieser<br/>
                            Website Ihrem Benutzerkonto zuordnen. Wir weisen darauf hin, dass wir als Anbieter der Seiten keine<br/>
                            Kenntnis vom Inhalt der übermittelten Daten sowie deren Nutzung durch Instagram erhalten.<br/><br/>
                            Die Nutzung dieses Dienstes erfolgt auf Grundlage Ihrer Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und §<br/>
                            25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar.<br/><br/>
                            Soweit mit Hilfe des hier beschriebenen Tools personenbezogene Daten auf unserer Website erfasst und an<br/>
                            Facebook bzw. Instagram weitergeleitet werden, sind wir und die Meta Platforms Ireland Limited, Merrion<br/>
                            Road Dublin 4, Dublin, D04 X2K5, Irland gemeinsam für diese Datenverarbeitung verantwortlich (Art. 26<br/>
                            DSGVO). Die gemeinsame Verantwortlichkeit beschränkt sich dabei ausschließlich auf die Erfassung der<br/>
                            Daten und deren Weitergabe an Facebook bzw. Instagram. Die nach der Weiterleitung erfolgende<br/>
                            Verarbeitung durch Facebook bzw. Instagram ist nicht Teil der gemeinsamen Verantwortung. Die uns<br/>
                            gemeinsam obliegenden Verpflichtungen wurden in einer Vereinbarung über gemeinsame Verarbeitung<br/>
                            festgehalten. Den Wortlaut der Vereinbarung finden Sie unter:<br/>
                            https://www.facebook.com/legal/controller_addendum. Laut dieser Vereinbarung sind wir für die Erteilung<br/>
                            der Datenschutzinformationen beim Einsatz des Facebook- bzw. Instagram-Tools und für die<br/>
                            datenschutzrechtlich sichere Implementierung des Tools auf unserer Website verantwortlich. Für die<br/>
                            Datensicherheit der Facebook bzw. Instagram-Produkte ist Facebook verantwortlich. Betroffenenrechte<br/>
                            (z. B. Auskunftsersuchen) hinsichtlich der bei Facebook bzw. Instagram verarbeiteten Daten können Sie<br/>
                            direkt bei Facebook geltend machen. Wenn Sie die Betroffenenrechte bei uns geltend machen, sind wir<br/>
                            verpflichtet, diese an Facebook weiterzuleiten.<br/><br/>
                            Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der EU-Kommission gestützt.<br/>
                            Details finden Sie hier:<br/>
                            https://www.facebook.com/legal/EU_data_transfer_addendum,<br/>
                            https://privacycenter.instagram.com/policy/ und<br/>
                            https://de-de.facebook.com/help/566994660333381.<br/><br/>
                            Weitere Informationen hierzu finden Sie in der Datenschutzerklärung von Instagram:<br/>
                            https://privacycenter.instagram.com/policy/.<br/><br/>
                            Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US Data Privacy Framework“ (DPF). Der<br/>
                            DPF ist ein Übereinkommen zwischen der Europäischen Union und den USA, der die Einhaltung<br/>
                            europäischer Datenschutzstandards bei Datenverarbeitungen in den USA gewährleisten soll. Jedes nach<br/>
                            dem DPF zertifizierte Unternehmen verpflichtet sich, diese Datenschutzstandards einzuhalten. Weitere<br/>
                            Informationen hierzu erhalten Sie vom Anbieter unter folgendem Link:<br/>
                            https://www.dataprivacyframework.gov/participant/4452.<br/>
                        </p>
                        <h2 className="text-xl md:text-2xl leading-tight  font-bold text-primary">6. Newsletter
                        </h2>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Newsletterdaten
                        </h3>
                        <p className="text-md">
                            Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-<br/>
                            Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass Sie der Inhaber der<br/>
                            angegebenen E-Mail-Adresse sind und mit dem Empfang des Newsletters einverstanden sind. Weitere<br/>
                            Daten werden nicht bzw. nur auf freiwilliger Basis erhoben. Diese Daten verwenden wir ausschließlich für<br/>
                            den Versand der angeforderten Informationen und geben diese nicht an Dritte weiter.<br/><br/>
                            Die Verarbeitung der in das Newsletteranmeldeformular eingegebenen Daten erfolgt ausschließlich auf<br/>
                            Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die erteilte Einwilligung zur Speicherung der<br/>
                            Daten, der E-Mail-Adresse sowie deren Nutzung zum Versand des Newsletters können Sie jederzeit<br/>
                            widerrufen, etwa über den „Austragen“-Link im Newsletter. Die Rechtmäßigkeit der bereits erfolgten<br/>
                            Datenverarbeitungsvorgänge bleibt vom Widerruf unberührt.<br/><br/>
                            Die von Ihnen zum Zwecke des Newsletter-Bezugs bei uns hinterlegten Daten werden von uns bis zu Ihrer<br/>
                            Austragung aus dem Newsletter bei uns bzw. dem Newsletterdiensteanbieter gespeichert und nach der<br/>
                            Abbestellung des Newsletters oder nach Zweckfortfall aus der Newsletterverteilerliste gelöscht. Wir<br/>
                            behalten uns vor, E-Mail-Adressen aus unserem Newsletterverteiler nach eigenem Ermessen im Rahmen<br/>
                            unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO zu löschen oder zu sperren.<br/><br/>
                            Daten, die zu anderen Zwecken bei uns gespeichert wurden, bleiben hiervon unberührt.<br/><br/>
                            Nach Ihrer Austragung aus der Newsletterverteilerliste wird Ihre E-Mail-Adresse bei uns bzw. dem<br/>
                            Newsletterdiensteanbieter ggf. in einer Blacklist gespeichert, sofern dies zur Verhinderung künftiger<br/>
                            Mailings erforderlich ist. Die Daten aus der Blacklist werden nur für diesen Zweck verwendet und nicht mit<br/>
                            anderen Daten zusammengeführt. Dies dient sowohl Ihrem Interesse als auch unserem Interesse an der<br/>
                            Einhaltung der gesetzlichen Vorgaben beim Versand von Newslettern (berechtigtes Interesse im Sinne des<br/>
                            Art. 6 Abs. 1 lit. f DSGVO). Die Speicherung in der Blacklist ist zeitlich nicht befristet. Sie können der<br/>
                            Speicherung widersprechen, sofern Ihre Interessen unser berechtigtes Interesse überwiegen.<br/>
                        </p>
                        <h2 className="text-xl md:text-2xl leading-tight  font-bold text-primary">7. Plugins und Tools
                        </h2>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">YouTube mit erweitertem Datenschutz
                        </h3>
                        <p className="text-md">
                            Diese Website bindet Videos der Website YouTube ein. Betreiber der Website ist die Google Ireland Limited<br/>
                            („Google”), Gordon House, Barrow Street, Dublin 4, Irland.<br/><br/>
                            Wenn Sie eine dieser Website besuchen, auf denen YouTube eingebunden ist, wird eine Verbindung zu den<br/>
                            Servern von YouTube hergestellt. Dabei wird dem YouTube-Server mitgeteilt, welche unserer Seiten Sie<br/>
                            besucht haben. Wenn Sie in Ihrem YouTube-Account eingeloggt sind, ermöglichen Sie YouTube, Ihr<br/>
                            Surfverhalten direkt Ihrem persönlichen Profil zuzuordnen. Dies können Sie verhindern, indem Sie sich aus<br/>
                            Ihrem YouTube-Account ausloggen.<br/><br/>
                            Wir nutzen YouTube im erweiterten Datenschutzmodus. Videos, die im erweiterten Datenschutzmodus<br/>
                            abgespielt werden, werden nach Aussage von YouTube nicht zur Personalisierung des Surfens auf YouTube<br/>
                            eingesetzt. Anzeigen, die im erweiterten Datenschutzmodus ausgespielt werden, sind ebenfalls nicht<br/>
                            personalisiert. Im erweiterten Datenschutzmodus werden keine Cookies gesetzt. Stattdessen werden<br/>
                            jedoch sogenannte Local Storage Elemente im Browser des Users gespeichert, die ähnlich wie Cookies<br/>
                            personenbezogene Daten beinhalten und zur Wiedererkennung eingesetzt werden können. Details zum<br/>
                            erweiterten Datenschutzmodus finden Sie hier:<br/>
                            https://support.google.com/youtube/answer/171780.<br/><br/>
                            Gegebenenfalls können nach der Aktivierung eines YouTube-Videos weitere Datenverarbeitungsvorgänge<br/>
                            ausgelöst werden, auf die wir keinen Einfluss haben.<br/><br/>
                            Die Nutzung von YouTube erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote.<br/>
                            Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar. Sofern eine entsprechende<br/>
                            Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a<br/>
                            DSGVO und § 25 Abs. 1 TDDDG, soweit die Einwilligung die Speicherung von Cookies oder den Zugriff auf<br/>
                            Informationen im Endgerät des Nutzers (z. B. Device-Fingerprinting) im Sinne des TDDDG umfasst. Die<br/>
                            Einwilligung ist jederzeit widerrufbar.<br/><br/>
                            Weitere Informationen über Datenschutz bei YouTube finden Sie in deren Datenschutzerklärung unter:<br/>
                            https://policies.google.com/privacy?hl=de.<br/><br/>
                            Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US Data Privacy Framework“ (DPF). Der<br/>
                            DPF ist ein Übereinkommen zwischen der Europäischen Union und den USA, der die Einhaltung<br/>
                            europäischer Datenschutzstandards bei Datenverarbeitungen in den USA gewährleisten soll. Jedes nach<br/>
                            dem DPF zertifizierte Unternehmen verpflichtet sich, diese Datenschutzstandards einzuhalten. Weitere<br/>
                            Informationen hierzu erhalten Sie vom Anbieter unter folgendem Link:<br/>
                            https://www.dataprivacyframework.gov/participant/5780.<br/>
                        </p>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Google Fonts (lokales Hosting)
                        </h3>
                        <p className="text-md">
                            Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Google Fonts, die von Google<br/>
                            bereitgestellt werden. Die Google Fonts sind lokal installiert. Eine Verbindung zu Servern von Google findet<br/>
                            dabei nicht statt.<br/><br/>
                            Weitere Informationen zu Google Fonts finden Sie unter<br/>
                            https://developers.google.com/fonts/faq und in der Datenschutzerklärung von Google:<br/>
                            https://policies.google.com/privacy?hl=de.  <br/>     
                        </p>
                        <h2 className="text-xl md:text-2xl leading-tight  font-bold text-primary">8. Eigene Dienste
                        </h2>
                        <h3 className="text-lg md:text-xl leading-tight  font-bold text-primary">Google Drive
                        </h3>
                        <p className="text-md">
                            Wir haben Google Drive auf dieser Website eingebunden. Anbieter ist die Google Ireland Limited („Google“),<br/>
                            Gordon House, Barrow Street, Dublin 4, Irland.<br/><br/>
                            Google Drive ermöglicht es uns, einen Uploadbereich auf unserer Website einzubinden, in dem Sie Inhalte<br/>
                            hochladen können. Wenn Sie Inhalte hochladen, werden diese auf den Servern von Google Drive<br/>
                            gespeichert. Wenn Sie unsere Website betreten, wird außerdem eine Verbindung zu Google Drive<br/>
                            aufgebaut, sodass Google Drive feststellen kann, dass Sie unsere Website besucht haben.<br/><br/>
                            Die Verwendung von Google Drive erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der<br/>
                            Websitebetreiber hat ein berechtigtes Interesse an einem zuverlässigen Uploadbereich auf seiner Website.<br/>
                            Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf<br/>
                            Grundlage von Art. 6 Abs. 1 lit. a DSGVO; die Einwilligung ist jederzeit widerrufbar.<br/><br/>
                            Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US Data Privacy Framework“ (DPF). Der<br/>
                            DPF ist ein Übereinkommen zwischen der Europäischen Union und den USA, der die Einhaltung<br/>
                            europäischer Datenschutzstandards bei Datenverarbeitungen in den USA gewährleisten soll. Jedes nach<br/>
                            dem DPF zertifizierte Unternehmen verpflichtet sich, diese Datenschutzstandards einzuhalten. Weitere<br/>
                            Informationen hierzu erhalten Sie vom Anbieter unter folgendem Link:<br/>
                            https://www.dataprivacyframework.gov/participant/5780.<br/><br/>
                            Auftragsverarbeitung<br/><br/>
                            Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes<br/>
                            geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der<br/>
                            gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach unseren<br/>
                            Weisungen und unter Einhaltung der DSGVO verarbeitet.<br/><br/>
                            Quelle:<br/>
                            https://www.e-recht24.de    <br/> 
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}