import assert from "node:assert/strict";
import test from "node:test";
import { getAssistantAnswer } from "../src/components/assistantKnowledge.js";

const examples = [
    ["Ich habe keine E-Mail bekommen", "missing_email"],
    ["Wie bekomme ich ein neues Passwort?", "password"],
    ["Mein Direktlink ist weg", "direct_link"],
    ["Wie registriere ich mich kostenlos?", "member_registration"],
    ["Was finde ich im Mitgliederbereich?", "member_content"],
    ["Wie lang ist der Vortrag und wie viele Seiten hat das Workbook?", "member_details"],
    ["Was ist der Unterschied zwischen den Meditationen?", "meditation_difference"],
    ["Kann ich die Meditation als MP3 herunterladen?", "member_downloads"],
    ["Wo sehe ich den Vortrag Wer entscheidet eigentlich dein Leben?", "event_recording"],
    ["Was kostet eine Sitzung?", "prices"],
    ["Gibt es 5er Pakete mit Rabatt?", "packages"],
    ["Wie lange dauert ein Termin?", "duration"],
    ["Wo kann ich einen Termin buchen?", "booking"],
    ["Kann ich meinen Termin verschieben?", "rescheduling"],
    ["Ich muss den Termin leider absagen", "cancellation"],
    ["Gibt es eine Begleitung über 6 Monate?", "long_programs"],
    ["Welche Sitzung passt zu mir?", "session_fit"],
    ["Was ist der Unterschied zwischen Erst- und Folgesitzung?", "first_followup"],
    ["Soll ich eine Einzelsitzung oder eine gemeinsame Sitzung buchen?", "individual_joint"],
    ["Was passiert bei der Intensivsitzung?", "intensive"],
    ["Soll ich Sabine oder Selcan buchen?", "choose_person"],
    ["Wobei könnt ihr mir helfen?", "help_general"],
    ["Was ist Spirit Healing eigentlich?", "what_is_spirit_healing"],
    ["Was sind innere Anteile?", "parts_explained"],
    ["Ist mein Bauchgefühl das Selbst oder ein Anteil?", "self_or_part"],
    ["Wie arbeitet ihr konkret in vier Schritten?", "process_steps"],
    ["Wo finde ich Erfahrungsberichte?", "testimonials"],
    ["Ich bin dauernd erschöpft und unter Strom", "stress_exhaustion"],
    ["Ich kann schlecht Grenzen setzen", "relationships"],
    ["Ich fühle mich nie gut genug", "self_worth"],
    ["Ich schiebe Entscheidungen immer auf", "decisions_parts"],
    ["Ich fühle innerlich gar nichts mehr", "numbness"],
    ["Kann ich mit körperlichen Beschwerden kommen?", "body"],
    ["Was bedeutet traumasensibel?", "trauma_sensitive"],
    ["Welche Methoden nutzt ihr?", "methods_overview"],
    ["Was ist der Unterschied zwischen Coaching und Therapie?", "coaching_therapy"],
    ["Arbeitet ihr mit Hypnose oder NLP?", "hypnosis_nlp"],
    ["Bietet ihr Familienaufstellung an?", "constellation"],
    ["Muss ich spirituell sein?", "energy_spiritual"],
    ["Ich weiß noch gar nicht genau, was mein Thema ist", "topic_clarity"],
    ["Wie läuft eine Sitzung ab?", "session_process"],
    ["Wie bereite ich mich vor?", "preparation"],
    ["Darf ich vor der Sitzung Alkohol trinken?", "substances"],
    ["Was, wenn ich während der Sitzung weine?", "emotions"],
    ["Findet das auf Zoom oder in Berlin statt?", "online_location_language"],
    ["Sind meine Angaben vertraulich?", "privacy"],
    ["Zahlt die Krankenkasse oder bekomme ich eine Rechnung?", "insurance_invoice"],
    ["Wie lautet eure Telefonnummer?", "contact"],
];

const turkishExamples = [
    ["Üyelik için e-posta gelmedi", "missing_email"],
    ["Şifremi unuttum, nasıl yenilerim?", "password"],
    ["Kişisel giriş linkim kayboldu", "direct_link"],
    ["Ücretsiz nasıl üye olabilirim?", "member_registration"],
    ["Üye alanında neler var?", "member_content"],
    ["Sunum kaç dakika ve çalışma kitabı kaç sayfa?", "member_details"],
    ["İki meditasyonun farkı nedir?", "meditation_difference"],
    ["Meditasyonu MP3 olarak indirebilir miyim?", "member_downloads"],
    ["Hayatına kim karar veriyor sunum kaydını nerede izlerim?", "event_recording"],
    ["Bir seansın ücreti ne kadar?", "prices"],
    ["İndirimli 5 seans paketi var mı?", "packages"],
    ["Bir randevu kaç dakika sürer?", "duration"],
    ["Nereden randevu alabilirim?", "booking"],
    ["Randevumu başka bir tarihe değiştirebilir miyim?", "rescheduling"],
    ["Randevumu iptal etmem gerekiyor", "cancellation"],
    ["6 aylık uzun süreli destek var mı?", "long_programs"],
    ["Hangi seans bana uygun?", "session_fit"],
    ["İlk seansla takip seansı arasındaki fark ne?", "first_followup"],
    ["Bireysel mi ortak seans mı seçmeliyim?", "individual_joint"],
    ["150 dakikalık yoğun seansta ne oluyor?", "intensive"],
    ["Sabine mi Selcan mı, kiminle çalışmalıyım?", "choose_person"],
    ["Hangi konularda destek oluyorsunuz?", "help_general"],
    ["Spirit Healing nedir?", "what_is_spirit_healing"],
    ["İçsel parçalar nedir?", "parts_explained"],
    ["İç sesim sezgi mi korku mu?", "self_or_part"],
    ["Somut olarak dört adımda nasıl ilerliyorsunuz?", "process_steps"],
    ["Danışan yorumlarını nerede bulabilirim?", "testimonials"],
    ["Sürekli yorgun ve gerginim", "stress_exhaustion"],
    ["İlişkilerimde sınır koyamıyorum", "relationships"],
    ["Kendimi yeterince iyi hissetmiyorum", "self_worth"],
    ["Kararları hep erteliyorum", "decisions_parts"],
    ["Hiçbir şey hissetmiyorum, içimde boşluk var", "numbness"],
    ["Bedensel şikâyetlerle gelebilir miyim?", "body"],
    ["Travma duyarlı çalışmak ne demek?", "trauma_sensitive"],
    ["Hangi yöntemlerle çalışıyorsunuz?", "methods_overview"],
    ["Koçluk ve bütüncül terapi arasındaki fark ne?", "coaching_therapy"],
    ["Hipnoz veya NLP kullanıyor musunuz?", "hypnosis_nlp"],
    ["Aile dizimi yapıyor musunuz?", "constellation"],
    ["Spiritüel olmak zorunda mıyım?", "energy_spiritual"],
    ["Konumun ne olduğunu henüz bilmiyorum", "topic_clarity"],
    ["Bir seans nasıl ilerliyor?", "session_process"],
    ["Seansa nasıl hazırlanmalıyım?", "preparation"],
    ["Seans öncesinde alkol içebilir miyim?", "substances"],
    ["Seans sırasında ağlarsam ne olur?", "emotions"],
    ["Seanslar Zoom'da mı, Antalya'da mı?", "online_location_language"],
    ["Bilgilerim gizli kalır mı?", "privacy"],
    ["Sigorta karşılıyor mu, fatura alabilir miyim?", "insurance_invoice"],
    ["Telefon numaranız nedir?", "contact"],
];

test("recognizes a broad range of natural homepage questions", () => {
    const mismatches = examples
        .map(([question, expectedIntent]) => ({ question, expectedIntent, actualIntent: getAssistantAnswer(question).intent }))
        .filter(({ expectedIntent, actualIntent }) => expectedIntent !== actualIntent);
    assert.deepEqual(mismatches, []);
});

test("answers the same broad range of questions in Turkish", () => {
    const answers = turkishExamples.map(([question, expectedIntent]) => ({
        question,
        expectedIntent,
        answer: getAssistantAnswer(question, "tr"),
    }));
    const mismatches = answers
        .filter(({ expectedIntent, answer }) => expectedIntent !== answer.intent)
        .map(({ question, expectedIntent, answer }) => ({ question, expectedIntent, actualIntent: answer.intent }));
    assert.deepEqual(mismatches, []);
    assert.ok(answers.every(({ answer }) => answer.text.length > 40));
});

test("localizes Turkish answer links", () => {
    const answer = getAssistantAnswer("Üye alanında neler var?", "tr");
    assert.equal(answer.links[0].label, "Üye alanını aç");
});

test("falls back safely for questions not covered by the website", () => {
    const answer = getAssistantAnswer("Verkauft ihr auch Fahrräder?");
    assert.equal(answer.intent, "fallback");
    assert.match(answer.text, /keine sichere Antwort/);
});

test("falls back safely in Turkish", () => {
    const answer = getAssistantAnswer("Bisiklet satıyor musunuz?", "tr");
    assert.equal(answer.intent, "fallback");
    assert.match(answer.text, /güvenle/);
});
