// What changes with the age of the user: the development that makes a thing usable at all,
// the standard that says how a limit is proved, and the law that makes it an obligation.
//
// Three classes of statement live here and they are NEVER merged, because they fail differently:
//   'law'      — an obligation. Breaking it is unlawful.
//   'standard' — a technical limit and a test method. It is how conformity is proved.
//   'data'     — observed development. It says whether a child will use the thing at all.
// A number on a student's A3 must carry its class. A development figure quoted as a legal
// requirement is a lie in the direction of authority; a legal limit quoted as a preference
// is a lie in the direction of comfort.
//
// `verified` keeps the same meaning as on the research shelf (assets/research.js):
//   'full' — the source text was opened and the clause read in it
//   'abstract' — the abstract, table of contents or front matter was read
//   'secondary' — the claim comes from a summary of the source
//
// Gathered 02.10.2026 for the toy brief. The age bands are the ten groups of the CPSC 2020
// Age Determination Guidelines, adopted here unchanged: they are the only published bands
// tied to observed play with real objects, so borrowing them keeps our numbers traceable.

const t = (en, sr) => ({ en, sr });

/* ---------------------------------------------------------------------------
   The doctrine: three sentences that decide how every number below is used.
   --------------------------------------------------------------------------- */
export const AGE_DOCTRINE = [
  {
    id: 'stage-not-age',
    title: t('Age is a proxy. Behaviour is the measurement.', 'Godište je zamena. Mera je ponašanje.'),
    body: t('A birthday predicts what a child does with an object; it does not determine it. ISO/IEC Guide 50 devotes a clause to developmental age against chronological age (5.3) and another to the needs of children with disabilities (4.6). The Spatial Reasoning Toolkit publishes a second version of its whole trajectory by stages instead of ages, explicitly for children with special educational needs. The ICO children’s code says in its own annex that age ranges are not a perfect guide to the evolving capacity of an individual child.', 'Datum rođenja predviđa šta dete radi sa predmetom, ali ne određuje. ISO/IEC Guide 50 ima poseban odeljak o razvojnom uzrastu naspram kalendarskog (5.3) i poseban o potrebama dece sa invaliditetom (4.6). Spatial Reasoning Toolkit objavljuje drugu verziju cele putanje po fazama umesto po godinama, izričito za decu sa posebnim obrazovnim potrebama. ICO-ov kodeks za decu u sopstvenom aneksu kaže da uzrasne grupe nisu savršen vodič kroz promenljivu sposobnost pojedinog deteta.'),
    studio: t('On our A3 the hazard band is set by what the child does — mouths it, pulls it, climbs it — and the age on the label is the second line, not the first. A toy made for the association meets the limit of the youngest behaviour it will actually meet, not of the age written on the group.', 'Na našem A3 opasnosni razred određuje ono što dete radi — stavlja u usta, vuče, penje se — a godište na nalepnici je drugi red, ne prvi. Igračka napravljena za udruženje zadovoljava granicu najmlađeg ponašanja na koje će zaista naići, a ne godišta upisanog na grupi.')
  },
  {
    id: 'edition-and-date',
    title: t('Every number has an edition and a date.', 'Svaki broj ima izdanje i datum.'),
    body: t('EN 71-1 has a 2026 edition; the course quotes the 2014 one because that is the text we have opened. Directive 2009/48/EC has been repealed by Regulation (EU) 2025/2509, in force since 1 January 2026 but applying from 1 August 2030. For four more years both frameworks are in the air at once.', 'EN 71-1 ima izdanje iz 2026; predmet navodi ono iz 2014. jer je to tekst koji smo otvorili. Direktivu 2009/48/EC zamenila je Uredba (EU) 2025/2509, na snazi od 1. januara 2026, a primenjuje se od 1. avgusta 2030. Još četiri godine oba okvira stoje u vazduhu istovremeno.'),
    studio: t('A number without a year and an edition is not a requirement, it is a memory. The sheet carries both, or the sheet is wrong by 2030.', 'Broj bez godine i izdanja nije zahtev nego sećanje. List nosi i jedno i drugo, ili je do 2030. pogrešan.')
  },
  {
    id: 'three-classes',
    title: t('Law, standard, development: never in the same column.', 'Zakon, standard, razvoj: nikad u istoj koloni.'),
    body: t('A law obliges. A standard gives the limit and the test by which conformity is shown. Development data says whether a child of that age will pick the thing up at all. Confuse them and the argument collapses in both directions: a preference defended as an obligation, and an obligation reduced to a preference.', 'Zakon obavezuje. Standard daje granicu i ispitivanje kojim se usaglašenost dokazuje. Razvojni podatak kaže da li će dete tog uzrasta predmet uopšte uzeti u ruke. Kad se pomešaju, argument pada u oba smera: ukus branjen kao obaveza, i obaveza svedena na ukus.'),
    studio: t('Each limit below is tagged with its class, and the tag goes onto the A3 beside the number. The compliance table of the sheet has a column for it.', 'Svaka granica ispod nosi oznaku svoje klase, i ta oznaka ide na A3 pored broja. Tabela usklađenosti na listu ima kolonu za to.')
  }
];

/* ---------------------------------------------------------------------------
   The ten bands. `does` is the hand and the mind; `space` is the spatial
   operation that becomes available; `product` is what that means for an object;
   `trap` is the mistake a designer makes at exactly this age.
   --------------------------------------------------------------------------- */
export const AGE_BANDS = [
  {
    id: 'b00', months: [0, 3], label: t('Birth through 3 months', 'Od rođenja do 3 meseca'),
    does: t('Reflexive grasp, jerky and unpredictable motion. Focus is best at about 8 inches (≈200 mm) at first and reaches a few feet by the end. Prefers the human face to every other pattern; turns the head towards a sound. At 3 months begins to swipe at a dangling object. Everything grasped goes to the mouth.', 'Refleksni hvat, trzav i nepredvidiv pokret. Fokus je najbolji na oko 200 mm na početku, a do kraja perioda dohvata nekoliko koraka. Ljudsko lice pretpostavlja svakom drugom obrascu; glavu okreće prema zvuku. Sa 3 meseca počinje da zamahuje ka visećem predmetu. Sve što uhvati ide u usta.'),
    space: t('There is no operation on space yet — there is tracking. The child learns that something exists in a direction.', 'Radnje nad prostorom još nema — ima praćenja. Dete uči da nešto postoji u nekom pravcu.'),
    product: t('Soft, light, washable, rounded, easy to grip; a slow movement and a gentle sound beat a loud or sudden one. Preference for soft material peaks here and falls through the first year.', 'Mekano, lako, perivo, zaobljeno, lako za hvat; polagan pokret i blag zvuk nadmašuju glasan ili iznenadan. Sklonost mekom materijalu je ovde na vrhu i opada kroz prvu godinu.'),
    trap: t('Designing for the eye of the adult buyer. At this band the object is for a child who cannot yet reach it.', 'Projektovanje za oko odraslog kupca. U ovom razredu predmet je za dete koje ga još ne dohvata.')
  },
  {
    id: 'b04', months: [4, 7], label: t('4 through 7 months', '4–7 meseci'),
    does: t('Grasp mastered around 6 months; sits independently at 6–7, which frees both hands and brings objects to the midline. The grip is a claw or a rake, not a pincer. Transfers hand to hand. Still mouths everything, so a suitable toy is washable.', 'Hvat ovladan oko 6. meseca; sedi samostalno sa 6–7, što oslobađa obe ruke i donosi predmet na srednju liniju. Hvat je kandžast ili grabljiv, ne pincetni. Prebacuje iz ruke u ruku. Još sve stavlja u usta, pa je prikladna igračka periva.'),
    space: t('Object permanence begins: a partly hidden thing has not stopped existing. This is the first spatial fact a child owns.', 'Počinje trajnost predmeta: delimično skriveno nije prestalo da postoji. To je prva prostorna činjenica koju dete poseduje.'),
    product: t('Blocks become holdable, but as handles rather than parts: under 4 inches (≈100 mm) across to be graspable, over 3 inches (≈75 mm) not to be swallowed, soft or hollow, rounded.', 'Kocka postaje držljiva, ali kao ručka, a ne kao deo: manja od ≈100 mm da bi se obuhvatila, veća od ≈75 mm da se ne bi progutala, mekana ili šuplja, zaobljena.'),
    trap: t('Expecting assembly. Two hands work, but they do not yet cooperate on one task.', 'Očekivanje sastavljanja. Dve ruke rade, ali još ne sarađuju na istom poslu.')
  },
  {
    id: 'b08', months: [8, 11], label: t('8 through 11 months', '8–11 meseci'),
    does: t('Crawls, pulls to stand, begins to climb. Holds two objects and bangs them together but cannot coordinate them into one action; with a single object one hand stabilises while the other explores. The pincer grasp begins. Dumps out, puts back, repeats. Cause and effect is understood in its simplest form.', 'Puzi, podiže se u stav, počinje da se penje. Drži dva predmeta i udara ih jedan o drugi, ali ih ne usklađuje u jednu radnju; na jednom predmetu jedna ruka drži, druga istražuje. Počinje pincetni hvat. Prosipa, vraća, ponavlja. Uzrok i posledica razumeju se u najprostijem obliku.'),
    space: t('Container and contained: in, out, behind. The child is doing topology with a bucket.', 'Sadržalac i sadržano: unutra, van, iza. Dete radi topologiju sa posudom.'),
    product: t('Squeezable and sounding; 3–5 inches (≈75–125 mm) carries easily. Few blocks, not an assortment. Wooden blocks are generally too heavy here.', 'Stisljivo i zvučno; ≈75–125 mm se lako nosi. Malo kocaka, ne asortiman. Drvene kocke su ovde uglavnom previše teške.'),
    trap: t('Twice the dexterity is twice the hazard: two objects in two hands means two things to choke on and two things to be struck by.', 'Dvaput veća spretnost je dvaput veća opasnost: dva predmeta u dve ruke znače dve stvari za gušenje i dve za udarac.')
  },
  {
    id: 'b12', months: [12, 18], label: t('12 through 18 months', '12–18 meseci'),
    does: t('Walks unsupported but unsteadily; curiosity far outweighs any judgement of danger. Manages simple twisting, turning, sliding and cranking. Fits a round peg into a round hole. Dumps, fills, stacks and knocks over. Symbolic play is not clear until about 18 months.', 'Hoda bez oslonca, ali nesigurno; radoznalost daleko prevazilazi svaku procenu opasnosti. Snalazi se sa prostim okretanjem, zavrtanjem, povlačenjem i obrtanjem ručice. Ubacuje okrugao klin u okruglu rupu. Prosipa, puni, slaže i obara. Simbolička igra nije jasna do oko 18. meseca.'),
    space: t('Fitting by one dimension: round into round. Not yet matching an angle.', 'Uklapanje po jednoj dimenziji: okruglo u okruglo. Ugao se još ne poklapa.'),
    product: t('Puzzles may be introduced but are handled sensorily, not solved: a simple frame, large pieces with grip knobs, large distinct wells. Blocks 2–4 inches (≈50–100 mm), 15–25 pieces is enough.', 'Slagalica se može uvesti, ali se ne rešava nego se čulno istražuje: prost okvir, velike figure sa ručicom, velika i jasno različita ležišta. Kocke ≈50–100 mm, 15–25 komada je dovoljno.'),
    trap: t('The cord. Under 18 months a cord that can tangle is limited to 220 mm and nothing about the child’s walking skill changes that.', 'Kanap. Do 18 meseci kanap koji može da se zamrsi ograničen je na 220 mm i nijedna veština hodanja to ne menja.')
  },
  {
    id: 'b19', months: [19, 23], label: t('19 through 23 months', '19–23 meseci'),
    does: t('Steadier on the feet; balances, jumps, runs, climbs onto furniture, walks stairs with help. Pincer grasp is developed enough for much smaller objects. Sorts into two groups. Uses very simple couplings: magnets, large hooks, hook-and-loop.', 'Sigurnije na nogama; balansira, skače, trči, penje se na nameštaj, uz stepenice ide uz pomoć. Pincetni hvat je razvijen za mnogo manje predmete. Sortira u dve grupe. Koristi vrlo proste spojeve: magnete, velike kuke, čičak.'),
    space: t('Matching an angle. A square peg goes into a square hole — and at 19 months true building play begins. This is the first mental rotation that pays off in the hand.', 'Poklapanje ugla. Četvrtast klin ulazi u četvrtastu rupu — i sa 19 meseci počinje prava graditeljska igra. To je prva mentalna rotacija koja se isplati u ruci.'),
    product: t('Lightweight wood, cardboard or foam, square or rectangular, about 2–4 inches (≈50–100 mm), sets of 20–40. Interlocking sets 2–4 inches, 20–30 pieces. Knocking down matters as much as building, so nothing heavy or hard-cornered.', 'Lako drvo, karton ili pena, kvadrat ili pravougaonik, oko ≈50–100 mm, setovi 20–40. Spojni setovi ≈50–100 mm, 20–30 komada. Obaranje je važno kao i građenje, pa ništa teško ni sa tvrdim uglom.'),
    trap: t('Kindergarten unit blocks. They are the right shape and the wrong mass: the tower is built to be knocked down onto a foot.', 'Velike drvene kocke za vrtić. Pravi oblik, pogrešna masa: toranj se gradi da bi bio oboren — na stopalo.')
  },
  {
    id: 'b24', months: [24, 35], label: t('2 years', '2 godine'),
    does: t('Pretend play is established; roles appear. Manages simple screwing and a one- or two-turn wind-up of low tension; large hooks, buttons and buckles yes, small buttons and snaps no. Balances on one foot, climbs, kicks and throws with uncertain control. Prefers the object to resemble the real thing.', 'Igra pretvaranja je utemeljena; pojavljuju se role. Snalazi se sa prostim zavrtanjem i navijanjem u jedan-dva obrta male zategnutosti; velike kuke, dugmeta i kopče da, mala dugmeta i drikeri ne. Balansira na jednoj nozi, penje se, šutira i baca uz nesigurnu kontrolu.'),
    space: t('Ordering by size emerges; sorting becomes meaningful. Inset puzzles are solved, but each piece must fit in exactly one orientation — the child cannot yet rotate a piece mentally and keep the plan.', 'Javlja se nizanje po veličini; sortiranje postaje smisleno. Slagalica sa ležištima se rešava, ali svaki deo mora da ulazi u samo jednoj orijentaciji — dete još ne može mentalno da okrene deo i zadrži plan.'),
    product: t('Inset puzzles with one clear solution, knobs so the piece can be turned in place without moving the fingers, distinctive shapes, smooth wooden or light plastic pieces. Blocks as at 19–23 months, 20–40 pieces.', 'Slagalice sa ležištima i jednim jasnim rešenjem, ručice da se deo okrene u mestu bez premeštanja prstiju, prepoznatljivi oblici, glatko drvo ili laka plastika. Kocke kao na 19–23 meseca, 20–40 komada.'),
    trap: t('A piece that fits two ways. It reads as generous and lands as noise: the child learns that the object has no rule.', 'Deo koji ulazi na dva načina. Izgleda darežljivo, a dolazi kao šum: dete nauči da predmet nema pravilo.')
  },
  {
    id: 'b36', months: [36, 47], label: t('3 years', '3 godine'),
    does: t('Analyses the parts of something seen and visualises each in relation to the others — “no, that doesn’t go there, it goes over here”. Works through relative size, volume, space and weight. Fine motor skill is enough for snapping, screwing, pressing and nesting; still no reading of assembly directions.', 'Rastavlja viđeno na delove i predstavlja svaki u odnosu na druge — „ne, to ne ide tu, ide ovde”. Prolazi kroz odnose veličine, zapremine, prostora i težine. Sitna motorika je dovoljna za spajanje, zavrtanje, pritiskanje i ugnježdavanje; uputstvo za sastavljanje još ne prati.'),
    space: t('The first real composition: parts into a whole that was planned. Wooden unit blocks become appropriate, and with them proportion as a lived fact — the basic unit and its multiples.', 'Prvo stvarno sastavljanje: delovi u celinu koja je bila zamišljena. Drvene jedinične kocke postaju prikladne, a sa njima i proporcija kao proživljena činjenica — osnovna jedinica i njeni umnošci.'),
    product: t('Puzzles up to 26 pieces; knobs or a magnetic wand may still be needed; cardboard pieces become usable because the child no longer mouths them. Interlocking sets 30–50 pieces, 2–4 inches. Unit blocks: the CPSC chart gives a basic unit of 3½ × 3½ × 1½ inches while its own narrative on the same page says 3 × 3 × 1 — so measure the block you actually have.', 'Slagalice do 26 delova; ručica ili magnetna palica mogu još da budu potrebne; kartonski delovi postaju upotrebljivi jer dete više ne stavlja u usta. Spojni setovi 30–50 delova, ≈50–100 mm. Jedinična kocka: CPSC tabela daje 3½ × 3½ × 1½ inča, a sopstveni tekst na istoj strani kaže 3 × 3 × 1 — pa izmeri kocku koju zaista imaš.'),
    trap: t('36 months is the biggest legal cliff in the whole table: sharp functional edges and points, accessible glass and longer cords all become permitted here. Nothing about a child changes overnight; the standard changes.', 'Trideset šest meseci je najveća pravna provalija u celoj tabeli: oštre funkcionalne ivice i vrhovi, dostupno staklo i dulji kanapi ovde postaju dopušteni. Na detetu se ništa ne menja preko noći; menja se standard.')
  },
  {
    id: 'b48', months: [48, 71], label: t('4 through 5 years', '4–5 godina'),
    does: t('Building is a dominant activity. Finally has the gross motor strength to push a flat piece into a slot and the fine motor skill to align it. Invents and coordinates several roles in one scenario. Still often cannot separate fantasy from reality.', 'Građenje je vladajuća aktivnost. Konačno ima grubu snagu da plosnat deo utisne u prorez i sitnu motoriku da ga poravna. Izmišlja i usklađuje nekoliko rola u jednom scenariju. Često još ne razdvaja izmišljeno od stvarnog.'),
    space: t('Systematic strategy begins to replace trial and error, and loose parts enter the structure: a car makes the garage a garage. Scale arrives as a question — how big is this for whom.', 'Sistematska strategija počinje da zamenjuje pogađanje, a rasuti delovi ulaze u strukturu: automobil čini garažu garažom. Razmera dolazi kao pitanje — koliko je to veliko i za koga.'),
    product: t('Puzzles up to 60 pieces, knobs no longer needed, first non-inset jigsaws. Blocks and interlocking sets 80–100 pieces, pieces under 1 inch (≈25 mm) now manageable — which is exactly the size that is still a small part for a younger sibling.', 'Slagalice do 60 delova, ručica više nije potrebna, prve prave slagalice bez ležišta. Kocke i spojni setovi 80–100 delova, delovi manji od ≈25 mm sada su izvodljivi — a to je upravo veličina koja je još mali deo za mlađeg brata ili sestru.'),
    trap: t('The younger sibling in the same room. The sheet is age-graded for four; the floor is shared with eighteen months.', 'Mlađe dete u istoj sobi. List je ocenjen za četvorogodišnjaka; pod se deli sa osamnaest meseci.')
  },
  {
    id: 'b72', months: [72, 107], label: t('6 through 8 years', '6–8 godina'),
    does: t('Plays by rules, spontaneous or set, and the rules can be complex. Makes small controlled marks. Rough-and-tumble and risk taking increase; so does the appetite for a specialised skill practised on purpose. Collecting begins, because detail is now noticed.', 'Igra po pravilima, dogovorenim ili izmišljenim, i pravila mogu biti složena. Pravi male kontrolisane poteze. Raste i grubo igranje i spremnost na rizik; raste i želja da se jedna veština namerno uvežba. Počinje kolekcionarstvo, jer se detalj sada vidi.'),
    space: t('Jigsaw logic: a piece is identified by where it goes, not by trying it everywhere. Three-dimensional puzzles start to interest towards 8–9. Plan and execution separate into steps.', 'Logika slagalice: deo se prepoznaje po mestu na koje ide, a ne probanjem svuda. Trodimenzionalne slagalice počinju da zanimaju prema 8–9. Plan i izvođenje se razdvajaju u korake.'),
    product: t('Puzzles up to 100 pieces, pieces at least an inch across until the fingers can do less. Blocks 80–100 pieces, mixed sizes and shapes. By 7–8, motorised or chip-based parts.', 'Slagalice do 100 delova, delovi od najmanje ≈25 mm dok prsti ne mogu manje. Kocke 80–100 delova, mešane veličine i oblici. Sa 7–8, motorizovani ili čipovani delovi.'),
    trap: t('This is the band where playground injuries peak, not the toddler band — ISO/IEC Guide 50 reports equipment injuries peaking at 5 to 9 years while burns, poisoning and drowning peak under 5. Competence buys reach, and reach buys falls.', 'U ovom razredu povrede na igralištu dostižu vrh, a ne u razredu malog deteta — ISO/IEC Guide 50 navodi da povrede od opreme dostižu vrh između 5 i 9 godina, dok opekotine, otrovanja i utapanja dostižu vrh ispod 5. Sposobnost kupuje domet, a domet kupuje pad.')
  },
  {
    id: 'b108', months: [108, 155], label: t('9 through 12 years', '9–12 godina'),
    does: t('Moves from the concrete towards the abstract and applies a general rule to a particular case. Prefers raw material to a finished product. Some games become predictable and boring, so the challenge has to rise.', 'Prelazi od konkretnog ka apstraktnom i opšte pravilo primenjuje na pojedinačan slučaj. Pretpostavlja sirov materijal gotovom proizvodu. Neke igre postaju predvidive i dosadne, pa izazov mora da raste.'),
    space: t('Follows directions for a three-dimensional construction and handles small, abstract, interlocking pieces. Jigsaws up to 500 pieces at nine and up to 2000 by twelve — the band where a drawing can finally be read as an instruction.', 'Prati uputstvo za trodimenzionalnu konstrukciju i radi sa malim, apstraktnim, spojnim delovima. Slagalice do 500 delova sa devet i do 2000 sa dvanaest — razred u kom se crtež konačno čita kao uputstvo.'),
    product: t('No practical limit on part count; 100 or more to hold the appeal. Metal parts, tiny screws, gears. Around 9, model sets with cement become appropriate, with adult help.', 'Nema praktične granice broja delova; 100 i više da bi se zadržala privlačnost. Metalni delovi, sitni vijci, zupčanici. Oko 9. godine prikladni su setovi sa lepkom i cementom, uz pomoć odraslog.'),
    trap: t('Designing a toy and delivering a kit. At this band a thing that only assembles one way is finished the first evening and never touched again.', 'Projektovana igračka, a isporučen komplet. U ovom razredu stvar koja se sastavlja samo na jedan način završena je prve večeri i više se ne dira.')
  }
];

export const bandById = id => AGE_BANDS.find(band => band.id === id) || null;

/* ---------------------------------------------------------------------------
   The limits. Every row names its class, its source, its clause and how far
   we read that source. A row without a clause is not allowed to exist here.
   --------------------------------------------------------------------------- */
export const AGE_LIMIT_KINDS = [
  { id: 'law', label: t('Law — an obligation', 'Zakon — obaveza') },
  { id: 'standard', label: t('Standard — the limit and its test', 'Standard — granica i njeno ispitivanje') },
  { id: 'data', label: t('Development — will it be used at all', 'Razvoj — da li će se uopšte koristiti') }
];

export const AGE_LIMITS = [
  /* ------------------------------ the toy in the hand ------------------------------ */
  {
    id: 'small-parts', kind: 'standard', bands: ['b00', 'b04', 'b08', 'b12', 'b19', 'b24'],
    rule: t('No toy or removable component for a child under 36 months may fit entirely inside the small-parts cylinder.', 'Nijedna igračka ni odvojivi deo za dete ispod 36 meseci ne sme da uđe ceo u cilindar za male delove.'),
    value: '⌀31,7 mm · 25,4–57,1 mm',
    detail: t('The same cylinder appears in the EU standard and in the US ban of 1979: diameter 31,7 mm, depth 25,4 mm at the shallow side rising to 57,1 mm. It is tested after the use-and-abuse forces, so what matters is what breaks off, not what you glued on.', 'Isti cilindar stoji u evropskom standardu i u američkoj zabrani iz 1979: prečnik 31,7 mm, dubina 25,4 mm na plićoj strani do 57,1 mm. Ispituje se posle sila upotrebe i zloupotrebe, pa je važno šta se otkine, ne šta si zalepio.'),
    source: 'EN 71-1:2011+A3 · 8.2 · 16 CFR 1501.4', clause: '8.2', verified: 'full',
    url: 'https://law.resource.org/pub/eu/toys/en.71.1.2014.html'
  },
  {
    id: 'cords-18', kind: 'standard', bands: ['b00', 'b04', 'b08', 'b12'],
    rule: t('A cord or chain that can tangle, on a toy for a child under 18 months: 220 mm, or it must break apart under test.', 'Kanap ili lančić koji može da se zamrsi, na igrački za dete ispod 18 meseci: 220 mm, ili se pod ispitivanjem mora raspasti.'),
    value: '≤ 220 mm',
    detail: t('Measured by 8.40; the breakaway alternative is tested by 8.38. From 18 to 36 months the limit rises to 300 mm, and anything over 220 mm that can form a loop or a noose needs a warning visible before purchase.', 'Meri se po 8.40; raspadanje je alternativa i ispituje se po 8.38. Od 18 do 36 meseci granica raste na 300 mm, a sve preko 220 mm što može da napravi omču zahteva upozorenje vidljivo pre kupovine.'),
    source: 'EN 71-1:2011+A3 · 4.11, 8.38, 8.40', clause: '8.40', verified: 'full',
    url: 'https://law.resource.org/pub/eu/toys/en.71.1.2014.html'
  },
  {
    id: 'cords-36', kind: 'standard', bands: ['b19', 'b24'],
    rule: t('18 to 36 months: a tangling cord may reach 300 mm, but over 220 mm it carries a warning at the point of sale.', '18 do 36 meseci: kanap koji se mrsi može do 300 mm, ali preko 220 mm nosi upozorenje na mestu prodaje.'),
    value: '≤ 300 mm',
    detail: t('The band between 220 and 300 mm is the clearest case in the standard of a limit that is allowed and still declared dangerous. It is a good question for a studio: what does a warning actually do in a household with two children.', 'Opseg između 220 i 300 mm najjasniji je slučaj u standardu gde je granica dopuštena, a ipak označena kao opasna. Dobro pitanje za studio: šta upozorenje stvarno radi u domu sa dvoje dece.'),
    source: 'EN 71-1:2011+A3 · 4.11, 7.x', clause: '4.11', verified: 'full',
    url: 'https://law.resource.org/pub/eu/toys/en.71.1.2014.html'
  },
  {
    id: 'edges-36', kind: 'standard', bands: ['b36', 'b48', 'b72', 'b108'],
    rule: t('Hazardous sharp functional edges and points are permitted only on toys for 36 months and over, with a warning.', 'Opasne oštre funkcionalne ivice i vrhovi dopušteni su samo na igračkama za 36 meseci i više, uz upozorenje.'),
    value: '≥ 36 months',
    detail: t('Accessible glass follows the same line: forbidden below 36 months, permitted above it under conditions. The threshold is the single largest legal step in the toy standard and it is a step in the paperwork, not in the child.', 'Dostupno staklo prati istu liniju: zabranjeno ispod 36 meseci, dopušteno iznad pod uslovima. Taj prag je najveći pravni skok u standardu za igračke, i to je skok u papirologiji, a ne u detetu.'),
    source: 'EN 71-1:2011+A3 · 4.5, 4.7 d), 4.8 b)', clause: '4.7 d)', verified: 'full',
    url: 'https://law.resource.org/pub/eu/toys/en.71.1.2014.html'
  },
  {
    id: 'magnets', kind: 'standard', bands: ['b72', 'b108'],
    rule: t('A loose magnet that is a small part must stay under the magnetic flux index limit; experimental magnet sets are for over 8 years and carry a warning.', 'Slobodan magnet koji je mali deo mora da ostane ispod granice indeksa magnetnog fluksa; eksperimentalni magnetni setovi su za preko 8 godina i nose upozorenje.'),
    value: '< 50 kG²mm² (0,5 T²mm²)',
    detail: t('Two swallowed magnets find each other through the bowel wall. This is the rare limit written directly out of a mechanism of injury rather than out of a measurement of a child.', 'Dva progutana magneta nađu se kroz zid creva. To je redak slučaj granice napisane direktno iz mehanizma povrede, a ne iz mere deteta.'),
    source: 'EN 71-1:2011+A3 · 4.23.2, 4.23.3, 7.20', clause: '4.23.2', verified: 'full',
    url: 'https://law.resource.org/pub/eu/toys/en.71.1.2014.html'
  },
  {
    id: 'ride-on-speed', kind: 'standard', bands: ['b36', 'b48', 'b72'],
    rule: t('Electrically driven ride-on toy: 6 km/h for 3 to 6 years (8,2 km/h only with a two-position limiter), 16 km/h from 6 years.', 'Električna igračka na kojoj se vozi: 6 km/h za 3 do 6 godina (8,2 km/h samo sa ograničivačem u dva položaja), 16 km/h od 6 godina.'),
    value: '6 / 8,2 / 16 km/h',
    detail: t('A seat is required in the lower band. The number is a design input for the studio: the stopping distance of a four-year-old sets the clear space around the thing.', 'U nižem razredu je sedište obavezno. Broj je projektantski ulaz za studio: put zaustavljanja četvorogodišnjaka određuje slobodan prostor oko stvari.'),
    source: 'EN 71-1:2011+A3 · 4.15.1.8', clause: '4.15.1.8', verified: 'full',
    url: 'https://law.resource.org/pub/eu/toys/en.71.1.2014.html'
  },
  /* ------------------------------ the thing you climb on ------------------------------ */
  {
    id: 'activity-height', kind: 'standard', bands: ['b36', 'b48', 'b72', 'b108'],
    rule: t('On an activity toy for home use there must be no part where a child can climb, sit or stand above 2 500 mm.', 'Na aktivnoj igrački za kućnu upotrebu ne sme postojati deo na kom dete može da se penje, sedi ili stoji iznad 2 500 mm.'),
    value: '≤ 2 500 mm',
    detail: t('EN 71-8 covers climbing, swinging, sliding, rocking, spinning and crawling toys for children under 14 years. A free height of fall over 600 mm changes which stability test applies.', 'EN 71-8 pokriva igračke za penjanje, ljuljanje, spuštanje, njihanje, vrtenje i provlačenje za decu ispod 14 godina. Slobodna visina pada preko 600 mm menja koje ispitivanje stabilnosti važi.'),
    source: 'EN 71-8:2011 · 4.1.3, 4.4.2, 4.4.3', clause: '4.1.3', verified: 'full',
    url: 'https://law.resource.org/pub/eu/toys/en.71.8.2011.html'
  },
  {
    id: 'swing-under-36', kind: 'standard', bands: ['b12', 'b19', 'b24'],
    rule: t('A swing whose crossbeam is 1 200 mm or less above the ground counts as intended for children under 36 months, and then needs a back rest, a protective bar 200–300 mm above the seat and a crotch strap.', 'Ljuljaška čija je prečka 1 200 mm ili manje nad zemljom smatra se namenjenom deci ispod 36 meseci, i tada traži naslon, zaštitnu prečku 200–300 mm nad sedištem i pojas između nogu.'),
    value: '1 200 mm → 200–300 mm',
    detail: t('Ground clearance under the seat: at least 200 mm for the low crossbeam, at least 350 mm above it. The geometry of the frame, not a label, decides which age the thing belongs to — the clearest example in any standard of age being read off the object.', 'Zazor pod sedištem: najmanje 200 mm za nisku prečku, najmanje 350 mm za višu. Geometrija rama, a ne nalepnica, odlučuje kom uzrastu stvar pripada — najjasniji primer u bilo kom standardu da se godište čita sa predmeta.'),
    source: 'EN 71-8:2011 · 4.6.1.3, 4.6.3, 4.6.6', clause: '4.6.3', verified: 'full',
    url: 'https://law.resource.org/pub/eu/toys/en.71.8.2011.html'
  },
  {
    id: 'entrapment-openings', kind: 'standard', bands: ['b12', 'b19', 'b24', 'b36', 'b48', 'b72', 'b108'],
    rule: t('A rigid circular opening with its lower edge 600 mm or more above the ground must not have an internal diameter between 130 mm and 230 mm.', 'Kruta kružna rupa čija je donja ivica 600 mm ili više nad zemljom ne sme imati unutrašnji prečnik između 130 mm i 230 mm.'),
    value: '130–230 mm forbidden',
    detail: t('An opening is safe when a head cannot enter or can pass through entirely; the band in between is a trap. Holes in rigid material: a 5 mm rod must not enter 10 mm deep on a toy for under 36 months, 7 mm for older children. Gaps in a standing surface: never over 30 mm. Chain links: maximum 5 mm opening, for fingers.', 'Rupa je bezbedna kad glava ne može da uđe ili može da prođe cela; opseg između je klopka. Rupe u krutom materijalu: šipka od 5 mm ne sme da uđe 10 mm duboko na igrački za ispod 36 meseci, 7 mm za starije. Zazori u površini na kojoj se stoji: nikad preko 30 mm. Lanac: najveći otvor 5 mm, zbog prstiju.'),
    source: 'EN 71-8:2011 · 4.3.1 b), 4.3.3, 4.3.4, 4.6.7', clause: '4.3.1 b)', verified: 'full',
    url: 'https://law.resource.org/pub/eu/toys/en.71.8.2011.html'
  },
  {
    id: 'playground-fall', kind: 'law', bands: ['b19', 'b24', 'b36', 'b48', 'b72', 'b108'],
    rule: t('On a public playground in Serbia, equipment with a free height of fall greater than 3 m may not be installed — nor may any accessible part of it reach above that.', 'Na javnom dečjem igralištu u Srbiji ne može se postaviti oprema sa slobodnom visinom pada većom od 3 m — ni bilo koji njen dostupni deo iznad toga.'),
    value: '≤ 3 m',
    detail: t('The rulebook points at SRPS EN 1176-1 to -6 and -11 and at SRPS EN 1177 for impact-attenuating surfaces, whose critical fall height must be documented by a test report. It applies to every publicly accessible outdoor playground including those in kindergartens and schools; private playgrounds with no public access are outside it.', 'Pravilnik upućuje na SRPS EN 1176-1 do -6 i -11 i na SRPS EN 1177 za površine koje ublažavaju udar, čija kritična visina pada mora biti dokumentovana ispitnim izveštajem. Primenjuje se na svako javno dostupno igralište na otvorenom, uključujući ona u vrtićima i školama; privatna igrališta bez javnog pristupa su izvan njega.'),
    source: t('Pravilnik o bezbednosti dečjih igrališta, Sl. glasnik RS 41/2019 · čl. 11', 'Pravilnik o bezbednosti dečjih igrališta, Sl. glasnik RS 41/2019 · čl. 11'), clause: 'čl. 11', verified: 'full',
    url: 'http://terra-pak.com/wp-content/uploads/2019/07/pravilnik-o-bezbednosti-decijih-igralista-2019.pdf'
  },
  {
    id: 'playground-board', kind: 'law', bands: ['b19', 'b24', 'b36', 'b48', 'b72', 'b108'],
    rule: t('The age band a playground is meant for must be written on a board at least 1,5 × 1,5 m at the entrance, together with the restriction on children up to seven years without an adult.', 'Starosni uzrast za koji je igralište namenjeno mora biti upisan na tabli od najmanje 1,5 × 1,5 m na prilazu, zajedno sa ograničenjem korišćenja za decu do sedam godina bez nadzora odraslog.'),
    value: '1,5 × 1,5 m · 7 years',
    detail: t('The same board carries the owner and their contact, the body that performed the first inspection and its date, emergency numbers, the ban on pets except guide dogs for people with impaired vision, and the instruction to report damage. This is the one place in Serbian law where an age band becomes a piece of architecture you can photograph.', 'Ista tabla nosi vlasnika i kontakt, telo koje je izvršilo prvi pregled i datum, brojeve službi, zabranu kućnih ljubimaca osim vodiča za osobe sa oštećenim vidom, i uputstvo da se oštećenje prijavi. To je jedino mesto u srpskom zakonu gde starosni razred postaje deo arhitekture koji može da se fotografiše.'),
    source: t('Pravilnik o bezbednosti dečjih igrališta, Sl. glasnik RS 41/2019 · čl. 10', 'Pravilnik o bezbednosti dečjih igrališta, Sl. glasnik RS 41/2019 · čl. 10'), clause: 'čl. 10', verified: 'full',
    url: 'http://terra-pak.com/wp-content/uploads/2019/07/pravilnik-o-bezbednosti-decijih-igralista-2019.pdf'
  },
  {
    id: 'playground-head', kind: 'standard', bands: ['b19', 'b24', 'b36', 'b48', 'b72', 'b108'],
    rule: t('On playground equipment a gap must not fall between 89 mm and 230 mm, the band in which a head or a torso is trapped.', 'Na opremi igrališta zazor ne sme da padne između 89 mm i 230 mm, u opseg u kom se glava ili telo zaglavljuju.'),
    value: '89–230 mm forbidden',
    detail: t('EN 1176 also defines forbidden bands for fingers and for clothing, and expects age zoning — separate areas for roughly 2–5 and 6–12 years so that equipment complexity matches the user. We have read this through secondary sources; the standard itself is not free.', 'EN 1176 određuje i zabranjene opsege za prste i za odeću, i očekuje zoniranje po uzrastu — odvojene prostore za grubo 2–5 i 6–12 godina da složenost opreme odgovara korisniku. Ovo smo čitali kroz sekundarne izvore; sam standard nije besplatan.'),
    source: 'EN 1176-1:2017+A1:2023', clause: '—', verified: 'secondary',
    url: 'https://nobelcert.com/DataFiles/FreeUpload/EN%201176-1%20(2017).pdf'
  },
  /* ------------------------------ the room around the child ------------------------------ */
  {
    id: 'furniture-height', kind: 'standard', bands: ['b36', 'b48', 'b72', 'b108'],
    rule: t('Educational chairs and tables are sized by the pupil’s standing height, not by age: eight size marks with colour codes.', 'Školske stolice i stolovi mere se po visini učenika, a ne po godištu: osam veličina sa bojama.'),
    value: t('size marks 0–7, by height', 'veličine 0–7, po visini'),
    detail: t('Orange for about 80–95 cm of height, purple to about 116, yellow to 121, red to 142, green to 159, blue above. The age column in every published table of this standard is explicitly a guide and the ranges overlap. A standard that measures the body instead of the birthday is the nearest thing in European furniture law to this studio’s doctrine.', 'Narandžasta za oko 80–95 cm visine, ljubičasta do oko 116, žuta do 121, crvena do 142, zelena do 159, plava iznad. Kolona sa godinama u svakoj objavljenoj tabeli ovog standarda izričito je orijentacija i opsezi se preklapaju. Standard koji meri telo umesto datuma rođenja je najbliže što evropsko pravo o nameštaju ima doktrini ovog studija.'),
    source: 'EN 1729-1:2015', clause: '—', verified: 'secondary',
    url: 'https://standards.iteh.ai/catalog/standards/cen/6a3b5b50-0be4-4271-8587-a88afe2c3a1b/en-1729-1-2015'
  },
  {
    id: 'preschool-space', kind: 'law', bands: ['b12', 'b19', 'b24', 'b36', 'b48'],
    rule: t('A preschool in Serbia is organised in three forms — 1 to 3 years, 3 to 7, and 1 to 7 combined — with a plot of at least 25 m² per child, at least 6,5 m² of gross floor area per child and a yard of at least 8 m² per child.', 'Predškolska ustanova u Srbiji organizuje se u tri oblika — 1 do 3 godine, 3 do 7, i 1 do 7 zajedno — uz parcelu od najmanje 25 m² po detetu, najmanje 6,5 m² bruto razvijene površine po detetu i dvorište od najmanje 8 m² po detetu.'),
    value: '25 / 15 · 6,5 · 8 m² per child',
    detail: t('In dense central urban zones the plot figure falls to 15 m² per child. Rooms for children belong on the ground and first floor; the second floor and the attic are for administration and professional services. We have read this through a legal portal’s rendering, not the gazette itself.', 'U gustim centralnim gradskim zonama broj za parcelu pada na 15 m² po detetu. Prostori za decu idu na prvu i drugu etažu; drugi sprat i potkrovlje su za upravu i stručne službe. Ovo smo čitali kroz prikaz na pravnom portalu, ne iz samog glasnika.'),
    source: t('Pravilnik o bližim uslovima za osnivanje, početak rada i obavljanje delatnosti predškolske ustanove', 'Pravilnik o bližim uslovima za osnivanje, početak rada i obavljanje delatnosti predškolske ustanove'), clause: '—', verified: 'secondary',
    url: 'https://www.paragraf.rs/propisi/pravilnik-o-uslovima-za-osnivanje-rad-obavljanje-delatnosti-predskolske-ustanove.html'
  },
  {
    id: 'second-handrail', kind: 'standard', bands: ['b36', 'b48', 'b72', 'b108'],
    rule: t('Where children are the principal users, a second handrail goes low: 600 mm above the nosing in the British practice, up to 711 mm in the American recommendation.', 'Gde su deca glavni korisnici, drugi rukohvat ide nisko: 600 mm nad ivicom stepenika u britanskoj praksi, do 711 mm u američkoj preporuci.'),
    value: '600–750 mm',
    detail: t('An opening in a guard or between risers must not pass a 100 mm sphere — the rule exists because a child’s head does. Serbia’s accessibility rulebook (22/2015), which this course otherwise quotes clause by clause, contains no child dimensions at all: the second handrail is a design decision here, not a requirement.', 'Otvor u ogradi ili između stepenika ne sme da propusti kuglu od 100 mm — pravilo postoji zato što dečja glava prolazi. Srpski pravilnik o pristupačnosti (22/2015), koji ovaj predmet inače navodi član po član, ne sadrži nijednu dečju meru: drugi rukohvat je ovde projektantska odluka, a ne zahtev.'),
    source: t('ISO 21542 and UK Approved Document M practice; 2010 ADA Standards advisory', 'Praksa po ISO 21542 i britanskom Approved Document M; savetodavni deo 2010 ADA Standards'), clause: '—', verified: 'secondary',
    url: 'https://issuu.com/accessinsight/docs/acaa_winter2022magazine/s/16835214'
  },
  /* ------------------------------ development, not law ------------------------------ */
  {
    id: 'puzzle-pieces', kind: 'data', bands: ['b12', 'b24', 'b36', 'b48', 'b72', 'b108'],
    rule: t('Piece count is an age measurement: 26 at three years, 60 at four to five, 100 at six to eight, 500 at nine, 2 000 by twelve.', 'Broj delova je mera uzrasta: 26 sa tri godine, 60 sa četiri do pet, 100 sa šest do osam, 500 sa devet, 2 000 do dvanaest.'),
    value: '26 / 60 / 100 / 500 / 2 000',
    detail: t('A puzzle needs three things at once: the fine motor skill to place the piece, the visual discrimination to see that it fits, and the cognition to plan the order. Experience moves the whole curve earlier, so a child who does puzzles beats the band. Below two years there is no puzzle, only a pre-puzzle.', 'Slagalica traži tri stvari istovremeno: sitnu motoriku da se deo postavi, vidno razlikovanje da se vidi da uklapa, i mišljenje da se isplanira red. Iskustvo pomera celu krivu ranije, pa dete koje redovno slaže nadmašuje svoj razred. Ispod dve godine nema slagalice, ima samo pred-slagalice.'),
    source: t('CPSC Age Determination Guidelines, January 2020 — Puzzles', 'CPSC Age Determination Guidelines, januar 2020 — Slagalice'), clause: 'Puzzles', verified: 'full',
    url: 'https://www.cpsc.gov/s3fs-public/Age-Determination-Guidelines-Relating-Consumer-Product-to-Characteristics-Skills-Play-Behavior-Intersts-to-Children-January-2020.pdf'
  },
  {
    id: 'building-starts', kind: 'data', bands: ['b19', 'b24', 'b36'],
    rule: t('True building play begins at about 19 months. Before that a block is a thing to be held, not a part to be placed.', 'Prava graditeljska igra počinje oko 19. meseca. Pre toga je kocka stvar koja se drži, a ne deo koji se postavlja.'),
    value: '19 months',
    detail: t('The same document gives the set sizes: 15–25 pieces at twelve to eighteen months, 20–40 through the second year, 60–80 and then 80–100 for the preschool child, 100 and over from six. The number of parts is not generosity; it is a statement about how long a structure the child can hold in mind.', 'Isti dokument daje veličine setova: 15–25 delova sa dvanaest do osamnaest meseci, 20–40 kroz drugu godinu, 60–80 pa 80–100 za predškolsko dete, 100 i više od šest. Broj delova nije darežljivost; to je tvrdnja o tome koliko dugu konstrukciju dete može da drži u glavi.'),
    source: t('CPSC Age Determination Guidelines, January 2020 — Blocks', 'CPSC Age Determination Guidelines, januar 2020 — Kocke'), clause: 'Blocks', verified: 'full',
    url: 'https://www.cpsc.gov/s3fs-public/Age-Determination-Guidelines-Relating-Consumer-Product-to-Characteristics-Skills-Play-Behavior-Intersts-to-Children-January-2020.pdf'
  },
  {
    id: 'pincer-grip', kind: 'data', bands: ['b08', 'b12', 'b19'],
    rule: t('The pincer grasp — thumb pad against index pad — appears between about 10 and 12 months and is what makes a small part pickable.', 'Pincetni hvat — jagodica palca na jagodicu kažiprsta — javlja se između oko 10. i 12. meseca i on je ono što mali deo čini uzimljivim.'),
    value: '≈ 10–12 months',
    detail: t('Before it there is a rake and a claw. The sequence given in the occupational-therapy literature runs crude palmar at 4–5 months, radial palmar at 6–8, raking at 7–8, radial digital at 8–10, then the pincer. A four-block tower at 12–18 months, nine blocks at 3–4 years, a mature tripod pencil grip at 4–5.', 'Pre njega su grabljenje i kandža. Niz koji daje literatura radne terapije ide: grub palmarni sa 4–5 meseci, radijalni palmarni sa 6–8, grabljenje sa 7–8, radijalni digitalni sa 8–10, pa pincetni. Toranj od četiri kocke sa 12–18 meseci, devet kocaka sa 3–4 godine, zreo tronožni hvat olovke sa 4–5.'),
    source: t('Paediatric occupational-therapy milestone tables', 'Tabele razvojnih prekretnica u pedijatrijskoj radnoj terapiji'), clause: '—', verified: 'secondary',
    url: 'https://childsplaytherapycenter.com/fine-motor-milestones-facilitation/'
  },
  {
    id: 'spatial-trajectory', kind: 'data', bands: ['b00', 'b04', 'b08', 'b12', 'b19', 'b24', 'b36', 'b48', 'b72'],
    rule: t('Spatial reasoning has a published trajectory from birth to seven along three lines: movement and navigation, shape properties, and composition and construction.', 'Prostorno mišljenje ima objavljenu putanju od rođenja do sedme godine po tri linije: kretanje i navigacija, svojstva oblika, i sastavljanje i konstrukcija.'),
    value: t('birth → 7 years, in three lines', 'rođenje → 7 godina, u tri linije'),
    detail: t('Bands: birth to 3, 3 to 4, 4 to 7. The same authors publish the whole trajectory a second time by stages instead of ages and say it is useful for children with special educational needs — which is the version the association needs, and the reason this page exists at all.', 'Razredi: rođenje do 3, 3 do 4, 4 do 7. Isti autori objavljuju celu putanju i drugi put po fazama umesto po godinama i kažu da je korisna za decu sa posebnim obrazovnim potrebama — to je verzija koja udruženju treba, i razlog zbog kog ova strana postoji.'),
    source: t('Spatial Reasoning Toolkit, Early Childhood Maths Group, 2022', 'Spatial Reasoning Toolkit, Early Childhood Maths Group, 2022'), clause: '—', verified: 'abstract',
    url: 'https://earlymaths.org/spatial-reasoning/'
  }
];

export const limitsForBand = id => AGE_LIMITS.filter(limit => limit.bands.includes(id));

export function filterLimits({ band = 'all', kind = 'all', query = '' } = {}) {
  const needle = String(query || '').trim().toLowerCase();
  return AGE_LIMITS.filter(limit => {
    if (band !== 'all' && !limit.bands.includes(band)) return false;
    if (kind !== 'all' && limit.kind !== kind) return false;
    if (!needle) return true;
    const text = [limit.rule.en, limit.rule.sr, limit.detail.en, limit.detail.sr, limit.value,
      typeof limit.source === 'string' ? limit.source : `${limit.source.en} ${limit.source.sr}`, limit.clause].join(' ').toLowerCase();
    return text.includes(needle);
  });
}

/* ---------------------------------------------------------------------------
   The legal layer: obligations that carry no number but decide what a number
   is for. Each one is a duty that exists whether or not a standard is cited.
   --------------------------------------------------------------------------- */
export const AGE_LAWS = [
  {
    id: 'crc-31', year: 2013, verified: 'secondary',
    title: t('Convention on the Rights of the Child, article 31, and General Comment 17', 'Konvencija o pravima deteta, član 31, i Opšti komentar 17'),
    says: t('Every child has the right to rest and leisure, to play and recreation appropriate to the age of the child. General Comment 17 (2013) defines play as behaviour initiated, controlled and structured by children themselves, and names three conditions for the right to exist: time, space and acceptance.', 'Svako dete ima pravo na odmor i slobodno vreme, na igru i razonodu prikladnu uzrastu deteta. Opšti komentar 17 (2013) određuje igru kao ponašanje koje deca sama započinju, vode i uređuju, i imenuje tri uslova da pravo postoji: vreme, prostor i prihvatanje.'),
    forUs: t('“Appropriate to the age of the child” is in the treaty text, which is why age grading is not merely commercial. And of the three conditions, two — time and space — are drawn by an architect.', '„Prikladno uzrastu deteta” stoji u tekstu ugovora, i zato razvrstavanje po uzrastu nije samo trgovačko. A od tri uslova, dva — vreme i prostor — crta arhitekta.'),
    url: 'https://cypcs.org.uk/wpcypcs/wp-content/uploads/2021/02/General-Comment-17.pdf'
  },
  {
    id: 'crpd', year: 2006, verified: 'secondary',
    title: t('Convention on the Rights of Persons with Disabilities — articles 7, 24, 26 and 30', 'Konvencija o pravima osoba sa invaliditetom — članovi 7, 24, 26 i 30'),
    says: t('Article 7 obliges states to take all measures for children with disabilities on an equal basis; article 24 inclusive education; article 26 habilitation and rehabilitation beginning at the earliest possible stage; article 30(5)(d) access to play, recreation and sporting venues.', 'Član 7 obavezuje države na sve mere za decu sa invaliditetom na ravnopravnoj osnovi; član 24 na inkluzivno obrazovanje; član 26 na habilitaciju i rehabilitaciju koja počinje u najranijoj mogućoj fazi; član 30(5)(d) na pristup mestima za igru, razonodu i sport.'),
    forUs: t('Article 26 is the sentence that turns the day after an assessment into a legal question rather than a favour, and 30(5)(d) is the one that puts the playground inside the convention.', 'Član 26 je rečenica koja dan posle procene čini pravno pitanje, a ne uslugu, a 30(5)(d) je onaj koji igralište uvodi u konvenciju.'),
    url: 'https://www.unicef.org/eca/sites/unicef.org.eca/files/IE_summary_accessible_220917_0.pdf'
  },
  {
    id: 'eu-2025-2509', year: 2025, verified: 'secondary',
    title: t('Regulation (EU) 2025/2509 on the safety of toys — it repeals the directive we were taught', 'Uredba (EU) 2025/2509 o bezbednosti igračaka — zamenjuje direktivu po kojoj smo učili'),
    says: t('Adopted 26 November 2025, in force since 1 January 2026, applying from 1 August 2030 after a 54-month transition. It repeals Directive 2009/48/EC and adds a digital product passport carried by a data carrier such as a QR code, stricter chemical restrictions, and provisions on connected toys, cybersecurity and artificial intelligence.', 'Doneta 26. novembra 2025, na snazi od 1. januara 2026, primenjuje se od 1. avgusta 2030. posle prelaznog roka od 54 meseca. Zamenjuje Direktivu 2009/48/EC i dodaje digitalni pasoš proizvoda na nosaču podataka kao što je QR kod, stroža hemijska ograničenja, i odredbe o povezanim igračkama, kibernetičkoj bezbednosti i veštačkoj inteligenciji.'),
    forUs: t('A student graduating in 2027 will design toys under a framework none of our textbooks describe. We have read this through compliance summaries, not the Official Journal; the shelf says so.', 'Student koji diplomira 2027. projektovaće igračke po okviru koji nijedan naš udžbenik ne opisuje. Ovo smo čitali kroz sažetke o usaglašenosti, ne iz Službenog lista; polica to i kaže.'),
    url: 'https://eur-lex.europa.eu/eli/reg/2025/2509/oj/eng'
  },
  {
    id: 'rs-toys', year: 2019, verified: 'secondary',
    title: t('The Serbian toy rulebook — Pravilnik o bezbednosti igračaka, Sl. glasnik RS 78/2019', 'Srpski pravilnik o igračkama — Pravilnik o bezbednosti igračaka, Sl. glasnik RS 78/2019'),
    says: t('Serbia’s toy rulebook covers products for play for children up to 14 years, with extra duties for toys intended for children under 36 months: parts sized so they cannot be swallowed or inhaled, a ban on nitrosamines, and information stating the minimum or maximum age of the user, the ability required, and whether adult supervision is needed.', 'Srpski pravilnik o igračkama pokriva proizvode za igru za decu do 14 godina, uz dodatne obaveze za igračke namenjene deci ispod 36 meseci: delovi dimenzionisani tako da se ne mogu progutati ni udahnuti, zabrana nitrozamina, i informacije o najmanjem ili najvećem uzrastu korisnika, potrebnoj sposobnosti i tome da li je potreban nadzor odraslog.'),
    forUs: t('“The ability of the user” is written into Serbian law beside the age. That phrase, not the birthday, is the legal opening for designing to a stage.', '„Sposobnost korisnika” upisana je u srpski zakon pored uzrasta. Ta reč, a ne datum rođenja, pravna je pukotina kroz koju se projektuje za fazu.'),
    url: 'https://rkp.rs/pravila-za-bezbednost-igracaka-zastita-dece-na-prvom-mestu/'
  },
  {
    id: 'guide-50', year: 2014, verified: 'abstract',
    title: t('ISO/IEC Guide 50:2014 — how to write a rule that knows a child is not a small adult', 'ISO/IEC Guide 50:2014 — kako se piše pravilo koje zna da dete nije mali odrastao'),
    says: t('Written for the people who write standards, and declared useful as background for designers and architects. Its fifth clause covers children’s anthropometry (5.1.2), motor (5.1.3), physiological (5.1.4) and cognitive (5.1.5) development and exploration strategies (5.1.6), then developmental against chronological age (5.3). Clause 4.5 is titled the “invisibility” of children, 4.6 the needs of children with disabilities. It states the balance plainly: safety against the child’s need to explore a stimulating environment and learn.', 'Pisan za one koji pišu standarde, a izričito koristan kao podloga projektantima i arhitektima. Peti odeljak pokriva antropometriju dece (5.1.2), motorni (5.1.3), fiziološki (5.1.4) i saznajni razvoj (5.1.5) i strategije istraživanja (5.1.6), pa razvojni naspram kalendarskog uzrasta (5.3). Odeljak 4.5 nosi naslov „nevidljivost” dece, 4.6 potrebe dece sa invaliditetom. Ravnotežu izgovara otvoreno: bezbednost naspram detetove potrebe da istražuje podsticajno okruženje i uči.'),
    forUs: t('One sentence from its introduction belongs above every studio desk: children are born into an adult world, without experience or appreciation of risk, but with a natural desire to explore. We have read the front matter and the contents; the clause bodies are behind a paywall.', 'Jedna rečenica iz njegovog uvoda pripada iznad svakog radnog stola u studiju: deca se rađaju u svet odraslih, bez iskustva i procene rizika, a sa prirodnom željom da istražuju. Pročitali smo prednji deo i sadržaj; tela odeljaka su za novac.'),
    url: 'https://www.iso.org/obp/ui/#iso:std:iso-iec:guide:50:ed-3:v1:en'
  },
  {
    id: 'ico-code', year: 2020, verified: 'full',
    title: t('Age appropriate design code — five bands, and the only code that writes them down', 'Kodeks dizajna prikladnog uzrastu — pet razreda, i jedini kodeks koji ih zapisuje'),
    says: t('Fifteen standards for online services used by children, with five bands: 0–5 pre-literate and early literacy, 6–9 core primary school years, 10–12 transition years, 13–15 early teens, 16–17 approaching adulthood. Its own annex says 3–5 year olds are learning to follow clear simple rules but cannot follow nuanced ones; 0–5 are pre-literate, so text is of very limited use in communicating with them; 10–12 have limited capacity to think beyond immediate consequences and are particularly susceptible to reward systems.', 'Petnaest standarda za mrežne usluge koje deca koriste, sa pet razreda: 0–5 pre čitanja i rana pismenost, 6–9 osnovnoškolske godine, 10–12 prelazne godine, 13–15 rani tinejdžeri, 16–17 blizu punoletstva. Njegov aneks kaže da deca od 3 do 5 godina uče da prate jasno i prosto pravilo, ali ne i iznijansirano; da su deca od 0 do 5 pre pismenosti, pa je tekst vrlo ograničeno sredstvo za obraćanje; da deca od 10 do 12 imaju ograničenu sposobnost da misle dalje od neposredne posledice i da su posebno osetljiva na sisteme nagrade.'),
    forUs: t('The moment a toy gets a chip, this is the register it enters. And the annex is a usable piece of writing for a studio even on paper: “text is of very limited use” is a drawing instruction.', 'U trenutku kad igračka dobije čip, ulazi u ovaj registar. A aneks je upotrebljiv tekst za studio i na papiru: „tekst je vrlo ograničeno sredstvo” jeste uputstvo za crtanje.'),
    url: 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/3-age-appropriate-application/'
  },
  {
    id: 'cpsc-2020', year: 2020, verified: 'full',
    title: t('CPSC Age Determination Guidelines, January 2020 — the bands this page borrows', 'CPSC Age Determination Guidelines, januar 2020 — razredi koje ova strana uzima'),
    says: t('Revised with the Eunice Kennedy Shriver National Institute of Child Health and Human Development from observational research into children’s play with real and novel toys. Ten age groups, eight play categories, twenty-one product subcategories; the first four years hold seven of the ten groups and the first year holds three. The document is explicit that it is not a mandatory rule.', 'Prerađen sa Nacionalnim institutom za zdravlje dece i ljudski razvoj „Eunice Kennedy Shriver” na osnovu posmatranja dečje igre sa stvarnim i novim igračkama. Deset uzrasnih grupa, osam kategorija igre, dvadeset jedna podkategorija proizvoda; prve četiri godine drže sedam od deset grupa, a prva godina tri. Dokument izričito kaže da nije obavezno pravilo.'),
    forUs: t('It also tells you how an unlabelled toy is treated: when a product is not clearly age-labelled, or labelled across more than one band under three, staff apply the most stringent test of the bands involved. The honest gap: a search of the 2020 text for “disability”, “special needs” and “developmental delay” finds them only in the reference list, not in the guidance. The most thorough age-grading document in the world has nothing to say about the children the association works with.', 'Kaže i kako se postupa sa neoznačenom igračkom: kada proizvod nije jasno označen uzrastom, ili je označen preko više razreda ispod tri godine, primenjuje se najstrože ispitivanje tih razreda. Iskrena praznina: pretraga teksta iz 2020. za „disability”, „special needs” i „developmental delay” nalazi ih samo u spisku literature, ne u uputstvu. Najtemeljniji dokument o razvrstavanju po uzrastu na svetu ne govori ništa o deci sa kojom udruženje radi.'),
    url: 'https://www.cpsc.gov/s3fs-public/Age-Determination-Guidelines-Relating-Consumer-Product-to-Characteristics-Skills-Play-Behavior-Intersts-to-Children-January-2020.pdf'
  }
];

/* ---------------------------------------------------------------------------
   What this page still does not have. A gap stated is a piece of work.
   --------------------------------------------------------------------------- */
export const AGE_GAPS = [
  {
    id: 'en1176-text',
    gap: t('The playground standard itself. Serbian law obliges SRPS EN 1176-1 to -6, -11 and EN 1177, and we have read none of them in the original — only summaries of the entrapment band and the age zoning.', 'Sam standard za igrališta. Srpski zakon obavezuje SRPS EN 1176-1 do -6, -11 i EN 1177, a nijedan nismo pročitali u originalu — samo prikaze zabranjenog opsega i zoniranja po uzrastu.'),
    next: t('Order the SRPS set through the faculty library; the Institute for Standardization also runs a course on this rulebook.', 'Naručiti SRPS komplet preko fakultetske biblioteke; Institut za standardizaciju drži i kurs o ovom pravilniku.')
  },
  {
    id: 'child-anthropometry-rs',
    gap: t('A child anthropometric table for this region. Published datasets we found are Jordanian and Malaysian samples and American reference data; no Serbian set, and no set at all for children with motor impairment.', 'Antropometrijska tabela dece za ovo podneblje. Objavljeni skupovi koje smo našli su jordanski i malezijski uzorci i američki referentni podaci; nijedan srpski, i nijedan za decu sa motornim oštećenjem.'),
    next: t('Ask the association what it measures on its own children, and ask the faculty whether a measured set can be collected as student work with consent.', 'Pitati udruženje šta meri na svojoj deci, i pitati fakultet može li se izmeren skup prikupiti kao studentski rad uz saglasnost.')
  },
  {
    id: 'stage-cards',
    gap: t('A published card deck that assesses a stage and then hands over a task with an object for it. The assessment side exists and is standardised; the day after it does not.', 'Objavljen špil kartica koji procenjuje fazu i onda predaje zadatak sa predmetom za nju. Strana procene postoji i standardizovana je; dan posle ne postoji.'),
    next: t('This is the same hole the creative hub records as open question one. The Spatial Reasoning Toolkit’s stages-not-ages trajectory is the nearest published spine to build it on.', 'To je ista rupa koju creative hub vodi kao otvoreno pitanje broj jedan. Putanja „faze, ne godine” iz Spatial Reasoning Toolkita najbliža je objavljena kičma na kojoj se to gradi.')
  },
  {
    id: 'rs-accessibility-children',
    gap: t('Serbia’s accessibility rulebook 22/2015 has no child dimensions. Every number this course teaches from it — the 150 cm turning circle, the corridor, the door, the ramp — describes an adult wheelchair user.', 'Srpski pravilnik o pristupačnosti 22/2015 nema dečje mere. Svaki broj koji predmet iz njega predaje — obrtni krug od 150 cm, hodnik, vrata, rampa — opisuje odraslog korisnika kolica.'),
    next: t('Check whether a child-sized turning circle exists anywhere in a national code, and if not, say so on the sheet instead of pretending the adult number covers it.', 'Proveriti postoji li obrtni krug za dete u bilo kom nacionalnom propisu, a ako ne postoji, reći to na listu, umesto da se odrasli broj izdaje za pokriven slučaj.')
  }
];
