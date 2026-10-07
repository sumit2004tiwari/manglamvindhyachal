"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PanditCount from "@/components/PanditCount";

/* ── FAQ data ── */
const faqs = [
  {
    q: "दर्शन का समय क्या है?",
    a: "माँ विंध्यवासिनी मंदिर में दर्शन सूर्योदय से रात्रि 10 बजे तक होते हैं। वेबसाइट के माध्यम से आने वाले श्रद्धालुओं को प्रातः 5:00–8:00 बजे गेट नं. 5 (हनुमान गली) से विशेष प्रवेश की सुविधा दी जाती है।",
  },
  {
    q: "वेबसाइट के माध्यम से कोई दक्षिणा शुल्क लिया जाता है?",
    a: "नहीं। वेबसाइट के माध्यम से आने वाले श्रद्धालुओं से कोई दक्षिणा नहीं ली जाती। जो भी दान करना हो, सीधे माँ के चरणों में करें।",
  },
  {
    q: "पूजा के लिए पंडित जी कैसे बुक करें?",
    a: "आप सीधे हमारे हेल्पलाइन नंबर 8739000333 पर कॉल या WhatsApp कर सकते हैं। हम अनुभवी तीर्थ पुरोहित की व्यवस्था करेंगे जो गोत्र-संकल्प सहित विधि-विधान से पूजन संपन्न कराएंगे।",
  },
  {
    q: "होटल या धर्मशाला की बुकिंग कैसे करें?",
    a: "मंदिर के निकट बजट और AC कमरे उपलब्ध हैं। बुकिंग के लिए 8739000333 पर संपर्क करें।",
  },
  {
    q: "विंध्याचल स्टेशन से मंदिर कैसे पहुंचें?",
    a: "विंध्याचल रेलवे स्टेशन से मंदिर केवल 1 KM दूर है। हम स्टेशन Pickup/Drop की सुविधा देते हैं।",
  },
  {
    q: "बुजुर्गों एवं दिव्यांग श्रद्धालुओं के लिए क्या सुविधाएं हैं?",
    a: "व्हीलचेयर समन्वय, कम पैदल चलने वाला सुगम प्रवेश मार्ग, विश्राम स्थल एवं पेयजल व्यवस्था उपलब्ध है।",
  },
  {
    q: "क्या यह वेबसाइट मंदिर प्रशासन की आधिकारिक वेबसाइट है?",
    a: "नहीं। यह एक निजी स्थानीय तीर्थ सहायता प्लेटफ़ॉर्म है। यह विंध्य विकास परिषद, मंदिर प्रशासन या किसी सरकारी संस्था से संबद्ध नहीं है।",
  },
  {
    q: "त्रिकोण परिक्रमा में कितना समय लगता है?",
    a: "पूरी त्रिकोण परिक्रमा (माँ विंध्यवासिनी → काली खोह → अष्टभुजा → वापस) में सामान्यतः 4–6 घंटे लगते हैं। वाहन सुविधा के साथ यह 2.5–3.5 घंटे में संभव है।",
  },
];

/* ── Helplines ── */
const helplines = [
  { icon: "🚨", label: "Police", num: "112" },
  { icon: "🏥", label: "Ambulance", num: "108" },
  { icon: "👩", label: "Women Safety", num: "1090" },
  { icon: "🚂", label: "Railway Help", num: "139" },
  { icon: "🔥", label: "Fire", num: "101" },
  { icon: "🛕", label: "तीर्थ सहायता", num: "8739000333" },
];

/* ── FAQ Component ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item neu-pressed" style={{ marginBottom: "1rem" }}>
      <button className="faq-q" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "var(--font-dev)", fontWeight: 600, color: "var(--text-dark)", fontSize: "1rem", outline: "none" }}>
        <span>{q}</span>
        <span style={{ color: "var(--red)", fontSize: "1.2rem", flexShrink: 0, marginLeft: "0.5rem" }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="faq-a" style={{ marginTop: "0.75rem", color: "var(--text-mid)", fontSize: "0.95rem", lineHeight: 1.6 }}>{a}</div>}
    </div>
  );
}

/* ── Main Page ── */
export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════════════════
          1. HERO (HOME)
      ══════════════════════════════════════════════════ */}
      <section id="hero" style={{ 
        background: "linear-gradient(rgba(242, 235, 225, 0.75), rgba(242, 235, 225, 0.95)), url('/hero-bg.jpg')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "6rem 0 5rem",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center"
      }}>
        <div className="container">
          <div className="neu-card" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", padding: "3rem 2rem", background: "rgba(242, 235, 225, 0.85)", backdropFilter: "blur(10px)" }}>
            <p style={{ fontFamily: "var(--font-dev)", color: "var(--red)", fontSize: "1rem", letterSpacing: "0.15em", marginBottom: "1.25rem", fontWeight: 700 }}>
              ॥ श्री विंध्यवासिनी देव्यै नमः ॥
            </p>
            <h1 style={{ fontFamily: "var(--font-dev)", fontSize: "clamp(2.5rem, 6vw, 3.8rem)", color: "var(--text-dark)", marginBottom: "1.5rem", lineHeight: 1.2 }}>
              माँ के दरबार में<br />
              <span style={{ color: "var(--red)" }}>आपका स्वागत है</span>
            </h1>
            <p style={{ fontFamily: "var(--font-dev)", color: "var(--text-mid)", fontSize: "clamp(1rem, 2vw, 1.2rem)", margin: "0 auto 2.5rem", lineHeight: 1.8 }}>
              विंध्याचल यात्रा को आसान बनाइए — दर्शन, पूजा, पंडित जी, माँ का श्रृंगार,
              होटल, भोजन और स्थानीय सहायता <strong>एक ही जगह।</strong>
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#darshan" className="btn btn-primary btn-xl">🛕 दर्शन सहायता</a>
              <a href="https://wa.me/918739000333" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-xl">💬 WhatsApp संपर्क</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. DARSHAN (दर्शन)
      ══════════════════════════════════════════════════ */}
      <section id="darshan" style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ color: "var(--red)", fontSize: "2.5rem", marginBottom: "1rem" }}>दर्शन सहायता</h2>
            <div style={{ width: "60px", height: "4px", background: "var(--red)", margin: "0 auto", borderRadius: "var(--r-full)" }} />
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            <div className="neu-card">
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🌅</div>
              <h3 style={{ color: "var(--text-dark)", marginBottom: "0.5rem" }}>सुगम दर्शन व्यवस्था</h3>
              <p>भीड़ से बचते हुए सुगम और शांत दर्शन की व्यवस्था। हम आपको सही समय और सही गेट (जैसे हनुमान गली गेट नं. 5) से प्रवेश का मार्गदर्शन करते हैं।</p>
              <a href="https://wa.me/918739000333?text=मुझे दर्शन सहायता चाहिए" className="btn btn-secondary btn-sm" style={{ marginTop: "1.5rem" }}>💬 Get an Enquiry</a>
            </div>
            <div className="neu-card">
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>♿</div>
              <h3 style={{ color: "var(--text-dark)", marginBottom: "0.5rem" }}>वरिष्ठ एवं दिव्यांग सहायता</h3>
              <p>कम पैदल चलने वाला मार्ग, व्हीलचेयर समन्वय, और विश्राम स्थल की व्यवस्था ताकि परिवार के सभी सदस्य आसानी से माँ का आशीर्वाद ले सकें।</p>
              <a href="https://wa.me/918739000333?text=मुझे व्हीलचेयर/वरिष्ठ नागरिक दर्शन सहायता चाहिए" className="btn btn-secondary btn-sm" style={{ marginTop: "1.5rem" }}>💬 Get an Enquiry</a>
            </div>
            <div className="neu-card">
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🕒</div>
              <h3 style={{ color: "var(--text-dark)", marginBottom: "0.5rem" }}>आरती एवं विशेष समय</h3>
              <p>प्रातः 5:00 से 8:00 बजे तक विशेष दर्शन। मंगला आरती, राजभोग आरती और शयन आरती के समय की सटीक जानकारी और सहायता।</p>
              <a href="https://wa.me/918739000333?text=मुझे आरती समय पर दर्शन की जानकारी चाहिए" className="btn btn-secondary btn-sm" style={{ marginTop: "1.5rem" }}>💬 Get an Enquiry</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3. PUJA SEVA (पूजा सेवा)
      ══════════════════════════════════════════════════ */}
      <section id="puja-seva" style={{ padding: "5rem 0", background: "var(--cream-dark)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ color: "var(--text-dark)", fontSize: "2.5rem", marginBottom: "1rem" }}>वैदिक पूजा सेवा</h2>
            <div style={{ width: "60px", height: "4px", background: "var(--red)", margin: "0 auto", borderRadius: "var(--r-full)" }} />
            <p style={{ marginTop: "1rem", maxWidth: "600px", margin: "1rem auto 0" }}>विधि-विधान और शुद्ध मंत्रोच्चार के साथ अपनी मनोकामना हेतु अनुष्ठान कराएं।</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {[
              { icon: "🪔", title: "सत्यनारायण कथा", desc: "सुख, शांति और समृद्धि के लिए। पूर्ण वैदिक विधि और गोत्र संकल्प के साथ।" },
              { icon: "🕉️", title: "रुद्राभिषेक", desc: "भगवान शिव का विशेष अभिषेक। रोग निवारण एवं उत्तम स्वास्थ्य हेतु।" },
              { icon: "📖", title: "दुर्गा सप्तशती पाठ", desc: "नवरात्रि या विशेष अवसरों पर माँ भगवती का परम कल्याणकारी पाठ।" },
              { icon: "✂️", title: "मुंडन संस्कार", desc: "गंगा घाट या मंदिर परिसर में शास्त्रोक्त विधि से शिशु का प्रथम मुंडन।" },
              { icon: "🔥", title: "हवन एवं यज्ञ", desc: "वातावरण शुद्धि और नवग्रह शांति हेतु विशेष मंत्रों से आहुति।" },
              { icon: "🙏", title: "मनोकामना अनुष्ठान", desc: "विशेष पारिवारिक या व्यावसायिक सफलता हेतु व्यक्तिगत संकल्प पूजा।" },
            ].map((s) => (
              <div key={s.title} className="neu-card-flat" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{s.icon}</div>
                <h3 style={{ color: "var(--red)", marginBottom: "0.5rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.95rem" }}>{s.desc}</p>
                <a href={`https://wa.me/918739000333?text=मुझे '${s.title}' के बारे में जानकारी चाहिए`} className="btn btn-secondary btn-sm" style={{ marginTop: "1.5rem" }}>💬 Get an Enquiry</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. PANDIT JI (पंडित जी)
      ══════════════════════════════════════════════════ */}
      <section id="pandit-ji" style={{ padding: "5rem 0" }}>
        <div className="container">
          <div className="neu-card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "center" }}>
            <div>
              <h2 style={{ color: "var(--red)", fontSize: "2.5rem", marginBottom: "1rem" }}>स्थानीय पंडित जी (तीर्थ पुरोहित)</h2>
              <PanditCount />
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', margin: '1rem 0' }}><Link href="/pandas" className="btn btn-primary">पांडा जी देखें / Book a Panda</Link><Link href="/pandas/register" className="btn btn-secondary">Register as Panda</Link></div>
              <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
                विंध्याचल में किसी भी प्रकार के धार्मिक अनुष्ठान के लिए हम योग्य, अनुभवी और वंशानुगत तीर्थ पुरोहितों की व्यवस्था करते हैं।
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>✅ गोत्र और वंशावली के अनुसार पूजा</li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>✅ शुद्ध वैदिक मंत्रोच्चारण</li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>✅ पारदर्शी और उचित दक्षिणा व्यवस्था</li>
              </ul>
              <a href="https://wa.me/918739000333?text=मुझे पूजा के लिए पंडित जी की आवश्यकता है" className="btn btn-primary btn-lg">💬 पंडित जी से बात करें</a>
            </div>
            <div className="neu-pressed" style={{ textAlign: "center", padding: "3rem", border: "2px dashed var(--border-red)" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📿</div>
              <h3 style={{ color: "var(--text-dark)" }}>परंपरा और शुद्धता</h3>
              <p>तीर्थ पुरोहित आपके परिवार के संकल्पित ब्राह्मण होते हैं। हम आपको आपके योग्य पंडे जी से जोड़ते हैं।</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. MAA SHRINGAR (माँ श्रृंगार)
      ══════════════════════════════════════════════════ */}
      <section id="maa-shringar" style={{ padding: "5rem 0", background: "var(--cream-dark)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ color: "var(--text-dark)", fontSize: "2.5rem", marginBottom: "1rem" }}>माँ का श्रृंगार</h2>
          <div style={{ width: "60px", height: "4px", background: "var(--red)", margin: "0 auto 2rem", borderRadius: "var(--r-full)" }} />
          
          <div className="neu-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌸</div>
            <p style={{ fontSize: "1.1rem", marginBottom: "2rem", lineHeight: 1.8 }}>
              श्रद्धालुओं द्वारा माँ विंध्यवासिनी को चुनरी, वस्त्र, नथ, सिंदूर, और आभूषण अर्पित करने की महान परंपरा है। यदि आप भी माँ का विशेष श्रृंगार करवाना चाहते हैं, तो हम सामग्री और मंदिर में अर्पण की पूर्ण व्यवस्था करते हैं।
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <div className="neu-pressed">🌺 सुहाग सामग्री</div>
              <div className="neu-pressed">👗 चुनरी एवं वस्त्र</div>
              <div className="neu-pressed">💐 विशेष पुष्प माला</div>
            </div>
            <a href="https://wa.me/918739000333?text=मुझे माँ का श्रृंगार अर्पित करना है" className="btn btn-primary btn-md" style={{ marginTop: "2rem" }}>💬 श्रृंगार व्यवस्था हेतु संपर्क</a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. HOTEL STAY (होटल)
      ══════════════════════════════════════════════════ */}
      <section id="hotel" style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ color: "var(--red)", fontSize: "2.5rem", marginBottom: "1rem" }}>होटल एवं धर्मशाला</h2>
            <div style={{ width: "60px", height: "4px", background: "var(--red)", margin: "0 auto", borderRadius: "var(--r-full)" }} />
            <p style={{ marginTop: "1rem" }}>आपके बजट और सुविधा के अनुसार आरामदायक कमरे।</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            <div className="neu-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ color: "var(--text-dark)", marginBottom: "0.5rem" }}>बजट स्टे / धर्मशाला</h3>
                <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>साफ-सुथरे कमरे, 24 घंटे पानी। बड़े परिवारों और समूह के लिए उपयुक्त।</p>
                <div className="neu-pressed" style={{ marginBottom: "1.5rem" }}>Starting from ~₹500/night</div>
              </div>
              <a href="https://wa.me/918739000333?text=मुझे बजट धर्मशाला/रूम की जानकारी चाहिए" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>💬 Get an Enquiry</a>
            </div>
            <div className="neu-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", border: "2px solid var(--border-red)" }}>
              <div>
                <h3 style={{ color: "var(--red)", marginBottom: "0.5rem" }}>AC Premium Hotel</h3>
                <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>मंदिर के निकट, Wi-Fi, पार्किंग, रेस्टोरेंट और आधुनिक सुविधाएं।</p>
                <div className="neu-pressed" style={{ marginBottom: "1.5rem" }}>Starting from ~₹1500/night</div>
              </div>
              <a href="https://wa.me/918739000333?text=मुझे AC होटल रूम की जानकारी चाहिए" className="btn btn-primary btn-sm" style={{ width: "100%" }}>💬 Get an Enquiry</a>
            </div>
            <div className="neu-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ color: "var(--text-dark)", marginBottom: "0.5rem" }}>Family & Group Hall</h3>
                <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>5-10 लोगों के लिए बड़े कमरे। परिक्रमा और यात्रा के लिए सुविधाजनक स्थान।</p>
                <div className="neu-pressed" style={{ marginBottom: "1.5rem" }}>Customize for your group</div>
              </div>
              <a href="https://wa.me/918739000333?text=हमें Group Stay/Family Hall चाहिए" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>💬 Get an Enquiry</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          7. BHOJAN (भोजन)
      ══════════════════════════════════════════════════ */}
      <section id="bhojan" style={{ padding: "5rem 0", background: "var(--cream-dark)" }}>
        <div className="container">
          <div className="neu-card" style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
            <div style={{ flex: "1 1 300px" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🍱</div>
              <h2 style={{ color: "var(--text-dark)", fontSize: "2rem", marginBottom: "1rem" }}>शुद्ध सात्विक भोजन</h2>
              <p style={{ marginBottom: "1.5rem" }}>तीर्थ यात्रा में आहार का विशेष महत्व है। हम आपको बिना लहसुन-प्याज के शुद्ध वैष्णव भोजन, फलाहार, और पारंपरिक विंध्य थाली की व्यवस्था उपलब्ध कराते हैं।</p>
              <a href="https://wa.me/918739000333?text=मुझे शुद्ध सात्विक भोजन/प्रसाद व्यवस्था के बारे में जानना है" className="btn btn-secondary">💬 भोजन व्यवस्था पूछें</a>
            </div>
            <div style={{ flex: "1 1 300px", display: "grid", gap: "1rem" }}>
              <div className="neu-pressed">✅ ब्राह्मणों द्वारा निर्मित भोजन</div>
              <div className="neu-pressed">✅ व्रत और फलाहार की विशेष व्यवस्था</div>
              <div className="neu-pressed">✅ 50+ लोगों के लिए समूह भंडारा / भोजन</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          8. YATRA / VAHAN (यात्रा / वाहन)
      ══════════════════════════════════════════════════ */}
      <section id="vahan" style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ color: "var(--red)", fontSize: "2.5rem", marginBottom: "1rem" }}>यात्रा एवं वाहन सेवा</h2>
            <div style={{ width: "60px", height: "4px", background: "var(--red)", margin: "0 auto", borderRadius: "var(--r-full)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            <div className="neu-card-flat" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚕</div>
              <h3 style={{ color: "var(--text-dark)", marginBottom: "0.5rem" }}>त्रिकोण परिक्रमा</h3>
              <p style={{ fontSize: "0.9rem", marginBottom: "1.5rem" }}>विंध्यवासिनी, काली खोह और अष्टभुजा माता के दर्शन हेतु विशेष टैक्सी/ऑटो व्यवस्था। (समय: ~3 घंटे)</p>
              <a href="https://wa.me/918739000333?text=मुझे त्रिकोण परिक्रमा के लिए वाहन चाहिए" className="btn btn-secondary btn-sm">💬 Get an Enquiry</a>
            </div>
            <div className="neu-card-flat" style={{ textAlign: "center", border: "2px solid var(--border-red)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚉</div>
              <h3 style={{ color: "var(--red)", marginBottom: "0.5rem" }}>Station Pickup / Drop</h3>
              <p style={{ fontSize: "0.9rem", marginBottom: "1.5rem" }}>विंध्याचल (VZL), मिर्ज़ापुर (MZP) या वाराणसी (BSB) रेलवे/एयरपोर्ट से सुरक्षित और आरामदायक वाहन।</p>
              <a href="https://wa.me/918739000333?text=मुझे स्टेशन Pickup/Drop की बुकिंग करनी है" className="btn btn-primary btn-sm">💬 Get an Enquiry</a>
            </div>
            <div className="neu-card-flat" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚙</div>
              <h3 style={{ color: "var(--text-dark)", marginBottom: "0.5rem" }}>लोकल साइटसीइंग</h3>
              <p style={{ fontSize: "0.9rem", marginBottom: "1.5rem" }}>सीता कुंड, रामेश्वरम धाम, और चुनार फोर्ट जैसे स्थानीय पर्यटक स्थलों के भ्रमण हेतु वाहन।</p>
              <a href="https://wa.me/918739000333?text=मुझे लोकल साइटसीइंग के लिए टैक्सी चाहिए" className="btn btn-secondary btn-sm">💬 Get an Enquiry</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          9. PARICHAY (परिचय)
      ══════════════════════════════════════════════════ */}
      <section id="parichay" style={{ padding: "5rem 0", background: "var(--cream-dark)" }}>
        <div className="container">
          <div className="neu-card" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ color: "var(--red)", fontSize: "2.5rem", marginBottom: "1rem" }}>हमारा परिचय (About Us)</h2>
            <h4 style={{ color: "var(--text-dark)", marginBottom: "1.5rem" }}>RAKA Mishra (अभिषेक मिश्रा)</h4>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              &quot;मंगलम विंध्याचल धाम&quot; एक स्थानीय पहल है जिसका उद्देश्य माँ विंध्यवासिनी के दर्शनार्थ आने वाले श्रद्धालुओं को एक सुरक्षित, पारदर्शी और सुखद अनुभव प्रदान करना है। हम समझते हैं कि नई जगह पर तीर्थयात्रियों को दर्शन, पूजा, और ठहरने में कई कठिनाइयों का सामना करना पड़ता है।
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2rem" }}>
              हमारी टीम स्थानीय पुजारियों, होटलों और वाहन चालकों के साथ मिलकर आपको उचित मूल्य पर बेहतरीन सेवा सुनिश्चित करती है, ताकि आप पूरी तरह से अपनी भक्ति और माँ की आराधना पर ध्यान केंद्रित कर सकें।
            </p>
            <div className="neu-pressed" style={{ display: "inline-block", padding: "1rem 2rem" }}>
              <strong style={{ color: "var(--red)" }}>हमारा संकल्प:</strong> &quot;श्रद्धालुओं की सेवा ही माँ की सच्ची आराधना है।&quot;
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          10. SAMPARK (संपर्क / FAQ / Footer)
      ══════════════════════════════════════════════════ */}
      <section id="sampark" style={{ padding: "5rem 0 2rem" }}>
        <div className="container">
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", marginBottom: "4rem" }}>
            
            {/* FAQ */}
            <div>
              <h2 style={{ color: "var(--text-dark)", fontSize: "2rem", marginBottom: "2rem" }}>अक्सर पूछे जाने वाले प्रश्न (FAQ)</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
              </div>
            </div>

            {/* Helplines & Contact Form Area */}
            <div>
              <h2 style={{ color: "var(--text-dark)", fontSize: "2rem", marginBottom: "2rem" }}>महत्वपूर्ण हेल्पलाइन</h2>
              <div className="neu-card" style={{ marginBottom: "2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  {helplines.map((h) => (
                    <div key={h.label} className="neu-pressed" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span>{h.icon}</span>
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{h.label}</div>
                        <div style={{ fontWeight: 700, color: "var(--text-dark)", fontSize: "0.9rem" }}>{h.num}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="neu-card" style={{ background: "var(--red)", color: "white" }}>
                <h3 style={{ color: "white", marginBottom: "0.5rem" }}>सीधे संपर्क करें</h3>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", marginBottom: "1.5rem" }}>किसी भी अन्य जानकारी या सहायता के लिए बेझिझक कॉल करें।</p>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <a href="tel:8739000333" className="btn" style={{ background: "white", color: "var(--red)" }}>📞 8739000333</a>
                  <a href="https://wa.me/918739000333" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "#25D366", color: "white" }}>💬 WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ borderTop: "2px solid var(--border)", paddingTop: "3rem", marginTop: "2rem" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-dev)", fontSize: "1.5rem", fontWeight: 800, color: "var(--red)", marginBottom: "0.5rem" }}>
              🕉️ मंगलम विंध्याचल धाम
            </div>
            <div style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>RAKA Mishra — तीर्थ सहायता</div>
            
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "600px", margin: "0 auto 1.5rem" }}>
              विंध्याचल आने वाले श्रद्धालुओं की सुविधा, सुगम दर्शन, वैदिक पूजा, वरिष्ठ नागरिक सहयोग एवं ठहरने-आवागमन हेतु समर्पित स्थानीय तीर्थ सहायता मंच।
            </p>

            <div className="neu-pressed" style={{ display: "inline-block", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              © 2025 मंगलम विंध्याचल धाम | यह एक निजी तीर्थ सहायता सेवा है, किसी सरकारी संस्था से संबद्ध नहीं।
            </div>
          </div>
        </footer>
      </section>

      {/* ══════════════════════════════════════════════════
          STICKY CONTACT BUTTONS
      ══════════════════════════════════════════════════ */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 1000
      }}>
        <a href="tel:8739000333" title="Call Us" style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "var(--red)",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.8rem",
          boxShadow: "var(--shadow-neu-red)",
          transition: "transform 0.2s"
        }}>
          📞
        </a>
        <a href="https://wa.me/918739000333" title="WhatsApp" target="_blank" rel="noopener noreferrer" style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#25D366",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2rem",
          boxShadow: "4px 4px 10px rgba(37,211,102,0.3)",
          transition: "transform 0.2s"
        }}>
          <svg style={{ width: "32px", height: "32px", fill: "currentColor" }} viewBox="0 0 24 24">
            <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.128.552 4.195 1.6 6.007L.18 23.473l5.586-1.464c1.748.956 3.712 1.46 5.727 1.46h.004c6.645 0 12.031-5.386 12.031-12.032C23.528 5.385 18.143 0 12.031 0zm0 21.492c-1.802 0-3.567-.484-5.11-1.401l-.367-.217-3.799.996.996-3.799-.217-.367c-.917-1.543-1.4-3.308-1.4-5.11 0-5.632 4.584-10.216 10.216-10.216 5.632 0 10.216 4.584 10.216 10.216 0 5.632-4.584 10.216-10.216 10.216zm5.607-7.662c-.308-.154-1.821-.9-2.103-1.002-.282-.102-.488-.154-.693.154-.205.308-.795 1.002-.975 1.207-.18.205-.36.231-.668.077-1.554-.775-2.73-1.865-3.562-3.315-.154-.269-.015-.413.138-.567.139-.14.308-.36.462-.54.154-.18.205-.308.308-.513.103-.205.051-.385-.026-.54-.077-.154-.693-1.67-.95-2.287-.25-.6-.503-.518-.693-.527-.18-.01-.385-.01-.591-.01-.205 0-.54.077-.822.385-.282.308-1.078 1.053-1.078 2.568s1.104 2.978 1.258 3.183c.154.205 2.17 3.313 5.258 4.646 1.834.792 2.529.851 3.421.71 1.028-.162 3.161-1.291 3.6-2.54.438-1.249.438-2.32.308-2.54-.128-.218-.487-.346-.795-.5z"/>
          </svg>
        </a>
      </div>
    </>
  );
}
