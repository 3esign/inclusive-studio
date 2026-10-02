// The research shelf of the creative hub: what we have actually read, what it says,
// what it does NOT say, and what it changes for this course.
//
// `verified` is the honest part and it is never decorative:
//   'full'      — the source text itself was opened and the claim read in it
//   'abstract'  — the abstract or the publisher page was read, not the full text
//   'secondary' — the claim comes from a summary of the source, not from the source
// A claim marked 'secondary' may not be quoted as a fact in a student's A3 without
// opening the original first. That rule is the whole point of keeping this file.
//
// Gathered 02.10.2026 for the toy brief and the spatial-intelligence thread.

const t = (en, sr) => ({ en, sr });

export const RESEARCH_KINDS = [
  { id: 'paper', label: t('Paper', 'Rad') },
  { id: 'standard', label: t('Standard', 'Standard') },
  { id: 'law', label: t('Law and convention', 'Zakon i konvencija') },
  { id: 'instrument', label: t('Instrument', 'Instrument') },
  { id: 'programme', label: t('Programme and practice', 'Program i praksa') },
  { id: 'guide', label: t('Guide', 'Priručnik') }
];

export const RESEARCH_THREADS = [
  { id: 'spatial', label: t('Spatial intelligence', 'Prostorna inteligencija') },
  { id: 'after', label: t('After the diagnosis', 'Posle dijagnoze') },
  { id: 'toy', label: t('Toys and play', 'Igračke i igra') },
  { id: 'teaching', label: t('Teaching space to children', 'Učenje prostora sa decom') },
  { id: 'rights', label: t('Rights and obligation', 'Prava i obaveza') },
  { id: 'method', label: t('Method of this studio', 'Metod ovog studija') }
];

export const RESEARCH = [
  /* ---------------- spatial intelligence: is it even trainable ---------------- */
  {
    id: 'uttal-2013', kind: 'paper', thread: 'spatial', year: 2013, verified: 'abstract',
    title: t('The malleability of spatial skills: a meta-analysis of training studies', 'Promenljivost prostornih sposobnosti: meta-analiza studija obuke'),
    who: 'Uttal, Meadow, Tipton, Hand, Alden, Warren & Newcombe · Psychological Bulletin 139(2), 352–402',
    says: t('Across 217 training studies the average gain of spatial training over control is g = 0,47. The gain survives a delay to a later test, and it appears on spatial tasks that were never trained. Training is most effective in children.', 'Kroz 217 studija obuke prosečan dobitak obuke prostornog mišljenja u odnosu na kontrolu je g = 0,47. Dobitak preživljava pauzu do kasnijeg testiranja i pojavljuje se na prostornim zadacima koji nisu vežbani. Obuka je najdelotvornija kod dece.'),
    limit: t('It measures gain on spatial tasks. It is not evidence that a trained child does better at school, and the paper itself does not claim that.', 'Meri dobitak na prostornim zadacima. Nije dokaz da uvežbano dete bolje prolazi u školi, i sam rad to ne tvrdi.'),
    use: t('The single sentence that justifies a studio week spent on an object for a child’s hand: the skill is not fixed.', 'Jedna rečenica koja opravdava nedelju studija potrošenu na predmet za dečju ruku: sposobnost nije data jednom zauvek.'),
    url: 'https://groups.psych.northwestern.edu/uttal/documents/1Themalleabilityofspatialskills-Ametaanalysisoftrainingstudies1_001.pdf'
  },
  {
    id: 'gilligan-2020', kind: 'paper', thread: 'spatial', year: 2020, verified: 'abstract',
    title: t('First demonstration of effective spatial training for near transfer to spatial performance and far transfer to a range of mathematics skills at 8 years', 'Prvi prikaz delotvorne prostorne obuke sa bliskim prenosom na prostorne zadatke i dalekim prenosom na niz matematičkih veština kod osmogodišnjaka'),
    who: 'Gilligan, Hodgkiss, Thomas & Farran · Developmental Science 23(4)',
    says: t('Spatial scaling training with 8-year-olds produced near transfer to spatial performance and far transfer to several mathematics skills — the first such demonstration at that age.', 'Obuka prostornog skaliranja kod osmogodišnjaka dala je blizak prenos na prostorne zadatke i dalek prenos na više matematičkih veština — prvi takav prikaz na tom uzrastu.'),
    limit: t('One age, one training type, and later trials do not always reproduce the far transfer. Read it beside the trials that found none.', 'Jedan uzrast, jedna vrsta obuke, a kasniji ogledi ne reprodukuju uvek dalek prenos. Čita se zajedno sa ogledima koji ga nisu našli.'),
    use: t('The optimistic end of the evidence. Quote it only with the pessimistic end in the same paragraph.', 'Optimistični kraj dokaza. Navodi se samo ako je pesimistični kraj u istom pasusu.'),
    url: 'https://onlinelibrary.wiley.com/doi/10.1111/desc.12909'
  },
  {
    id: 'no-math-transfer-2019', kind: 'paper', thread: 'spatial', year: 2019, verified: 'abstract',
    title: t('Boys and girls gain in spatial, but not in mathematical ability after mental rotation training in primary education', 'Dečaci i devojčice napreduju u prostornoj, ali ne i u matematičkoj sposobnosti posle obuke mentalne rotacije u osnovnoj školi'),
    who: 'Learning and Instruction',
    says: t('Children improved measurably on mental rotation and showed no transfer to mathematics performance.', 'Deca su merljivo napredovala u mentalnoj rotaciji i nisu pokazala prenos na matematička postignuća.'),
    limit: t('A null result on transfer is not a null result on the trained skill — the rotation gain was real.', 'Izostanak prenosa nije izostanak efekta na uvežbanu veštinu — dobitak u rotaciji je bio stvaran.'),
    use: t('The sentence that keeps a student from writing “this toy improves mathematics” on an A3.', 'Rečenica koja sprečava studenta da na A3 napiše „ova igračka poboljšava matematiku”.'),
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S1041608019300019'
  },
  {
    id: 'hands-on-2023', kind: 'paper', thread: 'spatial', year: 2023, verified: 'abstract',
    title: t('Hands-on: investigating the role of physical manipulatives in spatial training', 'Rukama: uloga fizičkih predmeta u obuci prostornog mišljenja'),
    who: 'Gilligan-Lee et al. · Child Development 94(5)',
    says: t('Spatial training with children was run with physical manipulatives and compared against the equivalent task without them — the question of whether the object in the hand matters is tested directly, not assumed.', 'Obuka prostornog mišljenja sa decom izvedena je sa fizičkim predmetima i poređena sa istim zadatkom bez njih — pitanje da li predmet u ruci nešto menja ispitano je neposredno, a ne pretpostavljeno.'),
    limit: t('We have read the abstract and the publisher page, not the full result. Do not quote an effect size from it until the paper is opened.', 'Pročitani su apstrakt i stranica izdavača, ne pun rezultat. Ne navoditi veličinu efekta dok se rad ne otvori.'),
    use: t('The reason the first task is a physical toy and not an application. It is an argument under test, not a settled fact.', 'Razlog zbog kog je prvi zadatak fizička igračka, a ne aplikacija. To je argument koji se ispituje, a ne utvrđena činjenica.'),
    url: 'https://srcd.onlinelibrary.wiley.com/doi/10.1111/cdev.13963'
  },
  {
    id: 'picture-rotation-test', kind: 'instrument', thread: 'spatial', year: 2003, verified: 'secondary',
    title: t('Picture Rotation Test — mental rotation for preschool children', 'Picture Rotation Test — mentalna rotacija za predškolski uzrast'),
    who: 'Hinze & Quaiser-Pohl · International Journal of Testing 3(3)',
    says: t('Sixteen items plus two examples, no time limit. Each item shows one picture of an animal or a person and three comparison pictures turned by 45, 90, 135 or 180 degrees; two of the three are mirrored rather than rotated, so guessing is visible.', 'Šesnaest zadataka i dva primera, bez vremenskog ograničenja. Svaki zadatak prikazuje jednu sliku životinje ili osobe i tri uporedne slike okrenute za 45, 90, 135 ili 180 stepeni; dve od tri su ogledalski obrnute, a ne zarotirane, pa se nagađanje vidi.'),
    limit: t('This is the shape of a card deck that measures. It says nothing about what to do with the result — that is the gap we work in.', 'To je oblik špila kartica koji meri. Ne govori ništa o tome šta se radi sa rezultatom — a to je praznina u kojoj radimo.'),
    use: t('The concrete answer to “what do those cards look like”. Our decks run the other way: they constrain the designer, not the child.', 'Konkretan odgovor na pitanje „kako te kartice izgledaju”. Naši špilovi idu obrnuto: ograničavaju projektanta, a ne dete.'),
    url: 'https://www.tandfonline.com/doi/abs/10.1207/S15327574IJT0303_2'
  },

  /* ---------------- after the diagnosis: the gap the association describes ---------------- */
  {
    id: 'mind-the-gap', kind: 'paper', thread: 'after', year: 2020, verified: 'abstract',
    title: t('Mind the gap: an intervention to support caregivers with a new autism spectrum disorder diagnosis is feasible and acceptable', 'Mind the gap: podrška staraocima posle nove dijagnoze iz spektra autizma je izvodljiva i prihvatljiva'),
    who: 'Pilot feasibility study · PMC7487627',
    says: t('Families report being handed a result and left to find information and services themselves. The intervention provides education, service navigation and topics relevant to a family in the first months after a diagnosis.', 'Porodice prijavljuju da dobiju nalaz i ostanu same da traže informacije i usluge. Intervencija nudi edukaciju, snalaženje u sistemu usluga i teme važne porodici u prvim mesecima posle dijagnoze.'),
    limit: t('It fills the gap with navigation and information. It does not put an object on the table at home — which is where our trade begins.', 'Prazninu popunjava snalaženjem i informacijama. Ne stavlja predmet na sto kod kuće — a tu naš zanat počinje.'),
    use: t('Names the gap in the literature’s own words, so the brief is not built on an anecdote.', 'Imenuje prazninu rečima same literature, pa zadatak ne stoji na anegdoti.'),
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7487627/'
  },
  {
    id: 'falling-through-cracks', kind: 'paper', thread: 'after', year: 2023, verified: 'secondary',
    title: t('Falling through the cracks: how service gaps leave children with neurodevelopmental disorders without the care they need', 'Propadanje kroz pukotine: kako rupe u uslugama ostavljaju decu sa neurorazvojnim poremećajima bez potrebne nege'),
    who: 'British Columbia Medical Journal',
    says: t('Assessment and care are separated by eligibility rules: a child can be assessed, named, and then fall outside every programme that would act on the result.', 'Procenu i negu razdvajaju pravila podobnosti: dete može da bude procenjeno, imenovano, pa da ispadne iz svakog programa koji bi po nalazu delovao.'),
    limit: t('A Canadian system. The mechanism travels; the numbers do not. Do not quote its figures for Serbia.', 'Kanadski sistem. Mehanizam putuje; brojevi ne. Njegove brojke ne navoditi za Srbiju.'),
    use: t('Shows the gap is structural, not a local failure of one association or one country.', 'Pokazuje da je praznina strukturna, a ne lokalni propust jednog udruženja ili jedne zemlje.'),
    url: 'https://bcmj.org/articles/falling-through-cracks-how-service-gaps-leave-children-neurodevelopmental-disorders-and'
  },
  {
    id: 'ei-instrument-list', kind: 'instrument', thread: 'after', year: 2025, verified: 'secondary',
    title: t('Early Intervention Program — list of developmental assessment instruments', 'Program rane intervencije — spisak instrumenata za razvojnu procenu'),
    who: 'New York State Department of Health',
    says: t('The working registry of the instruments a service is allowed to use: ASQ-3, DIAL-4, the Early Screening Inventory, the Bayley scales and others, each with its domains — communication, gross motor, fine motor, problem solving, personal-social.', 'Radni registar instrumenata koje služba sme da koristi: ASQ-3, DIAL-4, Early Screening Inventory, Bejlijeve skale i drugi, svaki sa svojim oblastima — komunikacija, gruba motorika, fina motorika, rešavanje problema, lično-socijalno.'),
    limit: t('An administrative list, not an evaluation. It tells you what is used, not what works.', 'Administrativni spisak, a ne ocena. Govori šta se koristi, ne šta radi.'),
    use: t('When somebody says “cards that determine what a child can do”, this is the shelf those cards sit on. Read the domain names: our toy brief uses the same vocabulary.', 'Kad neko kaže „kartice koje određuju šta dete ume”, ovo je polica na kojoj te kartice stoje. Pročitaj imena oblasti: zadatak igračke koristi isti rečnik.'),
    url: 'https://health.ny.gov/community/infants_children/early_intervention/docs/2025-01_list_developmental_assessment_instruments.pdf'
  },
  {
    id: 'community-early-intervention', kind: 'paper', thread: 'after', year: 2026, verified: 'secondary',
    title: t('Closing developmental gaps: effectiveness of community-based early intervention for young children with developmental delays', 'Zatvaranje razvojnih praznina: delotvornost rane intervencije u zajednici za malu decu sa razvojnim kašnjenjem'),
    who: 'Children (MDPI) 13(4), 459',
    says: t('Community-funded short-term programmes can serve children who fall outside the statutory funding categories, and may contribute to equity of access.', 'Kratkoročni programi finansirani iz zajednice mogu da opsluže decu koja ispadaju iz zakonskih kategorija finansiranja i mogu doprineti pravednijem pristupu.'),
    limit: t('Read from the abstract. The effect sizes have not been checked.', 'Čitano iz apstrakta. Veličine efekata nisu provereni.'),
    use: t('The evidence that an association doing this with cardboard and caps is not a substitute for a system — it is the part of the system that can act this week.', 'Dokaz da udruženje koje ovo radi kartonom i čepovima nije zamena za sistem — ono je deo sistema koji može da deluje ove nedelje.'),
    url: 'https://www.mdpi.com/2227-9067/13/4/459'
  },

  /* ---------------- toys: what makes one inclusive, and what makes one dangerous ---------------- */
  {
    id: 'en71-1', kind: 'standard', thread: 'toy', year: 2014, verified: 'full',
    title: t('EN 71-1 — Safety of toys, mechanical and physical properties: the small parts cylinder', 'EN 71-1 — Bezbednost igračaka, mehanička i fizička svojstva: cilindar za sitne delove'),
    who: 'CEN · published text at law.resource.org',
    says: t('The gauge is ⌀31,7 mm, with the bottom 25,4 mm deep at its highest point and 57,1 mm at its deepest. A part is placed in it uncompressed, in any orientation; if it fits entirely inside, it is a small part and may not be present in a toy for a child under 36 months.', 'Mera je ⌀31,7 mm, a dno je 25,4 mm duboko na najvišoj tački i 57,1 mm na najdubljoj. Deo se stavlja u nju nestisnut, u bilo kom položaju; ako ceo stane unutra, to je sitan deo i ne sme da postoji u igrački za dete ispod 36 meseci.'),
    limit: t('It is a choking gauge, not a quality mark. A toy can pass it and still be useless, ugly or exclusive.', 'To je mera za gušenje, a ne znak kvaliteta. Igračka može da je prođe, a da i dalje bude beskorisna, ružna ili isključujuća.'),
    use: t('The one number every week-1 A3 must carry, drawn around every loose part. A bottle cap at ⌀28–38 mm sits exactly on the boundary.', 'Jedan broj koji svaki A3 iz 1. nedelje mora da nosi, nacrtan oko svakog odvojivog dela. Čep od ⌀28–38 mm stoji tačno na granici.'),
    url: 'https://law.resource.org/pub/eu/toys/en.71.1.2014.html'
  },
  {
    id: 'en71-8', kind: 'standard', thread: 'toy', year: 2026, verified: 'secondary',
    title: t('EN 71-8:2026 — safety requirements for domestic activity toys', 'EN 71-8:2026 — bezbednosni zahtevi za aktivnosne igračke za domaćinstvo'),
    who: 'CEN · European Committee for Standardization',
    says: t('Safety requirements and test methods for activity toys used at home — swings, slides, climbing structures — so that the hazards of play equipment are treated separately from those of handheld toys.', 'Bezbednosni zahtevi i metode ispitivanja za aktivnosne igračke koje se koriste kod kuće — ljuljaške, tobogane, penjalice — tako da se opasnosti opreme za igru tretiraju odvojeno od opasnosti igračaka koje se drže u ruci.'),
    limit: t('Only the scope has been read, from the catalogue entry. The requirements themselves have not been opened.', 'Pročitan je samo obuhvat, iz kataloškog zapisa. Sami zahtevi nisu otvarani.'),
    use: t('The moment a student’s toy becomes something a child climbs on, this is the standard that applies and the drawing has to say so.', 'U trenutku kad studentska igračka postane nešto na šta se dete penje, važi ovaj standard i crtež to mora da kaže.'),
    url: 'https://standards.iteh.ai/catalog/standards/cen/e9ecba59-d643-4ad6-b2b8-88281163d1df/en-71-8-2026'
  },
  {
    id: 'toy-accessibility-review', kind: 'paper', thread: 'toy', year: 2020, verified: 'secondary',
    title: t('Usability and accessibility of toys and technologies for play for children with disabilities: a scoping review of guidelines and tools', 'Upotrebljivost i pristupačnost igračaka i tehnologija za igru dece sa invaliditetom: pregled smernica i alata'),
    who: 'Scoping review',
    says: t('The recurring design principles are accessibility across different motor and cognitive abilities, flexibility of interaction, comprehensibility through clear function and feedback, and simplicity that allows autonomous exploration. Three play directions: many play opportunities, many modes of play, many levels of challenge.', 'Ponavljajući principi projektovanja su pristupačnost za različite motorne i kognitivne sposobnosti, fleksibilnost interakcije, razumljivost kroz jasnu funkciju i povratnu informaciju, i jednostavnost koja dopušta samostalno istraživanje. Tri pravca igre: mnogo prilika za igru, mnogo načina igre, mnogo nivoa izazova.'),
    limit: t('A review of guidelines, so it inherits their weaknesses: most are expert opinion, few are tested with children.', 'Pregled smernica, pa nasleđuje njihove slabosti: većina je mišljenje stručnjaka, malo ih je provereno sa decom.'),
    use: t('“Many opportunities, many modes, many levels” is the clearest short test for a student toy — and it is the seven principles in the language of play.', '„Mnogo prilika, mnogo načina, mnogo nivoa” je najjasniji kratak test za studentsku igračku — a to je sedam principa na jeziku igre.'),
    url: 'https://www.researchgate.net/publication/347239015_5_Usability_and_accessibility_of_toys_and_technologies_for_play_for_children_with_disabilities_Scoping_review_of_guidelines_and_tools'
  },
  {
    id: 'inclusive-play-design-guide', kind: 'guide', thread: 'toy', year: 2016, verified: 'secondary',
    title: t('Inclusive Play Design Guide', 'Priručnik za projektovanje inkluzivne igre'),
    who: 'PlayCore / Utah State University Center for Persons with Disabilities',
    says: t('A play setting is judged by whether children of different abilities play side by side in the same activity, not by whether an accessible apparatus exists somewhere on the site.', 'Prostor za igru ocenjuje se po tome da li se deca različitih sposobnosti igraju rame uz rame u istoj aktivnosti, a ne po tome da li negde na lokaciji postoji pristupačna sprava.'),
    limit: t('A commercial guide from a manufacturer of play equipment. Useful principles, interested author.', 'Komercijalni priručnik proizvođača opreme za igru. Korisni principi, zainteresovan autor.'),
    use: t('Carries straight into week 9 and theme A, the inclusive playground on our own site.', 'Prelazi pravo u 9. nedelju i temu A, inkluzivno igralište na našoj lokaciji.'),
    url: 'https://www.accessibleplayground.net/wp-content/uploads/2016/05/Inclusive-Play-Design-Guide-LowRes-2.pdf'
  },
  {
    id: 'fine-motor-programme', kind: 'paper', thread: 'toy', year: 2026, verified: 'secondary',
    title: t('Pilot implementation of an intervention programme to promote fine motor skills in preschoolers', 'Pilot primena programa za podsticanje fine motorike kod predškolaca'),
    who: 'PMC12932967',
    says: t('The programme ran 20 sessions, about 10 hours in total, built from 97 activities: 33 for bilateral motor coordination and 64 for visual–motor integration.', 'Program je imao 20 susreta, oko 10 sati ukupno, sastavljen od 97 aktivnosti: 33 za bilateralnu motornu koordinaciju i 64 za vizuelno-motornu integraciju.'),
    limit: t('A feasibility and acceptability pilot. It reports that the programme can be run, not that it works.', 'Pilot izvodljivosti i prihvatljivosti. Izveštava da program može da se sprovede, ne da deluje.'),
    use: t('Gives the two names our toy brief uses for the hand: bilateral coordination and visual–motor integration. Vocabulary matters when you talk to a therapist.', 'Daje dva imena koja zadatak igračke koristi za ruku: bilateralna koordinacija i vizuelno-motorna integracija. Rečnik je važan kad razgovaraš sa terapeutom.'),
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12932967/'
  },

  /* ---------------- teaching space to children: the practice that already exists ---------------- */
  {
    id: 'arkki', kind: 'programme', thread: 'teaching', year: 1993, verified: 'secondary',
    title: t('Arkki — architecture education for children and young people', 'Arkki — arhitektonsko obrazovanje za decu i mlade'),
    who: 'Helsinki, Finland · curriculum approved by the Finnish Ministry of Education and Culture in 2008',
    says: t('A non-profit school running weekly courses for ages 4 to 18 on space, light, material and structure. The content is building art, urban and community planning, spatial and landscape design, treated experientially and multi-sensorially; pupils are led to analyse, evaluate and interpret the environment they live in.', 'Neprofitna škola koja drži nedeljne kurseve za uzrast od 4 do 18 godina o prostoru, svetlu, materijalu i konstrukciji. Sadržaj su graditeljska umetnost, urbanističko i mesno planiranje, prostorni i pejzažni dizajn, obrađeni iskustveno i višečulno; učenici se vode ka tome da analiziraju, procenjuju i tumače okruženje u kom žive.'),
    limit: t('A thirty-year-old working practice with a state-approved curriculum, but we have found no controlled evaluation of outcomes. Treat it as a model to study, not as evidence.', 'Tridesetogodišnja živa praksa sa državno odobrenim programom, ali nismo našli kontrolisanu evaluaciju ishoda. Uzmi je kao model za učenje, ne kao dokaz.'),
    use: t('The nearest thing to the “primer of space” we are describing: somebody has already run it for thirty years and written the curriculum down.', 'Najbliža stvar „bukvaru prostora” o kom govorimo: neko ga već trideset godina sprovodi i zapisao je program.'),
    url: 'https://www.arkki.fi/en/basic-art-education/curriculum/'
  },
  {
    id: 'spatial-reasoning-toolkit', kind: 'guide', thread: 'teaching', year: 2021, verified: 'secondary',
    title: t('The Spatial Reasoning Toolkit — a learning trajectory from birth to seven', 'Spatial Reasoning Toolkit — putanja učenja od rođenja do sedme godine'),
    who: 'Early Childhood Maths Group, UK · practitioners and researchers',
    says: t('Twenty years of psychological research turned into practitioner guidance, with trajectories for movement and navigation, shape properties, and shape composition and construction. The named contexts are outdoor play, construction and puzzles — block play supports understanding how pieces fit together.', 'Dvadeset godina psiholoških istraživanja pretvoreno u uputstvo za praktičare, sa putanjama za kretanje i snalaženje, svojstva oblika i sastavljanje i građenje oblika. Imenovani konteksti su igra napolju, građenje i slagalice — igra kockama podržava razumevanje kako se delovi uklapaju.'),
    limit: t('Guidance distilled from research, not research. Each trajectory step traces back to studies we have not individually opened.', 'Uputstvo izvedeno iz istraživanja, a ne istraživanje. Svaki korak putanje vodi do studija koje nismo pojedinačno otvarali.'),
    use: t('The age ladder a student needs before claiming a toy suits a four-year-old. It is the closest thing to a curriculum for spatial skill.', 'Lestvica uzrasta koja studentu treba pre nego što tvrdi da igračka odgovara četvorogodišnjaku. Najbliže nastavnom programu za prostornu sposobnost.'),
    url: 'https://earlymaths.org/spatial-reasoning/'
  },
  {
    id: 'drawing-block-building', kind: 'paper', thread: 'teaching', year: 2024, verified: 'secondary',
    title: t('Specific and shared cognitive predictors of drawing and block building in typically developing children', 'Posebni i zajednički kognitivni prediktori crtanja i građenja kockama kod dece tipičnog razvoja'),
    who: 'PMC11461352',
    says: t('Drawing and block building are examined as two different spatial outputs with partly shared and partly distinct cognitive predictors.', 'Crtanje i građenje kockama ispituju se kao dva različita prostorna ishoda sa delom zajedničkim, delom različitim kognitivnim prediktorima.'),
    limit: t('Read from the abstract. Which predictors are shared has not been checked in the full text.', 'Čitano iz apstrakta. Koji su prediktori zajednički nije provereno u punom tekstu.'),
    use: t('Direct support for an architecture course asking a child to both build and draw: they are not the same act and the toy may serve one and not the other.', 'Neposredna potpora predmetu iz arhitekture koji od deteta traži i da gradi i da crta: to nisu iste radnje i igračka može da posluži jednoj, a ne drugoj.'),
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11461352/'
  },
  {
    id: 'neighbourhood-maps', kind: 'paper', thread: 'teaching', year: 1982, verified: 'secondary',
    title: t('Children’s spatial representation of their neighbourhood: a step towards a general spatial competence', 'Dečja prostorna predstava sopstvenog kraja: korak ka opštoj prostornoj kompetenciji'),
    who: 'Journal of Environmental Psychology',
    says: t('The home works as the central reference point of a child’s mental map of the environment; by about seven a child can draw the area around the home from memory. Early maps are strings of landmarks, and relative distance and position arrive later.', 'Dom funkcioniše kao središnja referentna tačka dečje mentalne mape okruženja; oko sedme godine dete može po sećanju da nacrta kraj oko kuće. Rane mape su nizovi orijentira, a odnos rastojanja i položaja dolazi kasnije.'),
    limit: t('A 1982 study and a small sample by current standards. The stages are a model, not a schedule.', 'Studija iz 1982. i uzorak mali po današnjim merilima. Faze su model, a ne raspored.'),
    use: t('Why last year’s exercises on the home, the house and the model were the right instinct — and the reference to cite for it.', 'Zašto su prošlogodišnje vežbe o domu, kući i maketi bile pravi instinkt — i referenca koja se za to navodi.'),
    url: 'https://www.sciencedirect.com/science/article/pii/S0272494482800169/pdf'
  },

  /* ---------------- rights: what is owed, not what is kind ---------------- */
  {
    id: 'crpd-24-26', kind: 'law', thread: 'rights', year: 2006, verified: 'secondary',
    title: t('UN Convention on the Rights of Persons with Disabilities — Articles 24 and 26', 'Konvencija UN o pravima osoba sa invaliditetom — članovi 24 i 26'),
    who: 'United Nations · ratified by Serbia in 2009',
    says: t('Article 24 makes inclusive education a right at every level, from pre-school onward, in the general system. Article 26 requires habilitation and rehabilitation services available from the earliest possible stage, based on the person’s needs and strengths — it is the first such instrument to name habilitation distinctly from rehabilitation.', 'Član 24 čini inkluzivno obrazovanje pravom na svakom nivou, od predškolskog nadalje, u opštem sistemu. Član 26 zahteva habilitaciju i rehabilitaciju dostupne od najranije moguće faze, prema potrebama i snagama osobe — to je prvi takav instrument koji habilitaciju imenuje odvojeno od rehabilitacije.'),
    limit: t('A convention binds the state, not a toy designer. It gives you the obligation behind the brief, not a technical requirement.', 'Konvencija obavezuje državu, a ne projektanta igračke. Daje obavezu iza zadatka, a ne tehnički zahtev.'),
    use: t('“From the earliest possible stage” is the sentence that makes the day after the assessment a legal matter, not a favour.', '„Od najranije moguće faze” je rečenica zbog koje je dan posle procene pravno pitanje, a ne usluga.'),
    url: 'https://www.unicef.org/eca/sites/unicef.org.eca/files/IE_summary_accessible_220917_0.pdf'
  },
  {
    id: 'srbija-irk', kind: 'law', thread: 'rights', year: 2018, verified: 'secondary',
    title: t('Serbia: Rulebook on additional educational, health and social support for a child, pupil and adult', 'Srbija: Pravilnik o dodatnoj obrazovnoj, zdravstvenoj i socijalnoj podršci detetu, učeniku i odraslom'),
    who: 'Službeni glasnik RS 80/2018 · interresorna komisija',
    says: t('Local self-government forms an inter-sectoral commission with members from education, health and social protection. It assesses what additional support a child needs for inclusion in education and in the life of the community. For an IOP-2 — the more intensive individual education plan — the commission’s opinion is mandatory.', 'Jedinica lokalne samouprave obrazuje interresornu komisiju sa članovima iz obrazovanja, zdravstva i socijalne zaštite. Ona procenjuje koja je dodatna podrška detetu potrebna za uključivanje u obrazovanje i život zajednice. Za IOP-2 — intenzivniji individualni obrazovni plan — mišljenje komisije je obavezno.'),
    limit: t('Read from legal portals and a published PDF of the rulebook, not from the Official Gazette itself. Before quoting an article number, open the gazette.', 'Čitano sa pravnih portala i iz objavljenog PDF-a pravilnika, a ne iz samog Službenog glasnika. Pre navođenja broja člana, otvori glasnik.'),
    use: t('The Serbian name of the machinery the association is talking about. The commission names the support; somebody still has to make the thing.', 'Srpsko ime mehanizma o kom udruženje govori. Komisija imenuje podršku; neko i dalje mora da napravi stvar.'),
    url: 'http://pravni-skener.org/pdf/sr/baza_propisa/52.pdf'
  },
  {
    id: 'udl-3', kind: 'guide', thread: 'rights', year: 2024, verified: 'secondary',
    title: t('UDL Guidelines 3.0 — Universal Design for Learning', 'UDL smernice 3.0 — univerzalni dizajn učenja'),
    who: 'CAST · released 30 July 2024',
    says: t('The framework has three networks — affective (engagement), recognition (perception and understanding) and strategic (planning and action). Version 3.0 shifts the goal from producing “expert learners” to supporting learner agency, and explicitly addresses barriers rooted in bias and systems of exclusion.', 'Okvir ima tri mreže — afektivnu (angažovanje), prepoznavajuću (opažanje i razumevanje) i stratešku (planiranje i delanje). Verzija 3.0 pomera cilj sa stvaranja „ekspertskih učenika” na podršku samostalnosti onoga ko uči i izričito se bavi preprekama koje potiču iz pristrasnosti i sistema isključivanja.'),
    limit: t('A framework with a large practice base and a contested evidence base. It is how to think, not proof that it works.', 'Okvir sa velikom praktičnom osnovom i spornom dokaznom osnovom. To je način mišljenja, a ne dokaz da deluje.'),
    use: t('The bridge between universal design in space and universal design in teaching — the same seven-principle instinct applied to a lesson, and to a toy that teaches.', 'Most između univerzalnog dizajna u prostoru i univerzalnog dizajna u nastavi — isti instinkt sedam principa primenjen na čas, i na igračku koja uči.'),
    url: 'https://udlguidelines.cast.org/'
  },

  /* ---------------- the method of this studio ---------------- */
  {
    id: 'nario-redmond-2017', kind: 'paper', thread: 'method', year: 2017, verified: 'abstract',
    title: t('Crip for a day: the unintended negative consequences of disability simulations', 'Crip for a day: nenamerne negativne posledice simulacija invaliditeta'),
    who: 'Nario-Redmond, Gospodinov & Cobb · Rehabilitation Psychology 62(3)',
    says: t('After simulating a disability, participants report more empathy but also more pity, discomfort and fear, judge themselves less capable, and are no more willing to work with disabled people on accessibility.', 'Posle simulacije invaliditeta učesnici prijavljuju više empatije, ali i više sažaljenja, nelagode i straha, sebe procenjuju manje sposobnim i nisu spremniji da sa osobama sa invaliditetom rade na pristupačnosti.'),
    limit: t('It rules out one method. It does not rule out structured exercises with real tools, with a debrief.', 'Isključuje jedan metod. Ne isključuje strukturirane vežbe sa stvarnim alatima i zajedničkom analizom posle.'),
    use: t('The reason there is no blindfold in this studio, and the reason every lab here measures a tool rather than a person.', 'Razlog zbog kog u ovom studiju nema poveza na očima i zbog kog svaki ogled ovde meri alat, a ne osobu.'),
    url: 'https://www.researchgate.net/publication/314968962_Crip_for_a_Day_The_Unintended_Negative_Consequences_of_Disability_Simulations'
  },
  {
    id: 'ncstate-1997', kind: 'guide', thread: 'method', year: 1997, verified: 'full',
    title: t('The Principles of Universal Design, version 2.0', 'Principi univerzalnog dizajna, verzija 2.0'),
    who: 'Center for Universal Design, North Carolina State University',
    says: t('Seven principles with guidelines, written for products and environments at once: equitable use, flexibility, simple and intuitive use, perceptible information, tolerance for error, low physical effort, and size and space for approach and use.', 'Sedam principa sa smernicama, pisanih istovremeno za proizvode i okruženja: ravnopravna upotreba, fleksibilnost, jednostavna i intuitivna upotreba, uočljiva informacija, tolerancija na grešku, mali fizički napor, i veličina i prostor za pristup i upotrebu.'),
    limit: t('Written in 1997, before touchscreens and before the current cognitive-accessibility literature. It is a checklist of questions, not a specification with numbers.', 'Pisano 1997, pre ekrana osetljivih na dodir i pre današnje literature o kognitivnoj pristupačnosti. To je spisak pitanja, a ne specifikacija sa brojevima.'),
    use: t('The spine of the course. A toy is a product and an environment at the same time, which is why the seven work on it without translation.', 'Kičma predmeta. Igračka je istovremeno i proizvod i okruženje, i zato sedam principa na njoj radi bez prevoda.'),
    url: 'https://design.ncsu.edu/research/center-for-universal-design/'
  }
];

export const researchById = id => RESEARCH.find(item => item.id === id) || null;

export function filterResearch({ thread = 'all', kind = 'all', verified = 'all', query = '' } = {}) {
  const needle = String(query || '').trim().toLowerCase();
  return RESEARCH.filter(item => {
    if (thread !== 'all' && item.thread !== thread) return false;
    if (kind !== 'all' && item.kind !== kind) return false;
    if (verified !== 'all' && item.verified !== verified) return false;
    if (!needle) return true;
    const haystack = [item.title.en, item.title.sr, item.says.en, item.says.sr, item.limit.en, item.limit.sr, item.use.en, item.use.sr, item.who, String(item.year)]
      .join(' ').toLowerCase();
    return haystack.includes(needle);
  });
}

// What the shelf does not yet hold. An open question is a piece of work, not an apology.
export const OPEN_QUESTIONS = [
  {
    id: 'cards-after',
    question: t('Is there any published card deck that starts where the assessment ends — one task per spatial operation, with the object to practise it on?', 'Postoji li ijedan objavljen špil kartica koji počinje tamo gde procena prestaje — po jedan zadatak za svaku radnju nad prostorom, sa predmetom na kom se vežba?'),
    why: t('Everything found so far either measures a child or navigates a service. The deck the association wants may not exist, and that is a reason to make it, not a reason to stop looking.', 'Sve nađeno do sada ili meri dete ili se snalazi u sistemu usluga. Špil koji udruženje želi možda ne postoji, i to je razlog da se napravi, a ne da se prestane tražiti.'),
    next: t('Search the occupational-therapy and early-years literature, not the architecture literature. Ask the association’s therapists what they already hand out.', 'Pretražiti literaturu radne terapije i ranog uzrasta, ne arhitektonsku. Pitati terapeute udruženja šta već daju roditeljima.')
  },
  {
    id: 'serbia-evidence',
    question: t('What does Serbia actually do between the inter-sectoral commission’s opinion and the first hour of support?', 'Šta Srbija zaista radi između mišljenja interresorne komisije i prvog sata podrške?'),
    why: t('We have the rulebook and we have none of the practice: no published waiting time, no published refusal rate, no published count of children assessed and then unserved.', 'Imamo pravilnik, a nemamo praksu: nijedno objavljeno vreme čekanja, nijedna objavljena stopa odbijanja, nijedan objavljen broj dece koja su procenjena pa neopslužena.'),
    next: t('Ask the association for its own figures first — a count from one organisation beats a national estimate nobody measured.', 'Prvo tražiti brojke od samog udruženja — broj iz jedne organizacije vredi više od nacionalne procene koju niko nije merio.')
  },
  {
    id: 'object-vs-screen',
    question: t('For spatial operations, does the object in the hand actually beat the same task on a screen, and for which children?', 'Da li za radnje nad prostorom predmet u ruci zaista nadmašuje isti zadatak na ekranu, i za koju decu?'),
    why: t('Our whole first task rests on it. One study tests it directly; we have not read the result in full, and we must not teach an assumption as a finding.', 'Ceo naš prvi zadatak stoji na tome. Jedna studija to ispituje neposredno; nismo pročitali rezultat u celini, a ne smemo da predajemo pretpostavku kao nalaz.'),
    next: t('Open Gilligan-Lee et al. 2023 in full and write the effect into this file, with the direction it actually points.', 'Otvoriti Gilligan-Lee i saradnike iz 2023. u celini i upisati efekat u ovaj fajl, sa smerom u koji zaista pokazuje.')
  },
  {
    id: 'arkki-outcomes',
    question: t('Has thirty years of architecture education for children in Finland ever been evaluated against anything?', 'Da li je trideset godina arhitektonskog obrazovanja za decu u Finskoj ikada protiv nečega evaluirano?'),
    why: t('If a state-approved curriculum for ages 4–18 has outcome data, it is the strongest existing argument for a “primer of space”. If it has none, that is a publishable gap and a possible collaboration.', 'Ako državno odobren program za uzrast 4–18 ima podatke o ishodima, to je najjači postojeći argument za „bukvar prostora”. Ako ih nema, to je praznina za objavljivanje i moguća saradnja.'),
    next: t('Write to Arkki and search Finnish-language education research, not only English.', 'Pisati Arkkiju i pretražiti obrazovna istraživanja na finskom, ne samo na engleskom.')
  }
];
