import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Heart, Brain, ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * F-Kod Landing Page
 * Design: Modern, youth-focused, deep purple/indigo theme with gradient accents
 * Target: 14-24 age group
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">F-Kod</span>
          </div>
          <Button 
            variant="outline" 
            className="border-purple-400 text-purple-300 hover:bg-purple-500/20"
            onClick={() => document.getElementById('test-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Testi Başlat
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                Fıtratını <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Keşfet</span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 font-light">
                14-24 yaş gençler için kişisel potansiyeli keşfetme yolculuğu
              </p>
            </div>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              "Ben kimim?", "Bu dünyaya ne katmaya geldim?" ve "Hangi yoldan yürümeliyim?" sorularına cevap bul. 
              Senaryo bazlı test ile kendi fıtratını keşfet ve geleceğini tasarla.
            </p>

            <div className="flex gap-4 justify-center pt-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-xl"
                onClick={() => document.getElementById('test-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Testi Başlat <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-purple-400 text-purple-300 hover:bg-purple-500/20 px-8 py-6 text-lg rounded-xl"
              >
                Daha Fazla Bilgi
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Neden F-Kod?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Bilimsel Temelli</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Modern psikoloji ve kadim irfanı harmanlayan özgün bir sistem
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Kişiselleştirilmiş</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Yapay zeka tarafından hazırlanan, sadece sana özel raporlar
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Hızlı & Kolay</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                3-4 dakikada tamamlanabilen senaryo bazlı test
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 12 Archetypes Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-white text-center mb-4">12 Fıtrat Arketipi</h2>
          <p className="text-center text-slate-300 mb-16 max-w-2xl mx-auto">
            Dört ana fıtrat grubunun kombinasyonundan oluşan 12 benzersiz arketip. 
            Senin fıtratın hangisi?
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Toplumsal Mimarlar", icon: "🏗️", desc: "Kuralları insanları mutlu etmek için kullanırlar" },
              { name: "Stratejik Filozoflar", icon: "🧠", desc: "Karmaşanın içindeki görünmez düzeni bulurlar" },
              { name: "Saha Komutanları", icon: "⚡", desc: "Planı sahada kusursuzca inşa ederler" },
              { name: "Adil Rehberler", icon: "🤝", desc: "Şefkati kurallarla dengelerler" },
              { name: "Ruhsal Şifacılar", icon: "💫", desc: "Kalbindeki gizli yarayı görürler" },
              { name: "İlham Veren Motivatörler", icon: "🔥", desc: "Kitleleri peşinden sürüklerler" },
              { name: "Hakikat Dedektifleri", icon: "🔍", desc: "Sırları çözerler, derinliği ararlar" },
              { name: "Anlam Ozanları", icon: "✨", desc: "Anlamı başkalarının hayatına meşale gibi taşırlar" },
              { name: "Ezber Bozan Kâşifler", icon: "🚀", desc: "Eski kuralları yıkıp yeni vizyon kurarlar" },
              { name: "Taktiksel İcracılar", icon: "🎯", desc: "Hızlı karar verip hedefe kilitlenirler" },
              { name: "Saha Kahramanları", icon: "🛡️", desc: "Adaletsizliğe karşı cesurca mücadele ederler" },
              { name: "Yıkıcı Yenilikçiler", icon: "💥", desc: "Sınırları zorlayıp yeni düzenler kurarlar" },
            ].map((archetype, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-all">
                <div className="text-3xl mb-3">{archetype.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{archetype.name}</h3>
                <p className="text-slate-300 text-sm">{archetype.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Nasıl Çalışır?</h2>

          <div className="space-y-8">
            {[
              { step: 1, title: "Testi Çöz", desc: "10 senaryo sorusuna cevap ver. 3-4 dakika sürer." },
              { step: 2, title: "Fıtratını Keşfet", desc: "Yapay zeka analiz eder, senin arketipin belirlenir." },
              { step: 3, title: "Raporunu Al", desc: "Sadece sana özel, motive edici PDF raporu e-postana gönderilir." },
              { step: 4, title: "Yolculuğa Başla", desc: "F-Kod Derneği topluluğuna katılıp mentorlarla eşleş." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Test Section */}
      <section id="test-section" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-12 text-center space-y-6">
            <h2 className="text-4xl font-bold text-white">Hazır mısın?</h2>
            <p className="text-lg text-slate-300">
              Fıtratını keşfetmek için testi başlat. Sadece 3-4 dakika sürüyor.
            </p>
            
            <div className="space-y-4">
              <Button 
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-xl"
              >
                Testi Başlat <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Tamamen ücretsiz</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>3-4 dakika sürer</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Yapay zeka destekli analiz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-900/50 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">F-Kod</h3>
              <p className="text-slate-400 text-sm">Gençlerin fıtratlarını keşfetmelerine yardımcı olan platform</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-purple-400">Testi Başlat</a></li>
                <li><a href="#" className="hover:text-purple-400">Hakkında</a></li>
                <li><a href="#" className="hover:text-purple-400">İletişim</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Dernek</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-purple-400">Misyon</a></li>
                <li><a href="#" className="hover:text-purple-400">Vizyonumuz</a></li>
                <li><a href="#" className="hover:text-purple-400">Katılım</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-purple-400">Gizlilik</a></li>
                <li><a href="#" className="hover:text-purple-400">Koşullar</a></li>
                <li><a href="#" className="hover:text-purple-400">Çerezler</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-500/20 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 F-Kod Derneği. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
